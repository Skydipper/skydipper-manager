// routes.js
const nextRoutes = require('next-routes');

const routes = nextRoutes();

// ------- MANAGER  ---------------------
routes.add('manager_home', '/manager', 'manager/data');
routes.add('manager_data', '/manager/data/:tab?', 'manager/data');
routes.add('manager_data_detail', '/manager/data/:tab/:id/:subtab?', 'manager/data-detail');

// ------- USER MANAGEMENT  -------------
routes.add('sign-in', '/sign-in', 'app/sign-in');
routes.add('forgot-password', '/forgot-password', 'app/forgot-password');
routes.add('reset-password', '/reset-password/:tokenEmail?', 'app/reset-password');
routes.add('profile', '/profile', 'profile');

// // manager - data
// routes.add('manager_data', '/manager/data/:tab?', 'manager/data');
// routes.add('manager_data_detail', '/manager/data/:tab/:id/:subtab?', 'manager/data-detail');
// // manager - dashboards
// routes.add('manager_dashboards', '/manager/dashboards/:tab?', 'manager/dashboards');
// routes.add(
//   'manager_dashboards_detail',
//   '/manager/dashboards/:tab/:id/:subtab?',
//   'manager/dashboards-detail'
// );
// // manager - topics
// routes.add('manager_topics', '/manager/topics/:tab?', 'manager/topics');
// routes.add('manager_topics_detail', '/manager/topics/:tab/:id/:subtab?', 'manager/topics-detail');
// // manager - partners
// routes.add('manager_partners', '/manager/partners/:tab?', 'manager/partners');
// routes.add('manager_partners_detail', '/manager/partners/:tab/:id/:subtab?', 'manager/partners-detail');
// // manager - pages
// routes.add('manager_pages', '/manager/pages/:tab?', 'manager/pages');
// routes.add('manager_pages_detail', '/manager/pages/:tab/:id/:subtab?', 'manager/pages-detail');
// // manager - tools
// routes.add('manager_tools', '/manager/tools/:tab?', 'manager/tools');
// routes.add('manager_tools_detail', '/manager/tools/:tab/:id/:subtab?', 'manager/tools-detail');
// // manager - faqs
// routes.add('manager_faqs', '/manager/faqs/:tab?', 'manager/faqs');
// routes.add('manager_faqs_detail', '/manager/faqs/:tab/:id/:subtab?', 'manager/faqs-detail');

module.exports = routes;
