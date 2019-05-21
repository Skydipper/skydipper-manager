export const FOOTER_LINKS = [
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

export default { FOOTER_LINKS };
