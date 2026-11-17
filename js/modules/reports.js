window.HRMS = window.HRMS || {};
(function (HRMS) {
  'use strict';
  var U = HRMS.Util, UI = HRMS.UI, S = HRMS.State, L = HRMS.Lookup;

  var REPORTS = [
    { id: 'employee-master', title: 'Employee Master Report', collection: 'employees', desc: 'Complete employee register with job and compensation fields.' },
    { id: 'headcount', title: 'Headcount Report', collection: 'employees', desc: 'Department and branch-wise headcount distribution.' },
    { id: 'attendance', title: 'Attendance Report', collection: 'attendance', desc: 'Daily attendance status across branches.' },
    { id: 'leave', title: 'Leave Report', collection: 'leaveRequests', desc: 'Leave applications, approvals and utilisation.' },
    { id: 'payroll', title: 'Payroll Report', collection: 'payrollRuns', desc: 'Cycle-wise payroll totals and status.' },
    { id: 'recruitment', title: 'Recruitment Report', collection: 'candidates', desc: 'Pipeline stages and source effectiveness.' },
    { id: 'performance', title: 'Performance Report', collection: 'goals', desc: 'Goal weightages, achievement and ratings.' },
    { id: 'training', title: 'Training Report', collection: 'trainings', desc: 'Programs, nominations and completion.' },
    { id: 'contractor', title: 'Contractor Report', collection: 'contractors', desc: 'Agreements, deployment and compliance.' },
    { id: 'asset', title: 'Asset Report', collection: 'assets', desc: 'Allocation, condition and asset value.' },
    { id: 'compliance', title: 'Statutory Compliance Report', collection: 'complianceRecords', desc: 'Statutory dues, periods and filing status.' }
  ];

  function buildRows(report) {
    var rows = S.all(report.collection);
    if (S.session.branchId !== 'ALL') {
      rows = rows.filter(function (r) { return !r.branchId || r.branchId === S.session.branchId; });
    }
    return rows;
  }

  function columnsFor(report) {
    switch (report.id) {
      case 'employee-master':
        return [
          { label: 'Code', value: function (r) { return r.empCode; } },
          { label: 'Name', value: function (r) { return r.name; } },
          { label: 'Department', value: function (r) { return L.department(r.departmentId); } },
          { label: 'Designation', value: function (r) { return L.designation(r.designationId); } },
          { label: 'Branch', value: function (r) { return L.branch(r.branchId); } },
          { label: 'Status', value: function (r) { return r.status; } },
          { label: 'Gross Monthly', value: function (r) { return r.salary.gross; } }
        ];
      case 'attendance':
        return [
          { label: 'Date', value: function (r) { return r.date; } },
          { label: 'Employee', value: function (r) { return L.employeeName(r.employeeId); } },
          { label: 'Status', value: function (r) { return r.status; } },
          { label: 'Hours', value: function (r) { return r.workedHours; } },
          { label: 'Overtime', value: function (r) { return r.overtimeHours; } }
        ];
      case 'leave':
        return [
          { label: 'Request', value: function (r) { return r.id; } },
          { label: 'Employee', value: function (r) { return L.employeeName(r.employeeId); } },
          { label: 'Type', value: function (r) { return L.leaveType(r.leaveTypeId); } },
          { label: 'From', value: function (r) { return r.fromDate; } },
          { label: 'Days', value: function (r) { return r.days; } },
          { label: 'Status', value: function (r) { return r.status; } }
        ];
      case 'payroll':
        return [
          { label: 'Cycle', value: function (r) { return r.month; } },
          { label: 'Employees', value: function (r) { return r.employees; } },
          { label: 'Gross', value: function (r) { return r.grossTotal; } },
          { label: 'Deductions', value: function (r) { return r.deductionTotal; } },
          { label: 'Net', value: function (r) { return r.netTotal; } },
          { label: 'Status', value: function (r) { return r.status; } }
        ];
      case 'recruitment':
        return [
          { label: 'Candidate', value: function (r) { return r.name; } },
          { label: 'Requisition', value: function (r) { return r.requisitionId; } },
          { label: 'Source', value: function (r) { return r.source; } },
          { label: 'Stage', value: function (r) { return r.stage; } },
          { label: 'Rating', value: function (r) { return r.rating; } }
        ];
      case 'performance':
        return [
          { label: 'Employee', value: function (r) { return L.employeeName(r.employeeId); } },
          { label: 'KRA', value: function (r) { return r.kra; } },
          { label: 'Weight %', value: function (r) { return r.weightage; } },
          { label: 'Achievement', value: function (r) { return r.achievement; } },
          { label: 'Rating', value: function (r) { return r.managerRating; } }
        ];
      case 'training':
        return [
          { label: 'Program', value: function (r) { return r.name; } },
          { label: 'Category', value: function (r) { return r.category; } },
          { label: 'Start', value: function (r) { return r.startDate; } },
          { label: 'Nominated', value: function (r) { return r.nominated; } },
          { label: 'Status', value: function (r) { return r.status; } }
        ];
      case 'contractor':
        return [
          { label: 'Contractor', value: function (r) { return r.name; } },
          { label: 'Type', value: function (r) { return r.type; } },
          { label: 'Deployed', value: function (r) { return r.deployedWorkforce; } },
          { label: 'Agreement End', value: function (r) { return r.agreementEnd; } },
          { label: 'Compliance', value: function (r) { return r.complianceStatus; } }
        ];
      case 'asset':
        return [
          { label: 'Asset', value: function (r) { return r.name; } },
          { label: 'Category', value: function (r) { return r.category; } },
          { label: 'Allocated To', value: function (r) { return r.employeeId ? L.employeeName(r.employeeId) : 'Unassigned'; } },
          { label: 'Value', value: function (r) { return r.purchaseValue; } },
          { label: 'Status', value: function (r) { return r.status; } }
        ];
      case 'compliance':
        return [
          { label: 'Statute', value: function (r) { return r.name; } },
          { label: 'Category', value: function (r) { return r.category; } },
          { label: 'Due Date', value: function (r) { return r.dueDate; } },
          { label: 'Amount', value: function (r) { return r.amount; } },
          { label: 'Status', value: function (r) { return r.status; } }
        ];
      case 'headcount':
      default:
        return [
          { label: 'Employee', value: function (r) { return r.name || r.id; } },
          { label: 'Department', value: function (r) { return r.departmentId ? L.department(r.departmentId) : '—'; } },
          { label: 'Branch', value: function (r) { return r.branchId ? L.branch(r.branchId) : '—'; } },
          { label: 'Status', value: function (r) { return r.status || '—'; } }
        ];
    }
  }

  var activeReport = REPORTS[0].id;

  function handler() {
    var report = REPORTS.filter(function (r) { return r.id === activeReport; })[0] || REPORTS[0];
    var rows = buildRows(report);
    var cols = columnsFor(report);

    var html = HRMS.Navigation.breadcrumbs([{ label: 'Home', href: '#/dashboard' }, { label: 'Reports & Analytics' }]) +
      '<div class="page-head"><div class="page-head__text"><h1>Reports & Analytics</h1>' +
      '<p>Centralised report centre · ' + U.esc(L.branch(S.session.branchId)) + '</p></div>' +
      '<div class="page-head__actions">' +
      '<button class="btn" id="rep-print">' + UI.icon('print', 15) + 'Print</button>' +
      '<button class="btn btn--primary" id="rep-export">' + UI.icon('download', 15) + 'Export CSV</button></div></div>';

    html += '<div class="card"><div class="card__body"><div class="grid grid--4" style="gap:10px">' +
      REPORTS.map(function (r) {
        return '<button class="btn" data-report="' + r.id + '" style="justify-content:flex-start;height:auto;padding:10px 12px;text-align:left;' +
          (r.id === activeReport ? 'border-color:var(--c-primary);background:var(--c-primary-soft);color:var(--c-primary)' : '') + '">' +
          '<span><strong style="display:block;font-size:12px">' + U.esc(r.title) + '</strong>' +
          '<span class="tiny faint">' + U.esc(r.desc) + '</span></span></button>';
      }).join('') + '</div></div></div>';

    html += '<div class="card mt-6"><div class="card__head"><h3>' + U.esc(report.title) + '</h3>' +
      '<p>' + rows.length + ' row(s)</p></div>' +
      '<div class="card__body card__body--flush">' +
      (rows.length ? '<div class="table-wrap"><table class="table"><thead><tr>' +
        cols.map(function (c) { return '<th>' + U.esc(c.label) + '</th>'; }).join('') +
        '</tr></thead><tbody>' +
        rows.slice(0, 100).map(function (r) {
          return '<tr>' + cols.map(function (c) {
            var v = c.value(r);
            return '<td>' + U.esc(v === undefined || v === null ? '—' : v) + '</td>';
          }).join('') + '</tr>';
        }).join('') + '</tbody></table></div>' +
        (rows.length > 100 ? '<div class="card__body tiny muted">Showing first 100 rows. Use Export CSV for the full dataset.</div>' : '')
        : UI.emptyState({ icon: 'chart', title: 'No data', message: 'This report has no records for the selected scope.' })) +
      '</div></div>';

    return html;
  }

  function bind(view) {
    U.qsa('[data-report]', view).forEach(function (b) {
      b.addEventListener('click', function () {
        activeReport = b.getAttribute('data-report');
        HRMS.Router.refresh();
      });
    });
    var report = REPORTS.filter(function (r) { return r.id === activeReport; })[0];
    var cols = columnsFor(report);
    view.querySelector('#rep-export').addEventListener('click', function () {
      var rows = buildRows(report);
      U.download(report.id + '-report.csv', U.toCSV(rows, cols));
      HRMS.Toast.success('Report exported');
    });
    view.querySelector('#rep-print').addEventListener('click', function () { window.print(); });
  }

  HRMS.Modules = HRMS.Modules || {};
  HRMS.Modules.Reports = {
    register: function () {
      HRMS.Router.register('/reports', function () {
        var view = document.getElementById('view');
        view.innerHTML = handler();
        bind(view);
      });
    }
  };
})(window.HRMS);