import App, { Container } from 'next/app';
import React from 'react';
import { Provider } from 'react-redux';
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';

import finallyShim from 'promise.prototype.finally';

// actions
import { setRouter } from 'actions/routes';
import { setUser } from 'actions/user';
import { setMobileDetect, mobileParser } from 'react-responsive-redux';
import { setHostname } from 'actions/common';

import 'css/index.scss';

finallyShim.shim();

class Skydipper extends App {
  static async getInitialProps({ Component, router, ctx }) {
    const { asPath } = router;
    const { req, store, query, isServer } = ctx;
    const pathname = req ? asPath : ctx.asPath;

    // sets app routes
    const url = { asPath, pathname, query };
    store.dispatch(setRouter(url));

    // sets hostname
    const hostname = isServer ? req.headers.host : window.origin;
    store.dispatch(setHostname(hostname));

    // sets user data coming from a request (server) or the store (client)
    const { user } = isServer ? req : store.getState();

    if (user) {
      store.dispatch(setUser(user));
    }

    // mobile detection
    if (isServer) {
      const mobileDetect = mobileParser(req);
      store.dispatch(setMobileDetect(mobileDetect));
    }

    const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};

    return { pageProps: { ...pageProps, user, isServer, url } };
  }

  render() {
    const { Component, pageProps, store } = this.props;

    return (
      <Container>
        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
      </Container>
    );
  }
}

export default withRedux(initStore)(Skydipper);
