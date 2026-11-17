window.HRMS = window.HRMS || {};
(function (HRMS) {
  'use strict';
  var U = HRMS.Util, UI = HRMS.UI, S = HRMS.State, C = HRMS.Charts;

  function scoped(collection) {
    var rows = S.all(collection);
    if (S.session.branchId !== 'ALL') rows = rows.filter(function (r) { return r.branchId === S.session.branchId; });
    if (S.session.orgId !== 'ALL' && collection === 'employees') rows = rows.filter(function (r) { return r.orgId === S.session.orgId; });
    return rows;
  }

  function kpi(label, value, icon, delta, tone) {
    return '<div class="kpi"><div class="kpi__top"><span class="kpi__label">' + U.esc(label) + '</span>' +
      '<span class="kpi__icon">' + UI.icon(icon, 15) + '</span></div>' +
      '<div class="kpi__value">' + value + '</div>' +
      (delta ? '<div class="kpi__delta ' + (tone || 'up') + '">' + delta + '</div>' : '') + '</div>';
  }

  function renderAdmin() {
    var emps = scoped('employees');
    var active = emps.filter(function (e) { return e.status === 'Active'; });
    var probation = emps.filter(function (e) { return e.status === 'Probation'; });
    var notice = emps.filter(function (e) { return e.status === 'Notice Period'; });
    var separated = emps.filter(function (e) { return e.status === 'Separated'; });
    var today = new Date().toISOString().slice(0, 10);
    var todayAtt = scoped('attendance').filter(function (a) { return a.date === today; });
    var onLeave = todayAtt.filter(function (a) { return a.status === 'On Leave'; }).length;
    var absent = todayAtt.filter(function (a) { return a.status === 'Absent'; }).length;
    var present = todayAtt.filter(function (a) { return a.status === 'Present' || a.status === 'Late'; }).length;

    var newJoiners = emps.filter(function (e) {
      return (Date.now() - new Date(e.doj).getTime()) < 90 * 86400000;
    }).length;

    var deptCounts = U.groupBy(active, function (e) { return e.departmentId; });
    var deptData = Object.keys(deptCounts).map(function (k) {
      return { label: HRMS.Lookup.department(k).replace(' & ', ' & '), value: deptCounts[k].length };
    }).sort(function (a, b) { return b.value - a.value; }).slice(0, 7);

    var branchCounts = U.groupBy(active, function (e) { return e.branchId; });
    var branchData = Object.keys(branchCounts).map(function (k) {
      return { label: HRMS.Lookup.branch(k), value: branchCounts[k].length };
    }).sort(function (a, b) { return b.value - a.value; });

    var genderData = [
      { label: 'Male', value: active.filter(function (e) { return e.gender === 'Male'; }).length },
      { label: 'Female', value: active.filter(function (e) { return e.gender === 'Female'; }).length }
    ];

    var typeData = U.groupBy(active, function (e) { return e.employmentType; });
    var typeChart = Object.keys(typeData).map(function (k) { return { label: k, value: typeData[k].length }; });

    var last7 = [];
    for (var d = 6; d >= 0; d--) {
      var dt = new Date(); dt.setDate(dt.getDate() - d);
      var iso = dt.toISOString().slice(0, 10);
      var rows = scoped('attendance').filter(function (a) { return a.date === iso; });
      var p = rows.filter(function (a) { return a.status === 'Present' || a.status === 'Late'; }).length;
      last7.push({ label: dt.toLocaleDateString('en-GB', { weekday: 'short' }), value: p });
    }

    var payroll = S.all('payrollRuns')[0] || { grossTotal: 0, netTotal: 0, overtimeTotal: 0 };
    var pendingLeave = scoped('leaveRequests').filter(function (r) { return r.status === 'Pending'; }).length;
    var pendingExp = scoped('expenses').filter(function (r) { return r.status === 'Pending'; }).length;
    var pipeline = U.groupBy(S.all('candidates'), function (c) { return c.stage; });
    var pipelineData = ['Applied', 'Screening', 'Interview', 'Selected', 'Offer', 'Hired'].map(function (s) {
      return { label: s, value: (pipeline[s] || []).length };
    });

    var birthdays = emps.filter(function (e) {
      var m = e.dob.slice(5, 7);
      return m === new Date().toISOString().slice(5, 7);
    }).slice(0, 4);
    var anniversaries = emps.filter(function (e) {
      return e.doj.slice(5, 7) === new Date().toISOString().slice(5, 7);
    }).slice(0, 4);
    var expiringContracts = S.all('contractors').filter(function (c) {
      var days = (new Date(c.agreementEnd) - Date.now()) / 86400000;
      return days > -30 && days < 45;
    }).slice(0, 4);

    var html = '';
    html += '<div class="page-head"><div class="page-head__text"><h1>Executive HR Dashboard</h1>' +
      '<p>Live snapshot across ' + U.esc(HRMS.Lookup.branch(S.session.branchId)) + ' · ' + U.esc(S.session.role) + ' view</p></div>' +
      '<div class="page-head__actions">' +
      '<button class="btn" id="dash-export">' + UI.icon('download', 15) + 'Export summary</button>' +
      '<a class="btn btn--primary" href="#/employees">' + UI.icon('users', 15) + 'Employee Directory</a></div></div>';

    html += '<div class="grid grid--4">' +
      kpi('Total Employees', emps.length, 'users', '+ ' + newJoiners + ' in last 90 days') +
      kpi('Active Employees', active.length, 'check', 'On roll') +
      kpi('On Probation', probation.length, 'clock', 'Confirmation due') +
      kpi('Notice Period', notice.length, 'logout', 'Exits in progress') +
      '</div>';

    html += '<div class="grid grid--4 mt-4">' +
      kpi('Present Today', present, 'check', today) +
      kpi('On Leave Today', onLeave, 'calendar', 'Approved absences') +
      kpi('Absent Today', absent, 'x', 'Needs follow-up', 'down') +
      kpi('Separated (YTD)', separated.length, 'logout', 'Attrition tracked', 'down') +
      '</div>';

    html += '<div class="grid grid--3 mt-6">';

    html += '<div class="card"><div class="card__head"><h3>Department-wise Headcount</h3></div>' +
      '<div class="card__body">' + C.hbars(deptData) + '</div></div>';

    html += '<div class="card"><div class="card__head"><h3>Gender Distribution</h3></div>' +
      '<div class="card__body" style="display:flex;gap:18px;align-items:center;flex-wrap:wrap">' +
      C.donut(genderData, 140) + '<div style="flex:1;min-width:120px">' + C.legend(genderData) + '</div></div></div>';

    html += '<div class="card"><div class="card__head"><h3>Employment Type</h3></div>' +
      '<div class="card__body">' + C.donut(typeChart, 140) +
      '<div style="margin-top:12px">' + C.legend(typeChart) + '</div></div></div>';

    html += '</div>';

    html += '<div class="grid grid--2 mt-6">' +
      '<div class="card"><div class="card__head"><h3>Attendance Trend (7 days)</h3><p>Employees marked present or late</p></div>' +
      '<div class="card__body">' + C.line(last7) + '</div></div>' +
      '<div class="card"><div class="card__head"><h3>Branch-wise Headcount</h3></div>' +
      '<div class="card__body">' + C.bars(branchData) + '</div></div>' +
      '</div>';

    html += '<div class="grid grid--3 mt-6">' +
      '<div class="card"><div class="card__head"><h3>Payroll Snapshot</h3></div><div class="card__body">' +
      '<dl class="dl"><dt>Latest cycle</dt><dd>' + U.esc(payroll.month || '—') + '</dd>' +
      '<dt>Gross</dt><dd>' + U.fmtCurrency(payroll.grossTotal) + '</dd>' +
      '<dt>Deductions</dt><dd>' + U.fmtCurrency(payroll.deductionTotal) + '</dd>' +
      '<dt>Net payable</dt><dd><strong>' + U.fmtCurrency(payroll.netTotal) + '</strong></dd>' +
      '<dt>Overtime</dt><dd>' + U.fmtCurrency(payroll.overtimeTotal) + '</dd>' +
      '<dt>Status</dt><dd>' + U.badge(payroll.status || 'Draft') + '</dd></dl>' +
      '<p class="tiny faint mt-4">Demonstration figures — not legally validated payroll output.</p>' +
      '</div></div>' +

      '<div class="card"><div class="card__head"><h3>Pending Approvals</h3></div><div class="card__body">' +
      '<div class="list-row"><span class="grow">Leave requests</span><span class="badge badge--warning">' + pendingLeave + '</span></div>' +
      '<div class="list-row"><span class="grow">Expense claims</span><span class="badge badge--warning">' + pendingExp + '</span></div>' +
      '<div class="list-row"><span class="grow">Requisitions awaiting approval</span><span class="badge badge--warning">' +
      S.all('requisitions').filter(function (r) { return r.status === 'Pending Approval'; }).length + '</span></div>' +
      '<div class="list-row"><span class="grow">Resignations pending</span><span class="badge badge--warning">' +
      S.all('resignations').filter(function (r) { return r.status === 'Pending Approval'; }).length + '</span></div>' +
      '<a class="btn btn--primary btn--sm mt-4" href="#/leave">Review leave queue</a>' +
      '</div></div>' +

      '<div class="card"><div class="card__head"><h3>Recruitment Pipeline</h3></div><div class="card__body">' +
      C.bars(pipelineData) + '</div></div>' +
      '</div>';

    html += '<div class="grid grid--3 mt-6">' +
      '<div class="card"><div class="card__head"><h3>Upcoming Birthdays</h3></div><div class="card__body">' +
      (birthdays.length ? birthdays.map(function (e) {
        return '<div class="list-row">' + U.avatar(e.name, 'sm') + '<span class="grow"><strong>' + U.esc(e.name) + '</strong><br>' +
          '<span class="tiny faint">' + U.fmtDate(e.dob) + '</span></span></div>';
      }).join('') : '<p class="tiny muted">No birthdays this month.</p>') + '</div></div>' +

      '<div class="card"><div class="card__head"><h3>Work Anniversaries</h3></div><div class="card__body">' +
      (anniversaries.length ? anniversaries.map(function (e) {
        var yrs = new Date().getFullYear() - new Date(e.doj).getFullYear();
        return '<div class="list-row">' + U.avatar(e.name, 'sm') + '<span class="grow"><strong>' + U.esc(e.name) + '</strong><br>' +
          '<span class="tiny faint">' + yrs + ' year(s) · joined ' + U.fmtDate(e.doj) + '</span></span></div>';
      }).join('') : '<p class="tiny muted">No anniversaries this month.</p>') + '</div></div>' +

      '<div class="card"><div class="card__head"><h3>Contract Expiry Alerts</h3></div><div class="card__body">' +
      (expiringContracts.length ? expiringContracts.map(function (c) {
        return '<div class="list-row"><span class="grow"><strong>' + U.esc(c.name) + '</strong><br>' +
          '<span class="tiny faint">Ends ' + U.fmtDate(c.agreementEnd) + '</span></span>' + U.badge(c.status) + '</div>';
      }).join('') : '<p class="tiny muted">No contracts expiring in the next 45 days.</p>') + '</div></div>' +
      '</div>';

    return html;
  }

  function renderSelfService() {
    var user = S.currentUser();
    var me = S.find('employees', user.employeeId) || S.all('employees')[0];
    var myAtt = S.all('attendance').filter(function (a) { return a.employeeId === me.id; }).slice(0, 6);
    var myLeave = S.all('leaveRequests').filter(function (l) { return l.employeeId === me.id; });
    var myTickets = S.all('tickets').filter(function (t) { return t.employeeId === me.id; });
    var ann = S.all('announcements');

    var html = '<div class="page-head"><div class="page-head__text"><h1>Welcome, ' + U.esc(me.firstName) + '</h1>' +
      '<p>' + U.esc(me.empCode) + ' · ' + U.esc(HRMS.Lookup.designation(me.designationId)) + ' · ' +
      U.esc(HRMS.Lookup.department(me.departmentId)) + '</p></div>' +
      '<div class="page-head__actions"><a class="btn btn--primary" href="#/leave">Apply for Leave</a>' +
      '<a class="btn" href="#/helpdesk">Raise HR Ticket</a></div></div>';

    html += '<div class="grid grid--4">' +
      kpi('Leave Balance (EL)', '12', 'calendar', 'Days available') +
      kpi('Present Days (MTD)', myAtt.filter(function (a) { return a.status === 'Present'; }).length, 'check', 'This month') +
      kpi('Open Tickets', myTickets.filter(function (t) { return t.status !== 'Resolved'; }).length, 'lifebuoy', 'HR Helpdesk') +
      kpi('My CTC (Annual)', U.fmtCurrency(me.salary.gross * 12), 'wallet', 'Gross monthly ' + U.fmtCurrency(me.salary.gross)) +
      '</div>';

    html += '<div class="grid grid--2 mt-6">' +
      '<div class="card"><div class="card__head"><h3>My Recent Attendance</h3><a class="btn btn--sm" href="#/attendance">View all</a></div>' +
      '<div class="card__body">' + (myAtt.length ? myAtt.map(function (a) {
        return '<div class="list-row"><span class="grow"><strong>' + U.fmtDate(a.date) + '</strong><br>' +
          '<span class="tiny faint">In ' + (a.inTime || '—') + ' · Out ' + (a.outTime || '—') + '</span></span>' + U.badge(a.status) + '</div>';
      }).join('') : '<p class="tiny muted">No attendance records.</p>') + '</div></div>' +

      '<div class="card"><div class="card__head"><h3>My Leave Requests</h3><a class="btn btn--sm" href="#/leave">Apply</a></div>' +
      '<div class="card__body">' + (myLeave.length ? myLeave.map(function (l) {
        return '<div class="list-row"><span class="grow"><strong>' + U.esc(HRMS.Lookup.leaveType(l.leaveTypeId)) + '</strong><br>' +
          '<span class="tiny faint">' + U.fmtDate(l.fromDate) + ' · ' + l.days + ' day(s)</span></span>' + U.badge(l.status) + '</div>';
      }).join('') : '<p class="tiny muted">No leave requests yet.</p>') + '</div></div>' +
      '</div>';

    html += '<div class="card mt-6"><div class="card__head"><h3>Company Announcements</h3></div><div class="card__body">' +
      ann.map(function (a) {
        return '<div class="list-row"><span class="grow"><strong>' + U.esc(a.title) + '</strong><br>' +
          '<span class="tiny faint">' + U.esc(a.body) + '</span></span>' +
          '<span class="tiny faint">' + U.timeAgo(a.date) + '</span></div>';
      }).join('') + '</div></div>';

    return html;
  }

  function handler() {
    var view = document.getElementById('view');
    view.innerHTML = UI.icon && (S.session.role === 'Employee') ? renderSelfService() : renderAdmin();
    var btn = document.getElementById('dash-export');
    if (btn) {
      btn.addEventListener('click', function () {
        var emps = S.all('employees');
        var cols = [
          { label: 'Employee Code', key: 'empCode' },
          { label: 'Name', key: 'name' },
          { label: 'Department', value: function (r) { return HRMS.Lookup.department(r.departmentId); } },
          { label: 'Branch', value: function (r) { return HRMS.Lookup.branch(r.branchId); } },
          { label: 'Status', key: 'status' }
        ];
        U.download('hrms-summary-' + new Date().toISOString().slice(0, 10) + '.csv', U.toCSV(emps, cols));
        HRMS.Toast.success('Summary exported to CSV');
      });
    }
  }

  HRMS.Modules = HRMS.Modules || {};
  HRMS.Modules.Dashboard = {
    register: function () {
      HRMS.Router.register('/dashboard', handler);
      HRMS.Router.register('/', handler);
      HRMS.Router.register('/me', handler);
    }
  };
})(window.HRMS);