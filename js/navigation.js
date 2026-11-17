window.HRMS = window.HRMS || {};
(function (HRMS) {
  'use strict';
  var U = HRMS.Util, UI = HRMS.UI, S = HRMS.State;

  var MENU = [
    {
      section: 'Overview', items: [
        { label: 'Dashboard', route: '/dashboard', icon: 'grid' }
      ]
    },
    {
      section: 'Organisation', items: [
        { label: 'Organization Profile', route: '/organization', icon: 'sitemap' },
        { label: 'Branches', route: '/organization/branches', icon: 'briefcase' },
        { label: 'Departments', route: '/organization/departments', icon: 'grid' },
        { label: 'Designations', route: '/organization/designations', icon: 'award' },
        { label: 'Leave Types', route: '/organization/leaveTypes', icon: 'calendar' },
        { label: 'Employee Management', route: '/employees', icon: 'users' },
        { label: 'Recruitment', route: '/recruitment', icon: 'target' }
      ]
    },
    {
      section: 'Time & Attendance', items: [
        { label: 'Attendance', route: '/attendance', icon: 'clock' },
        { label: 'Shift & Roster', route: '/shifts', icon: 'calendar' },
        { label: 'Leave Management', route: '/leave', icon: 'calendar' }
      ]
    },
    {
      section: 'Pay & Benefits', items: [
        { label: 'Payroll', route: '/payroll', icon: 'wallet' },
        { label: 'Statutory Compliance', route: '/compliance', icon: 'shield' },
        { label: 'Loans & Advances', route: '/loans', icon: 'card' },
        { label: 'Expenses & Reimbursements', route: '/expenses', icon: 'receipt' }
      ]
    },
    {
      section: 'Talent', items: [
        { label: 'Performance', route: '/performance', icon: 'award' },
        { label: 'Training & Development', route: '/training', icon: 'book' }
      ]
    },
    {
      section: 'Workplace', items: [
        { label: 'Asset Management', route: '/assets', icon: 'box' },
        { label: 'Contractor Management', route: '/contractors', icon: 'briefcase' },
        { label: 'HR Helpdesk', route: '/helpdesk', icon: 'lifebuoy' },
        { label: 'Document Management', route: '/documents', icon: 'file' },
        { label: 'Separation & Exit', route: '/separation', icon: 'logout' }
      ]
    },
    {
      section: 'Insights', items: [
        { label: 'Reports & Analytics', route: '/reports', icon: 'chart' },
        { label: 'Administration', route: '/administration', icon: 'plug' },
        { label: 'Settings', route: '/settings', icon: 'settings' }
      ]
    }
  ];

  function canSee(route) {
    if (route === '/dashboard' || route === '/me') return true;
    return HRMS.Permissions.can(route);
  }

  function renderSidebar() {
    var sidebar = document.getElementById('sidebar');
    var role = S.session.role;
    var nav = MENU.map(function (group) {
      var items = group.items.filter(function (i) { return canSee(i.route); });
      if (!items.length) return '';
      return '<div class="nav-section"><div class="nav-section__title">' + U.esc(group.section) + '</div>' +
        items.map(function (i) {
          return '<a class="nav-item" href="#' + i.route + '" data-route="' + i.route + '">' +
            UI.icon(i.icon, 17) + '<span>' + U.esc(i.label) + '</span></a>';
        }).join('') + '</div>';
    }).join('');

    sidebar.className = 'sidebar' + (S.ui.sidebarCollapsed ? ' is-collapsed' : '');
    sidebar.innerHTML =
      '<div class="sidebar__brand">' +
      '<div class="sidebar__logo">NX</div>' +
      '<div class="sidebar__brand-text"><strong>Nexus HRMS</strong><span>' + U.esc(role) + '</span></div>' +
      '</div>' +
      '<nav class="sidebar__nav">' + nav + '</nav>' +
      '<div class="sidebar__foot">' +
      '<button class="nav-item" data-action="reset-demo">' + UI.icon('refresh', 17) + '<span>Reset Demo Data</span></button>' +
      '</div>';

    sidebar.querySelector('[data-action="reset-demo"]').addEventListener('click', function () {
      UI.confirmDialog({
        title: 'Reset demonstration data?',
        message: 'This clears LocalStorage and re-seeds all sample records. Any changes you made will be lost.',
        confirmText: 'Reset', danger: true
      }).then(function (ok) { if (ok) S.resetDemo(); });
    });
  }

  function renderHeader() {
    var header = document.getElementById('app-header');
    var user = S.currentUser();
    var orgs = S.all('organizations');
    var branches = S.all('branches').filter(function (b) { return S.session.orgId === 'ALL' || b.orgId === S.session.orgId; });
    var pending = S.all('leaveRequests').filter(function (r) { return r.status === 'Pending'; }).length +
      S.all('expenses').filter(function (r) { return r.status === 'Pending'; }).length;

    header.innerHTML =
      '<button class="header__menu-btn icon-btn" id="sidebar-toggle" aria-label="Toggle navigation">' + UI.icon('menu', 18) + '</button>' +
      '<div class="header__selectors">' +
      '<select class="select" id="org-switch" aria-label="Organization" style="height:32px;font-size:12px;max-width:190px">' +
      '<option value="ALL"' + (S.session.orgId === 'ALL' ? ' selected' : '') + '>All Organizations</option>' +
      orgs.map(function (o) { return '<option value="' + o.id + '"' + (S.session.orgId === o.id ? ' selected' : '') + '>' + U.esc(o.name) + '</option>'; }).join('') +
      '</select>' +
      '<select class="select" id="branch-switch" aria-label="Branch" style="height:32px;font-size:12px;max-width:180px">' +
      '<option value="ALL">All Branches</option>' +
      branches.map(function (b) { return '<option value="' + b.id + '"' + (S.session.branchId === b.id ? ' selected' : '') + '>' + U.esc(b.name) + '</option>'; }).join('') +
      '</select>' +
      '</div>' +
      '<div class="header__search search-input">' + UI.icon('search', 16) +
      '<input class="input" id="global-search" type="search" placeholder="Search employees, modules…" aria-label="Global search" autocomplete="off">' +
      '<div id="search-results"></div></div>' +
      '<div class="header__spacer"></div>' +
      '<div class="header__actions">' +
      '<select class="select" id="role-switch" aria-label="Switch role" style="height:32px;font-size:12px;width:auto">' +
      ['HR Admin', 'Manager', 'Payroll Admin', 'Employee'].map(function (r) {
        return '<option' + (S.session.role === r ? ' selected' : '') + '>' + r + '</option>';
      }).join('') + '</select>' +
      '<button class="icon-btn" id="theme-toggle" aria-label="Toggle theme">' + UI.icon(S.ui.theme === 'light' ? 'moon' : 'sun', 18) + '</button>' +
      '<button class="icon-btn" id="notif-btn" aria-label="Notifications">' + UI.icon('bell', 18) +
      (pending ? '<span class="icon-btn__dot"></span>' : '') + '</button>' +
      '<button class="icon-btn" id="help-btn" aria-label="Help and support">' + UI.icon('help', 18) + '</button>' +
      '<button class="header__user" id="profile-btn">' + U.avatar(user.name) +
      '<span class="header__user-meta"><strong>' + U.esc(user.name) + '</strong><span>' + U.esc(user.role) + '</span></span>' +
      '</button>' +
      '</div>';

    header.querySelector('#org-switch').addEventListener('change', function (e) { S.setOrg(e.target.value); renderHeader(); renderSidebar(); HRMS.Router.refresh(); });
    header.querySelector('#branch-switch').addEventListener('change', function (e) { S.setBranch(e.target.value); HRMS.Router.refresh(); });
    header.querySelector('#role-switch').addEventListener('change', function (e) {
      S.setRole(e.target.value); renderSidebar(); renderHeader();
      HRMS.Router.go('/dashboard');
      HRMS.Toast.info('Now viewing as ' + e.target.value);
    });
    header.querySelector('#theme-toggle').addEventListener('click', function () { S.toggleTheme(); renderHeader(); });
    header.querySelector('#notif-btn').addEventListener('click', showNotifications);
    header.querySelector('#help-btn').addEventListener('click', showHelp);
    header.querySelector('#profile-btn').addEventListener('click', showProfileMenu);
    header.querySelector('#sidebar-toggle').addEventListener('click', function () {
      var sb = document.getElementById('sidebar');
      if (window.innerWidth <= 960) sb.classList.toggle('is-open');
      else { S.ui.sidebarCollapsed = !S.ui.sidebarCollapsed; S.persistUI(); renderSidebar(); }
    });

    var search = header.querySelector('#global-search');
    search.addEventListener('input', U.debounce(function () { runSearch(search.value); }, 200));
    search.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { search.value = ''; runSearch(''); }
    });
  }

  function runSearch(term) {
    var box = document.getElementById('search-results');
    if (!term || term.trim().length < 2) { box.innerHTML = ''; return; }
    var q = term.toLowerCase();
    var empHits = S.all('employees').filter(function (e) {
      return e.name.toLowerCase().indexOf(q) > -1 || e.empCode.toLowerCase().indexOf(q) > -1 ||
        e.email.toLowerCase().indexOf(q) > -1;
    }).slice(0, 5);
    var modHits = [];
    MENU.forEach(function (g) {
      g.items.forEach(function (i) {
        if (canSee(i.route) && i.label.toLowerCase().indexOf(q) > -1) modHits.push(i);
      });
    });

    var html = '';
    if (empHits.length) {
      html += '<div class="detail-group"><h4>Employees</h4>' + empHits.map(function (e) {
        return '<a class="list-row" href="#/employees/' + e.id + '" style="text-decoration:none">' +
          U.avatar(e.name, 'sm') + '<span class="grow"><strong>' + U.esc(e.name) + '</strong><br><span class="tiny faint">' +
          U.esc(e.empCode) + ' · ' + U.esc(HRMS.Lookup.department(e.departmentId)) + '</span></span></a>';
      }).join('') + '</div>';
    }
    if (modHits.length) {
      html += '<div class="detail-group"><h4>Modules</h4>' + modHits.slice(0, 5).map(function (m) {
        return '<a class="list-row" href="#' + m.route + '"><span class="grow">' + U.esc(m.label) + '</span>' + UI.icon('chevron', 14) + '</a>';
      }).join('') + '</div>';
    }
    if (!html) html = '<div class="card__body tiny muted">No matches for “' + U.esc(term) + '”.</div>';

    var panel = document.createElement('div');
    panel.className = 'card';
    panel.style.cssText = 'position:absolute;top:40px;left:0;right:0;max-height:60vh;overflow:auto;z-index:60;padding:12px 14px';
    panel.innerHTML = html;
    box.innerHTML = '';
    box.appendChild(panel);
    panel.addEventListener('click', function () { box.innerHTML = ''; var s = document.getElementById('global-search'); if (s) s.value = ''; });
  }

  function showNotifications() {
    var pendingLeave = S.all('leaveRequests').filter(function (r) { return r.status === 'Pending'; });
    var pendingExp = S.all('expenses').filter(function (r) { return r.status === 'Pending'; });
    var body = '<div class="detail-group"><h4>Pending approvals</h4>' +
      (pendingLeave.length + pendingExp.length === 0 ? '<p class="tiny muted">Nothing pending. You are all caught up.</p>' :
        pendingLeave.slice(0, 5).map(function (r) {
          return '<div class="list-row">' + U.avatar(HRMS.Lookup.employeeName(r.employeeId), 'sm') +
            '<span class="grow"><strong>' + U.esc(HRMS.Lookup.employeeName(r.employeeId)) + '</strong><br>' +
            '<span class="tiny faint">Leave · ' + U.esc(r.fromDate) + ' · ' + r.days + ' day(s)</span></span>' +
            U.badge('Pending') + '</div>';
        }).join('') +
        pendingExp.slice(0, 3).map(function (r) {
          return '<div class="list-row">' + U.avatar(HRMS.Lookup.employeeName(r.employeeId), 'sm') +
            '<span class="grow"><strong>' + U.esc(HRMS.Lookup.employeeName(r.employeeId)) + '</strong><br>' +
            '<span class="tiny faint">Expense · ' + U.esc(r.category) + ' · ' + U.fmtCurrency(r.amount) + '</span></span>' +
            U.badge('Pending') + '</div>';
        }).join('')) + '</div>';

    UI.openModal({
      title: 'Notifications', size: 'sm', body: body,
      footer: '<a class="btn btn--primary" href="#/leave">Open Leave Approvals</a>'
    });
  }

  function showHelp() {
    UI.openModal({
      title: 'Help & Support', size: 'sm',
      body: '<p style="font-size:13px;line-height:1.7">This is an interactive front-end prototype. ' +
        'All data is stored in your browser via LocalStorage — no server is involved.</p>' +
        '<div class="detail-group mt-4"><h4>Things to try</h4><dl class="dl">' +
        '<dt>Add a record</dt><dd>Use “Add New” on any module listing.</dd>' +
        '<dt>Switch role</dt><dd>Change the role dropdown in the header to see permission-based menus.</dd>' +
        '<dt>Persist data</dt><dd>Refresh the page — your edits remain.</dd>' +
        '<dt>Export</dt><dd>Any listing can be exported to CSV.</dd></dl></div>'
    });
  }

  function showProfileMenu() {
    var user = S.currentUser();
    UI.openModal({
      title: 'My Account', size: 'sm',
      body: '<div class="row" style="gap:12px;margin-bottom:16px">' + U.avatar(user.name, 'lg') +
        '<div><strong>' + U.esc(user.name) + '</strong><br><span class="tiny muted">' + U.esc(user.email || '') + '</span><br>' +
        '<span class="badge badge--primary" style="margin-top:6px">' + U.esc(user.role) + '</span></div></div>' +
        '<dl class="dl"><dt>Employee ID</dt><dd>' + U.esc(user.employeeId || '—') + '</dd>' +
        '<dt>Branch</dt><dd>' + U.esc(HRMS.Lookup.branch(user.branchId)) + '</dd>' +
        '<dt>Last login</dt><dd>' + U.fmtDate(user.lastLogin) + '</dd></dl>',
      footer: '<button class="btn" data-close>Close</button>' +
        '<button class="btn btn--danger" id="logout-btn">Logout</button>',
      onMount: function (el, close) {
        el.querySelector('#logout-btn').addEventListener('click', function () {
          close();
          HRMS.State.logout();
          window.location.reload(); // Reloads page to trigger the login screen again
        });
      }
    });
  }

  function syncActive(path) {
    U.qsa('.nav-item[data-route]').forEach(function (a) {
      var r = a.getAttribute('data-route');
      a.classList.toggle('is-active', path === r || path.indexOf(r + '/') === 0);
    });
  }

  function breadcrumbs(items) {
    return '<nav class="breadcrumbs" aria-label="Breadcrumb">' +
      items.map(function (it, i) {
        var last = i === items.length - 1;
        return (last ? '<span class="current">' : '<a href="' + (it.href || '#') + '">') +
          U.esc(it.label) + (last ? '</span>' : '</a>') +
          (last ? '' : '<span class="sep">/</span>');
      }).join('') + '</nav>';
  }

  HRMS.Navigation = {
    renderShell: function () { renderSidebar(); renderHeader(); },
    renderSidebar: renderSidebar,
    renderHeader: renderHeader,
    syncActive: syncActive,
    breadcrumbs: breadcrumbs
  };
})(window.HRMS);