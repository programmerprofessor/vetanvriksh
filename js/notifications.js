window.HRMS = window.HRMS || {};
(function (HRMS) {
  'use strict';

  var ICONS = { success: '✓', error: '✕', warning: '!', info: 'i' };

  function toast(message, type, title) {
    type = type || 'info';
    var root = document.getElementById('toast-root');
    if (!root) return;
    var el = document.createElement('div');
    el.className = 'toast toast--' + type;
    el.innerHTML =
      '<div class="toast__body"><strong>' + HRMS.Util.esc(title || (type === 'success' ? 'Success' : type === 'error' ? 'Error' : 'Notice')) + '</strong>' +
      '<span>' + HRMS.Util.esc(message) + '</span></div>' +
      '<button class="icon-btn btn--sm" aria-label="Dismiss">' + ICONS[type] + '</button>';
    root.appendChild(el);
    var remove = function () { if (el.parentNode) el.parentNode.removeChild(el); };
    el.querySelector('button').addEventListener('click', remove);
    setTimeout(remove, 4200);
  }

  HRMS.Toast = {
    success: function (m, t) { toast(m, 'success', t); },
    error: function (m, t) { toast(m, 'error', t); },
    warning: function (m, t) { toast(m, 'warning', t); },
    info: function (m, t) { toast(m, 'info', t); }
  };
})(window.HRMS);