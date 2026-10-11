document.addEventListener('DOMContentLoaded', () => {
  const showNotice = (notice, message, isError = false) => {
    notice.textContent = message;
    notice.classList.toggle('is-error', isError);
    notice.hidden = false;
  };

  document.querySelectorAll('[data-password-toggle]').forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const input = document.getElementById(toggle.getAttribute('aria-controls'));
      const isPasswordVisible = input.type === 'text';
      input.type = isPasswordVisible ? 'password' : 'text';
      toggle.textContent = isPasswordVisible ? 'Tampilkan' : 'Sembunyikan';
      toggle.setAttribute('aria-label', isPasswordVisible ? 'Tampilkan kata sandi' : 'Sembunyikan kata sandi');
    });
  });

  document.querySelectorAll('[data-auth-form]').forEach((form) => {
    const notice = form.querySelector('[data-auth-notice]');
    const password = form.elements.password;
    const confirmation = form.elements['password-confirm'];

    const validatePasswordMatch = () => {
      if (!confirmation) return;
      const mismatch = confirmation.value.length > 0 && confirmation.value !== password.value;
      confirmation.setCustomValidity(mismatch ? 'Konfirmasi kata sandi belum sama.' : '');
      if (mismatch) confirmation.setAttribute('aria-invalid', 'true');
      else confirmation.removeAttribute('aria-invalid');
    };

    password.addEventListener('input', validatePasswordMatch);
    confirmation?.addEventListener('input', validatePasswordMatch);

    form.addEventListener('input', () => {
      notice.hidden = true;
      notice.classList.remove('is-error');
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      validatePasswordMatch();
      if (!form.reportValidity()) return;

      if (form.dataset.authMode === 'login') {
        window.location.href = 'dashboard.html';
        return;
      }

      const message = form.dataset.authMode === 'register'
        ? 'Data pendaftaran valid. Hubungkan layanan autentikasi untuk membuat akun.'
        : 'Data masuk valid. Hubungkan layanan autentikasi untuk melanjutkan.';
      showNotice(notice, message);
    });
  });

  document.querySelectorAll('[data-google-signin]').forEach((button) => {
    button.addEventListener('click', () => {
      if (document.querySelector('[data-auth-mode="login"]')) {
        window.location.href = 'dashboard.html';
        return;
      }

      const notice = document.querySelector('[data-auth-notice]');
      showNotice(notice, 'Google Sign-In memerlukan konfigurasi OAuth.', true);
    });
  });
});
