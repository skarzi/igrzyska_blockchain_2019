import withParentPrefix from '../index';

const ROUTE_PREFIX = '/dashboard';

const MOCK_DASHBOARD_ROUTES = {
  EMPTY: '/empty',
  RESCHEDULE: '/reschedule',
};

describe('with-parent-prefix', () => {
  it('should generate route objects', () => {
    const routesWithPrefix = withParentPrefix(ROUTE_PREFIX, MOCK_DASHBOARD_ROUTES);

    expect(routesWithPrefix).toEqual({
      EMPTY: `${ROUTE_PREFIX}${MOCK_DASHBOARD_ROUTES.EMPTY}`,
      RESCHEDULE: `${ROUTE_PREFIX}${MOCK_DASHBOARD_ROUTES.RESCHEDULE}`,
      ROOT: ROUTE_PREFIX,
    });
  });

  it('should generate route object with nested routes', () => {
    const NESTED_PREFIX = '/your-spaces';

    const NESTED_ROUTES = {
      ...MOCK_DASHBOARD_ROUTES,
      yourSpaces: withParentPrefix(NESTED_PREFIX, {
        ADD_NEW: '/add-new',
      }),
    };

    const routesWithPrefix = withParentPrefix(ROUTE_PREFIX, NESTED_ROUTES);

    expect(routesWithPrefix).toEqual({
      EMPTY: `${ROUTE_PREFIX}${MOCK_DASHBOARD_ROUTES.EMPTY}`,
      RESCHEDULE: `${ROUTE_PREFIX}${MOCK_DASHBOARD_ROUTES.RESCHEDULE}`,
      ROOT: ROUTE_PREFIX,
      yourSpaces: {
        ADD_NEW: `${ROUTE_PREFIX}${NESTED_PREFIX}/add-new`,
        ROOT: `${ROUTE_PREFIX}${NESTED_PREFIX}`,
      },
    });
  });
});
