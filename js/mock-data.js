window.HRMS = window.HRMS || {};
(function (HRMS) {
  'use strict';

  /* deterministic pseudo-random so demo data is stable per seed */
  var seed = 20240517;
  function rnd() { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; }
  function pick(a) { return a[Math.floor(rnd() * a.length)]; }
  function int(min, max) { return min + Math.floor(rnd() * (max - min + 1)); }
  function pad(n, l) { n = String(n); while (n.length < (l || 2)) n = '0' + n; return n; }
  function iso(d) { return d.toISOString().slice(0, 10); }
  function daysFromNow(n) { var d = new Date(); d.setDate(d.getDate() + n); return iso(d); }

  var FIRST = ['Aarav','Vivaan','Aditya','Diya','Ananya','Ishaan','Kabir','Meera','Rohan','Sanya','Arjun','Neha','Karthik','Priya','Rahul','Sneha','Vikram','Pooja','Nikhil','Riya','Sameer','Tara','Manish','Kavya','Deepak','Anjali','Farhan','Zoya','Imran','Lakshmi','Joseph','Grace','Daniel','Ayesha','Vivek','Shruti'];
  var LAST = ['Sharma','Verma','Patel','Reddy','Iyer','Nair','Gupta','Mehta','Khan','Singh','Kulkarni','Das','Bose','Chopra','Menon','Rao','Joshi','Kapoor','Malhotra','Sinha','Fernandes','Pillai'];

  /* ---------------- Master data ---------------- */
  var organizations = [
    { id: 'ORG-01', name: 'Nexus Industries Ltd.', industry: 'Manufacturing', code: 'NIL', currency: 'INR', fyStart: '04-01', email: 'hr@nexus.example', phone: '+91 22 4000 1000', website: 'www.nexus.example', address: 'Andheri East, Mumbai, MH 400069', status: 'Active' },
    { id: 'ORG-02', name: 'Nexus Hospitality Pvt. Ltd.', industry: 'Hospitality', code: 'NHL', currency: 'INR', fyStart: '04-01', email: 'people@nexushospitality.example', phone: '+91 484 200 2000', website: 'www.nexushospitality.example', address: 'Marine Drive, Kochi, KL 682031', status: 'Active' }
  ];

  var branches = [
    { id: 'BR-01', orgId: 'ORG-01', name: 'Mumbai Corporate HQ', code: 'MUM-HQ', city: 'Mumbai', state: 'Maharashtra', country: 'India', address: 'Andheri East, Mumbai', phone: '+91 22 4000 1001', headcount: 0, status: 'Active' },
    { id: 'BR-02', orgId: 'ORG-01', name: 'Pune Manufacturing Plant', code: 'PUN-PLT', city: 'Pune', state: 'Maharashtra', country: 'India', address: 'Chakan MIDC, Pune', phone: '+91 20 6000 2001', headcount: 0, status: 'Active' },
    { id: 'BR-03', orgId: 'ORG-01', name: 'Bengaluru Tech Centre', code: 'BLR-TEC', city: 'Bengaluru', state: 'Karnataka', country: 'India', address: 'Whitefield, Bengaluru', phone: '+91 80 7000 3001', headcount: 0, status: 'Active' },
    { id: 'BR-04', orgId: 'ORG-02', name: 'Kochi Resort & Spa', code: 'KOC-RST', city: 'Kochi', state: 'Kerala', country: 'India', address: 'Marine Drive, Kochi', phone: '+91 484 200 2001', headcount: 0, status: 'Active' },
    { id: 'BR-05', orgId: 'ORG-01', name: 'Delhi Retail Hub', code: 'DEL-RTL', city: 'New Delhi', state: 'Delhi', country: 'India', address: 'Connaught Place, New Delhi', phone: '+91 11 5000 4001', headcount: 0, status: 'Active' }
  ];

  var departments = [
    { id: 'DP-01', branchId: 'BR-01', name: 'Human Resources', code: 'HR', headId: null, costCentre: 'CC-1001', status: 'Active' },
    { id: 'DP-02', branchId: 'BR-01', name: 'Finance & Accounts', code: 'FIN', headId: null, costCentre: 'CC-1002', status: 'Active' },
    { id: 'DP-03', branchId: 'BR-03', name: 'Engineering', code: 'ENG', headId: null, costCentre: 'CC-2001', status: 'Active' },
    { id: 'DP-04', branchId: 'BR-02', name: 'Production', code: 'PRD', headId: null, costCentre: 'CC-3001', status: 'Active' },
    { id: 'DP-05', branchId: 'BR-02', name: 'Quality Assurance', code: 'QA', headId: null, costCentre: 'CC-3002', status: 'Active' },
    { id: 'DP-06', branchId: 'BR-05', name: 'Sales & Marketing', code: 'SLS', headId: null, costCentre: 'CC-4001', status: 'Active' },
    { id: 'DP-07', branchId: 'BR-04', name: 'Front Office', code: 'FRO', headId: null, costCentre: 'CC-5001', status: 'Active' },
    { id: 'DP-08', branchId: 'BR-04', name: 'Housekeeping', code: 'HSK', headId: null, costCentre: 'CC-5002', status: 'Active' },
    { id: 'DP-09', branchId: 'BR-01', name: 'IT Support', code: 'ITS', headId: null, costCentre: 'CC-1003', status: 'Active' }
  ];

  var designations = [
    { id: 'DG-01', name: 'Managing Director', grade: 'G1', level: 1, minCtc: 3000000, maxCtc: 6000000, status: 'Active' },
    { id: 'DG-02', name: 'General Manager', grade: 'G2', level: 2, minCtc: 1800000, maxCtc: 3000000, status: 'Active' },
    { id: 'DG-03', name: 'Department Manager', grade: 'G3', level: 3, minCtc: 1200000, maxCtc: 1800000, status: 'Active' },
    { id: 'DG-04', name: 'Team Lead', grade: 'G4', level: 4, minCtc: 800000, maxCtc: 1200000, status: 'Active' },
    { id: 'DG-05', name: 'Senior Executive', grade: 'G5', level: 5, minCtc: 550000, maxCtc: 800000, status: 'Active' },
    { id: 'DG-06', name: 'Executive', grade: 'G6', level: 6, minCtc: 350000, maxCtc: 550000, status: 'Active' },
    { id: 'DG-07', name: 'Associate', grade: 'G7', level: 7, minCtc: 240000, maxCtc: 350000, status: 'Active' },
    { id: 'DG-08', name: 'Trainee', grade: 'G8', level: 8, minCtc: 180000, maxCtc: 240000, status: 'Active' }
  ];

  var shifts = [
    { id: 'SH-01', name: 'General Shift', code: 'GEN', startTime: '09:00', endTime: '18:00', type: 'General', breakMins: 60, graceMins: 10, weeklyOffs: 'Sat,Sun', crossMidnight: 'No', status: 'Active' },
    { id: 'SH-02', name: 'Shift A (Morning)', code: 'A', startTime: '06:00', endTime: '14:00', type: 'Rotational', breakMins: 30, graceMins: 10, weeklyOffs: 'Sun', crossMidnight: 'No', status: 'Active' },
    { id: 'SH-03', name: 'Shift B (Evening)', code: 'B', startTime: '14:00', endTime: '22:00', type: 'Rotational', breakMins: 30, graceMins: 10, weeklyOffs: 'Sun', crossMidnight: 'No', status: 'Active' },
    { id: 'SH-04', name: 'Shift C (Night)', code: 'C', startTime: '22:00', endTime: '06:00', type: 'Cross-midnight', breakMins: 30, graceMins: 15, weeklyOffs: 'Sun', crossMidnight: 'Yes', status: 'Active' },
    { id: 'SH-05', name: 'Flexible Shift', code: 'FLX', startTime: '10:00', endTime: '19:00', type: 'Flexible', breakMins: 60, graceMins: 120, weeklyOffs: 'Sat,Sun', crossMidnight: 'No', status: 'Active' }
  ];

  var leaveTypes = [
    { id: 'LT-01', name: 'Earned Leave', code: 'EL', daysPerYear: 18, carryForward: 'Yes', maxCarryForward: 30, encashable: 'Yes', paid: 'Yes', status: 'Active' },
    { id: 'LT-02', name: 'Casual Leave', code: 'CL', daysPerYear: 12, carryForward: 'No', maxCarryForward: 0, encashable: 'No', paid: 'Yes', status: 'Active' },
    { id: 'LT-03', name: 'Sick Leave', code: 'SL', daysPerYear: 10, carryForward: 'No', maxCarryForward: 0, encashable: 'No', paid: 'Yes', status: 'Active' },
    { id: 'LT-04', name: 'Maternity Leave', code: 'ML', daysPerYear: 182, carryForward: 'No', maxCarryForward: 0, encashable: 'No', paid: 'Yes', status: 'Active' },
    { id: 'LT-05', name: 'Loss of Pay', code: 'LOP', daysPerYear: 0, carryForward: 'No', maxCarryForward: 0, encashable: 'No', paid: 'No', status: 'Active' },
    { id: 'LT-06', name: 'Compensatory Off', code: 'CO', daysPerYear: 0, carryForward: 'Yes', maxCarryForward: 10, encashable: 'No', paid: 'Yes', status: 'Active' }
  ];

  var holidays = [
    { id: 'HL-01', name: 'Republic Day', date: daysFromNow(-260), type: 'National', branchId: 'ALL', status: 'Active' },
    { id: 'HL-02', name: 'Holi', date: daysFromNow(-180), type: 'National', branchId: 'ALL', status: 'Active' },
    { id: 'HL-03', name: 'Independence Day', date: daysFromNow(-90), type: 'National', branchId: 'ALL', status: 'Active' },
    { id: 'HL-04', name: 'Diwali', date: daysFromNow(120), type: 'National', branchId: 'ALL', status: 'Active' },
    { id: 'HL-05', name: 'Christmas', date: daysFromNow(190), type: 'Festival', branchId: 'ALL', status: 'Active' }
  ];

  /* ---------------- Employees ---------------- */
  var employees = [];
  var TOTAL = 54;
  for (var i = 0; i < TOTAL; i++) {
    var first = FIRST[i % FIRST.length];
    var last = LAST[(i * 7) % LAST.length];
    var desig = designations[int(1, 6)];
    var dept = departments[i % departments.length];
    var branch = branches.filter(function (b) { return b.id === dept.branchId; })[0] || branches[0];
    var basic = Math.round((desig.minCtc / 12) * 0.5 / 100) * 100;
    var hra = Math.round(basic * 0.4);
    var conveyance = 1600;
    var special = Math.round(basic * 0.25);
    var gross = basic + hra + conveyance + special;
    var status = i === 3 || i === 17 || i === 41 ? 'Separated'
      : i === 8 || i === 22 ? 'Notice Period'
        : i < 6 ? 'Probation' : 'Active';
    employees.push({
      id: 'EMP-' + pad(i + 1, 4),
      empCode: 'E' + pad(1001 + i, 4),
      firstName: first, lastName: last,
      name: first + ' ' + last,
      email: (first + '.' + last).toLowerCase() + i + '@nexus.example',
      phone: '+91 9' + int(100000000, 999999999),
      gender: i % 3 === 0 ? 'Female' : 'Male',
      dob: '19' + int(75, 99) + '-' + pad(int(1, 12)) + '-' + pad(int(1, 28)),
      maritalStatus: i % 4 === 0 ? 'Married' : 'Single',
      bloodGroup: pick(['A+', 'B+', 'O+', 'AB+', 'O-']),
      doj: daysFromNow(-int(60, 2400)),
      status: status,
      employmentType: i % 9 === 0 ? 'Contract' : (i % 13 === 0 ? 'Intern' : (i % 17 === 0 ? 'Part-time' : 'Full-time')),
      category: pick(['Permanent', 'Permanent', 'Probationer', 'Contractual']),
      orgId: branch.orgId,
      branchId: branch.id,
      departmentId: dept.id,
      designationId: desig.id,
      shiftId: shifts[i % shifts.length].id,
      managerId: i > 4 ? 'EMP-' + pad(int(1, 4), 4) : null,
      workLocation: branch.city,
      probationEnd: daysFromNow(int(-300, 60)),
      salary: { basic: basic, hra: hra, conveyance: conveyance, special: special, gross: gross },
      bank: { bankName: pick(['HDFC Bank', 'ICICI Bank', 'Axis Bank', 'SBI']), accountNo: 'XXXX' + int(1000, 9999), ifsc: 'HDFC000' + int(1000, 9999), branch: branch.city },
      statutory: { pan: 'ABCDE' + int(1000, 9999) + 'F', uan: '10' + int(10000000000, 99999999999), esic: int(1000000000, 9999999999), pfApplicable: 'Yes', esicApplicable: i % 4 === 0 ? 'No' : 'Yes' },
      skills: [pick(['SQL', 'Excel', 'SAP', 'React', 'Leadership', 'Lean', 'Quality Audit', 'Customer Service']), pick(['Communication', 'Problem Solving', 'Teamwork'])],
      createdOn: daysFromNow(-int(60, 2400)), updatedOn: daysFromNow(-int(0, 30)), createdBy: 'HR Admin'
    });
  }
  branches.forEach(function (b) { b.headcount = employees.filter(function (e) { return e.branchId === b.id && e.status !== 'Separated'; }).length; });
  departments.forEach(function (d) { d.headId = (employees.filter(function (e) { return e.departmentId === d.id; })[0] || {}).id || null; });

  /* ---------------- Attendance (last 10 days) ---------------- */
  var attendance = [];
  var attStatuses = ['Present', 'Present', 'Present', 'Present', 'Late', 'Half Day', 'Absent', 'On Leave', 'Week Off'];
  for (var d = 0; d < 10; d++) {
    var day = daysFromNow(-d);
    employees.forEach(function (e) {
      if (e.status === 'Separated') return;
      var st = pick(attStatuses);
      attendance.push({
        id: 'AT-' + day.replace(/-/g, '') + '-' + e.id.slice(-4),
        employeeId: e.id, date: day, shiftId: e.shiftId, branchId: e.branchId, departmentId: e.departmentId,
        inTime: st === 'Absent' || st === 'On Leave' || st === 'Week Off' ? '' : pad(int(8, 11)) + ':' + pad(int(0, 59)),
        outTime: st === 'Absent' || st === 'On Leave' || st === 'Week Off' ? '' : pad(int(17, 21)) + ':' + pad(int(0, 59)),
        workedHours: st === 'Absent' || st === 'On Leave' || st === 'Week Off' ? 0 : (st === 'Half Day' ? 4 : 8 + (rnd() > 0.7 ? 1 : 0)),
        overtimeHours: rnd() > 0.82 ? 1 + int(0, 3) : 0,
        status: st, source: rnd() > 0.85 ? 'Manual' : 'Biometric'
      });
    });
  }

  /* ---------------- Leave requests ---------------- */
  var leaveRequests = [];
  for (var l = 0; l < 22; l++) {
    var emp = employees[int(0, employees.length - 1)];
    var lt = leaveTypes[int(0, 3)];
    var from = daysFromNow(int(-25, 25));
    leaveRequests.push({
      id: 'LV-' + pad(1001 + l, 4),
      employeeId: emp.id, leaveTypeId: lt.id,
      fromDate: from, toDate: from, days: int(1, 4),
      reason: pick(['Family function', 'Medical consultation', 'Personal errand', 'Travel plans', 'Child care']),
      status: pick(['Pending', 'Approved', 'Approved', 'Rejected', 'Pending']),
      appliedOn: daysFromNow(-int(0, 20)),
      approverId: emp.managerId, contact: '+91 9' + int(100000000, 999999999)
    });
  }

  /* ---------------- Recruitment ---------------- */
  var requisitions = [];
  var reqTitles = ['Production Supervisor', 'Software Engineer II', 'Front Office Executive', 'Sales Executive', 'QA Engineer', 'Housekeeping Supervisor', 'Accounts Executive', 'HR Business Partner'];
  for (var r = 0; r < 10; r++) {
    var rdept = departments[r % departments.length];
    requisitions.push({
      id: 'REQ-' + pad(2001 + r, 4),
      title: reqTitles[r % reqTitles.length],
      departmentId: rdept.id, branchId: rdept.branchId,
      positions: int(1, 6), filled: int(0, 2),
      employmentType: pick(['Full-time', 'Contract', 'Intern']),
      priority: pick(['High', 'Medium', 'Low']),
      minExperience: int(0, 6), budgetMin: int(300000, 900000), budgetMax: int(900001, 1800000),
      status: pick(['Open', 'Open', 'Approved', 'Closed', 'Pending Approval']),
      raisedBy: 'EMP-0001', raisedOn: daysFromNow(-int(1, 60)), targetDate: daysFromNow(int(10, 90)),
      hiringManagerId: employees[int(0, 5)].id
    });
  }

  var candidates = [];
  var stages = ['Applied', 'Screening', 'Interview', 'Selected', 'Offer', 'Hired', 'Rejected'];
  for (var c = 0; c < 26; c++) {
    var cfirst = FIRST[(c * 3) % FIRST.length];
    var clast = LAST[(c * 5) % LAST.length];
    candidates.push({
      id: 'CAN-' + pad(3001 + c, 4),
      name: cfirst + ' ' + clast,
      email: (cfirst + '.' + clast).toLowerCase() + c + '@mail.example',
      phone: '+91 9' + int(100000000, 999999999),
      requisitionId: requisitions[c % requisitions.length].id,
      source: pick(['LinkedIn', 'Naukri', 'Referral', 'Walk-in', 'Campus']),
      experienceYears: int(0, 12),
      currentCtc: int(300000, 1600000),
      expectedCtc: int(400000, 2000000),
      stage: stages[c % stages.length],
      rating: int(1, 5),
      appliedOn: daysFromNow(-int(1, 45)),
      interviewDate: daysFromNow(int(-10, 20)),
      recruiterId: 'EMP-0001'
    });
  }

  /* ---------------- Payroll ---------------- */
  var payrollRuns = [];
  var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  for (var p = 0; p < 4; p++) {
    var now = new Date(); now.setMonth(now.getMonth() - p);
    var totalGross = employees.filter(function (e) { return e.status !== 'Separated'; })
      .reduce(function (s, e) { return s + e.salary.gross; }, 0);
    payrollRuns.push({
      id: 'PAY-' + now.getFullYear() + pad(now.getMonth() + 1),
      month: months[now.getMonth()] + ' ' + now.getFullYear(),
      period: iso(new Date(now.getFullYear(), now.getMonth(), 1)) + ' to ' + iso(new Date(now.getFullYear(), now.getMonth() + 1, 0)),
      employees: employees.filter(function (e) { return e.status !== 'Separated'; }).length,
      grossTotal: totalGross,
      deductionTotal: Math.round(totalGross * 0.18),
      netTotal: Math.round(totalGross * 0.82),
      overtimeTotal: int(20000, 90000),
      status: p === 0 ? 'Draft' : (p === 1 ? 'Under Review' : 'Finalized'),
      processedOn: daysFromNow(-p * 30), processedBy: 'HR Admin'
    });
  }

  /* ---------------- Performance, Training, Assets ---------------- */
  var goals = [];
  for (var g = 0; g < 16; g++) {
    var ge = employees[g];
    goals.push({
      id: 'GL-' + pad(4001 + g, 4),
      employeeId: ge.id,
      kra: pick(['Operational Efficiency', 'Quality Improvement', 'Customer Satisfaction', 'Cost Optimisation', 'Team Development']),
      kpi: pick(['Reduce downtime by 10%', 'Achieve 98% QA pass rate', 'NPS above 60', 'Reduce cost per unit by 5%', 'Complete 2 certifications']),
      weightage: pick([10, 15, 20, 25, 30]),
      target: pick(['95%', '10%', '100%', '5%']),
      achievement: pick(['85%', '92%', '78%', '100%']),
      selfRating: int(1, 5), managerRating: int(1, 5),
      cycle: 'FY 2025-26', status: pick(['Draft', 'In Review', 'Finalized'])
    });
  }

  var trainings = [];
  var trainingNames = ['POSH Awareness', 'Fire Safety & Evacuation', 'Lean Six Sigma Yellow Belt', 'Advanced Excel', 'Leadership Essentials', 'Food Safety (HACCP)', 'Machine Guarding Safety', 'Customer Service Excellence'];
  for (var t = 0; t < 10; t++) {
    trainings.push({
      id: 'TRN-' + pad(5001 + t, 4),
      name: trainingNames[t % trainingNames.length],
      category: pick(['Statutory', 'Technical', 'Behavioural', 'Safety']),
      trainer: pick(['Internal - HR', 'External - SafeWorks', 'Internal - L&D', 'External - SkillPro']),
      mode: pick(['Classroom', 'Online', 'On-the-job']),
      startDate: daysFromNow(int(-40, 40)), durationHours: pick([2, 4, 8, 16]),
      seats: int(10, 40), nominated: int(5, 30),
      departmentId: departments[t % departments.length].id,
      status: pick(['Scheduled', 'Completed', 'Cancelled', 'Nomination Open'])
    });
  }

  var assets = [];
  var assetCats = ['Laptop', 'Desktop', 'Mobile Phone', 'ID Card', 'Uniform', 'Safety Helmet', 'Tool Kit', 'Vehicle'];
  for (var a = 0; a < 24; a++) {
    var ae = employees[a % employees.length];
    assets.push({
      id: 'AST-' + pad(6001 + a, 4),
      name: assetCats[a % assetCats.length] + ' - ' + pick(['Dell', 'HP', 'Lenovo', 'Samsung', '3M', 'Toyota']),
      category: assetCats[a % assetCats.length],
      serialNo: 'SN' + int(100000, 999999),
      employeeId: a % 5 === 0 ? null : ae.id,
      branchId: ae.branchId,
      allocatedOn: daysFromNow(-int(10, 700)),
      purchaseValue: int(5000, 120000),
      condition: pick(['Good', 'Good', 'Fair', 'Needs Repair']),
      status: a % 5 === 0 ? 'In Stock' : 'Allocated'
    });
  }

  /* ---------------- Contractors, loans, expenses, helpdesk ---------------- */
  var contractors = [];
  for (var ct = 0; ct < 8; ct++) {
    contractors.push({
      id: 'CON-' + pad(7001 + ct, 4),
      name: pick(['Shakti Manpower Services', 'Global Facility Care', 'Precision Staffing', 'Sunrise Labour Co.', 'MetroHouse Services']) + ' ' + (ct + 1),
      type: pick(['Manpower Supply', 'Housekeeping', 'Security', 'Canteen']),
      branchId: branches[ct % branches.length].id,
      contactPerson: pick(FIRST) + ' ' + pick(LAST),
      phone: '+91 9' + int(100000000, 999999999),
      deployedWorkforce: int(10, 120),
      agreementStart: daysFromNow(-int(90, 500)),
      agreementEnd: daysFromNow(int(-20, 300)),
      ratePerDay: int(450, 1200),
      complianceStatus: pick(['Compliant', 'Compliant', 'Docs Pending', 'Non-compliant']),
      status: pick(['Active', 'Active', 'Expired', 'Suspended'])
    });
  }

  var loans = [];
  for (var ln = 0; ln < 12; ln++) {
    var le = employees[int(0, employees.length - 1)];
    var amt = int(10000, 200000);
    loans.push({
      id: 'LN-' + pad(8001 + ln, 4),
      employeeId: le.id,
      type: pick(['Salary Advance', 'Personal Loan', 'Festival Advance', 'Emergency Loan']),
      amount: amt, tenureMonths: pick([3, 6, 12, 24]),
      emi: Math.round(amt / 6),
      disbursedOn: daysFromNow(-int(10, 400)),
      outstanding: Math.round(amt * (rnd() * 0.8)),
      status: pick(['Active', 'Closed', 'Pending Approval', 'Active'])
    });
  }

  var expenses = [];
  for (var ex = 0; ex < 20; ex++) {
    var xe = employees[int(0, employees.length - 1)];
    expenses.push({
      id: 'EXP-' + pad(9001 + ex, 4),
      employeeId: xe.id,
      category: pick(['Travel', 'Food Allowance', 'Accommodation', 'Conveyance', 'Fuel', 'Medical']),
      claimDate: daysFromNow(-int(1, 45)),
      amount: int(350, 25000),
      description: pick(['Client visit - Pune', 'Airport transfer', 'Hotel stay - Bengaluru', 'Monthly fuel', 'Medical consultation']),
      receiptAttached: rnd() > 0.2 ? 'Yes' : 'No',
      status: pick(['Pending', 'Approved', 'Reimbursed', 'Rejected']),
      approverId: xe.managerId
    });
  }

  var tickets = [];
  for (var tk = 0; tk < 16; tk++) {
    var te = employees[int(0, employees.length - 1)];
    tickets.push({
      id: 'TKT-' + pad(1101 + tk, 4),
      employeeId: te.id,
      category: pick(['Payroll Query', 'Document Request', 'IT Access', 'Grievance', 'Policy Clarification']),
      subject: pick(['Payslip not received', 'Need experience letter', 'Laptop replacement', 'Shift change request', 'Leave balance mismatch']),
      description: 'Raised via employee self-service portal.',
      priority: pick(['Low', 'Medium', 'High', 'Critical']),
      raisedOn: daysFromNow(-int(0, 20)),
      assignedTo: 'EMP-0001',
      slaHours: pick([24, 48, 72]),
      status: pick(['Open', 'In Progress', 'Resolved', 'Escalated'])
    });
  }

  var documents = [];
  var docTypes = ['Appointment Letter', 'Offer Letter', 'Aadhaar Card', 'PAN Card', 'Educational Certificate', 'Experience Letter', 'Salary Revision Letter', 'Relieving Letter'];
  for (var dc = 0; dc < 22; dc++) {
    var de = employees[dc % employees.length];
    documents.push({
      id: 'DOC-' + pad(1201 + dc, 4),
      name: docTypes[dc % docTypes.length],
      category: pick(['Statutory', 'Employment', 'Education', 'Company']),
      employeeId: dc % 6 === 0 ? null : de.id,
      fileName: 'document_' + (1201 + dc) + '.pdf',
      fileSize: int(120, 4800) + ' KB',
      uploadedOn: daysFromNow(-int(1, 600)),
      expiryDate: dc % 5 === 0 ? daysFromNow(int(-30, 300)) : '',
      verificationStatus: pick(['Verified', 'Pending', 'Rejected', 'Verified']),
      uploadedBy: 'HR Admin'
    });
  }

  var resignations = [];
  for (var rs = 0; rs < 8; rs++) {
    var re = employees[int(0, employees.length - 1)];
    resignations.push({
      id: 'SEP-' + pad(1301 + rs, 4),
      employeeId: re.id,
      resignationDate: daysFromNow(-int(1, 70)),
      lastWorkingDate: daysFromNow(int(5, 80)),
      reason: pick(['Better opportunity', 'Relocation', 'Higher studies', 'Personal reasons', 'Compensation']),
      noticePeriodDays: pick([30, 60, 90]),
      noticeServed: int(0, 90),
      exitInterview: pick(['Completed', 'Pending', 'Scheduled']),
      clearanceHR: pick(['Cleared', 'Pending']),
      clearanceIT: pick(['Cleared', 'Pending']),
      clearanceFinance: pick(['Cleared', 'Pending']),
      assetHandover: pick(['Done', 'Pending']),
      fnfStatus: pick(['Pending', 'Processed']),
      status: pick(['Pending Approval', 'Approved', 'In Notice', 'Exited'])
    });
  }

  var users = [
    { id: 'USR-01', name: 'Priya Menon', email: 'priya.menon@nexus.example', role: 'HR Admin', employeeId: 'EMP-0001', branchId: 'BR-01', status: 'Active', lastLogin: daysFromNow(0) },
    { id: 'USR-02', name: 'Rahul Verma', email: 'rahul.verma@nexus.example', role: 'Manager', employeeId: 'EMP-0002', branchId: 'BR-01', status: 'Active', lastLogin: daysFromNow(-1) },
    { id: 'USR-03', name: 'Ananya Iyer', email: 'ananya.iyer@nexus.example', role: 'Employee', employeeId: 'EMP-0007', branchId: 'BR-03', status: 'Active', lastLogin: daysFromNow(-2) },
    { id: 'USR-04', name: 'Vikram Rao', email: 'vikram.rao@nexus.example', role: 'Payroll Admin', employeeId: 'EMP-0012', branchId: 'BR-01', status: 'Active', lastLogin: daysFromNow(-4) }
  ];

  var announcements = [
    { id: 'AN-01', title: 'Annual Performance Cycle Opens', body: 'Self-assessment window for FY 2025-26 is now open until month end.', date: daysFromNow(-2), author: 'HR Team', audience: 'All' },
    { id: 'AN-02', title: 'Payroll Cut-off Reminder', body: 'Attendance regularisation must be completed before the 24th.', date: daysFromNow(-5), author: 'Payroll Team', audience: 'All' },
    { id: 'AN-03', title: 'Safety Drill - Pune Plant', body: 'Mandatory fire safety drill scheduled at the Pune plant next Tuesday.', date: daysFromNow(-8), author: 'EHS Team', audience: 'Pune Plant' }
  ];

  HRMS.MockData = {
    organizations: organizations,
    branches: branches,
    departments: departments,
    designations: designations,
    shifts: shifts,
    leaveTypes: leaveTypes,
    holidays: holidays,
    employees: employees,
    attendance: attendance,
    leaveRequests: leaveRequests,
    requisitions: requisitions,
    candidates: candidates,
    payrollRuns: payrollRuns,
    goals: goals,
    trainings: trainings,
    assets: assets,
    contractors: contractors,
    loans: loans,
    expenses: expenses,
    tickets: tickets,
    documents: documents,
    resignations: resignations,
    users: users,
    announcements: announcements
  };
})(window.HRMS);