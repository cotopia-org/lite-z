export const paths = {
  dashboard: 'dashboard',
  auth: {
    index: 'auth',
    login: 'login',
    register: 'register',
    ['forget-password']: 'forget-password',
  },
  invite: 'invite',
  workspaces: {
    index: 'workspaces',
    create: 'create',
    view: ':workspace_id',
    calendar: 'calendar',
    settings: 'settings',
    rooms: {
      index: 'rooms',
      view: {
        index: ':room_id',
        settings: 'settings',
        jobs: 'jobs',
        users: 'users',
        payroll: 'payroll',
      },
    },
  },
};
