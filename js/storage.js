window.HRMS = window.HRMS || {};
(function (HRMS) {
  'use strict';
  var NS = 'uhrms:';
  HRMS.Storage = {
    get: function (key, fallback) {
      try {
        var raw = localStorage.getItem(NS + key);
        return raw === null ? fallback : JSON.parse(raw);
      } catch (e) { console.warn('[storage] read failed:', key, e); return fallback; }
    },
    set: function (key, value) {
      try { localStorage.setItem(NS + key, JSON.stringify(value)); return true; }
      catch (e) { console.warn('[storage] write failed:', key, e); return false; }
    },
    remove: function (key) { localStorage.removeItem(NS + key); },
    clearAll: function () {
      Object.keys(localStorage).filter(function (k) { return k.indexOf(NS) === 0; })
        .forEach(function (k) { localStorage.removeItem(k); });
    }
  };
})(window.HRMS);