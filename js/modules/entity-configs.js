window.HRMS = window.HRMS || {};
(function (HRMS) {
  'use strict';
  var U = HRMS.Util, UI = HRMS.UI, S = HRMS.State, L = HRMS.Lookup;

  function empOptions() {
    return S.all('employees').slice(0, 60).map(function (e) { return { value: e.id, label: e.name + ' (' + e.empCode + ')' }; });
  }
  function deptOptions() {
    return S.all('departments').map(function (d) { return { value: d.id, label: d.name }; });
  }
  function branchOptions() {
    return S.all('branches').map(function (b) { return { value: b.id, label: b.name }; });
  }
  function personCell(id) {
    var name = L.employeeName(id);
    return '<div class="person">' + U.avatar(name, 'sm') + '<div class="person__meta"><strong>' + U.esc(name) + '</strong><span>' + U.esc(id || '—') + '</span></div></div>';
  }

  var CONFIGS = [];

  /* ---------- MASTER: BRANCHES ---------- */
  CONFIGS.push({
    route: 'organization/branches', collection: 'branches', title: 'Branch Management', singular: 'Branch',
    icon: 'briefcase', idPrefix: 'br', subtitle: 'Manage company locations and offices',
    searchFields: ['name', 'code', 'city'],
    columns: [
      { key: 'name', label: 'Branch Name', sortable: true },
      { key: 'code', label: 'Code' },
      { key: 'city', label: 'City' },
      { key: 'headcount', label: 'Employees', align: 'right' },
      { key: 'status', label: 'Status', render: function (r) { return U.badge(r.status); } }
    ],
    form: [
      { name: 'name', label: 'Branch Name', type: 'text', required: true },
      { name: 'code', label: 'Branch Code', type: 'text', required: true },
      { name: 'city', label: 'City', type: 'text', required: true },
      { name: 'state', label: 'State', type: 'text', required: true },
      { name: 'address', label: 'Address', type: 'textarea', full: true },
      { name: 'phone', label: 'Phone', type: 'tel' },
      { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'], default: 'Active' }
    ],
    detailGroups: function(r) {
      return [{ title: 'Branch Details', fields: [['Name', r.name], ['Code', r.code], ['City', r.city], ['Address', r.address]] }];
    }
  });

  /* ---------- MASTER: DEPARTMENTS ---------- */
  CONFIGS.push({
    route: 'organization/departments', collection: 'departments', title: 'Department Management', singular: 'Department',
    icon: 'grid', idPrefix: 'dp', subtitle: 'Organizational structure and cost centres',
    searchFields: ['name', 'code'],
    columns: [
      { key: 'name', label: 'Department', sortable: true },
      { key: 'code', label: 'Code' },
      { key: 'branchId', label: 'Branch', render: function (r) { return U.esc(L.branch(r.branchId)); } },
      { key: 'costCentre', label: 'Cost Centre' },
      { key: 'status', label: 'Status', render: function (r) { return U.badge(r.status); } }
    ],
    form: [
      { name: 'name', label: 'Department Name', type: 'text', required: true },
      { name: 'code', label: 'Department Code', type: 'text', required: true },
      { name: 'branchId', label: 'Branch', type: 'select', required: true, options: branchOptions },
      { name: 'costCentre', label: 'Cost Centre', type: 'text' },
      { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'], default: 'Active' }
    ],
    detailGroups: function(r) {
      return [{ title: 'Department Details', fields: [['Name', r.name], ['Code', r.code], ['Branch', L.branch(r.branchId)]] }];
    }
  });

  /* ---------- MASTER: DESIGNATIONS ---------- */
  CONFIGS.push({
    route: 'organization/designations', collection: 'designations', title: 'Designation Master', singular: 'Designation',
    icon: 'award', idPrefix: 'dg', subtitle: 'Job titles, grades and salary bands',
    searchFields: ['name', 'grade'],
    columns: [
      { key: 'name', label: 'Designation', sortable: true },
      { key: 'grade', label: 'Grade' },
      { key: 'level', label: 'Level', align: 'right' },
      { key: 'minCtc', label: 'Min CTC', align: 'right', render: function (r) { return U.fmtCurrency(r.minCtc); } },
      { key: 'maxCtc', label: 'Max CTC', align: 'right', render: function (r) { return U.fmtCurrency(r.maxCtc); } },
      { key: 'status', label: 'Status', render: function (r) { return U.badge(r.status); } }
    ],
    form: [
      { name: 'name', label: 'Designation Name', type: 'text', required: true },
      { name: 'grade', label: 'Grade', type: 'text', required: true },
      { name: 'level', label: 'Level (1-10)', type: 'number', required: true, min: 1, max: 10 },
      { name: 'minCtc', label: 'Min CTC (Annual)', type: 'number', required: true },
      { name: 'maxCtc', label: 'Max CTC (Annual)', type: 'number', required: true },
      { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'], default: 'Active' }
    ]
  });

  /* ---------- MASTER: LEAVE TYPES ---------- */
  CONFIGS.push({
    route: 'organization/leaveTypes', collection: 'leaveTypes', title: 'Leave Type Master', singular: 'Leave Type',
    icon: 'calendar', idPrefix: 'lt', subtitle: 'Configure leave quotas and policies',
    searchFields: ['name', 'code'],
    columns: [
      { key: 'name', label: 'Leave Type', sortable: true },
      { key: 'code', label: 'Code' },
      { key: 'daysPerYear', label: 'Days / Year', align: 'right' },
      { key: 'carryForward', label: 'Carry Forward' },
      { key: 'paid', label: 'Paid' },
      { key: 'status', label: 'Status', render: function (r) { return U.badge(r.status); } }
    ],
    form: [
      { name: 'name', label: 'Leave Type Name', type: 'text', required: true },
      { name: 'code', label: 'Code', type: 'text', required: true },
      { name: 'daysPerYear', label: 'Days Per Year', type: 'number', required: true, min: 0 },
      { name: 'carryForward', label: 'Carry Forward', type: 'select', options: ['Yes', 'No'], default: 'No' },
      { name: 'maxCarryForward', label: 'Max Carry Forward (Days)', type: 'number', min: 0 },
      { name: 'paid', label: 'Is Paid', type: 'select', options: ['Yes', 'No'], default: 'Yes' },
      { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'], default: 'Active' }
    ]
  });

  /* ---------- ORGANIZATION PROFILE ---------- */
  CONFIGS.push({
    route: 'organization', collection: 'departments', title: 'Organization Profile', singular: 'Department',
    icon: 'sitemap', idPrefix: 'org', subtitle: 'Branches, departments, designations, cost centres and hierarchy',
    searchFields: ['name', 'code', 'costCentre'], searchPlaceholder: 'Search departments…',
    columns: [
      { key: 'name', label: 'Department', sortable: true },
      { key: 'code', label: 'Code' },
      { key: 'branchId', label: 'Branch', render: function (r) { return U.esc(L.branch(r.branchId)); } },
      { key: 'costCentre', label: 'Cost Centre' },
      { key: 'headId', label: 'Department Head', render: function (r) { return U.esc(r.headId ? L.employeeName(r.headId) : '—'); } },
      { key: 'status', label: 'Status', render: function (r) { return U.badge(r.status); } }
    ],
    filters: [
      { key: 'branchId', label: 'Branch', options: branchOptions(), accessor: function (r) { return r.branchId; } },
      { key: 'status', label: 'Status', options: ['Active', 'Inactive'], accessor: function (r) { return r.status; } }
    ],
    stats: function (rows) {
      return [
        { label: 'Branches', value: S.all('branches').length, icon: 'sitemap' },
        { label: 'Departments', value: S.all('departments').length, icon: 'grid' },
        { label: 'Designations', value: S.all('designations').length, icon: 'award' },
        { label: 'Active Departments', value: rows.filter(function (r) { return r.status === 'Active'; }).length, icon: 'check' }
      ];
    },
    form: [
      { name: 'name', label: 'Department Name', type: 'text', required: true },
      { name: 'code', label: 'Department Code', type: 'text', required: true },
      { name: 'branchId', label: 'Branch', type: 'select', required: true, options: branchOptions, placeholder: 'Select branch' },
      { name: 'costCentre', label: 'Cost Centre', type: 'text' },
      { name: 'status', label: 'Status', type: 'select', required: true, options: ['Active', 'Inactive'], default: 'Active' }
    ],
    detailGroups: function (r) {
      return [{
        title: 'Department', fields: [
          ['Name', r.name], ['Code', r.code], ['Branch', L.branch(r.branchId)],
          ['Cost Centre', r.costCentre], ['Head', r.headId ? L.employeeName(r.headId) : '—'],
          ['Status', r.status]
        ]
      }, {
        title: 'Headcount', fields: [
          ['Employees', S.all('employees').filter(function (e) { return e.departmentId === r.id; }).length]
        ]
      }];
    }
  });

  /* ---------- RECRUITMENT ---------- */
  CONFIGS.push({
    route: 'recruitment', collection: 'candidates', title: 'Recruitment', singular: 'Candidate',
    icon: 'target', idPrefix: 'rec', subtitle: 'Requisition pipeline: Applied → Screening → Interview → Selected → Offer → Hired',
    searchFields: ['name', 'email', 'requisitionId'], searchPlaceholder: 'Search candidates…',
    approvals: true,
    columns: [
      { key: 'name', label: 'Candidate', sortable: true, render: function (r) { return personCell(r.id).replace(r.id, r.email); } },
      { key: 'requisitionId', label: 'Requisition' },
      { key: 'source', label: 'Source' },
      { key: 'experienceYears', label: 'Exp (yrs)', align: 'right' },
      { key: 'expectedCtc', label: 'Expected CTC', align: 'right', render: function (r) { return U.fmtCurrency(r.expectedCtc); } },
      { key: 'stage', label: 'Stage', render: function (r) { return U.badge(r.stage); } },
      { key: 'rating', label: 'Rating', align: 'right' }
    ],
    filters: [
      { key: 'stage', label: 'Stage', options: ['Applied', 'Screening', 'Interview', 'Selected', 'Offer', 'Hired', 'Rejected'], accessor: function (r) { return r.stage; } },
      { key: 'source', label: 'Source', options: ['LinkedIn', 'Naukri', 'Referral', 'Walk-in', 'Campus'], accessor: function (r) { return r.source; } }
    ],
    stats: function (rows) {
      return [
        { label: 'Total Candidates', value: rows.length, icon: 'users' },
        { label: 'In Interview', value: rows.filter(function (r) { return r.stage === 'Interview'; }).length, icon: 'target' },
        { label: 'Offers Out', value: rows.filter(function (r) { return r.stage === 'Offer'; }).length, icon: 'file' },
        { label: 'Hired', value: rows.filter(function (r) { return r.stage === 'Hired'; }).length, icon: 'check' }
      ];
    },
    form: [
      { name: 'name', label: 'Candidate Name', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'phone', label: 'Phone', type: 'tel', required: true },
      { name: 'requisitionId', label: 'Requisition', type: 'select', required: true, options: function () { return S.all('requisitions').map(function (r) { return { value: r.id, label: r.id + ' — ' + r.title }; }); } },
      { name: 'source', label: 'Source', type: 'select', required: true, options: ['LinkedIn', 'Naukri', 'Referral', 'Walk-in', 'Campus'] },
      { name: 'experienceYears', label: 'Experience (years)', type: 'number', required: true, min: 0, max: 45 },
      { name: 'currentCtc', label: 'Current CTC', type: 'number', min: 0 },
      { name: 'expectedCtc', label: 'Expected CTC', type: 'number', min: 0 },
      { name: 'stage', label: 'Stage', type: 'select', required: true, options: ['Applied', 'Screening', 'Interview', 'Selected', 'Offer', 'Hired', 'Rejected'], default: 'Applied' },
      { name: 'rating', label: 'Rating (1-5)', type: 'number', min: 1, max: 5 }
    ],
    detailGroups: function (r) {
      return [{
        title: 'Candidate', fields: [
          ['Name', r.name], ['Email', r.email], ['Phone', r.phone],
          ['Requisition', r.requisitionId], ['Source', r.source], ['Experience', r.experienceYears + ' years'],
          ['Current CTC', U.fmtCurrency(r.currentCtc)], ['Expected CTC', U.fmtCurrency(r.expectedCtc)],
          ['Stage', r.stage], ['Rating', r.rating + ' / 5'], ['Applied On', U.fmtDate(r.appliedOn)]
        ]
      }];
    }
  });

  /* ---------- ATTENDANCE ---------- */
  CONFIGS.push({
    route: 'attendance', collection: 'attendance', title: 'Attendance Management', singular: 'Attendance Record',
    icon: 'clock', idPrefix: 'att', subtitle: 'Daily punches, late coming, overtime and regularisation',
    searchFields: ['id', function (r) { return L.employeeName(r.employeeId); }, 'date'],
    searchPlaceholder: 'Search by employee, date or record ID…',
    columns: [
      { key: 'employeeId', label: 'Employee', render: function (r) { return personCell(r.employeeId); } },
      { key: 'date', label: 'Date', sortable: true, render: function (r) { return U.fmtDate(r.date); }, exportValue: function (r) { return r.date; } },
      { key: 'shiftId', label: 'Shift', render: function (r) { return U.esc(L.shift(r.shiftId)); } },
      { key: 'inTime', label: 'In' }, { key: 'outTime', label: 'Out' },
      { key: 'workedHours', label: 'Hours', align: 'right' },
      { key: 'overtimeHours', label: 'OT', align: 'right' },
      { key: 'status', label: 'Status', render: function (r) { return U.badge(r.status); } }
    ],
    filters: [
      { key: 'status', label: 'Status', options: ['Present', 'Late', 'Half Day', 'Absent', 'On Leave', 'Week Off'], accessor: function (r) { return r.status; } },
      { key: 'branchId', label: 'Branch', options: branchOptions, accessor: function (r) { return r.branchId; } },
      { key: 'departmentId', label: 'Department', options: deptOptions, accessor: function (r) { return r.departmentId; } }
    ],
    stats: function (rows) {
      return [
        { label: 'Records', value: rows.length, icon: 'clock' },
        { label: 'Present', value: rows.filter(function (r) { return r.status === 'Present'; }).length, icon: 'check' },
        { label: 'Late', value: rows.filter(function (r) { return r.status === 'Late'; }).length, icon: 'clock' },
        { label: 'Overtime Hours', value: rows.reduce(function (s, r) { return s + (r.overtimeHours || 0); }, 0), icon: 'chart' }
      ];
    },
    form: [
      { name: 'employeeId', label: 'Employee', type: 'select', required: true, options: empOptions, placeholder: 'Select employee' },
      { name: 'date', label: 'Date', type: 'date', required: true },
      { name: 'inTime', label: 'In Time (HH:MM)', type: 'text' },
      { name: 'outTime', label: 'Out Time (HH:MM)', type: 'text' },
      { name: 'workedHours', label: 'Worked Hours', type: 'number', min: 0, max: 24 },
      { name: 'overtimeHours', label: 'Overtime Hours', type: 'number', min: 0, max: 12 },
      { name: 'status', label: 'Status', type: 'select', required: true, options: ['Present', 'Late', 'Half Day', 'Absent', 'On Leave', 'Week Off', 'Holiday'], default: 'Present' },
      { name: 'source', label: 'Source', type: 'select', options: ['Biometric', 'Manual', 'Mobile App', 'Web'], default: 'Manual' }
    ],
    detailGroups: function (r) {
      return [{
        title: 'Attendance Record', fields: [
          ['Employee', L.employeeName(r.employeeId)], ['Date', U.fmtDate(r.date)],
          ['Shift', L.shift(r.shiftId)], ['In', r.inTime || '—'], ['Out', r.outTime || '—'],
          ['Worked Hours', r.workedHours], ['Overtime', r.overtimeHours],
          ['Status', r.status], ['Source', r.source]
        ]
      }];
    }
  });

  /* ---------- SHIFTS ---------- */
  CONFIGS.push({
    route: 'shifts', collection: 'shifts', title: 'Shift & Roster Management', singular: 'Shift',
    icon: 'calendar', idPrefix: 'shf', subtitle: 'General, rotational, split, flexible and cross-midnight shift masters',
    searchFields: ['name', 'code', 'type'],
    columns: [
      { key: 'name', label: 'Shift', sortable: true },
      { key: 'code', label: 'Code' },
      { key: 'startTime', label: 'Start' }, { key: 'endTime', label: 'End' },
      { key: 'type', label: 'Type' },
      { key: 'graceMins', label: 'Grace (min)', align: 'right' },
      { key: 'weeklyOffs', label: 'Weekly Offs' },
      { key: 'status', label: 'Status', render: function (r) { return U.badge(r.status); } }
    ],
    filters: [{ key: 'type', label: 'Shift Type', options: ['General', 'Rotational', 'Flexible', 'Cross-midnight'], accessor: function (r) { return r.type; } }],
    stats: function (rows) {
      return [
        { label: 'Shift Masters', value: rows.length, icon: 'calendar' },
        { label: 'Rotational', value: rows.filter(function (r) { return r.type === 'Rotational'; }).length, icon: 'refresh' },
        { label: 'Cross-midnight', value: rows.filter(function (r) { return r.crossMidnight === 'Yes'; }).length, icon: 'moon' },
        { label: 'Active', value: rows.filter(function (r) { return r.status === 'Active'; }).length, icon: 'check' }
      ];
    },
    form: [
      { name: 'name', label: 'Shift Name', type: 'text', required: true },
      { name: 'code', label: 'Shift Code', type: 'text', required: true },
      { name: 'startTime', label: 'Start Time', type: 'text', required: true, placeholder: '09:00' },
      { name: 'endTime', label: 'End Time', type: 'text', required: true, placeholder: '18:00' },
      { name: 'type', label: 'Shift Type', type: 'select', required: true, options: ['General', 'Rotational', 'Flexible', 'Split', 'Cross-midnight'] },
      { name: 'breakMins', label: 'Break (minutes)', type: 'number', min: 0, max: 180 },
      { name: 'graceMins', label: 'Grace Period (minutes)', type: 'number', min: 0, max: 180 },
      { name: 'weeklyOffs', label: 'Weekly Offs', type: 'text', placeholder: 'Sat,Sun' },
      { name: 'crossMidnight', label: 'Cross Midnight', type: 'select', options: ['Yes', 'No'], default: 'No' },
      { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'], default: 'Active' }
    ],
    detailGroups: function (r) {
      return [{
        title: 'Shift Definition', fields: [
          ['Name', r.name], ['Code', r.code], ['Timing', r.startTime + ' – ' + r.endTime],
          ['Type', r.type], ['Break', r.breakMins + ' min'], ['Grace', r.graceMins + ' min'],
          ['Weekly Offs', r.weeklyOffs], ['Cross Midnight', r.crossMidnight], ['Status', r.status]
        ]
      }, {
        title: 'Assigned Employees', fields: [
          ['Employees', S.all('employees').filter(function (e) { return e.shiftId === r.id; }).length]
        ]
      }];
    }
  });

  /* ---------- LEAVE ---------- */
  CONFIGS.push({
    route: 'leave', collection: 'leaveRequests', title: 'Leave Management', singular: 'Leave Request',
    icon: 'calendar', idPrefix: 'lev', subtitle: 'Applications, approvals, balances and leave calendar',
    approvals: true,
    searchFields: ['id', function (r) { return L.employeeName(r.employeeId); }, 'reason'],
    columns: [
      { key: 'id', label: 'Request #', sortable: true },
      { key: 'employeeId', label: 'Employee', render: function (r) { return personCell(r.employeeId); } },
      { key: 'leaveTypeId', label: 'Leave Type', render: function (r) { return U.esc(L.leaveType(r.leaveTypeId)); } },
      { key: 'fromDate', label: 'From', render: function (r) { return U.fmtDate(r.fromDate); }, exportValue: function (r) { return r.fromDate; } },
      { key: 'days', label: 'Days', align: 'right' },
      { key: 'status', label: 'Status', render: function (r) { return U.badge(r.status); } },
      { key: 'appliedOn', label: 'Applied', render: function (r) { return U.fmtDate(r.appliedOn); } }
    ],
    filters: [
      { key: 'status', label: 'Status', options: ['Pending', 'Approved', 'Rejected'], accessor: function (r) { return r.status; } },
      { key: 'leaveTypeId', label: 'Leave Type', options: function () { return S.all('leaveTypes').map(function (t) { return { value: t.id, label: t.name }; }); }, accessor: function (r) { return r.leaveTypeId; } }
    ],
    stats: function (rows) {
      return [
        { label: 'Total Requests', value: rows.length, icon: 'calendar' },
        { label: 'Pending', value: rows.filter(function (r) { return r.status === 'Pending'; }).length, icon: 'clock' },
        { label: 'Approved', value: rows.filter(function (r) { return r.status === 'Approved'; }).length, icon: 'check' },
        { label: 'Days Requested', value: rows.reduce(function (s, r) { return s + (r.days || 0); }, 0), icon: 'chart' }
      ];
    },
    form: [
      { name: 'employeeId', label: 'Employee', type: 'select', required: true, options: empOptions, placeholder: 'Select employee' },
      { name: 'leaveTypeId', label: 'Leave Type', type: 'select', required: true, options: function () { return S.all('leaveTypes').map(function (t) { return { value: t.id, label: t.name }; }); }, placeholder: 'Select leave type' },
      { name: 'fromDate', label: 'From Date', type: 'date', required: true },
      { name: 'toDate', label: 'To Date', type: 'date', required: true },
      { name: 'days', label: 'Number of Days', type: 'number', required: true, min: 1, max: 180 },
      { name: 'reason', label: 'Reason', type: 'textarea', required: true, full: true, minLength: 5 },
      { name: 'contact', label: 'Contact During Leave', type: 'tel' },
      { name: 'status', label: 'Status', type: 'select', options: ['Pending', 'Approved', 'Rejected'], default: 'Pending' }
    ],
    detailGroups: function (r) {
      return [{
        title: 'Leave Request', fields: [
          ['Request', r.id], ['Employee', L.employeeName(r.employeeId)],
          ['Leave Type', L.leaveType(r.leaveTypeId)], ['From', U.fmtDate(r.fromDate)],
          ['To', U.fmtDate(r.toDate)], ['Days', r.days], ['Reason', r.reason],
          ['Contact', r.contact], ['Applied On', U.fmtDate(r.appliedOn)], ['Status', r.status]
        ]
      }];
    }
  });

  /* ---------- PAYROLL ---------- */
  CONFIGS.push({
    route: 'payroll', collection: 'payrollRuns', title: 'Payroll Management', singular: 'Payroll Run',
    icon: 'wallet', idPrefix: 'pay', subtitle: 'Draft → Attendance Validation → Calculation → Review → Approval → Finalized',
    notice: 'All payroll figures in this prototype are demonstration calculations only. They are not legally validated payroll output.',
    editable: false,
    searchFields: ['id', 'month'],
    columns: [
      { key: 'id', label: 'Run ID', sortable: true },
      { key: 'month', label: 'Payroll Month' },
      { key: 'employees', label: 'Employees', align: 'right' },
      { key: 'grossTotal', label: 'Gross', align: 'right', render: function (r) { return U.fmtCurrency(r.grossTotal); } },
      { key: 'deductionTotal', label: 'Deductions', align: 'right', render: function (r) { return U.fmtCurrency(r.deductionTotal); } },
      { key: 'netTotal', label: 'Net Payable', align: 'right', render: function (r) { return U.fmtCurrency(r.netTotal); } },
      { key: 'overtimeTotal', label: 'Overtime', align: 'right', render: function (r) { return U.fmtCurrency(r.overtimeTotal); } },
      { key: 'status', label: 'Status', render: function (r) { return U.badge(r.status); } }
    ],
    filters: [{ key: 'status', label: 'Status', options: ['Draft', 'Under Review', 'Finalized'], accessor: function (r) { return r.status; } }],
    stats: function (rows) {
      var latest = rows[0] || {};
      return [
        { label: 'Cycles', value: rows.length, icon: 'wallet' },
        { label: 'Latest Gross', value: U.fmtCurrency(latest.grossTotal || 0), icon: 'chart' },
        { label: 'Latest Net', value: U.fmtCurrency(latest.netTotal || 0), icon: 'card' },
        { label: 'Finalized', value: rows.filter(function (r) { return r.status === 'Finalized'; }).length, icon: 'check' }
      ];
    },
    form: [],
    detailGroups: function (r) {
      return [{
        title: 'Payroll Cycle', fields: [
          ['Run ID', r.id], ['Month', r.month], ['Period', r.period],
          ['Employees', r.employees], ['Gross Total', U.fmtCurrency(r.grossTotal)],
          ['Deductions', U.fmtCurrency(r.deductionTotal)], ['Net Payable', U.fmtCurrency(r.netTotal)],
          ['Overtime', U.fmtCurrency(r.overtimeTotal)], ['Status', r.status], ['Processed On', U.fmtDate(r.processedOn)]
        ]
      }, {
        title: 'Workflow', fields: [
          ['1. Draft', 'Completed'], ['2. Attendance Validation', 'Completed'],
          ['3. Calculation', 'Completed'], ['4. Review', r.status === 'Draft' ? 'Pending' : 'Completed'],
          ['5. Approval', r.status === 'Finalized' ? 'Completed' : 'Pending'], ['6. Finalized', r.status === 'Finalized' ? 'Yes' : 'No']
        ]
      }];
    }
  });

  /* ---------- COMPLIANCE ---------- */
  CONFIGS.push({
    route: 'compliance', collection: 'complianceRecords', title: 'Statutory Compliance', singular: 'Compliance Record',
    icon: 'shield', idPrefix: 'cmp',
    subtitle: 'EPF, ESIC, Professional Tax, TDS, LWF and statutory registers',
    notice: 'Statutory rates, ceilings and effective dates shown here are illustrative placeholders and must be replaced with legally verified values before production use.',
    searchFields: ['id', 'name', 'category'],
    columns: [
      { key: 'name', label: 'Statute', sortable: true },
      { key: 'category', label: 'Category' },
      { key: 'rate', label: 'Rate / Basis' },
      { key: 'period', label: 'Period' },
      { key: 'dueDate', label: 'Due Date', render: function (r) { return U.fmtDate(r.dueDate); } },
      { key: 'amount', label: 'Amount', align: 'right', render: function (r) { return U.fmtCurrency(r.amount); } },
      { key: 'status', label: 'Status', render: function (r) { return U.badge(r.status); } }
    ],
    filters: [
      { key: 'category', label: 'Category', options: ['Provident Fund', 'Insurance', 'State Tax', 'Income Tax', 'Welfare', 'Labour'], accessor: function (r) { return r.category; } },
      { key: 'status', label: 'Status', options: ['Pending', 'Paid', 'Filed', 'Overdue'], accessor: function (r) { return r.status; } }
    ],
    stats: function (rows) {
      return [
        { label: 'Statutory Items', value: rows.length, icon: 'shield' },
        { label: 'Filed', value: rows.filter(function (r) { return r.status === 'Filed'; }).length, icon: 'check' },
        { label: 'Pending', value: rows.filter(function (r) { return r.status === 'Pending'; }).length, icon: 'clock' },
        { label: 'Total Liability', value: U.fmtCurrency(rows.reduce(function (s, r) { return s + (r.amount || 0); }, 0)), icon: 'wallet' }
      ];
    },
    form: [
      { name: 'name', label: 'Statute Name', type: 'text', required: true },
      { name: 'category', label: 'Category', type: 'select', required: true, options: ['Provident Fund', 'Insurance', 'State Tax', 'Income Tax', 'Welfare', 'Labour'] },
      { name: 'rate', label: 'Rate / Basis', type: 'text', required: true, placeholder: 'e.g. 12% of basic' },
      { name: 'period', label: 'Period', type: 'text', required: true, placeholder: 'e.g. Apr 2025' },
      { name: 'dueDate', label: 'Due Date', type: 'date', required: true },
      { name: 'amount', label: 'Amount', type: 'number', min: 0 },
      { name: 'status', label: 'Status', type: 'select', options: ['Pending', 'Paid', 'Filed', 'Overdue'], default: 'Pending' }
    ],
    detailGroups: function (r) {
      return [{
        title: 'Compliance Item', fields: [
          ['Statute', r.name], ['Category', r.category], ['Rate / Basis', r.rate],
          ['Period', r.period], ['Due Date', U.fmtDate(r.dueDate)],
          ['Amount', U.fmtCurrency(r.amount)], ['Status', r.status]
        ]
      }];
    }
  });

  /* ---------- PERFORMANCE ---------- */
  CONFIGS.push({
    route: 'performance', collection: 'goals', title: 'Performance Management', singular: 'Goal',
    icon: 'award', idPrefix: 'perf', subtitle: 'KRA/KPI goal setting, self-assessment, manager review and rating',
    approvals: true,
    searchFields: ['id', 'kra', 'kpi'],
    columns: [
      { key: 'employeeId', label: 'Employee', render: function (r) { return personCell(r.employeeId); } },
      { key: 'kra', label: 'KRA', sortable: true },
      { key: 'kpi', label: 'KPI' },
      { key: 'weightage', label: 'Weight %', align: 'right' },
      { key: 'achievement', label: 'Achievement', align: 'right' },
      { key: 'managerRating', label: 'Rating', align: 'right' },
      { key: 'status', label: 'Status', render: function (r) { return U.badge(r.status); } }
    ],
    filters: [
      { key: 'cycle', label: 'Cycle', options: ['FY 2025-26'], accessor: function (r) { return r.cycle; } },
      { key: 'status', label: 'Status', options: ['Draft', 'In Review', 'Finalized'], accessor: function (r) { return r.status; } }
    ],
    stats: function (rows) {
      var avg = rows.length ? (rows.reduce(function (s, r) { return s + (r.managerRating || 0); }, 0) / rows.length).toFixed(1) : '0.0';
      return [
        { label: 'Goals', value: rows.length, icon: 'award' },
        { label: 'Avg Rating', value: avg, icon: 'chart' },
        { label: 'In Review', value: rows.filter(function (r) { return r.status === 'In Review'; }).length, icon: 'clock' },
        { label: 'Finalized', value: rows.filter(function (r) { return r.status === 'Finalized'; }).length, icon: 'check' }
      ];
    },
    form: [
      { name: 'employeeId', label: 'Employee', type: 'select', required: true, options: empOptions },
      { name: 'kra', label: 'KRA', type: 'text', required: true },
      { name: 'kpi', label: 'KPI', type: 'text', required: true },
      { name: 'weightage', label: 'Weightage (%)', type: 'number', required: true, min: 1, max: 100 },
      { name: 'target', label: 'Target', type: 'text' },
      { name: 'achievement', label: 'Achievement', type: 'text' },
      { name: 'selfRating', label: 'Self Rating (1-5)', type: 'number', min: 1, max: 5 },
      { name: 'managerRating', label: 'Manager Rating (1-5)', type: 'number', min: 1, max: 5 },
      { name: 'cycle', label: 'Cycle', type: 'select', required: true, options: ['FY 2025-26', 'FY 2024-25'], default: 'FY 2025-26' },
      { name: 'status', label: 'Status', type: 'select', options: ['Draft', 'In Review', 'Finalized'], default: 'Draft' }
    ],
    detailGroups: function (r) {
      return [{
        title: 'Goal', fields: [
          ['Employee', L.employeeName(r.employeeId)], ['KRA', r.kra], ['KPI', r.kpi],
          ['Weightage', r.weightage + '%'], ['Target', r.target], ['Achievement', r.achievement],
          ['Self Rating', r.selfRating], ['Manager Rating', r.managerRating],
          ['Cycle', r.cycle], ['Status', r.status]
        ]
      }];
    }
  });

  /* ---------- TRAINING ---------- */
  CONFIGS.push({
    route: 'training', collection: 'trainings', title: 'Training & Development', singular: 'Training Program',
    icon: 'book', idPrefix: 'trn', subtitle: 'Training calendar, nominations, attendance and evaluation',
    searchFields: ['id', 'name', 'trainer'],
    columns: [
      { key: 'name', label: 'Program', sortable: true },
      { key: 'category', label: 'Category' },
      { key: 'trainer', label: 'Trainer' },
      { key: 'mode', label: 'Mode' },
      { key: 'startDate', label: 'Start', render: function (r) { return U.fmtDate(r.startDate); }, exportValue: function (r) { return r.startDate; } },
      { key: 'durationHours', label: 'Hours', align: 'right' },
      { key: 'nominated', label: 'Nominated', align: 'right' },
      { key: 'status', label: 'Status', render: function (r) { return U.badge(r.status); } }
    ],
    filters: [
      { key: 'category', label: 'Category', options: ['Statutory', 'Technical', 'Behavioural', 'Safety'], accessor: function (r) { return r.category; } },
      { key: 'status', label: 'Status', options: ['Scheduled', 'Completed', 'Cancelled', 'Nomination Open'], accessor: function (r) { return r.status; } }
    ],
    stats: function (rows) {
      return [
        { label: 'Programs', value: rows.length, icon: 'book' },
        { label: 'Completed', value: rows.filter(function (r) { return r.status === 'Completed'; }).length, icon: 'check' },
        { label: 'Nomination Open', value: rows.filter(function (r) { return r.status === 'Nomination Open'; }).length, icon: 'users' },
        { label: 'Total Hours', value: rows.reduce(function (s, r) { return s + (r.durationHours || 0); }, 0), icon: 'clock' }
      ];
    },
    form: [
      { name: 'name', label: 'Program Name', type: 'text', required: true },
      { name: 'category', label: 'Category', type: 'select', required: true, options: ['Statutory', 'Technical', 'Behavioural', 'Safety'] },
      { name: 'trainer', label: 'Trainer', type: 'text', required: true },
      { name: 'mode', label: 'Mode', type: 'select', options: ['Classroom', 'Online', 'On-the-job'], default: 'Classroom' },
      { name: 'startDate', label: 'Start Date', type: 'date', required: true },
      { name: 'durationHours', label: 'Duration (hours)', type: 'number', min: 1, max: 200 },
      { name: 'seats', label: 'Seats', type: 'number', min: 1 },
      { name: 'nominated', label: 'Nominated', type: 'number', min: 0 },
      { name: 'status', label: 'Status', type: 'select', options: ['Scheduled', 'Completed', 'Cancelled', 'Nomination Open'], default: 'Scheduled' }
    ],
    detailGroups: function (r) {
      return [{
        title: 'Training Program', fields: [
          ['Program', r.name], ['Category', r.category], ['Trainer', r.trainer], ['Mode', r.mode],
          ['Start Date', U.fmtDate(r.startDate)], ['Duration', r.durationHours + ' hours'],
          ['Seats', r.seats], ['Nominated', r.nominated], ['Status', r.status]
        ]
      }];
    }
  });

  /* ---------- ASSETS ---------- */
  CONFIGS.push({
    route: 'assets', collection: 'assets', title: 'Asset Management', singular: 'Asset',
    icon: 'box', idPrefix: 'ast', subtitle: 'Allocation, uniform, ID cards, safety equipment and recovery',
    searchFields: ['id', 'name', 'serialNo', 'category'],
    columns: [
      { key: 'name', label: 'Asset', sortable: true },
      { key: 'category', label: 'Category' },
      { key: 'serialNo', label: 'Serial No.' },
      { key: 'employeeId', label: 'Allocated To', render: function (r) { return r.employeeId ? U.esc(L.employeeName(r.employeeId)) : '<span class="faint">Unassigned</span>'; } },
      { key: 'purchaseValue', label: 'Value', align: 'right', render: function (r) { return U.fmtCurrency(r.purchaseValue); } },
      { key: 'condition', label: 'Condition' },
      { key: 'status', label: 'Status', render: function (r) { return U.badge(r.status); } }
    ],
    filters: [
      { key: 'category', label: 'Category', options: ['Laptop', 'Desktop', 'Mobile Phone', 'ID Card', 'Uniform', 'Safety Helmet', 'Tool Kit', 'Vehicle'], accessor: function (r) { return r.category; } },
      { key: 'status', label: 'Status', options: ['Allocated', 'In Stock', 'Returned', 'Lost'], accessor: function (r) { return r.status; } }
    ],
    stats: function (rows) {
      return [
        { label: 'Total Assets', value: rows.length, icon: 'box' },
        { label: 'Allocated', value: rows.filter(function (r) { return r.status === 'Allocated'; }).length, icon: 'check' },
        { label: 'In Stock', value: rows.filter(function (r) { return r.status === 'In Stock'; }).length, icon: 'briefcase' },
        { label: 'Asset Value', value: U.fmtCurrency(rows.reduce(function (s, r) { return s + (r.purchaseValue || 0); }, 0)), icon: 'wallet' }
      ];
    },
    form: [
      { name: 'name', label: 'Asset Name', type: 'text', required: true },
      { name: 'category', label: 'Category', type: 'select', required: true, options: ['Laptop', 'Desktop', 'Mobile Phone', 'ID Card', 'Uniform', 'Safety Helmet', 'Tool Kit', 'Vehicle'] },
      { name: 'serialNo', label: 'Serial Number', type: 'text', required: true },
      { name: 'employeeId', label: 'Allocated To', type: 'select', options: empOptions, placeholder: 'Unassigned' },
      { name: 'purchaseValue', label: 'Purchase Value', type: 'number', min: 0 },
      { name: 'condition', label: 'Condition', type: 'select', options: ['Good', 'Fair', 'Needs Repair', 'Damaged'], default: 'Good' },
      { name: 'status', label: 'Status', type: 'select', options: ['Allocated', 'In Stock', 'Returned', 'Lost'], default: 'In Stock' }
    ],
    detailGroups: function (r) {
      return [{
        title: 'Asset', fields: [
          ['Name', r.name], ['Category', r.category], ['Serial No.', r.serialNo],
          ['Allocated To', r.employeeId ? L.employeeName(r.employeeId) : 'Unassigned'],
          ['Branch', L.branch(r.branchId)], ['Allocated On', U.fmtDate(r.allocatedOn)],
          ['Purchase Value', U.fmtCurrency(r.purchaseValue)], ['Condition', r.condition], ['Status', r.status]
        ]
      }];
    }
  });

  /* ---------- CONTRACTORS ---------- */
  CONFIGS.push({
    route: 'contractors', collection: 'contractors', title: 'Contractor Management', singular: 'Contractor',
    icon: 'briefcase', idPrefix: 'con', subtitle: 'Agreements, deployed workforce, labour compliance and billing',
    searchFields: ['id', 'name', 'contactPerson', 'type'],
    columns: [
      { key: 'name', label: 'Contractor', sortable: true },
      { key: 'type', label: 'Type' },
      { key: 'branchId', label: 'Branch', render: function (r) { return U.esc(L.branch(r.branchId)); } },
      { key: 'deployedWorkforce', label: 'Deployed', align: 'right' },
      { key: 'agreementEnd', label: 'Agreement Ends', render: function (r) { return U.fmtDate(r.agreementEnd); } },
      { key: 'complianceStatus', label: 'Compliance', render: function (r) { return U.badge(r.complianceStatus); } },
      { key: 'status', label: 'Status', render: function (r) { return U.badge(r.status); } }
    ],
    filters: [
      { key: 'type', label: 'Type', options: ['Manpower Supply', 'Housekeeping', 'Security', 'Canteen'], accessor: function (r) { return r.type; } },
      { key: 'status', label: 'Status', options: ['Active', 'Expired', 'Suspended'], accessor: function (r) { return r.status; } }
    ],
    stats: function (rows) {
      return [
        { label: 'Contractors', value: rows.length, icon: 'briefcase' },
        { label: 'Active', value: rows.filter(function (r) { return r.status === 'Active'; }).length, icon: 'check' },
        { label: 'Deployed Workforce', value: rows.reduce(function (s, r) { return s + (r.deployedWorkforce || 0); }, 0), icon: 'users' },
        { label: 'Compliance Issues', value: rows.filter(function (r) { return r.complianceStatus !== 'Compliant'; }).length, icon: 'shield' }
      ];
    },
    form: [
      { name: 'name', label: 'Contractor Name', type: 'text', required: true },
      { name: 'type', label: 'Contract Type', type: 'select', required: true, options: ['Manpower Supply', 'Housekeeping', 'Security', 'Canteen'] },
      { name: 'branchId', label: 'Branch', type: 'select', required: true, options: branchOptions },
      { name: 'contactPerson', label: 'Contact Person', type: 'text', required: true },
      { name: 'phone', label: 'Phone', type: 'tel', required: true },
      { name: 'deployedWorkforce', label: 'Deployed Workforce', type: 'number', min: 0 },
      { name: 'agreementStart', label: 'Agreement Start', type: 'date', required: true },
      { name: 'agreementEnd', label: 'Agreement End', type: 'date', required: true },
      { name: 'ratePerDay', label: 'Rate Per Day', type: 'number', min: 0 },
      { name: 'complianceStatus', label: 'Compliance', type: 'select', options: ['Compliant', 'Docs Pending', 'Non-compliant'], default: 'Docs Pending' },
      { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Expired', 'Suspended'], default: 'Active' }
    ],
    detailGroups: function (r) {
      return [{
        title: 'Contractor', fields: [
          ['Name', r.name], ['Type', r.type], ['Branch', L.branch(r.branchId)],
          ['Contact Person', r.contactPerson], ['Phone', r.phone],
          ['Deployed Workforce', r.deployedWorkforce],
          ['Agreement', U.fmtDate(r.agreementStart) + ' – ' + U.fmtDate(r.agreementEnd)],
          ['Rate Per Day', U.fmtCurrency(r.ratePerDay)],
          ['Compliance', r.complianceStatus], ['Status', r.status]
        ]
      }];
    }
  });

  /* ---------- LOANS ---------- */
  CONFIGS.push({
    route: 'loans', collection: 'loans', title: 'Loans & Advances', singular: 'Loan',
    icon: 'card', idPrefix: 'ln', subtitle: 'Loan applications, approvals, EMI schedules and recovery',
    approvals: true,
    searchFields: ['id', function (r) { return L.employeeName(r.employeeId); }, 'type'],
    columns: [
      { key: 'id', label: 'Loan #', sortable: true },
      { key: 'employeeId', label: 'Employee', render: function (r) { return personCell(r.employeeId); } },
      { key: 'type', label: 'Type' },
      { key: 'amount', label: 'Amount', align: 'right', render: function (r) { return U.fmtCurrency(r.amount); } },
      { key: 'tenureMonths', label: 'Tenure', align: 'right' },
      { key: 'emi', label: 'EMI', align: 'right', render: function (r) { return U.fmtCurrency(r.emi); } },
      { key: 'outstanding', label: 'Outstanding', align: 'right', render: function (r) { return U.fmtCurrency(r.outstanding); } },
      { key: 'status', label: 'Status', render: function (r) { return U.badge(r.status); } }
    ],
    filters: [{ key: 'status', label: 'Status', options: ['Active', 'Closed', 'Pending Approval', 'Rejected'], accessor: function (r) { return r.status; } }],
    stats: function (rows) {
      return [
        { label: 'Loans', value: rows.length, icon: 'card' },
        { label: 'Active', value: rows.filter(function (r) { return r.status === 'Active'; }).length, icon: 'check' },
        { label: 'Total Disbursed', value: U.fmtCurrency(rows.reduce(function (s, r) { return s + (r.amount || 0); }, 0)), icon: 'wallet' },
        { label: 'Outstanding', value: U.fmtCurrency(rows.reduce(function (s, r) { return s + (r.outstanding || 0); }, 0)), icon: 'chart' }
      ];
    },
    form: [
      { name: 'employeeId', label: 'Employee', type: 'select', required: true, options: empOptions },
      { name: 'type', label: 'Loan Type', type: 'select', required: true, options: ['Salary Advance', 'Personal Loan', 'Festival Advance', 'Emergency Loan'] },
      { name: 'amount', label: 'Amount', type: 'number', required: true, min: 1000, max: 500000 },
      { name: 'tenureMonths', label: 'Tenure (months)', type: 'number', required: true, min: 1, max: 60 },
      { name: 'emi', label: 'EMI Amount', type: 'number', min: 0 },
      { name: 'outstanding', label: 'Outstanding Balance', type: 'number', min: 0 },
      { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Closed', 'Pending Approval', 'Rejected'], default: 'Pending Approval' }
    ],
    detailGroups: function (r) {
      return [{
        title: 'Loan', fields: [
          ['Loan ID', r.id], ['Employee', L.employeeName(r.employeeId)], ['Type', r.type],
          ['Amount', U.fmtCurrency(r.amount)], ['Tenure', r.tenureMonths + ' months'],
          ['EMI', U.fmtCurrency(r.emi)], ['Disbursed On', U.fmtDate(r.disbursedOn)],
          ['Outstanding', U.fmtCurrency(r.outstanding)], ['Status', r.status]
        ]
      }];
    }
  });

  /* ---------- EXPENSES ---------- */
  CONFIGS.push({
    route: 'expenses', collection: 'expenses', title: 'Expenses & Reimbursements', singular: 'Expense Claim',
    icon: 'receipt', idPrefix: 'exp', subtitle: 'Travel, food, accommodation, conveyance, fuel and medical claims',
    approvals: true,
    searchFields: ['id', function (r) { return L.employeeName(r.employeeId); }, 'category', 'description'],
    columns: [
      { key: 'id', label: 'Claim #', sortable: true },
      { key: 'employeeId', label: 'Employee', render: function (r) { return personCell(r.employeeId); } },
      { key: 'category', label: 'Category' },
      { key: 'claimDate', label: 'Claim Date', render: function (r) { return U.fmtDate(r.claimDate); } },
      { key: 'amount', label: 'Amount', align: 'right', render: function (r) { return U.fmtCurrency(r.amount); } },
      { key: 'receiptAttached', label: 'Receipt' },
      { key: 'status', label: 'Status', render: function (r) { return U.badge(r.status); } }
    ],
    filters: [
      { key: 'category', label: 'Category', options: ['Travel', 'Food Allowance', 'Accommodation', 'Conveyance', 'Fuel', 'Medical'], accessor: function (r) { return r.category; } },
      { key: 'status', label: 'Status', options: ['Pending', 'Approved', 'Reimbursed', 'Rejected'], accessor: function (r) { return r.status; } }
    ],
    stats: function (rows) {
      return [
        { label: 'Claims', value: rows.length, icon: 'receipt' },
        { label: 'Pending', value: rows.filter(function (r) { return r.status === 'Pending'; }).length, icon: 'clock' },
        { label: 'Reimbursed', value: U.fmtCurrency(rows.filter(function (r) { return r.status === 'Reimbursed'; }).reduce(function (s, r) { return s + r.amount; }, 0)), icon: 'check' },
        { label: 'Total Claimed', value: U.fmtCurrency(rows.reduce(function (s, r) { return s + (r.amount || 0); }, 0)), icon: 'wallet' }
      ];
    },
    form: [
      { name: 'employeeId', label: 'Employee', type: 'select', required: true, options: empOptions },
      { name: 'category', label: 'Category', type: 'select', required: true, options: ['Travel', 'Food Allowance', 'Accommodation', 'Conveyance', 'Fuel', 'Medical'] },
      { name: 'claimDate', label: 'Claim Date', type: 'date', required: true },
      { name: 'amount', label: 'Amount', type: 'number', required: true, min: 1, max: 500000 },
      { name: 'description', label: 'Description', type: 'textarea', required: true, full: true, minLength: 4 },
      { name: 'receiptAttached', label: 'Receipt Attached', type: 'select', options: ['Yes', 'No'], default: 'No' },
      { name: 'status', label: 'Status', type: 'select', options: ['Pending', 'Approved', 'Reimbursed', 'Rejected'], default: 'Pending' }
    ],
    detailGroups: function (r) {
      return [{
        title: 'Expense Claim', fields: [
          ['Claim ID', r.id], ['Employee', L.employeeName(r.employeeId)], ['Category', r.category],
          ['Claim Date', U.fmtDate(r.claimDate)], ['Amount', U.fmtCurrency(r.amount)],
          ['Description', r.description], ['Receipt', r.receiptAttached], ['Status', r.status]
        ]
      }];
    }
  });

  /* ---------- HELPDESK ---------- */
  CONFIGS.push({
    route: 'helpdesk', collection: 'tickets', title: 'HR Helpdesk', singular: 'Ticket',
    icon: 'lifebuoy', idPrefix: 'tkt', subtitle: 'HR queries, grievances, document requests, SLA and escalations',
    approvals: true,
    searchFields: ['id', 'subject', 'category', function (r) { return L.employeeName(r.employeeId); }],
    columns: [
      { key: 'id', label: 'Ticket', sortable: true },
      { key: 'employeeId', label: 'Raised By', render: function (r) { return personCell(r.employeeId); } },
      { key: 'category', label: 'Category' },
      { key: 'subject', label: 'Subject' },
      { key: 'priority', label: 'Priority', render: function (r) { return U.badge(r.priority === 'Critical' ? 'Rejected' : r.priority); } },
      { key: 'raisedOn', label: 'Raised', render: function (r) { return U.fmtDate(r.raisedOn); } },
      { key: 'status', label: 'Status', render: function (r) { return U.badge(r.status); } }
    ],
    filters: [
      { key: 'category', label: 'Category', options: ['Payroll Query', 'Document Request', 'IT Access', 'Grievance', 'Policy Clarification'], accessor: function (r) { return r.category; } },
      { key: 'status', label: 'Status', options: ['Open', 'In Progress', 'Resolved', 'Escalated'], accessor: function (r) { return r.status; } },
      { key: 'priority', label: 'Priority', options: ['Low', 'Medium', 'High', 'Critical'], accessor: function (r) { return r.priority; } }
    ],
    stats: function (rows) {
      return [
        { label: 'Tickets', value: rows.length, icon: 'lifebuoy' },
        { label: 'Open', value: rows.filter(function (r) { return r.status === 'Open'; }).length, icon: 'clock' },
        { label: 'Resolved', value: rows.filter(function (r) { return r.status === 'Resolved'; }).length, icon: 'check' },
        { label: 'Escalated', value: rows.filter(function (r) { return r.status === 'Escalated'; }).length, icon: 'x' }
      ];
    },
    form: [
      { name: 'employeeId', label: 'Raised By', type: 'select', required: true, options: empOptions },
      { name: 'category', label: 'Category', type: 'select', required: true, options: ['Payroll Query', 'Document Request', 'IT Access', 'Grievance', 'Policy Clarification'] },
      { name: 'subject', label: 'Subject', type: 'text', required: true, full: true },
      { name: 'description', label: 'Description', type: 'textarea', required: true, full: true, minLength: 8 },
      { name: 'priority', label: 'Priority', type: 'select', options: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
      { name: 'slaHours', label: 'SLA (hours)', type: 'number', min: 1, max: 240 },
      { name: 'status', label: 'Status', type: 'select', options: ['Open', 'In Progress', 'Resolved', 'Escalated'], default: 'Open' }
    ],
    detailGroups: function (r) {
      return [{
        title: 'Ticket', fields: [
          ['Ticket ID', r.id], ['Raised By', L.employeeName(r.employeeId)], ['Category', r.category],
          ['Subject', r.subject], ['Description', r.description], ['Priority', r.priority],
          ['Raised On', U.fmtDate(r.raisedOn)], ['SLA', r.slaHours + ' hours'], ['Status', r.status]
        ]
      }];
    }
  });

  /* ---------- DOCUMENTS ---------- */
  CONFIGS.push({
    route: 'documents', collection: 'documents', title: 'Document Management', singular: 'Document',
    icon: 'file', idPrefix: 'doc', subtitle: 'Employee documents, verification, expiry tracking and templates',
    searchFields: ['id', 'name', 'fileName', 'category'],
    columns: [
      { key: 'name', label: 'Document', sortable: true },
      { key: 'category', label: 'Category' },
      { key: 'employeeId', label: 'Employee', render: function (r) { return r.employeeId ? U.esc(L.employeeName(r.employeeId)) : '<span class="faint">Company document</span>'; } },
      { key: 'fileName', label: 'File' },
      { key: 'uploadedOn', label: 'Uploaded', render: function (r) { return U.fmtDate(r.uploadedOn); } },
      { key: 'expiryDate', label: 'Expires', render: function (r) { return r.expiryDate ? U.fmtDate(r.expiryDate) : '—'; } },
      { key: 'verificationStatus', label: 'Verification', render: function (r) { return U.badge(r.verificationStatus); } }
    ],
    filters: [
      { key: 'category', label: 'Category', options: ['Statutory', 'Employment', 'Education', 'Company'], accessor: function (r) { return r.category; } },
      { key: 'verificationStatus', label: 'Verification', options: ['Verified', 'Pending', 'Rejected'], accessor: function (r) { return r.verificationStatus; } }
    ],
    stats: function (rows) {
      return [
        { label: 'Documents', value: rows.length, icon: 'file' },
        { label: 'Verified', value: rows.filter(function (r) { return r.verificationStatus === 'Verified'; }).length, icon: 'check' },
        { label: 'Pending', value: rows.filter(function (r) { return r.verificationStatus === 'Pending'; }).length, icon: 'clock' },
        { label: 'Expiring Soon', value: rows.filter(function (r) {
          if (!r.expiryDate) return false;
          var d = (new Date(r.expiryDate) - Date.now()) / 86400000;
          return d > -30 && d < 60;
        }).length, icon: 'shield' }
      ];
    },
    form: [
      { name: 'name', label: 'Document Name', type: 'text', required: true },
      { name: 'category', label: 'Category', type: 'select', required: true, options: ['Statutory', 'Employment', 'Education', 'Company'] },
      { name: 'employeeId', label: 'Employee', type: 'select', options: empOptions, placeholder: 'Company document' },
      { name: 'fileName', label: 'File Name', type: 'text', required: true, placeholder: 'document.pdf' },
      { name: 'expiryDate', label: 'Expiry Date', type: 'date' },
      { name: 'verificationStatus', label: 'Verification', type: 'select', options: ['Verified', 'Pending', 'Rejected'], default: 'Pending' }
    ],
    detailGroups: function (r) {
      return [{
        title: 'Document', fields: [
          ['Name', r.name], ['Category', r.category],
          ['Employee', r.employeeId ? L.employeeName(r.employeeId) : 'Company document'],
          ['File', r.fileName], ['Size', r.fileSize], ['Uploaded On', U.fmtDate(r.uploadedOn)],
          ['Expiry', r.expiryDate ? U.fmtDate(r.expiryDate) : '—'],
          ['Verification', r.verificationStatus], ['Uploaded By', r.uploadedBy]
        ]
      }];
    }
  });

  /* ---------- SEPARATION ---------- */
  CONFIGS.push({
    route: 'separation', collection: 'resignations', title: 'Separation & Exit', singular: 'Exit Record',
    icon: 'logout', idPrefix: 'sep', subtitle: 'Resignation, notice period, clearances, F&F and relieving letters',
    approvals: true,
    searchFields: ['id', function (r) { return L.employeeName(r.employeeId); }, 'reason'],
    columns: [
      { key: 'id', label: 'Exit #', sortable: true },
      { key: 'employeeId', label: 'Employee', render: function (r) { return personCell(r.employeeId); } },
      { key: 'resignationDate', label: 'Resigned', render: function (r) { return U.fmtDate(r.resignationDate); } },
      { key: 'lastWorkingDate', label: 'Last Working Day', render: function (r) { return U.fmtDate(r.lastWorkingDate); } },
      { key: 'noticePeriodDays', label: 'Notice', align: 'right' },
      { key: 'clearanceHR', label: 'HR Clearance', render: function (r) { return U.badge(r.clearanceHR); } },
      { key: 'status', label: 'Status', render: function (r) { return U.badge(r.status); } }
    ],
    filters: [
      { key: 'status', label: 'Status', options: ['Pending Approval', 'Approved', 'In Notice', 'Exited'], accessor: function (r) { return r.status; } },
      { key: 'fnfStatus', label: 'F&F Status', options: ['Pending', 'Processed'], accessor: function (r) { return r.fnfStatus; } }
    ],
    stats: function (rows) {
      return [
        { label: 'Exit Records', value: rows.length, icon: 'logout' },
        { label: 'In Notice', value: rows.filter(function (r) { return r.status === 'In Notice'; }).length, icon: 'clock' },
        { label: 'Exited', value: rows.filter(function (r) { return r.status === 'Exited'; }).length, icon: 'check' },
        { label: 'F&F Pending', value: rows.filter(function (r) { return r.fnfStatus === 'Pending'; }).length, icon: 'wallet' }
      ];
    },
    form: [
      { name: 'employeeId', label: 'Employee', type: 'select', required: true, options: empOptions },
      { name: 'resignationDate', label: 'Resignation Date', type: 'date', required: true },
      { name: 'lastWorkingDate', label: 'Last Working Date', type: 'date', required: true },
      { name: 'noticePeriodDays', label: 'Notice Period (days)', type: 'number', min: 0, max: 180 },
      { name: 'reason', label: 'Reason', type: 'textarea', full: true, required: true, minLength: 4 },
      { name: 'exitInterview', label: 'Exit Interview', type: 'select', options: ['Completed', 'Pending', 'Scheduled'], default: 'Pending' },
      { name: 'clearanceHR', label: 'HR Clearance', type: 'select', options: ['Cleared', 'Pending'], default: 'Pending' },
      { name: 'clearanceIT', label: 'IT Clearance', type: 'select', options: ['Cleared', 'Pending'], default: 'Pending' },
      { name: 'clearanceFinance', label: 'Finance Clearance', type: 'select', options: ['Cleared', 'Pending'], default: 'Pending' },
      { name: 'assetHandover', label: 'Asset Handover', type: 'select', options: ['Done', 'Pending'], default: 'Pending' },
      { name: 'fnfStatus', label: 'Full & Final', type: 'select', options: ['Pending', 'Processed'], default: 'Pending' },
      { name: 'status', label: 'Status', type: 'select', options: ['Pending Approval', 'Approved', 'In Notice', 'Exited', 'Rejected'], default: 'Pending Approval' }
    ],
    detailGroups: function (r) {
      return [{
        title: 'Exit Record', fields: [
          ['Exit ID', r.id], ['Employee', L.employeeName(r.employeeId)],
          ['Resignation Date', U.fmtDate(r.resignationDate)], ['Last Working Date', U.fmtDate(r.lastWorkingDate)],
          ['Notice Period', r.noticePeriodDays + ' days'], ['Reason', r.reason]
        ]
      }, {
        title: 'Clearances', fields: [
          ['Exit Interview', r.exitInterview], ['HR Clearance', r.clearanceHR],
          ['IT Clearance', r.clearanceIT], ['Finance Clearance', r.clearanceFinance],
          ['Asset Handover', r.assetHandover], ['Full & Final', r.fnfStatus], ['Status', r.status]
        ]
      }];
    }
  });

  /* ---------- ADMINISTRATION ---------- */
  CONFIGS.push({
    route: 'administration', collection: 'users', title: 'Administration', singular: 'User',
    icon: 'plug', idPrefix: 'usr', subtitle: 'Users, roles, permissions, audit logs and integration settings',
    searchFields: ['name', 'email', 'role'],
    columns: [
      { key: 'name', label: 'User', sortable: true, render: function (r) { return personCell(r.employeeId).replace(r.employeeId, r.email); } },
      { key: 'role', label: 'Role', render: function (r) { return '<span class="badge badge--primary">' + U.esc(r.role) + '</span>'; } },
      { key: 'branchId', label: 'Branch', render: function (r) { return U.esc(L.branch(r.branchId)); } },
      { key: 'lastLogin', label: 'Last Login', render: function (r) { return U.fmtDate(r.lastLogin); } },
      { key: 'status', label: 'Status', render: function (r) { return U.badge(r.status); } }
    ],
    filters: [{ key: 'role', label: 'Role', options: ['HR Admin', 'Manager', 'Employee', 'Payroll Admin'], accessor: function (r) { return r.role; } }],
    stats: function (rows) {
      return [
        { label: 'Users', value: rows.length, icon: 'users' },
        { label: 'Active', value: rows.filter(function (r) { return r.status === 'Active'; }).length, icon: 'check' },
        { label: 'Roles', value: 4, icon: 'shield' },
        { label: 'Audit Events (demo)', value: rows.length * 12, icon: 'file' }
      ];
    },
    form: [
      { name: 'name', label: 'Full Name', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'role', label: 'Role', type: 'select', required: true, options: ['HR Admin', 'Manager', 'Employee', 'Payroll Admin'] },
      { name: 'employeeId', label: 'Linked Employee', type: 'select', options: empOptions },
      { name: 'branchId', label: 'Branch', type: 'select', options: branchOptions },
      { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'], default: 'Active' }
    ],
    detailGroups: function (r) {
      return [{
        title: 'User Account', fields: [
          ['Name', r.name], ['Email', r.email], ['Role', r.role],
          ['Employee ID', r.employeeId], ['Branch', L.branch(r.branchId)],
          ['Last Login', U.fmtDate(r.lastLogin)], ['Status', r.status]
        ]
      }];
    }
  });

  /* ---- seed derived collections that don't exist in MockData ---- */
  function seedDerived() {
    if (!S.all('complianceRecords').length) {
      var base = [
        ['Employees Provident Fund (EPF)', 'Provident Fund', '12% of basic (employee + employer)', 482000, 'Filed'],
        ['Employees State Insurance (ESIC)', 'Insurance', '0.75% employee / 3.25% employer', 128000, 'Filed'],
        ['Professional Tax', 'State Tax', 'Slab-based, state specific', 32000, 'Pending'],
        ['Tax Deducted at Source (TDS)', 'Income Tax', 'As per applicable slab', 764000, 'Pending'],
        ['Labour Welfare Fund', 'Welfare', 'Fixed contribution per employee', 12400, 'Paid'],
        ['Minimum Wages Compliance', 'Labour', 'State scheduled employment rates', 0, 'Filed'],
        ['Statutory Bonus', 'Welfare', '8.33%–20% of eligible wages', 96000, 'Pending'],
        ['Gratuity Provision', 'Welfare', '15/26 of last drawn basic', 340000, 'Paid']
      ];
      base.forEach(function (b, i) {
        S.insert('complianceRecords', {
          id: 'CMP-' + String(1001 + i),
          name: b[0], category: b[1], rate: b[2], period: 'Current month',
          dueDate: new Date(Date.now() + (i + 1) * 7 * 86400000).toISOString().slice(0, 10),
          amount: b[3], status: b[4], createdOn: new Date().toISOString().slice(0, 10)
        });
      });
    }
  }

  HRMS.Modules.Entity.registerAll = function () {
    seedDerived();
    CONFIGS.forEach(function (cfg) { HRMS.Modules.Entity.register(cfg); });
  };

  HRMS.EntityConfigs = CONFIGS;
})(window.HRMS);