/**
 * For nested routes use:
 * import withParentPrefix from './utils/with-parent-prefix';
 *
 * Example:
 * {
 *   dashboard: withParentPrefix('/dashboard', {
 *     ACCOUNT: '/account'
 *   }
 * }
 */

const routes = {
  ROOT: '/',
  FUND: '/fund',
};

export default routes;
