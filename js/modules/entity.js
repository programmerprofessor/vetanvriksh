window.HRMS = window.HRMS || {};
(function (HRMS) {
  'use strict';
  var U = HRMS.Util, UI = HRMS.UI, S = HRMS.State;

  var states = {};

  function getState(key) {
    if (!states[key]) {
      states[key] = { page: 1, sort: { key: null, dir: 'asc' }, q: '', filters: {} };
    }
    return states[key];
  }

  function resolveField(f) {
    var copy = Object.assign({}, f);
    if (typeof copy.options === 'function') copy.options = copy.options();
    return copy;
  }

  function applyFilters(cfg, st) {
    var rows = S.all(cfg.collection);
    if (S.session.branchId !== 'ALL' && rows.length && rows[0].branchId !== undefined) {
      rows = rows.filter(function (r) { return !r.branchId || r.branchId === S.session.branchId; });
    }
    if (st.q) {
      var q = st.q.toLowerCase();
      rows = rows.filter(function (r) {
        return (cfg.searchFields || ['id']).some(function (f) {
          var v = typeof f === 'function' ? f(r) : r[f];
          return String(v || '').toLowerCase().indexOf(q) > -1;
        });
      });
    }
    Object.keys(st.filters).forEach(function (key) {
      var val = st.filters[key];
      if (!val) return;
      var filter = (cfg.filters || []).filter(function (f) { return f.key === key; })[0];
      if (!filter) return;
      rows = rows.filter(function (r) {
        var v = filter.accessor ? filter.accessor(r) : r[key];
        return String(v) === String(val);
      });
    });
    if (st.sort.key) {
      var col = cfg.columns.filter(function (c) { return c.key === st.sort.key; })[0];
      rows = U.sortBy(rows, st.sort.key, st.sort.dir, col && col.sortValue);
    }
    return rows;
  }

  function renderList(cfg) {
    var st = getState(cfg.route);
    var rows = applyFilters(cfg, st);
    var info = U.paginate(rows, st.page, 10);

    var columns = cfg.columns.concat([{
      key: '__actions', label: 'Actions', actions: function (r) {
        var buttons = '<button class="btn btn--sm btn--ghost" data-view="' + r.id + '" title="View">' + UI.icon('eye', 14) + '</button>';
        if (cfg.editable !== false) buttons += '<button class="btn btn--sm btn--ghost" data-edit="' + r.id + '" title="Edit">' + UI.icon('edit', 14) + '</button>';
        if (cfg.approvals) {
          var status = r.status || r.stage || '';
          if (/pending|draft|review|open/i.test(status)) {
            buttons += '<button class="btn btn--sm btn--ghost" data-approve="' + r.id + '" title="Approve" style="color:var(--c-success)">' + UI.icon('check', 14) + '</button>';
            buttons += '<button class="btn btn--sm btn--ghost" data-reject="' + r.id + '" title="Reject" style="color:var(--c-danger)">' + UI.icon('x', 14) + '</button>';
          }
        }
        buttons += '<button class="btn btn--sm btn--ghost" data-delete="' + r.id + '" title="Delete">' + UI.icon('trash', 14) + '</button>';
        return '<div class="row" style="justify-content:flex-end;gap:2px">' + buttons + '</div>';
      }
    }]);

    var filterHtml = (cfg.filters || []).map(function (f) {
      // Resolve options dynamically if it's a function, otherwise use the array
      var filterOptions = typeof f.options === 'function' ? f.options() : (f.options || []);
      
      var opts = filterOptions.map(function (o) {
        var v = typeof o === 'string' ? o : o.value;
        var l = typeof o === 'string' ? o : o.label;
        return '<option value="' + U.esc(v) + '"' + (st.filters[f.key] === String(v) ? ' selected' : '') + '>' + U.esc(l) + '</option>';
      }).join('');
      return '<div class="field"><label for="flt-' + f.key + '">' + U.esc(f.label) + '</label>' +
        '<select class="select" id="flt-' + f.key + '" data-filter="' + f.key + '"><option value="">All</option>' + opts + '</select></div>';
    }).join('');

    var stats = cfg.stats ? cfg.stats(rows) : null;
    var statsHtml = stats ? '<div class="grid grid--4">' + stats.map(function (s) {
      return '<div class="kpi"><div class="kpi__top"><span class="kpi__label">' + U.esc(s.label) + '</span>' +
        '<span class="kpi__icon">' + UI.icon(s.icon || 'chart', 15) + '</span></div>' +
        '<div class="kpi__value">' + s.value + '</div></div>';
    }).join('') + '</div>' : '';

    return HRMS.Navigation.breadcrumbs([{ label: 'Home', href: '#/dashboard' }, { label: cfg.title }]) +
      '<div class="page-head"><div class="page-head__text"><h1>' + U.esc(cfg.title) + '</h1>' +
      '<p>' + U.esc(cfg.subtitle || '') + '</p></div>' +
      '<div class="page-head__actions">' +
      '<button class="btn" data-export>' + UI.icon('download', 15) + 'Export CSV</button>' +
      (cfg.editable === false ? '' : '<button class="btn btn--primary" data-add>' + UI.icon('plus', 15) + 'Add New</button>') +
      '</div></div>' +
      (cfg.notice ? '<div class="card" style="border-left:3px solid var(--c-warning)"><div class="card__body tiny muted">' + U.esc(cfg.notice) + '</div></div><div class="mt-4"></div>' : '') +
      (statsHtml ? statsHtml + '<div class="mt-6"></div>' : '') +
      '<div class="card">' +
      '<div class="filter-bar">' +
      '<div class="field field--grow"><label for="ent-q">Search</label><div class="search-input">' +
      UI.icon('search', 15) + '<input class="input" id="ent-q" placeholder="' + U.esc(cfg.searchPlaceholder || 'Search records') + '" value="' + U.esc(st.q) + '"></div></div>' +
      filterHtml +
      '<button class="btn btn--ghost" data-clear>Clear</button>' +
      '</div>' +
      UI.dataTable({
        columns: columns, rows: info.rows, sort: st.sort, idPrefix: cfg.idPrefix || cfg.route,
        empty: {
          icon: cfg.icon || 'box',
          title: cfg.emptyTitle || 'No records found',
          message: cfg.emptyMessage || 'Adjust your filters or create a new record.',
          action: cfg.editable === false ? '' : '<button class="btn btn--primary" data-add>Add New</button>'
        }
      }) +
      UI.pagination(info, cfg.idPrefix || cfg.route) +
      '</div>';
  }

  function bindList(view, cfg) {
    var st = getState(cfg.route);
    var prefix = cfg.idPrefix || cfg.route;

    var addBtn = view.querySelector('[data-add]');
    if (addBtn) addBtn.addEventListener('click', function () { openForm(cfg, null); });

    view.querySelector('#ent-q').addEventListener('input', U.debounce(function (e) {
      st.q = e.target.value; st.page = 1; HRMS.Router.refresh();
    }, 250));

    U.qsa('[data-filter]', view).forEach(function (sel) {
      sel.addEventListener('change', function () {
        st.filters[sel.getAttribute('data-filter')] = sel.value;
        st.page = 1; HRMS.Router.refresh();
      });
    });
    view.querySelector('[data-clear]').addEventListener('click', function () {
      st.q = ''; st.filters = {}; st.page = 1; HRMS.Router.refresh();
    });

    U.qsa('[data-' + prefix + '-sort]', view).forEach(function (th) {
      th.addEventListener('click', function () {
        var key = th.getAttribute('data-' + prefix + '-sort');
        st.sort = { key: key, dir: st.sort.key === key && st.sort.dir === 'asc' ? 'desc' : 'asc' };
        HRMS.Router.refresh();
      });
    });
    U.qsa('[data-' + prefix + '-page]', view).forEach(function (b) {
      b.addEventListener('click', function () {
        if (b.disabled) return;
        st.page = Number(b.getAttribute('data-' + prefix + '-page'));
        HRMS.Router.refresh();
      });
    });

    U.qsa('[data-view]', view).forEach(function (b) {
      b.addEventListener('click', function () { openDetail(cfg, b.getAttribute('data-view')); });
    });
    U.qsa('[data-edit]', view).forEach(function (b) {
      b.addEventListener('click', function () { openForm(cfg, b.getAttribute('data-edit')); });
    });
    
    // Referential Integrity Check for Delete
    U.qsa('[data-delete]', view).forEach(function (b) {
      b.addEventListener('click', function () {
        var id = b.getAttribute('data-delete');
        
        var isUsed = false;
        var dependentModule = '';
        
        if (cfg.collection === 'departments') {
            isUsed = S.all('employees').some(function(e) { return e.departmentId === id; });
            dependentModule = 'Employees';
        } else if (cfg.collection === 'branches') {
            isUsed = S.all('employees').some(function(e) { return e.branchId === id; });
            dependentModule = 'Employees';
        } else if (cfg.collection === 'designations') {
            isUsed = S.all('employees').some(function(e) { return e.designationId === id; });
            dependentModule = 'Employees';
        } else if (cfg.collection === 'leaveTypes') {
            isUsed = S.all('leaveRequests').some(function(l) { return l.leaveTypeId === id; });
            dependentModule = 'Leave Requests';
        }

        if (isUsed) {
            HRMS.Toast.error('Cannot delete. This record is currently linked to active ' + dependentModule + '. Deactivate it instead.');
            return;
        }

        UI.confirmDialog({
          title: 'Delete record?', message: 'Record ' + id + ' will be permanently removed from the demonstration dataset.',
          confirmText: 'Delete', danger: true
        }).then(function (ok) {
          if (!ok) return;
          S.remove(cfg.collection, id);
          HRMS.Toast.success('Record deleted');
          HRMS.Router.refresh();
        });
      });
    });
    U.qsa('[data-approve]', view).forEach(function (b) {
      b.addEventListener('click', function () { setStatus(cfg, b.getAttribute('data-approve'), 'Approved'); });
    });
    U.qsa('[data-reject]', view).forEach(function (b) {
      b.addEventListener('click', function () { setStatus(cfg, b.getAttribute('data-reject'), 'Rejected'); });
    });

    view.querySelector('[data-export]').addEventListener('click', function () {
      var rows = applyFilters(cfg, st);
      var cols = cfg.columns.filter(function (c) { return !c.actions; }).map(function (c) {
        return { label: c.label, value: c.exportValue || c.render ? function (r) { return c.exportValue ? c.exportValue(r) : stripHtml(c.render(r)); } : c.key };
      });
      U.download(cfg.route + '-' + new Date().toISOString().slice(0, 10) + '.csv', U.toCSV(rows, cols));
      HRMS.Toast.success('Exported ' + rows.length + ' records to CSV');
    });
  }

  function stripHtml(html) {
    var d = document.createElement('div');
    d.innerHTML = html;
    return d.textContent.trim();
  }

  function setStatus(cfg, id, status) {
    var row = S.find(cfg.collection, id);
    if (!row) return;
    var field = row.status !== undefined ? 'status' : (row.stage !== undefined ? 'stage' : 'status');
    UI.confirmDialog({
      title: status + ' record?',
      message: 'Set ' + id + ' to "' + status + '". This updates the demonstration dataset.',
      confirmText: status
    }).then(function (ok) {
      if (!ok) return;
      var patch = {};
      patch[field] = status;
      S.update(cfg.collection, id, patch);
      HRMS.Toast.success('Record marked as ' + status);
      HRMS.Router.refresh();
    });
  }

  function openDetail(cfg, id) {
    var row = S.find(cfg.collection, id);
    if (!row) { HRMS.Toast.error('Record not found'); return; }
    var groups = cfg.detailGroups ? cfg.detailGroups(row) : [
      ['Record ID', row.id],
      ['Status', row.status || row.stage || '—']
    ];
    var body = groups.map(function (g) { return UI.detailGroup(g.title, g.fields); }).join('');
    UI.openDrawer({
      title: cfg.title + ' — ' + id,
      body: body,
      footer: '<button class="btn" data-close>Close</button>' +
        (cfg.editable === false ? '' : '<button class="btn btn--primary" id="drawer-edit">Edit Record</button>'),
      onMount: function (el, close) {
        var edit = el.querySelector('#drawer-edit');
        if (edit) edit.addEventListener('click', function () { close(); openForm(cfg, id); });
      }
    });
  }

  function openForm(cfg, id) {
    var existing = id ? S.find(cfg.collection, id) : null;
    var schema = (cfg.form || []).map(resolveField);
    var values = {};
    if (existing) {
      schema.forEach(function (f) {
        var v = f.valueGetter ? f.valueGetter(existing) : existing[f.name];
        values[f.name] = v === undefined || v === null ? '' : v;
      });
    } else {
      schema.forEach(function (f) { if (f.default !== undefined) values[f.name] = f.default; });
    }

    UI.openModal({
      title: existing ? 'Edit ' + cfg.singular : 'New ' + cfg.singular,
      size: 'lg',
      body: UI.renderForm(schema, values),
      footer: '<button class="btn" data-close>Cancel</button>' +
        '<button class="btn btn--primary" id="ent-save">' + (existing ? 'Save Changes' : 'Create Record') + '</button>',
      onMount: function (el, close) {
        var form = el.querySelector('form');
        el.querySelector('#ent-save').addEventListener('click', function () {
          var data = UI.readForm(form, schema);
          var result = HRMS.Validation.validate(schema, data);
          if (!result.valid) { UI.showErrors(form, result.errors); HRMS.Toast.error('Please correct the highlighted fields'); return; }

          if (existing) {
            S.update(cfg.collection, existing.id, data);
            HRMS.Toast.success(cfg.singular + ' updated successfully');
          } else {
            data.id = cfg.idPrefix ? (cfg.idPrefix.toUpperCase() + '-' + String(Date.now()).slice(-6)) : U.uid('REC');
            if (!data.status) data.status = cfg.defaultStatus || 'Pending';
            data.createdOn = new Date().toISOString().slice(0, 10);
            data.createdBy = S.currentUser().name;
            S.insert(cfg.collection, data);
            HRMS.Toast.success(cfg.singular + ' created successfully');
          }
          close();
          HRMS.Router.refresh();
        });
      }
    });
  }

  HRMS.Modules = HRMS.Modules || {};
  HRMS.Modules.Entity = {
    register: function (cfg) {
      HRMS.Router.register('/' + cfg.route, function () {
        var view = document.getElementById('view');
        view.innerHTML = renderList(cfg);
        bindList(view, cfg);
      });
    }
  };
})(window.HRMS);