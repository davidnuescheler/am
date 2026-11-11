import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

async function publishPage(ref, pathname, status) {
  const path = `/davidnuescheler/am/${ref}${pathname}`;
  status.textContent = `Updating preview for ${pathname}...`;
  const preview = await fetch(`https://admin.hlx.page/preview${path}`, {
    method: 'POST',
    credentials: 'include',
  });
  if (!preview.ok) throw new Error(`Preview of ${pathname} failed (HTTP ${preview.status}).`);

  status.textContent = `Publishing ${pathname}...`;
  const published = await fetch(`https://admin.hlx.page/live${path}`, {
    method: 'POST',
    credentials: 'include',
  });
  if (!published.ok) throw new Error(`Publish of ${pathname} failed (HTTP ${published.status}).`);
}

function addPublishButton(footer) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = 'Publish';
  const status = document.createElement('p');
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  footer.append(button, status);

  button.addEventListener('click', async () => {
    if (button.disabled) return;
    button.disabled = true;
    const ref = window.location.hostname.match(/^(.+)--am--davidnuescheler\.(?:aem|hlx)\.(?:page|live)$/)?.[1] || 'main';
    const { pathname } = window.location;
    try {
      await publishPage(ref, pathname, status);
      if (pathname === '/catalog') {
        await publishPage(ref, '/passwords.json', status);
      }
      status.textContent = pathname === '/catalog'
        ? 'Catalog and passwords.json published successfully.'
        : 'Page published successfully.';
      window.location.reload();
    } catch (error) {
      status.textContent = `Publishing did not complete. ${error.message} Check your AEM admin sign-in and publishing permissions, then try again.`;
    } finally {
      button.disabled = false;
    }
  });
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  if (fragment) {
    while (fragment.firstElementChild) footer.append(fragment.firstElementChild);
  }

  addPublishButton(footer);
  block.append(footer);
}
