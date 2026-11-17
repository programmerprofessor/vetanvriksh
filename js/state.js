window.HRMS = window.HRMS || {};
(function (HRMS) {
  'use strict';

  var COLLECTIONS = ['organizations','branches','departments','designations','shifts','leaveTypes','holidays',
    'employees','attendance','leaveRequests','requisitions','candidates','payrollRuns','goals','trainings',
    'assets','contractors','loans','expenses','tickets','documents','resignations','users','announcements'];

  var listeners = [];
  var State = {
    db: {},
    session: { userId: 'USR-01', role: 'HR Admin', orgId: 'ORG-01', branchId: 'ALL', isAuthenticated: false },
    ui: { theme: 'light', sidebarCollapsed: false, industry: 'Manufacturing', activeModules: null },

    init: function () {
      var self = this;
      var stored = HRMS.Storage.get('db', null);
      if (stored && stored.__version === 3) {
        this.db = stored;
      } else {
        this.db = { __version: 3 };
        COLLECTIONS.forEach(function (k) { self.db[k] = JSON.parse(JSON.stringify(HRMS.MockData[k] || [])); });
        HRMS.Storage.set('db', this.db);
      }
      var session = HRMS.Storage.get('session', null);
      if (session) this.session = session;
      var ui = HRMS.Storage.get('ui', null);
      if (ui) this.ui = ui;
      document.documentElement.setAttribute('data-theme', this.ui.theme || 'light');
    },

    persist: function () { HRMS.Storage.set('db', this.db); },
    persistSession: function () { HRMS.Storage.set('session', this.session); },
    persistUI: function () { HRMS.Storage.set('ui', this.ui); },

    all: function (collection) { return this.db[collection] || []; },
    find: function (collection, id) { return this.all(collection).filter(function (r) { return r.id === id; })[0] || null; },

    insert: function (collection, record) {
      if (!this.db[collection]) this.db[collection] = [];
      this.db[collection].unshift(record);
      this.persist(); this.emit();
      return record;
    },

    update: function (collection, id, patch) {
      var rows = this.all(collection);
      for (var i = 0; i < rows.length; i++) {
        if (rows[i].id === id) {
          rows[i] = Object.assign({}, rows[i], patch, { updatedOn: new Date().toISOString().slice(0, 10) });
          this.persist(); this.emit();
          return rows[i];
        }
      }
      return null;
    },

    remove: function (collection, id) {
      var rows = this.all(collection);
      var idx = rows.findIndex(function (r) { return r.id === id; });
      if (idx > -1) { rows.splice(idx, 1); this.persist(); this.emit(); return true; }
      return false;
    },

    /* ---- Auth & Session ---- */
    login: function (role) {
      var map = { 'HR Admin': 'USR-01', 'Manager': 'USR-02', 'Employee': 'USR-03', 'Payroll Admin': 'USR-04' };
      this.session.role = role;
      this.session.userId = map[role] || 'USR-01';
      this.session.isAuthenticated = true;
      this.persistSession(); this.emit();
    },
    logout: function () {
      this.session.isAuthenticated = false;
      this.persistSession();
    },
    setRole: function (role) {
      var map = { 'HR Admin': 'USR-01', 'Manager': 'USR-02', 'Employee': 'USR-03', 'Payroll Admin': 'USR-04' };
      this.session.role = role;
      this.session.userId = map[role] || 'USR-01';
      this.persistSession(); this.emit();
    },
    currentUser: function () {
      return this.find('users', this.session.userId) || { name: 'HR Admin', role: this.session.role, employeeId: 'EMP-0001' };
    },
    setOrg: function (id) { this.session.orgId = id; this.persistSession(); this.emit(); },
    setBranch: function (id) { this.session.branchId = id; this.persistSession(); this.emit(); },
    toggleTheme: function () {
      this.ui.theme = this.ui.theme === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', this.ui.theme);
      this.persistUI(); this.emit();
    },
    resetDemo: function () {
      HRMS.Storage.clearAll();
      window.location.hash = '#/dashboard';
      window.location.reload();
    },

    subscribe: function (fn) { listeners.push(fn); },
    emit: function () { listeners.forEach(function (fn) { try { fn(); } catch (e) { console.warn(e); } }); }
  };

  /* ---- relationship lookups ---- */
  HRMS.Lookup = {
    employee: function (id) { return State.find('employees', id); },
    employeeName: function (id) { var e = State.find('employees', id); return e ? e.name : (id || '—'); },
    department: function (id) { var d = State.find('departments', id); return d ? d.name : (id || '—'); },
    branch: function (id) { if (id === 'ALL') return 'All Branches'; var b = State.find('branches', id); return b ? b.name : (id || '—'); },
    designation: function (id) { var d = State.find('designations', id); return d ? d.name : (id || '—'); },
    shift: function (id) { var s = State.find('shifts', id); return s ? s.name : (id || '—'); },
    leaveType: function (id) { var t = State.find('leaveTypes', id); return t ? t.name : (id || '—'); },
    org: function (id) { var o = State.find('organizations', id); return o ? o.name : (id || '—'); }
  };

  HRMS.State = State;
})(window.HRMS);