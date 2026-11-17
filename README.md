# Universal Multi-Industry HRMS — Frontend Prototype

An interactive, dependency-free HTML5 / CSS3 / vanilla JavaScript (ES6) prototype of a
universal HRMS. All data is seeded locally and persisted in browser LocalStorage.

## Setup

1. Open the project folder in VS Code.
2. Install the **Live Server** extension (or use any static server).
3. Right-click `index.html` → **Open with Live Server**.
4. Navigate to `http://localhost:5500`.

> Opening `index.html` directly with `file://` also works, but a local server is recommended.

No build step, no package manager, no external libraries.

## Architecture

| Layer | Files | Purpose |
|---|---|---|
| Design tokens | `css/variables.css` | Colours, spacing, radii, shadows, dark theme |
| Base | `css/reset.css` | Normalisation |
| Shell | `css/layout.css` | Sidebar, header, page grid, breadcrumbs |
| Components | `css/components.css` | Cards, KPI, buttons, badges, tabs, modal, drawer, toast |
| Forms | `css/forms.css` | Fields, validation states, filter bar |
| Tables | `css/tables.css` | Data tables, toolbar, pagination |
| Dashboard | `css/dashboard.css` | Charts, bar rows, timeline |
| Responsive | `css/responsive.css` | Tablet / mobile / print |

| Layer | Files | Purpose |
|---|---|---|
| Persistence | `js/storage.js` | Namespaced LocalStorage wrapper |
| Seed data | `js/mock-data.js` | Deterministic sample dataset |
| State | `js/state.js` | In-memory DB, session, UI state, lookups |
| Utilities | `js/common.js` | Formatting, CSV, sorting, pagination, escaping |
| Validation | `js/validation.js` | Rule-based client-side validation |
| Notifications | `js/notifications.js` | Toast system |
| Permissions | `js/permissions.js` | Role → module matrix |
| UI kit | `js/components.js` | Table, form builder, modal, drawer, confirm |
| Charts | `js/charts.js` | SVG donut / bar / line |
| Router | `js/router.js` | Hash router with params |
| Navigation | `js/navigation.js` | Sidebar, header, search, notifications |
| Modules | `js/modules/*` | Dashboard, Employees, Entity engine, Reports, Settings |

### Config-driven entity engine

Most modules are declarative. `js/modules/entity-configs.js` defines each module as a
configuration object (collection, columns, filters, form schema, KPI stats, detail groups).
`js/modules/entity.js` renders list, filters, sorting, pagination, detail drawer, add/edit
modal, validation, approvals, delete and CSV export for every config automatically.

Adding a new module is a config entry — no new UI code required.

## Master data & relationships

All modules reference the same identifiers:

- `employees[].id` → `EMP-0001` (used by attendance, leave, payroll, assets, goals, loans, expenses, tickets, documents, resignations)
- `branches[].id` → `BR-01…` (org-scoped)
- `departments[].id` → `DP-01…` (branch-scoped)
- `designations[].id` → `DG-01…`
- `shifts[].id` → `SH-01…`
- `leaveTypes[].id` → `LT-01…`
- `organizations[].id` → `ORG-01…`

Lookup helpers live in `HRMS.Lookup` (`employeeName`, `department`, `branch`, `designation`, `shift`, `leaveType`, `org`).

## Implemented interactions

Sidebar collapse, mobile drawer, org/branch/role switching, global search (`/` to focus),
notifications, theme toggle, add/edit/delete with confirmation, form validation with inline errors,
filtering, sorting, pagination, detail drawer, approve/reject status changes, CSV export,
CSV import (employees), print layout, LocalStorage persistence, empty/loading states,
toasts, and role-based menu visibility.

## Known limitations

- No backend, API, database or authentication — LocalStorage only (not a production datastore).
- Role switching simulates permissions; it is not security.
- File upload, resume parsing and PDF preview are non-functional placeholders (labelled in UI).
- Statutory rates and payroll calculations are illustrative and not legally validated.
- Drag-and-drop roster assignment is not implemented; shifts are managed via the shift master.
- Charts are client-side SVG renderings of local data.

## Suggested backend entity mapping

| UI module | Entity | Key fields |
|---|---|---|
| Employees | `Employee` | id, empCode, name, email, departmentId, designationId, branchId, shiftId, managerId, doj, status |
| Leave | `LeaveRequest` | id, employeeId, leaveTypeId, fromDate, toDate, days, status, approverId |
| Attendance | `AttendanceRecord` | id, employeeId, date, shiftId, inTime, outTime, workedHours, overtimeHours, status |
| Payroll | `PayrollRun` | id, month, period, grossTotal, deductionTotal, netTotal, status |
| Recruitment | `Candidate` | id, requisitionId, name, email, stage, rating |
| Assets | `Asset` | id, name, category, serialNo, employeeId, status |
| Compliance | `ComplianceRecord` | id, name, category, rate, period, dueDate, amount, status |
| Exit | `Resignation` | id, employeeId, resignationDate, lastWorkingDate, clearances, status |

Every form field maps to a column with a declared type, required flag and validation rule
in `entity-configs.js`, ready to be lifted into an OpenAPI schema.