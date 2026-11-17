window.HRMS = window.HRMS || {};
(function (HRMS) {
  'use strict';
  var U = HRMS.Util;

  /* ---------------- Icons ---------------- */
  var ICONS = {
    grid: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',
    sitemap: 'M12 3v6M6 21v-6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v6M9 21h6M6 9h12',
    users: 'M17 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9.5 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8M22 21v-2a4 4 0 0 0-3-3.87',
    user: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8',
    target: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8M12 11.5a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1',
    clock: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M12 7v5l3 2',
    calendar: 'M4 5h16v16H4zM4 10h16M8 3v4M16 3v4',
    wallet: 'M3 7h18v13H3zM3 7l2-3h12l2 3M16 13h2',
    shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z',
    award: 'M12 3a6 6 0 1 0 0 12 6 6 0 0 0 0-12M8.5 14L7 21l5-3 5 3-1.5-7',
    book: 'M4 4h7a3 3 0 0 1 3 3v13a3 3 0 0 0-3-3H4zM20 4h-4a3 3 0 0 0-3 3v13a3 3 0 0 1 3-3h4z',
    box: 'M21 8l-9-5-9 5v9l9 5 9-5zM3 8l9 5 9-5M12 13v9',
    briefcase: 'M3 8h18v12H3zM8 8V5h8v3',
    card: 'M3 6h18v12H3zM3 10h18',
    receipt: 'M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2zM9 8h6M9 12h6',
    lifebuoy: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8M5 5l3.5 3.5M19 5l-3.5 3.5M5 19l3.5-3.5M19 19l-3.5-3.5',
    file: 'M6 3h8l4 4v14H6zM14 3v5h5',
    logout: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9',
    chart: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
    plug: 'M9 3v6M15 3v6M6 9h12v3a6 6 0 0 1-12 0zM12 18v3',
    settings: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 1 1-4 0v-.1A1.6 1.6 0 0 0 7.5 19.4l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.6 1.6 0 0 0 3 15H3a2 2 0 1 1 0-4h.1A1.6 1.6 0 0 0 4.6 8.5l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.6 1.6 0 0 0 10 3.1V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 2.7 1.1l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0 1.1 2.7H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z',
    search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14M20 20l-4-4',
    bell: 'M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0',
    help: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M9.1 9a3 3 0 1 1 4.2 2.7c-.8.4-1.3 1-1.3 1.8v.5M12 17h.01',
    sun: 'M12 4V2M12 22v-2M4 12H2M22 12h-2M6 6L4.5 4.5M19.5 19.5L18 18M6 18l-1.5 1.5M19.5 4.5L18 6M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8',
    moon: 'M21 12.8A8.5 8.5 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8',
    menu: 'M3 6h18M3 12h18M3 18h18',
    plus: 'M12 5v14M5 12h14',
    edit: 'M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z',
    trash: 'M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6',
    eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6',
    check: 'M20 6L9 17l-5-5',
    x: 'M18 6L6 18M6 6l12 12',
    download: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3',
    upload: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12',
    filter: 'M22 3H2l8 9.5V19l4 2v-8.5z',
    print: 'M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-2M6 14h12v8H6z',
    refresh: 'M23 4v6h-6M1 20v-6h6M3.5 9a9 9 0 0 1 14.9-3.4L23 10M1 14l4.6 4.4A9 9 0 0 0 20.5 15',
    chevron: 'M9 18l6-6-6-6',
    dot: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8'
  };

  function icon(name, size) {
    var d = ICONS[name] || ICONS.dot;
    var s = size || 18;
    return '<svg class="icon" width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + d + '"/></svg>';
  }

  /* ---------------- Empty state ---------------- */
  function emptyState(opts) {
    opts = opts || {};
    return '<div class="empty"><div class="empty__icon">' + icon(opts.icon || 'box', 24) + '</div>' +
      '<h4>' + U.esc(opts.title || 'Nothing here yet') + '</h4>' +
      '<p>' + U.esc(opts.message || 'No records match your current filters.') + '</p>' +
      (opts.action ? '<div class="mt-4">' + opts.action + '</div>' : '') + '</div>';
  }

  /* ---------------- Pagination ---------------- */
  function pagination(info, idPrefix) {
    idPrefix = idPrefix || 'pg';
    var pages = info.pages, page = info.page;
    var start = (page - 1) * 10 + 1;
    var end = Math.min(info.total, page * 10);
    var buttons = '';
    var from = Math.max(1, page - 2), to = Math.min(pages, from + 4);
    for (var i = from; i <= to; i++) {
      buttons += '<button class="page-btn' + (i === page ? ' is-active' : '') + '" data-' + idPrefix + '-page="' + i + '">' + i + '</button>';
    }
    return '<div class="pagination">' +
      '<span>Showing <strong>' + start + '–' + end + '</strong> of <strong>' + info.total + '</strong></span>' +
      '<div class="row">' +
      '<button class="page-btn" data-' + idPrefix + '-page="' + (page - 1) + '"' + (page <= 1 ? ' disabled' : '') + '>Prev</button>' +
      buttons +
      '<button class="page-btn" data-' + idPrefix + '-page="' + (page + 1) + '"' + (page >= pages ? ' disabled' : '') + '>Next</button>' +
      '</div></div>';
  }

  /* ---------------- Data table ---------------- */
  function dataTable(opts) {
    var columns = opts.columns, rows = opts.rows, sort = opts.sort || {}, idPrefix = opts.idPrefix || 'tbl';
    var head = columns.map(function (c) {
      if (c.sortable === false || c.actions) return '<th class="' + (c.actions ? 'col-actions' : '') + '">' + U.esc(c.label) + '</th>';
      var arrow = sort.key === c.key ? (sort.dir === 'asc' ? '▲' : '▼') : '↕';
      return '<th class="is-sortable" data-' + idPrefix + '-sort="' + c.key + '">' + U.esc(c.label) +
        '<span class="sort-arrow">' + arrow + '</span></th>';
    }).join('');

    var body;
    if (!rows.length) {
      body = '<tr><td colspan="' + columns.length + '">' + emptyState(opts.empty) + '</td></tr>';
    } else {
      body = rows.map(function (r, idx) {
        var tds = columns.map(function (c) {
          if (c.actions) {
            return '<td class="col-actions">' + c.actions(r, idx) + '</td>';
          }
          var val = c.render ? c.render(r) : U.esc(r[c.key] === undefined || r[c.key] === null ? '—' : r[c.key]);
          return '<td class="' + (c.align === 'right' ? 'num' : '') + '">' + val + '</td>';
        }).join('');
        return '<tr data-row-id="' + U.esc(r.id) + '">' + tds + '</tr>';
      }).join('');
    }
    return '<div class="table-wrap"><table class="table"><thead><tr>' + head + '</tr></thead><tbody>' + body + '</tbody></table></div>';
  }

  /* ---------------- Modal / Drawer ---------------- */
  var modalRoot = function () { return document.getElementById('modal-root'); };
  var drawerRoot = function () { return document.getElementById('drawer-root'); };
  var scrim = function () { return document.getElementById('scrim'); };

  function openModal(opts) {
    var root = modalRoot();
    var wrap = document.createElement('div');
    wrap.className = 'modal-wrap';
    wrap.innerHTML =
      '<div class="modal ' + (opts.size ? 'modal--' + opts.size : '') + '" role="dialog" aria-modal="true">' +
      '<div class="modal__head"><h3>' + U.esc(opts.title || '') + '</h3>' +
      '<button class="icon-btn" data-close aria-label="Close">' + icon('x', 16) + '</button></div>' +
      '<div class="modal__body">' + (opts.body || '') + '</div>' +
      (opts.footer === null ? '' : '<div class="modal__foot">' + (opts.footer ||
        '<button class="btn" data-close>Cancel</button>') + '</div>') +
      '</div>';
    root.appendChild(wrap);
    scrim().hidden = false;

    function close() {
      if (wrap.parentNode) wrap.parentNode.removeChild(wrap);
      if (!root.children.length) scrim().hidden = true;
      document.removeEventListener('keydown', onKey);
    }
    function onKey(e) { if (e.key === 'Escape') close(); }
    document.addEventListener('keydown', onKey);
    wrap.addEventListener('click', function (e) {
      if (e.target.closest('[data-close]')) close();
      if (e.target === wrap) close();
    });
    if (opts.onMount) opts.onMount(wrap, close);
    return { el: wrap, close: close };
  }

  function openDrawer(opts) {
    var root = drawerRoot();
    var el = document.createElement('div');
    el.className = 'drawer';
    el.setAttribute('role', 'dialog');
    el.innerHTML =
      '<div class="drawer__head"><h3>' + U.esc(opts.title || '') + '</h3>' +
      '<button class="icon-btn" data-close aria-label="Close">' + icon('x', 16) + '</button></div>' +
      '<div class="drawer__body">' + (opts.body || '') + '</div>' +
      (opts.footer ? '<div class="drawer__foot">' + opts.footer + '</div>' : '');
    root.appendChild(el);
    scrim().hidden = false;

    function close() {
      if (el.parentNode) el.parentNode.removeChild(el);
      if (!root.children.length) scrim().hidden = true;
      document.removeEventListener('keydown', onKey);
    }
    function onKey(e) { if (e.key === 'Escape') close(); }
    document.addEventListener('keydown', onKey);
    el.addEventListener('click', function (e) {
      if (e.target.closest('[data-close]')) close();
    });
    scrim().addEventListener('click', close, { once: true });
    if (opts.onMount) opts.onMount(el, close);
    return { el: el, close: close };
  }

  function confirmDialog(opts) {
    return new Promise(function (resolve) {
      var handle = openModal({
        title: opts.title || 'Please confirm',
        size: 'sm',
        body: '<p style="font-size:13px;line-height:1.6">' + U.esc(opts.message || 'Are you sure?') + '</p>',
        footer: '<button class="btn" data-cancel>Cancel</button>' +
          '<button class="btn ' + (opts.danger ? 'btn--danger' : 'btn--primary') + '" data-ok>' +
          U.esc(opts.confirmText || 'Confirm') + '</button>',
        onMount: function (el, close) {
          el.querySelector('[data-ok]').addEventListener('click', function () { close(); resolve(true); });
          el.querySelector('[data-cancel]').addEventListener('click', function () { close(); resolve(false); });
        }
      });
      handle.el.addEventListener('click', function (e) {
        if (e.target === handle.el) resolve(false);
      });
    });
  }

  /* ---------------- Form builder ---------------- */
  function fieldHtml(f, value) {
    var id = 'f_' + f.name;
    var v = value === undefined || value === null ? (f.default !== undefined ? f.default : '') : value;
    var req = f.required ? '<span class="req">*</span>' : '';
    var control;
    if (f.type === 'select') {
      var opts = (f.options || []).map(function (o) {
        var ov = typeof o === 'string' ? o : o.value;
        var ol = typeof o === 'string' ? o : o.label;
        return '<option value="' + U.esc(ov) + '"' + (String(ov) === String(v) ? ' selected' : '') + '>' + U.esc(ol) + '</option>';
      }).join('');
      control = '<select class="select" id="' + id + '" name="' + f.name + '"' + (f.disabled ? ' disabled' : '') + '>' +
        (f.placeholder ? '<option value="">' + U.esc(f.placeholder) + '</option>' : '') + opts + '</select>';
    } else if (f.type === 'textarea') {
      control = '<textarea class="textarea" id="' + id + '" name="' + f.name + '" placeholder="' + U.esc(f.placeholder || '') + '">' + U.esc(v) + '</textarea>';
    } else if (f.type === 'checkbox') {
      return '<div class="field' + (f.full ? ' field--full' : '') + '"><label class="checkbox">' +
        '<input type="checkbox" id="' + id + '" name="' + f.name + '"' + (v === true || v === 'Yes' ? ' checked' : '') + '> ' +
        U.esc(f.label) + '</label></div>';
    } else {
      control = '<input class="input" type="' + (f.type || 'text') + '" id="' + id + '" name="' + f.name + '"' +
        ' value="' + U.esc(v) + '" placeholder="' + U.esc(f.placeholder || '') + '"' +
        (f.min !== undefined ? ' min="' + f.min + '"' : '') + (f.max !== undefined ? ' max="' + f.max + '"' : '') +
        (f.readonly ? ' readonly' : '') + '>';
    }
    return '<div class="field' + (f.full ? ' field--full' : '') + '">' +
      '<label for="' + id + '">' + U.esc(f.label || f.name) + req + '</label>' + control +
      (f.hint ? '<span class="field__hint">' + U.esc(f.hint) + '</span>' : '') +
      '<span class="field__error" data-error-for="' + f.name + '"></span></div>';
  }

  function renderForm(schema, values) {
    values = values || {};
    return '<form class="form-grid" novalidate>' +
      schema.map(function (f) { return fieldHtml(f, values[f.name]); }).join('') + '</form>';
  }

  function readForm(formEl, schema) {
    var values = {};
    schema.forEach(function (f) {
      var input = formEl.querySelector('[name="' + f.name + '"]');
      if (!input) { values[f.name] = ''; return; }
      if (f.type === 'checkbox') values[f.name] = input.checked ? 'Yes' : 'No';
      else if (f.type === 'number') values[f.name] = input.value === '' ? '' : Number(input.value);
      else values[f.name] = input.value.trim();
    });
    return values;
  }

  function showErrors(formEl, errors) {
    U.qsa('.field__error', formEl).forEach(function (e) { e.textContent = ''; });
    U.qsa('.input,.select,.textarea', formEl).forEach(function (e) { e.classList.remove('is-invalid'); });
    Object.keys(errors).forEach(function (k) {
      var slot = formEl.querySelector('[data-error-for="' + k + '"]');
      if (slot) slot.textContent = errors[k];
      var input = formEl.querySelector('[name="' + k + '"]');
      if (input) input.classList.add('is-invalid');
    });
    var first = formEl.querySelector('.is-invalid');
    if (first) first.focus();
  }

  /* ---------------- Detail view helpers ---------------- */
  function detailGroup(title, pairs) {
    return '<div class="detail-group"><h4>' + U.esc(title) + '</h4><dl class="dl">' +
      pairs.map(function (p) {
        return '<dt>' + U.esc(p[0]) + '</dt><dd>' + (p[2] ? p[2] : U.esc(p[1] === undefined || p[1] === null || p[1] === '' ? '—' : p[1])) + '</dd>';
      }).join('') + '</dl></div>';
  }

  HRMS.UI = {
    icon: icon,
    emptyState: emptyState,
    pagination: pagination,
    dataTable: dataTable,
    openModal: openModal,
    openDrawer: openDrawer,
    confirmDialog: confirmDialog,
    renderForm: renderForm,
    readForm: readForm,
    showErrors: showErrors,
    detailGroup: detailGroup
  };
})(window.HRMS);