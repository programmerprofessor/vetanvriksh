window.HRMS = window.HRMS || {};
(function (HRMS) {
  'use strict';
  var U = HRMS.Util, UI = HRMS.UI, S = HRMS.State;

  var INDUSTRIES = ['Manufacturing', 'Service', 'Hospitality', 'Retail', 'Healthcare', 'Logistics', 'Construction', 'IT', 'Education', 'Other'];

  var INDUSTRY_MODULES = {
    Manufacturing: ['Production Shifts', 'Machine / Operator Mapping', 'Piece-rate Wages', 'Production Incentives', 'Factory Manpower', 'Contract Labour', 'Safety Training'],
    Service: ['Client Allocation', 'Project Allocation', 'Timesheets', 'Billable Hours', 'On-site Attendance', 'Travel Claims'],
    Hospitality: ['Property Mapping', 'Front Office Roster', 'Housekeeping Roster', 'Kitchen Staff Scheduling', 'Banquet Manpower', 'Service Charge Distribution'],
    Retail: ['Store Roster', 'POS Shift Coverage', 'Seasonal Manpower', 'Incentive Schemes'],
    Healthcare: ['Ward Roster', 'Doctor Duty Roster', 'Nursing Shifts', 'Clinical Certifications'],
    Logistics: ['Route Roster', 'Driver Duty Allocation', 'Fleet Attendance', 'Warehouse Shifts'],
    Construction: ['Site Deployment', 'Labour Contractor Billing', 'Safety Compliance', 'Equipment Allocation'],
    IT: ['Project Allocation', 'Timesheets', 'Billable Utilisation', 'Skill Matrix'],
    Education: ['Faculty Timetable', 'Academic Calendar', 'Student-faculty Ratio', 'Exam Duty Roster'],
    Other: ['Configurable Modules']
  };

  function render() {
    var ui = S.ui;
    var industry = ui.industry || 'Manufacturing';

    return HRMS.Navigation.breadcrumbs([{ label: 'Home', href: '#/dashboard' }, { label: 'Settings' }]) +
      '<div class="page-head"><div class="page-head__text"><h1>Settings & Administration</h1>' +
      '<p>Industry configuration, module activation, appearance and demonstration data</p></div></div>' +

      '<div class="grid grid--2">' +

      '<div class="card"><div class="card__head"><h3>Industry Configuration</h3></div><div class="card__body">' +
      '<div class="field"><label for="industry-select">Organization Industry</label>' +
      '<select class="select" id="industry-select">' +
      INDUSTRIES.map(function (i) { return '<option' + (i === industry ? ' selected' : '') + '>' + i + '</option>'; }).join('') +
      '</select><span class="field__hint">Selecting an industry activates additional industry-specific features without removing common HRMS modules.</span></div>' +
      '<div class="detail-group mt-4"><h4>Activated Industry Modules</h4>' +
      (INDUSTRY_MODULES[industry] || []).map(function (m) {
        return '<div class="list-row"><span class="grow">' + U.esc(m) + '</span><span class="badge badge--success"><i class="dot"></i>Active</span></div>';
      }).join('') + '</div></div></div>' +

      '<div class="card"><div class="card__head"><h3>Appearance & Preferences</h3></div><div class="card__body">' +
      '<div class="field"><label>Theme</label>' +
      '<div class="row"><button class="btn' + (ui.theme === 'light' ? ' btn--primary' : '') + '" data-theme="light">Light</button>' +
      '<button class="btn' + (ui.theme === 'dark' ? ' btn--primary' : '') + '" data-theme="dark">Dark</button></div></div>' +
      '<div class="field"><label>Sidebar</label>' +
      '<div class="row"><button class="btn" data-sidebar="toggle">' + (ui.sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar') + '</button></div></div>' +
      '<div class="field"><label>Active Role</label><select class="select" id="settings-role">' +
      ['HR Admin', 'Manager', 'Payroll Admin', 'Employee'].map(function (r) {
        return '<option' + (S.session.role === r ? ' selected' : '') + '>' + r + '</option>';
      }).join('') + '</select><span class="field__hint">Role controls which modules appear in the sidebar.</span></div>' +
      '</div></div>' +

      '<div class="card"><div class="card__head"><h3>Organization Profile</h3></div><div class="card__body">' +
      S.all('organizations').map(function (o) {
        return '<div class="list-row"><span class="grow"><strong>' + U.esc(o.name) + '</strong><br>' +
          '<span class="tiny faint">' + U.esc(o.industry) + ' · ' + U.esc(o.code) + ' · ' + U.esc(o.address) + '</span></span>' +
          U.badge(o.status) + '</div>';
      }).join('') + '</div></div>' +

      '<div class="card"><div class="card__head"><h3>Data & Demonstration</h3></div><div class="card__body">' +
      '<p class="tiny muted" style="margin-bottom:12px">This prototype stores all records in browser LocalStorage. ' +
      'No server, database or authentication is involved. Resetting clears every local change and re-seeds the sample dataset.</p>' +
      '<div class="row row--wrap"><button class="btn" id="export-all">' + UI.icon('download', 15) + 'Export all employees</button>' +
      '<button class="btn btn--danger" id="reset-all">' + UI.icon('refresh', 15) + 'Reset demo data</button></div>' +
      '<div class="detail-group mt-6"><h4>Storage usage</h4><dl class="dl">' +
      '<dt>LocalStorage keys</dt><dd>' + Object.keys(localStorage).filter(function (k) { return k.indexOf('uhrms:') === 0; }).length + '</dd>' +
      '<dt>Employees</dt><dd>' + S.all('employees').length + '</dd>' +
      '<dt>Attendance rows</dt><dd>' + S.all('attendance').length + '</dd>' +
      '<dt>Total collections</dt><dd>' + Object.keys(S.db).filter(function (k) { return k !== '__version'; }).length + '</dd>' +
      '</dl></div></div></div>' +

      '<div class="card"><div class="card__head"><h3>Known Limitations</h3></div><div class="card__body tiny muted">' +
      '<ul style="padding-left:18px;line-height:1.9">' +
      '<li>No backend, API or database — LocalStorage only.</li>' +
      '<li>No real authentication; the role switcher simulates permissions.</li>' +
      '<li>File upload, resume parsing and document preview are placeholders.</li>' +
      '<li>Statutory rates and payroll figures are illustrative, not legally validated.</li>' +
      '<li>Drag-and-drop roster assignment is not implemented; roster is managed via shift master.</li>' +
      '<li>Charts are SVG rendered client-side from local data.</li>' +
      '</ul></div></div>' +

      '</div>';
  }

  function bind(view) {
    view.querySelector('#industry-select').addEventListener('change', function (e) {
      S.ui.industry = e.target.value; S.persistUI();
      HRMS.Toast.success(e.target.value + ' module configuration applied');
      HRMS.Router.refresh();
    });
    U.qsa('[data-theme]', view).forEach(function (b) {
      b.addEventListener('click', function () {
        S.ui.theme = b.getAttribute('data-theme');
        document.documentElement.setAttribute('data-theme', S.ui.theme);
        S.persistUI(); HRMS.Navigation.renderHeader(); HRMS.Router.refresh();
      });
    });
    view.querySelector('[data-sidebar="toggle"]').addEventListener('click', function () {
      S.ui.sidebarCollapsed = !S.ui.sidebarCollapsed; S.persistUI();
      HRMS.Navigation.renderSidebar(); HRMS.Router.refresh();
    });
    view.querySelector('#settings-role').addEventListener('change', function (e) {
      S.setRole(e.target.value);
      HRMS.Navigation.renderSidebar(); HRMS.Navigation.renderHeader();
      HRMS.Toast.info('Role switched to ' + e.target.value);
      HRMS.Router.go('/dashboard');
    });
    view.querySelector('#export-all').addEventListener('click', function () {
      var cols = [
        { label: 'Code', key: 'empCode' }, { label: 'Name', key: 'name' },
        { label: 'Email', key: 'email' }, { label: 'Status', key: 'status' }
      ];
      U.download('all-employees.csv', U.toCSV(S.all('employees'), cols));
      HRMS.Toast.success('Employees exported');
    });
    view.querySelector('#reset-all').addEventListener('click', function () {
      UI.confirmDialog({
        title: 'Reset all demonstration data?',
        message: 'Every locally stored record will be deleted and the seeded sample dataset restored.',
        confirmText: 'Reset everything', danger: true
      }).then(function (ok) { if (ok) S.resetDemo(); });
    });
  }

  HRMS.Modules = HRMS.Modules || {};
  HRMS.Modules.Settings = {
    register: function () {
      HRMS.Router.register('/settings', function () {
        var view = document.getElementById('view');
        view.innerHTML = render();
        bind(view);
      });
    }
  };
})(window.HRMS);