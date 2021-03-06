require('dotenv').config();

const express = require('express');
const next = require('next');
const basicAuth = require('basic-auth');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const serveStatic = require('serve-static');
const path = require('path');
const { parse } = require('url');
const session = require('express-session');
const redis = require('redis');
const RedisStore = require('connect-redis')(session);
const routes = require('./routes');
const auth = require('./auth');

const port = process.env.PORT || 3000;
const prod = process.env.NODE_ENV === 'production';

const app = next({ dev: !prod });
const handle = routes.getRequestHandler(app, ({ req, res, route, query }) => {
  app.render(req, res, route.page, query);
});

const server = express();

const checkBasicAuth = credentials => (req, res, nextAction) => {
  const user = basicAuth(req);

  let authorized = false;
  if (user && (user.name === credentials.name && user.pass === credentials.pass)) {
    authorized = true;
  }

  if (!authorized) {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    return res.sendStatus(401);
  }

  return nextAction();
};

const isAuthenticated = (req, res, nextAction) => {
  // Saving referrer of user
  if (req.session) req.session.referrer = req.url;
  if (req.isAuthenticated()) return nextAction();

  return res.redirect('/sign-in');
};

// Configuring session and cookie options
const sessionOptions = {
  secret: process.env.SECRET || 'keyboard cat',
  resave: false,
  saveUninitialized: true,
};

if (prod) {
  const redisClient = redis.createClient(process.env.REDIS_URL);
  sessionOptions.store = new RedisStore({
    client: redisClient,
    logErrors: true,
    prefix: 'skydipper_sess_',
  });
}

// Using basic auth in prod mode
const { USERNAME, PASSWORD } = process.env;
if (prod && (USERNAME && PASSWORD)) {
  server.use(
    checkBasicAuth({
      name: USERNAME,
      pass: PASSWORD,
    })
  );
}

// Configure Express
server.use(cookieParser());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.use(session(sessionOptions));
server.use(serveStatic(path.join(__dirname, 'static')));

// Middleware check: we make sure that we trigger auth if a token is passed
server.use((req, res, nextAction) => {
  if (req.query && req.query.token && !/auth/.test(req.url)) {
    return res.redirect(`/auth?token=${req.query.token}`);
  }
  return nextAction();
});

// Authentication
auth.initialize(server);

// Initializing next app before express server
app.prepare().then(() => {
  // Configuring next routes with express
  const handleUrl = (req, res) => {
    const parsedUrl = parse(req.url, true);
    return handle(req, res, parsedUrl);
  };

  // We redirect the base URL to the manager
  server.get('/', (req, res) => res.redirect('/manager'));

  // Authentication
  server.get('/auth', auth.authenticate({ failureRedirect: '/sign-in' }), (req, res) => {
    if (/manager/.test(req.session.referrer)) return res.redirect('/manager');

    const authRedirect = req.cookies.authUrl || '/sign-in';

    if (req.cookies.authUrl) {
      res.clearCookie('authUrl');
    }

    return res.redirect(authRedirect);
  });

  // Authenticate specific service, and set authUrl cookie so we remember where we where
  server.get('/auth/:service', (req, res) => {
    const { service } = req.params;

    // Returning user data
    if (service === 'user') return res.json(req.user || {});

    if (!/facebook|google|twitter/.test(service)) {
      return res.redirect('/sign-in');
    }

    if (req.cookies.authUrl) {
      res.clearCookie('authUrl');
    }

    // save the current url for redirect if successfull, set it to expire in 5 min
    res.cookie('authUrl', req.headers.referer, { maxAge: 3e5, httpOnly: true });
    return res.redirect(
      `${process.env.CONTROL_TOWER_URL}/auth/${service}?callbackUrl=${
        process.env.CALLBACK_URL
      }&applications=skydipper&token=true&origin=skydipper`
    );
  });

  // If the user is already logged in, we redirect
  server.get('/sign-in', (req, res, nextAction) => {
    if (req.isAuthenticated()) res.redirect('/manager');
    return nextAction();
  });

  server.get('/login', auth.login);
  server.get('/logout', (req, res) => {
    req.session.destroy();
    req.logout();
    res.redirect('back');
  });

  // Local sign-in
  server.post('/local-sign-in', auth.signin);

  // Update user data
  server.post('/update-user', auth.updateUser);

  server.get('/manager*?', isAuthenticated, handleUrl);
  server.get('/profile/?', isAuthenticated, handleUrl);

  server.use(handle);

  server.listen(port, err => {
    if (err) throw err;
    console.info(`> Ready on http://localhost:${port} [${process.env.NODE_ENV || 'development'}]`);
  });
});
