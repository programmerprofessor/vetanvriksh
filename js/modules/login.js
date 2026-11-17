window.HRMS = window.HRMS || {};
(function (HRMS) {
  'use strict';
  var U = HRMS.Util, S = HRMS.State;

  function render() {
    var app = document.getElementById('app');
    app.style.display = 'none'; // Hide main app

    var loginHtml = `
      <div class="login-wrapper" id="login-wrapper">
        <div class="login-card">
          <div class="login-header">
            <div class="login-logo">NX</div>
            <h2>Welcome back</h2>
            <p>Sign in to Nexus Universal HRMS</p>
          </div>
          
          <form class="login-form" id="login-form">
            <div class="field">
              <label for="login-email">Email address</label>
              <input class="input" type="email" id="login-email" placeholder="name@nexus.example" required>
            </div>
            <div class="field">
              <label for="login-password">Password</label>
              <input class="input" type="password" id="login-password" placeholder="••••••••" required>
            </div>
            <button class="btn btn--primary" style="width:100%; height:38px" type="submit">Sign In</button>
          </form>

          <div class="login-demo">
            <p style="margin-bottom:12px; font-weight:600; color:var(--c-text)">Quick Demo Login</p>
            <div class="row" style="justify-content:center">
              <button class="btn btn--sm" data-quick-role="HR Admin">HR Admin</button>
              <button class="btn btn--sm" data-quick-role="Manager">Manager</button>
              <button class="btn btn--sm" data-quick-role="Employee">Employee</button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', loginHtml);

    // Handle Form Submit
    document.getElementById('login-form').addEventListener('submit', function(e) {
      e.preventDefault();
      var email = document.getElementById('login-email').value;
      if (!email) return;
      
      // Simulate authentication delay
      var btn = this.querySelector('button[type="submit"]');
      var origText = btn.textContent;
      btn.textContent = 'Signing in...';
      btn.disabled = true;

      setTimeout(function() {
        S.login('HR Admin'); // Default role for typed email
        document.getElementById('login-wrapper').remove();
        app.style.display = 'flex';
        HRMS.App.boot();
      }, 600);
    });

    // Handle Quick Logins
    document.querySelectorAll('[data-quick-role]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var role = this.getAttribute('data-quick-role');
        S.login(role);
        document.getElementById('login-wrapper').remove();
        app.style.display = 'flex';
        HRMS.App.boot();
      });
    });
  }

  HRMS.Modules = HRMS.Modules || {};
  HRMS.Modules.Login = { render: render };
})(window.HRMS);