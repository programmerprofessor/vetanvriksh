(function (HRMS) {
  'use strict';

  function boot() {
    // 1. Initialize State first
    HRMS.State.init();
    
    // 2. Check Authentication
    if (!HRMS.State.session.isAuthenticated) {
      HRMS.Modules.Login.render();
      return; // Stop execution. Login.js will call boot() again upon success.
    }

    // 3. Render App Shell
    HRMS.Navigation.renderShell();

    // 4. Register Routes
    HRMS.Modules.Dashboard.register();
    HRMS.Modules.Employees.register();
    HRMS.Modules.Entity.registerAll();
    HRMS.Modules.Reports.register();
    HRMS.Modules.Settings.register();

    // 5. Start Router
    HRMS.Router.start();

    /* keep header in sync when state changes from anywhere */
    HRMS.State.subscribe(function () {
      HRMS.Navigation.syncActive(HRMS.Router.current().path);
    });

    /* close mobile sidebar on navigation */
    window.addEventListener('hashchange', function () {
      var sb = document.getElementById('sidebar');
      if (sb) sb.classList.remove('is-open');
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        var s = document.getElementById('global-search');
        if (s) s.focus();
      }
    });

    console.log('%cHRMS prototype ready', 'color:#2f5de3;font-weight:700');
  }

  // Expose boot so the login module can call it
  HRMS.App = { boot: boot };

  // Initial execution
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})(window.HRMS);