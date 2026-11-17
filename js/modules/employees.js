window.HRMS = window.HRMS || {};
(function (HRMS) {
  'use strict';
  var U = HRMS.Util, UI = HRMS.UI, S = HRMS.State, L = HRMS.Lookup;

  var listState = { page: 1, sort: { key: 'name', dir: 'asc' }, q: '', dept: '', branch: '', status: '', type: '' };

  var EMP_SCHEMA = [
    { name: 'firstName', label: 'First Name', type: 'text', required: true, maxLength: 40 },
    { name: 'lastName', label: 'Last Name', type: 'text', required: true, maxLength: 40 },
    { name: 'email', label: 'Official Email', type: 'email', required: true },
    { name: 'phone', label: 'Mobile Number', type: 'tel', required: true },
    { name: 'gender', label: 'Gender', type: 'select', required: true, options: ['Male', 'Female', 'Other'], placeholder: 'Select gender' },
    { name: 'dob', label: 'Date of Birth', type: 'date', required: true },
    { name: 'doj', label: 'Date of Joining', type: 'date', required: true },
    {
      name: 'branchId', label: 'Branch', type: 'select', required: true, placeholder: 'Select branch',
      options: function () { return S.all('branches').map(function (b) { return { value: b.id, label: b.name }; }); }
    },
    {
      name: 'departmentId', label: 'Department', type: 'select', required: true, placeholder: 'Select department',
      options: function () { return S.all('departments').map(function (d) { return { value: d.id, label: d.name }; }); }
    },
    {
      name: 'designationId', label: 'Designation', type: 'select', required: true, placeholder: 'Select designation',
      options: function () { return S.all('designations').map(function (d) { return { value: d.id, label: d.name + ' (' + d.grade + ')' }; }); }
    },
    {
      name: 'shiftId', label: 'Shift', type: 'select', required: true, placeholder: 'Select shift',
      options: function () { return S.all('shifts').map(function (s) { return { value: s.id, label: s.name }; }); }
    },
    { name: 'employmentType', label: 'Employment Type', type: 'select', required: true, options: ['Full-time', 'Part-time', 'Contract', 'Intern'], placeholder: 'Select type' },
    { name: 'category', label: 'Employee Category', type: 'select', required: true, options: ['Permanent', 'Probationer', 'Contractual', 'Consultant'], placeholder: 'Select category' },
    { name: 'status', label: 'Status', type: 'select', required: true, options: ['Active', 'Probation', 'Notice Period', 'Separated'], default: 'Active' },
    { name: 'basic', label: 'Basic Salary (monthly)', type: 'number', required: true, min: 0 },
    { name: 'hra', label: 'HRA (monthly)', type: 'number', min: 0 },
    { name: 'conveyance', label: 'Conveyance (monthly)', type: 'number', min: 0 },
    { name: 'special', label: 'Special Allowance (monthly)', type: 'number', min: 0 },
    { name: 'bankName', label: 'Bank Name', type: 'text', full: true },
    { name: 'accountNo', label: 'Account Number', type: 'text' },
    { name: 'ifsc', label: 'IFSC Code', type: 'text', pattern: /^[A-Z]{4}0[A-Z0-9]{6}$/, patternMessage: 'Format: ABCD0123456' },
    { name: 'pan', label: 'PAN', type: 'text', pattern: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, patternMessage: 'Format: ABCDE1234F' },
    { name: 'uan', label: 'UAN (PF)', type: 'text', pattern: /^\d{12}$/, patternMessage: 'Must be exactly 12 digits' }
  ];

  function resolveOptions(schema) {
    return schema.map(function (f) {
      var copy = Object.assign({}, f);
      if (typeof copy.options === 'function') copy.options = copy.options();
      return copy;
    });
  }

  function scopedEmployees() {
    var rows = S.all('employees');
    if (S.session.branchId !== 'ALL') rows = rows.filter(function (r) { return r.branchId === S.session.branchId; });
    return rows;
  }

  function filtered() {
    var rows = scopedEmployees();
    if (listState.q) {
      var q = listState.q.toLowerCase();
      rows = rows.filter(function (r) {
        return (r.name + ' ' + r.empCode + ' ' + r.email).toLowerCase().indexOf(q) > -1;
      });
    }
    if (listState.dept) rows = rows.filter(function (r) { return r.departmentId === listState.dept; });
    if (listState.branch) rows = rows.filter(function (r) { return r.branchId === listState.branch; });
    if (listState.status) rows = rows.filter(function (r) { return r.status === listState.status; });
    if (listState.type) rows = rows.filter(function (r) { return r.employmentType === listState.type; });
    return U.sortBy(rows, listState.sort.key, listState.sort.dir);
  }

  /* ---------------- Listing ---------------- */
  function renderList() {
    var all = filtered();
    var info = U.paginate(all, listState.page, 10);
    var total = scopedEmployees().length;

    var columns = [
      {
        key: 'name', label: 'Employee', sortable: true, render: function (r) {
          return '<div class="person">' + U.avatar(r.name, 'sm') +
            '<div class="person__meta"><strong>' + U.esc(r.name) + '</strong><span>' + U.esc(r.empCode) + '</span></div></div>';
        }
      },
      { key: 'departmentId', label: 'Department', render: function (r) { return U.esc(L.department(r.departmentId)); } },
      { key: 'designationId', label: 'Designation', render: function (r) { return U.esc(L.designation(r.designationId)); } },
      { key: 'branchId', label: 'Branch', render: function (r) { return U.esc(L.branch(r.branchId)); } },
      { key: 'employmentType', label: 'Type' },
      { key: 'doj', label: 'Joined', render: function (r) { return U.fmtDate(r.doj); } },
      { key: 'status', label: 'Status', render: function (r) { return U.badge(r.status); } },
      {
        key: 'actions', label: 'Actions', actions: function (r) {
          return '<div class="row" style="justify-content:flex-end;gap:2px">' +
            '<a class="btn btn--sm btn--ghost" href="#/employees/' + r.id + '">' + UI.icon('eye', 14) + '</a>' +
            '<button class="btn btn--sm btn--ghost" data-edit="' + r.id + '">' + UI.icon('edit', 14) + '</button>' +
            '<button class="btn btn--sm btn--ghost" data-delete="' + r.id + '">' + UI.icon('trash', 14) + '</button></div>';
        }
      }
    ];

    var deptOptions = S.all('departments').map(function (d) { return { value: d.id, label: d.name }; });
    var branchOptions = S.all('branches').map(function (b) { return { value: b.id, label: b.name }; });

    return HRMS.Navigation.breadcrumbs([{ label: 'Home', href: '#/dashboard' }, { label: 'Employee Management' }]) +
      '<div class="page-head"><div class="page-head__text"><h1>Employee Management</h1>' +
      '<p>' + total + ' employee records · ' + U.esc(L.branch(S.session.branchId)) + '</p></div>' +
      '<div class="page-head__actions">' +
      '<button class="btn" id="emp-import">' + UI.icon('upload', 15) + 'Import CSV</button>' +
      '<button class="btn" id="emp-export">' + UI.icon('download', 15) + 'Export CSV</button>' +
      '<button class="btn btn--primary" id="emp-add">' + UI.icon('plus', 15) + 'Add Employee</button>' +
      '</div></div>' +

      '<div class="card"><div class="filter-bar">' +
      '<div class="field field--grow"><label for="emp-q">Search</label><div class="search-input">' +
      UI.icon('search', 15) + '<input class="input" id="emp-q" placeholder="Name, code or email" value="' + U.esc(listState.q) + '"></div></div>' +
      '<div class="field"><label for="f-dept">Department</label><select class="select" id="f-dept"><option value="">All</option>' +
      deptOptions.map(function (o) { return '<option value="' + o.value + '"' + (listState.dept === o.value ? ' selected' : '') + '>' + U.esc(o.label) + '</option>'; }).join('') + '</select></div>' +
      '<div class="field"><label for="f-branch">Branch</label><select class="select" id="f-branch"><option value="">All</option>' +
      branchOptions.map(function (o) { return '<option value="' + o.value + '"' + (listState.branch === o.value ? ' selected' : '') + '>' + U.esc(o.label) + '</option>'; }).join('') + '</select></div>' +
      '<div class="field"><label for="f-status">Status</label><select class="select" id="f-status"><option value="">All</option>' +
      ['Active', 'Probation', 'Notice Period', 'Separated'].map(function (s) { return '<option' + (listState.status === s ? ' selected' : '') + '>' + s + '</option>'; }).join('') + '</select></div>' +
      '<div class="field"><label for="f-type">Type</label><select class="select" id="f-type"><option value="">All</option>' +
      ['Full-time', 'Part-time', 'Contract', 'Intern'].map(function (s) { return '<option' + (listState.type === s ? ' selected' : '') + '>' + s + '</option>'; }).join('') + '</select></div>' +
      '<button class="btn btn--ghost" id="f-clear">Clear</button>' +
      '</div>' +
      UI.dataTable({
        columns: columns, rows: info.rows, sort: listState.sort, idPrefix: 'emp',
        empty: {
          icon: 'users', title: 'No employees found',
          message: 'Adjust your filters or add a new employee record.',
          action: '<button class="btn btn--primary" data-add>Add Employee</button>'
        }
      }) +
      UI.pagination(info, 'emp') + '</div>';
  }

  function bindList(view) {
    view.querySelector('#emp-add').addEventListener('click', function () { openForm(null); });
    var addAlt = view.querySelector('[data-add]');
    if (addAlt) addAlt.addEventListener('click', function () { openForm(null); });

    view.querySelector('#emp-q').addEventListener('input', U.debounce(function (e) {
      listState.q = e.target.value; listState.page = 1; HRMS.Router.refresh();
    }, 250));
    ['dept', 'branch', 'status', 'type'].forEach(function (k) {
      var el = view.querySelector('#f-' + k);
      el.addEventListener('change', function () { listState[k] = el.value; listState.page = 1; HRMS.Router.refresh(); });
    });
    view.querySelector('#f-clear').addEventListener('click', function () {
      listState = { page: 1, sort: listState.sort, q: '', dept: '', branch: '', status: '', type: '' };
      HRMS.Router.refresh();
    });

    U.qsa('[data-emp-sort]', view).forEach(function (th) {
      th.addEventListener('click', function () {
        var key = th.getAttribute('data-emp-sort');
        listState.sort = { key: key, dir: listState.sort.key === key && listState.sort.dir === 'asc' ? 'desc' : 'asc' };
        HRMS.Router.refresh();
      });
    });
    U.qsa('[data-emp-page]', view).forEach(function (b) {
      b.addEventListener('click', function () {
        if (b.disabled) return;
        listState.page = Number(b.getAttribute('data-emp-page'));
        HRMS.Router.refresh();
      });
    });
    U.qsa('[data-edit]', view).forEach(function (b) {
      b.addEventListener('click', function () { openForm(b.getAttribute('data-edit')); });
    });
    U.qsa('[data-delete]', view).forEach(function (b) {
      b.addEventListener('click', function () {
        var id = b.getAttribute('data-delete');
        var emp = S.find('employees', id);
        UI.confirmDialog({
          title: 'Delete employee record?',
          message: 'WARNING: ' + emp.name + ' has linked attendance, leave, and payroll records. In a real database, this would be a soft delete or cascade. Proceed?',
          confirmText: 'Delete Completely', danger: true
        }).then(function (ok) {
          if (!ok) return;
          S.remove('employees', id);
          HRMS.Toast.success('Employee record deleted');
          HRMS.Router.refresh();
        });
      });
    });

    view.querySelector('#emp-export').addEventListener('click', function () {
      var cols = [
        { label: 'Employee Code', key: 'empCode' }, { label: 'Name', key: 'name' },
        { label: 'Email', key: 'email' }, { label: 'Phone', key: 'phone' },
        { label: 'Department', value: function (r) { return L.department(r.departmentId); } },
        { label: 'Designation', value: function (r) { return L.designation(r.designationId); } },
        { label: 'Branch', value: function (r) { return L.branch(r.branchId); } },
        { label: 'Date of Joining', key: 'doj' }, { label: 'Status', key: 'status' },
        { label: 'Gross Monthly', value: function (r) { return r.salary.gross; } }
      ];
      U.download('employees-' + new Date().toISOString().slice(0, 10) + '.csv', U.toCSV(filtered(), cols));
      HRMS.Toast.success('Exported ' + filtered().length + ' employee records');
    });

    view.querySelector('#emp-import').addEventListener('click', openImport);
  }

  /* ---------------- Add / Edit ---------------- */
  function openForm(id) {
    var existing = id ? S.find('employees', id) : null;
    var schema = resolveOptions(EMP_SCHEMA);
    var values = existing ? {
      firstName: existing.firstName, lastName: existing.lastName, email: existing.email, phone: existing.phone,
      gender: existing.gender, dob: existing.dob, doj: existing.doj, branchId: existing.branchId,
      departmentId: existing.departmentId, designationId: existing.designationId, shiftId: existing.shiftId,
      employmentType: existing.employmentType, category: existing.category, status: existing.status,
      basic: existing.salary.basic, hra: existing.salary.hra, conveyance: existing.salary.conveyance,
      special: existing.salary.special, bankName: existing.bank.bankName, accountNo: existing.bank.accountNo,
      ifsc: existing.bank.ifsc, pan: existing.statutory.pan, uan: existing.statutory.uan
    } : { status: 'Active', employmentType: 'Full-time', category: 'Permanent' };

    UI.openModal({
      title: existing ? 'Edit Employee — ' + existing.empCode : 'Add New Employee',
      size: 'lg',
      body: UI.renderForm(schema, values),
      footer: '<button class="btn" data-close>Cancel</button><button class="btn btn--primary" id="emp-save">' +
        (existing ? 'Save Changes' : 'Create Employee') + '</button>',
      onMount: function (el, close) {
        var form = el.querySelector('form');
        var branchSelect = form.querySelector('[name="branchId"]');
        var deptSelect = form.querySelector('[name="departmentId"]');

        // CASCADING DROPDOWN LOGIC
        branchSelect.addEventListener('change', function() {
            var selectedBranch = branchSelect.value;
            var allDepts = S.all('departments');
            var filteredDepts = allDepts.filter(function(d) { return d.branchId === selectedBranch; });
            
            deptSelect.innerHTML = '<option value="">Select department</option>';
            filteredDepts.forEach(function(d) {
                var opt = document.createElement('option');
                opt.value = d.id;
                opt.textContent = d.name;
                deptSelect.appendChild(opt);
            });
        });

        // Trigger on load if editing
        if(branchSelect.value) {
            branchSelect.dispatchEvent(new Event('change'));
            if(existing) deptSelect.value = existing.departmentId;
        }

        el.querySelector('#emp-save').addEventListener('click', function () {
          var data = UI.readForm(form, schema);
          var result = HRMS.Validation.validate(schema, data);
          if (!result.valid) { UI.showErrors(form, result.errors); HRMS.Toast.error('Please correct the highlighted fields'); return; }

          var gross = Number(data.basic) + Number(data.hra || 0) + Number(data.conveyance || 0) + Number(data.special || 0);
          var payload = {
            firstName: data.firstName, lastName: data.lastName, name: data.firstName + ' ' + data.lastName,
            email: data.email, phone: data.phone, gender: data.gender, dob: data.dob, doj: data.doj,
            branchId: data.branchId, departmentId: data.departmentId, designationId: data.designationId,
            shiftId: data.shiftId, employmentType: data.employmentType, category: data.category, status: data.status,
            salary: { basic: Number(data.basic), hra: Number(data.hra || 0), conveyance: Number(data.conveyance || 0), special: Number(data.special || 0), gross: gross },
            bank: { bankName: data.bankName, accountNo: data.accountNo, ifsc: data.ifsc },
            statutory: { pan: data.pan, uan: data.uan },
            orgId: (S.find('branches', data.branchId) || {}).orgId || 'ORG-01'
          };

          if (existing) {
            S.update('employees', existing.id, payload);
            HRMS.Toast.success('Employee updated successfully');
          } else {
            var nextNum = S.all('employees').length + 1;
            payload.id = U.uid('EMP');
            payload.empCode = 'E' + String(1000 + nextNum).padStart(4, '0');
            payload.createdOn = new Date().toISOString().slice(0, 10);
            payload.createdBy = S.currentUser().name;
            payload.managerId = null;
            payload.skills = [];
            S.insert('employees', payload);
            HRMS.Toast.success('Employee created successfully');
          }
          close();
          HRMS.Router.refresh();
        });
      }
    });
  }

  /* ---------------- CSV import ---------------- */
  function openImport() {
    UI.openModal({
      title: 'Bulk Import Employees (CSV)', size: 'md',
      body: '<p class="tiny muted" style="margin-bottom:12px">Upload a CSV with headers: ' +
        '<code class="mono">firstName,lastName,email,phone,gender,dob,doj,branchId,departmentId,designationId,shiftId</code>. ' +
        'Rows are validated; invalid rows are skipped.</p>' +
        '<input type="file" id="csv-file" accept=".csv" class="input" style="padding:8px;height:auto">' +
        '<div id="csv-report" class="mt-4"></div>',
      footer: '<button class="btn" data-close>Close</button><button class="btn btn--primary" id="csv-run">Import</button>',
      onMount: function (el) {
        el.querySelector('#csv-run').addEventListener('click', function () {
          var input = el.querySelector('#csv-file');
          var report = el.querySelector('#csv-report');
          if (!input.files || !input.files[0]) { HRMS.Toast.error('Choose a CSV file first'); return; }
          var reader = new FileReader();
          reader.onload = function () {
            try {
              var rows = U.parseCSV(String(reader.result));
              var ok = 0, bad = 0;
              rows.forEach(function (row) {
                if (!row.firstName || !row.email) { bad++; return; }
                var deptId = row.departmentId || 'DP-01';
                var branchId = row.branchId || 'BR-01';
                S.insert('employees', {
                  id: U.uid('EMP'),
                  empCode: row.empCode || ('E' + String(1000 + S.all('employees').length + 1).padStart(4, '0')),
                  firstName: row.firstName, lastName: row.lastName || '', name: (row.firstName + ' ' + (row.lastName || '')).trim(),
                  email: row.email, phone: row.phone || '', gender: row.gender || 'Male',
                  dob: row.dob || '1995-01-01', doj: row.doj || new Date().toISOString().slice(0, 10),
                  status: 'Active', employmentType: 'Full-time', category: 'Permanent',
                  orgId: (S.find('branches', branchId) || {}).orgId || 'ORG-01',
                  branchId: branchId, departmentId: deptId,
                  designationId: row.designationId || 'DG-06', shiftId: row.shiftId || 'SH-01',
                  managerId: null, workLocation: '', probationEnd: '', skills: [],
                  salary: { basic: 30000, hra: 12000, conveyance: 1600, special: 7500, gross: 51100 },
                  bank: { bankName: '', accountNo: '', ifsc: '' },
                  statutory: { pan: '', uan: '' },
                  createdOn: new Date().toISOString().slice(0, 10), createdBy: S.currentUser().name
                });
                ok++;
              });
              report.innerHTML = '<div class="badge badge--success">Imported ' + ok + ' record(s)</div> ' +
                (bad ? '<div class="badge badge--danger">Skipped ' + bad + ' row(s)</div>' : '');
              HRMS.Toast.success(ok + ' employees imported');
              HRMS.Router.refresh();
            } catch (e) {
              console.error(e);
              HRMS.Toast.error('Could not parse the CSV file');
            }
          };
          reader.readAsText(input.files[0]);
        });
      }
    });
  }

  /* ---------------- Profile ---------------- */
  var profileTab = 'overview';

  function renderProfile(id) {
    var emp = S.find('employees', id);
    if (!emp) {
      return HRMS.Navigation.breadcrumbs([{ label: 'Home', href: '#/dashboard' }, { label: 'Employees', href: '#/employees' }, { label: 'Not found' }]) +
        UI.emptyState({ icon: 'users', title: 'Employee not found', message: 'This record may have been deleted.', action: '<a class="btn btn--primary" href="#/employees">Back to directory</a>' });
    }

    var tabs = ['overview', 'job', 'personal', 'documents', 'attendance', 'leave', 'payroll', 'assets', 'performance', 'history'];
    var tabLabels = {
      overview: 'Overview', job: 'Job & Salary', personal: 'Personal', documents: 'Documents',
      attendance: 'Attendance', leave: 'Leave', payroll: 'Payroll', assets: 'Assets',
      performance: 'Performance', history: 'History'
    };

    var html = HRMS.Navigation.breadcrumbs([
      { label: 'Home', href: '#/dashboard' },
      { label: 'Employees', href: '#/employees' },
      { label: emp.name }
    ]);

    html += '<div class="card"><div class="card__body" style="display:flex;gap:18px;align-items:flex-start;flex-wrap:wrap">' +
      U.avatar(emp.name, 'lg') +
      '<div style="flex:1 1 240px;min-width:0">' +
      '<h1 style="font-size:20px;font-weight:700">' + U.esc(emp.name) + '</h1>' +
      '<p class="tiny muted">' + U.esc(emp.empCode) + ' · ' + U.esc(L.designation(emp.designationId)) + ' · ' + U.esc(L.department(emp.departmentId)) + '</p>' +
      '<div class="row row--wrap mt-4">' + U.badge(emp.status) +
      '<span class="badge badge--primary">' + U.esc(emp.employmentType) + '</span>' +
      '<span class="badge">' + U.esc(L.branch(emp.branchId)) + '</span></div>' +
      '</div>' +
      '<div class="row row--wrap">' +
      '<button class="btn" id="emp-edit">' + UI.icon('edit', 15) + 'Edit</button>' +
      '<button class="btn" id="emp-print">' + UI.icon('print', 15) + 'Print</button>' +
      '<button class="btn btn--danger" id="emp-delete">' + UI.icon('trash', 15) + 'Delete</button>' +
      '</div></div>' +
      '<div class="tabs" style="padding:0 20px">' + tabs.map(function (t) {
        return '<button class="tab' + (profileTab === t ? ' is-active' : '') + '" data-tab="' + t + '">' + tabLabels[t] + '</button>';
      }).join('') + '</div></div>';

    html += '<div class="mt-6" id="tab-content">' + profileTabContent(emp, profileTab) + '</div>';
    return html;
  }

  function profileTabContent(emp, tab) {
    var att = S.all('attendance').filter(function (a) { return a.employeeId === emp.id; });
    var leave = S.all('leaveRequests').filter(function (l) { return l.employeeId === emp.id; });
    var docs = S.all('documents').filter(function (d) { return d.employeeId === emp.id; });
    var assets = S.all('assets').filter(function (a) { return a.employeeId === emp.id; });
    var goals = S.all('goals').filter(function (g) { return g.employeeId === emp.id; });

    if (tab === 'overview') {
      return '<div class="grid grid--3">' +
        '<div class="card"><div class="card__body">' +
        UI.detailGroup('Employment', [
          ['Employee Code', emp.empCode], ['Designation', L.designation(emp.designationId)],
          ['Department', L.department(emp.departmentId)], ['Branch', L.branch(emp.branchId)],
          ['Reporting Manager', emp.managerId ? L.employeeName(emp.managerId) : '—'],
          ['Shift', L.shift(emp.shiftId)]
        ]) + '</div></div>' +
        '<div class="card"><div class="card__body">' +
        UI.detailGroup('Contact', [
          ['Email', emp.email], ['Mobile', emp.phone], ['Date of Joining', U.fmtDate(emp.doj)],
          ['Date of Birth', U.fmtDate(emp.dob)], ['Work Location', emp.workLocation]
        ]) + '</div></div>' +
        '<div class="card"><div class="card__body">' +
        UI.detailGroup('Compensation', [
          ['Basic', U.fmtCurrency(emp.salary.basic)], ['HRA', U.fmtCurrency(emp.salary.hra)],
          ['Conveyance', U.fmtCurrency(emp.salary.conveyance)], ['Special Allowance', U.fmtCurrency(emp.salary.special)],
          ['Gross Monthly', U.fmtCurrency(emp.salary.gross)], ['Annual Gross', U.fmtCurrency(emp.salary.gross * 12)]
        ]) + '</div></div></div>' +
        '<p class="tiny faint mt-4">Demonstration figures — not a validated payroll statement.</p>';
    }

    if (tab === 'job') {
      return '<div class="card"><div class="card__body">' +
        UI.detailGroup('Job Information', [
          ['Employee Code', emp.empCode], ['Category', emp.category], ['Employment Type', emp.employmentType],
          ['Department', L.department(emp.departmentId)], ['Designation', L.designation(emp.designationId)],
          ['Branch', L.branch(emp.branchId)], ['Shift', L.shift(emp.shiftId)],
          ['Probation End', U.fmtDate(emp.probationEnd)], ['Status', emp.status]
        ]) + UI.detailGroup('Salary Structure (monthly)', [
          ['Basic', U.fmtCurrency(emp.salary.basic)], ['HRA', U.fmtCurrency(emp.salary.hra)],
          ['Conveyance', U.fmtCurrency(emp.salary.conveyance)], ['Special Allowance', U.fmtCurrency(emp.salary.special)],
          ['Gross', U.fmtCurrency(emp.salary.gross)]
        ]) + UI.detailGroup('Bank & Statutory', [
          ['Bank', emp.bank.bankName], ['Account', emp.bank.accountNo], ['IFSC', emp.bank.ifsc],
          ['PAN', emp.statutory.pan], ['UAN', emp.statutory.uan], ['ESIC', emp.statutory.esic || '—']
        ]) + '</div></div>';
    }

    if (tab === 'personal') {
      return '<div class="card"><div class="card__body">' +
        UI.detailGroup('Personal Details', [
          ['Full Name', emp.name], ['Gender', emp.gender], ['Date of Birth', U.fmtDate(emp.dob)],
          ['Marital Status', emp.maritalStatus], ['Blood Group', emp.bloodGroup], ['Personal Email', emp.email],
          ['Mobile', emp.phone]
        ]) + UI.detailGroup('Skills', [['Primary Skills', (emp.skills || []).join(', ') || '—']]) +
        '<p class="tiny faint">Emergency contact, family details and education history are shown as placeholders in this prototype.</p>' +
        '</div></div>';
    }

    if (tab === 'documents') {
      return '<div class="card"><div class="card__head"><h3>Employee Documents</h3>' +
        '<button class="btn btn--sm" id="tab-upload">' + UI.icon('upload', 14) + 'Upload</button></div>' +
        '<div class="card__body card__body--flush">' +
        (docs.length ? UI.dataTable({
          columns: [
            { key: 'name', label: 'Document' },
            { key: 'category', label: 'Category' },
            { key: 'fileName', label: 'File' },
            { key: 'uploadedOn', label: 'Uploaded', render: function (r) { return U.fmtDate(r.uploadedOn); } },
            { key: 'verificationStatus', label: 'Verification', render: function (r) { return U.badge(r.verificationStatus); } }
          ], rows: docs, idPrefix: 'doc'
        }) : UI.emptyState({ icon: 'file', title: 'No documents', message: 'No documents have been uploaded for this employee.' })) +
        '</div></div>';
    }

    if (tab === 'attendance') {
      return '<div class="card"><div class="card__head"><h3>Attendance History</h3><p>Last ' + att.length + ' records</p></div>' +
        '<div class="card__body card__body--flush">' +
        (att.length ? UI.dataTable({
          columns: [
            { key: 'date', label: 'Date', render: function (r) { return U.fmtDate(r.date); } },
            { key: 'shiftId', label: 'Shift', render: function (r) { return U.esc(L.shift(r.shiftId)); } },
            { key: 'inTime', label: 'In' }, { key: 'outTime', label: 'Out' },
            { key: 'workedHours', label: 'Hours', align: 'right' },
            { key: 'overtimeHours', label: 'OT', align: 'right' },
            { key: 'status', label: 'Status', render: function (r) { return U.badge(r.status); } }
          ], rows: att.slice(0, 15), idPrefix: 'att'
        }) : UI.emptyState({ icon: 'clock', title: 'No attendance', message: 'No attendance records exist for this employee.' })) +
        '</div></div>';
    }

    if (tab === 'leave') {
      return '<div class="card"><div class="card__head"><h3>Leave History</h3></div><div class="card__body card__body--flush">' +
        (leave.length ? UI.dataTable({
          columns: [
            { key: 'id', label: 'Request #' },
            { key: 'leaveTypeId', label: 'Type', render: function (r) { return U.esc(L.leaveType(r.leaveTypeId)); } },
            { key: 'fromDate', label: 'From', render: function (r) { return U.fmtDate(r.fromDate); } },
            { key: 'days', label: 'Days', align: 'right' },
            { key: 'status', label: 'Status', render: function (r) { return U.badge(r.status); } }
          ], rows: leave, idPrefix: 'lev'
        }) : UI.emptyState({ icon: 'calendar', title: 'No leave records', message: 'This employee has not applied for leave.' })) +
        '</div></div>';
    }

    if (tab === 'payroll') {
      var runs = S.all('payrollRuns');
      return '<div class="card"><div class="card__head"><h3>Payroll History (demonstration)</h3></div><div class="card__body card__body--flush">' +
        UI.dataTable({
          columns: [
            { key: 'month', label: 'Month' },
            { key: 'gross', label: 'Gross', align: 'right', render: function () { return U.fmtCurrency(emp.salary.gross); } },
            { key: 'pf', label: 'PF (12%)', align: 'right', render: function () { return U.fmtCurrency(Math.round(emp.salary.basic * 0.12)); } },
            { key: 'pt', label: 'Prof. Tax', align: 'right', render: function () { return U.fmtCurrency(200); } },
            { key: 'net', label: 'Net Pay', align: 'right', render: function () { return U.fmtCurrency(Math.round(emp.salary.gross * 0.82)); } },
            { key: 'status', label: 'Status', render: function (r) { return U.badge(r.status); } }
          ], rows: runs, idPrefix: 'pay'
        }) + '</div></div>' +
        '<p class="tiny faint mt-4">Figures are illustrative only and are not legally validated statutory calculations.</p>';
    }

    if (tab === 'assets') {
      return '<div class="card"><div class="card__head"><h3>Assigned Assets</h3></div><div class="card__body card__body--flush">' +
        (assets.length ? UI.dataTable({
          columns: [
            { key: 'name', label: 'Asset' }, { key: 'category', label: 'Category' },
            { key: 'serialNo', label: 'Serial No.' },
            { key: 'allocatedOn', label: 'Allocated', render: function (r) { return U.fmtDate(r.allocatedOn); } },
            { key: 'condition', label: 'Condition' }, { key: 'status', label: 'Status', render: function (r) { return U.badge(r.status); } }
          ], rows: assets, idPrefix: 'ast'
        }) : UI.emptyState({ icon: 'box', title: 'No assets', message: 'No company assets are assigned to this employee.' })) +
        '</div></div>';
    }

    if (tab === 'performance') {
      return '<div class="card"><div class="card__head"><h3>Goals & Appraisal</h3></div><div class="card__body card__body--flush">' +
        (goals.length ? UI.dataTable({
          columns: [
            { key: 'kra', label: 'KRA' }, { key: 'kpi', label: 'KPI' },
            { key: 'weightage', label: 'Weight %', align: 'right' },
            { key: 'achievement', label: 'Achievement', align: 'right' },
            { key: 'managerRating', label: 'Rating', align: 'right' },
            { key: 'status', label: 'Status', render: function (r) { return U.badge(r.status); } }
          ], rows: goals, idPrefix: 'goal'
        }) : UI.emptyState({ icon: 'award', title: 'No goals set', message: 'Goals will appear here once the appraisal cycle is configured.' })) +
        '</div></div>';
    }

    return '<div class="card"><div class="card__body"><div class="timeline">' +
      '<div class="timeline__item"><span class="timeline__dot">1</span><div><strong>Joined the organization</strong>' +
      '<div class="tiny faint">' + U.fmtDate(emp.doj) + ' · ' + U.esc(L.branch(emp.branchId)) + '</div></div></div>' +
      '<div class="timeline__item"><span class="timeline__dot">2</span><div><strong>Assigned to ' + U.esc(L.department(emp.departmentId)) + '</strong>' +
      '<div class="tiny faint">Reporting to ' + U.esc(emp.managerId ? L.employeeName(emp.managerId) : 'Department Head') + '</div></div></div>' +
      '<div class="timeline__item"><span class="timeline__dot">3</span><div><strong>Current status: ' + U.esc(emp.status) + '</strong>' +
      '<div class="tiny faint">Last updated ' + U.fmtDate(emp.updatedOn || emp.createdOn) + '</div></div></div>' +
      '</div></div></div>';
  }

  function bindProfile(view, id) {
    var emp = S.find('employees', id);
    if (!emp) return;

    U.qsa('[data-tab]', view).forEach(function (b) {
      b.addEventListener('click', function () {
        profileTab = b.getAttribute('data-tab');
        HRMS.Router.refresh();
      });
    });
    view.querySelector('#emp-edit').addEventListener('click', function () { openForm(id); });
    view.querySelector('#emp-print').addEventListener('click', function () { window.print(); });
    view.querySelector('#emp-delete').addEventListener('click', function () {
      UI.confirmDialog({
        title: 'Delete employee record?',
        message: emp.name + ' will be permanently removed from the demo dataset.',
        confirmText: 'Delete', danger: true
      }).then(function (ok) {
        if (!ok) return;
        S.remove('employees', id);
        HRMS.Toast.success('Employee deleted');
        HRMS.Router.go('/employees');
      });
    });
    var upload = view.querySelector('#tab-upload');
    if (upload) {
      upload.addEventListener('click', function () {
        HRMS.Toast.info('Document upload is a placeholder in this prototype — connect the document service to enable it.');
      });
    }
  }

  HRMS.Modules = HRMS.Modules || {};
  HRMS.Modules.Employees = {
    register: function () {
      HRMS.Router.register('/employees', function () {
        var view = document.getElementById('view');
        view.innerHTML = renderList();
        bindList(view);
      });
      HRMS.Router.register('/employees/:id', function (ctx) {
        var view = document.getElementById('view');
        view.innerHTML = renderProfile(ctx.params.id);
        bindProfile(view, ctx.params.id);
      });
    },
    schema: EMP_SCHEMA
  };
})(window.HRMS);