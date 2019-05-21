export const APP_HEADER_ITEMS = [
  {
    user: false,
    id: 'user',
    label: 'Log in'
  },
  {
    user: true,
    id: 'user',
    route: 'profile',
    label: 'Profile',
    children: [{ label: 'Profile', route: 'profile' }, { label: 'Logout', id: 'logout' }]
  }
];

export default { APP_HEADER_ITEMS };
