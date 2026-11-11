const STORAGE_KEY = 'catalog-login';

async function checkAccessCode(accessCode) {
  const response = await fetch('/passwords.json', { cache: 'no-store' });
  if (!response.ok) throw new Error('Unable to load catalog credentials');
  const sheet = await response.json();
  if (!Array.isArray(sheet?.data) || !sheet.data.every((row) => (
    row && typeof row.Password === 'string'
  ))) {
    throw new Error('Invalid catalog credentials response');
  }
  return sheet.data.some((row) => row.Password === accessCode);
}

export default function requireCatalogLogin() {
  const dialog = document.createElement('dialog');
  dialog.className = 'catalog-login';
  dialog.setAttribute('aria-labelledby', 'catalog-login-title');
  dialog.innerHTML = `
    <form>
      <h2 id="catalog-login-title">Catalog access</h2>
      <label for="catalog-password">Access code</label>
      <input id="catalog-password" name="password" type="password"
        autocomplete="current-password" required>
      <p class="catalog-login-status" role="status" aria-live="polite"></p>
      <button type="submit">Continue</button>
    </form>
  `;
  const form = dialog.querySelector('form');
  const password = form.elements.namedItem('password');
  const button = form.querySelector('button');
  const status = form.querySelector('[role="status"]');
  dialog.addEventListener('cancel', (event) => event.preventDefault());
  document.body.append(dialog);
  document.body.classList.add('catalog-login-open');
  dialog.showModal();

  return new Promise((resolve) => {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (button.disabled) return;
      button.disabled = true;
      status.textContent = 'Checking access code...';
      let valid;
      try {
        valid = await checkAccessCode(password.value);
      } catch {
        status.textContent = 'Access-code validation is unavailable. Please try again.';
        button.disabled = false;
        return;
      }
      if (!valid) {
        status.textContent = 'Incorrect access code.';
        password.focus();
        button.disabled = false;
        return;
      }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          password: password.value,
        }));
      } catch {
        status.textContent = 'Unable to save access code. Please enable local storage and try again.';
        button.disabled = false;
        return;
      }
      password.value = '';
      dialog.close();
      dialog.remove();
      document.body.classList.remove('catalog-login-open');
      resolve();
    });

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const credentials = JSON.parse(saved);
        if (typeof credentials?.password !== 'string') {
          throw new Error('Invalid saved catalog login');
        }
        password.value = credentials.password;
        form.requestSubmit();
      }
    } catch {
      status.textContent = 'Unable to read saved access code. Please enter it again.';
    }
  });
}
