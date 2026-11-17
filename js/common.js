window.HRMS = window.HRMS || {};
(function (HRMS) {
  'use strict';

  function esc(v) {
    if (v === null || v === undefined) return '';
    return String(v).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function fmtCurrency(n) {
    if (n === null || n === undefined || isNaN(n)) return '—';
    return '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 });
  }
  function fmtDate(d) {
    if (!d) return '—';
    var safeDateStr = (typeof d === 'string' && d.length === 10) ? d + 'T00:00:00' : d;
    var dt = new Date(safeDateStr);
    if (isNaN(dt)) return d;
    return dt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }
  function fmtDateTime(d) {
    if (!d) return '—';
    var dt = new Date(d);
    if (isNaN(dt)) return d;
    return fmtDate(d) + ' · ' + dt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  }
  function timeAgo(d) {
    var dt = new Date(d); if (isNaN(dt)) return d;
    var diff = Math.floor((Date.now() - dt.getTime()) / 86400000);
    if (diff <= 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    if (diff < 30) return diff + ' days ago';
    if (diff < 365) return Math.floor(diff / 30) + ' months ago';
    return Math.floor(diff / 365) + ' years ago';
  }
  function initials(name) {
    if (!name) return '?';
    return name.trim().split(/\s+/).slice(0, 2).map(function (p) { return p[0].toUpperCase(); }).join('');
  }
  var AV_COLORS = ['#2f5de3', '#0f7a56', '#b45309', '#7c3aed', '#0369a1', '#be185d', '#4d7c0f', '#c2410c'];
  function avatarColor(str) {
    var h = 0; str = String(str || 'x');
    for (var i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % 9999;
    return AV_COLORS[h % AV_COLORS.length];
  }
  function avatar(name, size) {
    var cls = size === 'lg' ? 'avatar avatar--lg' : (size === 'sm' ? 'avatar avatar--sm' : 'avatar');
    return '<span class="' + cls + '" style="background:' + avatarColor(name) + '">' + esc(initials(name)) + '</span>';
  }
  var seq = 0;
  function uid(prefix) { seq++; return (prefix || 'ID') + '-' + Date.now().toString(36).slice(-5).toUpperCase() + seq; }
  function debounce(fn, ms) {
    var t; return function () {
      var args = arguments, ctx = this;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(ctx, args); }, ms || 250);
    };
  }
  function sortBy(rows, key, dir, accessor) {
    var out = rows.slice();
    out.sort(function (a, b) {
      var av = accessor ? accessor(a) : a[key];
      var bv = accessor ? accessor(b) : b[key];
      if (av === null || av === undefined) av = '';
      if (bv === null || bv === undefined) bv = '';
      if (typeof av === 'number' && typeof bv === 'number') return dir === 'asc' ? av - bv : bv - av;
      av = String(av).toLowerCase(); bv = String(bv).toLowerCase();
      if (av < bv) return dir === 'asc' ? -1 : 1;
      if (av > bv) return dir === 'asc' ? 1 : -1;
      return 0;
    });
    return out;
  }
  function paginate(rows, page, perPage) {
    var total = rows.length;
    var pages = Math.max(1, Math.ceil(total / perPage));
    var p = Math.min(Math.max(1, page), pages);
    return { rows: rows.slice((p - 1) * perPage, p * perPage), page: p, pages: pages, total: total };
  }
  function groupBy(rows, fn) {
    return rows.reduce(function (acc, r) { var k = fn(r); (acc[k] = acc[k] || []).push(r); return acc; }, {});
  }
  function toCSV(rows, columns) {
    var head = columns.map(function (c) { return '"' + c.label.replace(/"/g, '""') + '"'; }).join(',');
    var body = rows.map(function (r) {
      return columns.map(function (c) {
        var v = c.value ? c.value(r) : r[c.key];
        if (v === null || v === undefined) v = '';
        return '"' + String(v).replace(/"/g, '""') + '"';
      }).join(',');
    });
    return [head].concat(body).join('\r\n');
  }
  function download(filename, content, mime) {
    var blob = new Blob(['\ufeff' + content], { type: mime || 'text/csv;charset=utf-8;' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = filename; document.body.appendChild(a); a.click();
    setTimeout(function () { document.body.removeChild(a); URL.revokeObjectURL(url); }, 200);
  }
  function parseCSV(text) {
    var lines = text.replace(/\r/g, '').split('\n').filter(function (l) { return l.trim() !== ''; });
    if (!lines.length) return [];
    function split(line) {
      var out = [], cur = '', inQ = false;
      for (var i = 0; i < line.length; i++) {
        var ch = line[i];
        if (ch === '"') {
          if (inQ && line[i + 1] === '"') { cur += '"'; i++; }
          else inQ = !inQ;
        } else if (ch === ',' && !inQ) { out.push(cur); cur = ''; }
        else cur += ch;
      }
      out.push(cur);
      return out;
    }
    var headers = split(lines[0]).map(function (h) { return h.trim(); });
    return lines.slice(1).map(function (l) {
      var cells = split(l), obj = {};
      headers.forEach(function (h, i) { obj[h] = (cells[i] || '').trim(); });
      return obj;
    });
  }
  function statusTone(status) {
    var s = String(status || '').toLowerCase();
    if (/(active|approved|present|verified|compliant|cleared|done|completed|finalized|hired|resolved|closed|reimbursed|selected|good)/.test(s)) return 'success';
    if (/(pending|draft|review|probation|scheduled|in progress|notice|nomination|screening|interview|offer|open)/.test(s)) return 'warning';
    if (/(rejected|absent|expired|non-compliant|suspended|escalated|cancelled|needs repair|failed|lost|not compliant)/.test(s)) return 'danger';
    if (/(on leave|week off|half day|late|in stock|allocated|deployed|rotational)/.test(s)) return 'info';
    return 'neutral';
  }
  function badge(status) {
    return '<span class="badge badge--' + statusTone(status) + '"><i class="dot"></i>' + esc(status || '—') + '</span>';
  }
  function qs(sel, root) { return (root || document).querySelector(sel); }
  function qsa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function on(root, evt, sel, handler) {
    root.addEventListener(evt, function (e) {
      var t = e.target.closest(sel);
      if (t && root.contains(t)) handler.call(t, e, t);
    });
  }

  HRMS.Util = {
    esc: esc, fmtCurrency: fmtCurrency, fmtDate: fmtDate, fmtDateTime: fmtDateTime,
    timeAgo: timeAgo, initials: initials, avatar: avatar, avatarColor: avatarColor,
    uid: uid, debounce: debounce, sortBy: sortBy, paginate: paginate, groupBy: groupBy,
    toCSV: toCSV, download: download, parseCSV: parseCSV, statusTone: statusTone, badge: badge,
    qs: qs, qsa: qsa, on: on
  };
})(window.HRMS);