(function () {
    var forms = { login: document.getElementById('loginForm'), register: document.getElementById('registerForm') },
        tabs = { login: document.getElementById('tab-login'), register: document.getElementById('tab-register') },
        emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    /* ---------- Validation ---------- */
    function check(input) {
        var v = input.value, rule = input.dataset.rule;
        if (rule === 'name') {
            if (!v.trim()) return 'Enter your full name.';
            if (v.trim().length < 2) return 'Name must be at least 2 characters.';
        }
        if (rule === 'email') {
            if (!v.trim()) return 'Enter your email address.';
            if (!emailRe.test(v.trim())) return 'Enter a valid email, like name@example.com.';
        }
        if (rule === 'password') {
            if (!v) return 'Enter your password.';
            if (v.length < 8) return 'Password must be at least 8 characters (' + v.length + ' so far).';
        }
        if (rule === 'confirm') {
            if (!v) return 'Confirm your password.';
            if (v !== document.getElementById(input.dataset.match).value) return 'Passwords do not match.';
        }
        return '';
    }

    function validate(input, show) {
        var msg = check(input), field = input.closest('.field'),
            err = document.getElementById(input.id + '-err') || field.querySelector('.error');
        if (!show) { return !msg }
        field.classList.toggle('invalid', !!msg);
        field.classList.toggle('valid', !msg && input.value !== '');
        input.setAttribute('aria-invalid', msg ? 'true' : 'false');
        err.textContent = msg;
        return !msg;
    }

    Object.keys(forms).forEach(function (name) {
        var form = forms[name];

        form.querySelectorAll('input').forEach(function (input) {
            input.addEventListener('input', function () {
                // real-time: validate as soon as the user has started typing
                validate(input, true);
                // keep confirm-password in sync when the password changes
                if (input.dataset.rule === 'password') {
                    var c = form.querySelector('[data-rule="confirm"]');
                    if (c && c.value !== '') validate(c, true);
                }
                form.querySelector('.status').textContent = '';
            });
            input.addEventListener('blur', function () {
                if (input.value !== '' || input.closest('.field').classList.contains('invalid')) validate(input, true);
            });
        });

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var first = null, ok = true;
            form.querySelectorAll('input').forEach(function (input) {
                if (!validate(input, true)) { ok = false; if (!first) first = input }
            });
            var status = form.querySelector('.status');
            if (!ok) { status.textContent = ''; first.focus(); return }
            status.textContent = (name === 'login') ? 'Login successful (demo only, nothing is sent).' : 'Account created (demo only, nothing is sent).';
            form.reset();
            form.querySelectorAll('.field').forEach(function (f) { f.classList.remove('valid', 'invalid') });
            form.querySelectorAll('input').forEach(function (i) { i.removeAttribute('aria-invalid') });
            form.querySelectorAll('.pw-btn').forEach(function (b) { hide(b) });
        });
    });

    /* ---------- Password show / hide ---------- */
    function hide(btn) {
        var input = btn.parentNode.querySelector('input');
        input.type = 'password'; btn.textContent = 'Show'; btn.setAttribute('aria-pressed', 'false'); btn.setAttribute('aria-label', 'Show password');
    }
    document.querySelectorAll('.pw-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var input = btn.parentNode.querySelector('input'), show = input.type === 'password';
            input.type = show ? 'text' : 'password';
            btn.textContent = show ? 'Hide' : 'Show';
            btn.setAttribute('aria-pressed', show);
            btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
        });
    });

    /* ---------- Switch Login / Register ---------- */
    function show(which, focusTab) {
        Object.keys(forms).forEach(function (k) {
            var on = (k === which);
            forms[k].hidden = !on;
            tabs[k].setAttribute('aria-selected', on);
            tabs[k].tabIndex = on ? 0 : -1;
        });
        if (focusTab) tabs[which].focus();
    }
    Object.keys(tabs).forEach(function (k) {
        tabs[k].addEventListener('click', function () { show(k) });
        tabs[k].addEventListener('keydown', function (e) {
            if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { show(k === 'login' ? 'register' : 'login', true) }
        });
    });
    document.querySelectorAll('[data-go]').forEach(function (b) {
        b.addEventListener('click', function () { show(b.dataset.go) });
    });

    document.getElementById('theme').addEventListener('click', function () {
        var r = document.documentElement,
            dark = r.getAttribute('data-theme') === 'dark' || (!r.getAttribute('data-theme') && matchMedia('(prefers-color-scheme: dark)').matches);
        r.setAttribute('data-theme', dark ? 'light' : 'dark');
    });
})();