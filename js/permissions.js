window.HRMS = window.HRMS || {};
(function (HRMS) {
  'use strict';

  /* role → allowed module routes. '*' = all */
  var MATRIX = {
    'HR Admin': ['*'],
    'Payroll Admin': ['/dashboard', '/employees', '/payroll', '/compliance', '/reports', '/documents', '/settings'],
    'Manager': ['/dashboard', '/employees', '/attendance', '/shifts', '/leave', '/performance', '/training', '/helpdesk', '/reports', '/expenses'],
    'Employee': ['/dashboard', '/me', '/leave', '/attendance', '/documents', '/helpdesk', '/expenses']
  };

  HRMS.Permissions = {
    can: function (route) {
      var allowed = MATRIX[HRMS.State.session.role] || [];
      if (allowed.indexOf('*') > -1) return true;
      return allowed.some(function (r) { return route === r || route.indexOf(r + '/') === 0; });
    },
    allowedRoutes: function () { return MATRIX[HRMS.State.session.role] || []; }
  };
})(window.HRMS);