window.HRMS = window.HRMS || {};
(function (HRMS) {
  'use strict';

  var routes = [];
  var current = { path: '/dashboard', params: {}, query: {} };

  function parseHash() {
    var raw = (window.location.hash || '#/dashboard').replace(/^#/, '');
    var qIdx = raw.indexOf('?');
    var query = {};
    if (qIdx > -1) {
      raw.slice(qIdx + 1).split('&').forEach(function (p) {
        var kv = p.split('=');
        if (kv[0]) query[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1] || '');
      });
      raw = raw.slice(0, qIdx);
    }
    if (raw.charAt(0) !== '/') raw = '/' + raw;
    return { path: raw.replace(/\/+$/, '') || '/', query: query };
  }

  function match(path) {
    var segs = path.split('/').filter(Boolean);
    for (var i = 0; i < routes.length; i++) {
      var r = routes[i];
      var rSegs = r.path.split('/').filter(Boolean);
      if (rSegs.length !== segs.length) continue;
      var params = {}, ok = true;
      for (var j = 0; j < rSegs.length; j++) {
        if (rSegs[j].charAt(0) === ':') params[rSegs[j].slice(1)] = decodeURIComponent(segs[j]);
        else if (rSegs[j] !== segs[j]) { ok = false; break; }
      }
      if (ok) return { route: r, params: params };
    }
    return null;
  }

  function render(path, query) {
    var view = document.getElementById('view');
    
    // Show skeleton loader for realistic feel
    view.innerHTML = '<div class="skeleton skeleton-line" style="width:30%;height:24px;margin-bottom:20px"></div>' +
                     '<div class="card"><div class="card__body">' +
                     '<div class="skeleton skeleton-line"></div>'.repeat(5) + '</div></div>';

    setTimeout(function() {
      var found = match(path);
      
      // Security Bypass Check
      if (found && !HRMS.Permissions.can(path)) {
        view.innerHTML = HRMS.UI.emptyState({
          icon: 'shield', title: 'Access Denied',
          message: 'Your current role (' + HRMS.State.session.role + ') does not have permission to view this module.',
          action: '<a class="btn btn--primary" href="#/dashboard">Return to Dashboard</a>'
        });
        return;
      }

      if (!found) {
        view.innerHTML = HRMS.UI.emptyState({
          icon: 'search', title: 'Page not found',
          message: 'The route "' + path + '" does not exist in this prototype.',
          action: '<a class="btn btn--primary" href="#/dashboard">Back to Dashboard</a>'
        });
        return;
      }
      
      current = { path: path, params: found.params, query: query || {} };
      try {
        found.route.handler({ params: found.params, query: query || {}, path: path });
      } catch (err) {
        console.error('[router] render error', err);
        view.innerHTML = HRMS.UI.emptyState({
          icon: 'x', title: 'Something went wrong',
          message: 'This screen failed to render. Check the browser console for details.'
        });
      }
      HRMS.Navigation.syncActive(path);
      window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
    }, 250);
  }

  HRMS.Router = {
    register: function (path, handler) { routes.push({ path: path, handler: handler }); },
    go: function (path) {
      if (window.location.hash.replace(/^#/, '') === path) {
        var h = parseHash();
        render(h.path, h.query);
      } else {
        window.location.hash = path;
      }
    },
    current: function () { return current; },
    refresh: function () {
      var h = parseHash();
      render(h.path, h.query);
    },
    start: function () {
      window.addEventListener('hashchange', function () {
        var h = parseHash();
        render(h.path, h.query);
      });
      var h = parseHash();
      render(h.path, h.query);
    }
  };
})(window.HRMS);