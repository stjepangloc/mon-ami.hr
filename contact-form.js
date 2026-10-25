(() => {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('contact-status');
  const button = form.querySelector('button[type="submit"]');
  const label = button.innerHTML;
  let sending = false;

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (sending || !form.reportValidity()) return;

    const body = new FormData(form);
    sending = true;
    button.disabled = true;
    button.textContent = 'Slanje…';
    form.setAttribute('aria-busy', 'true');
    status.dataset.state = 'pending';
    status.textContent = 'Vaš upit se šalje…';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body,
        headers: { Accept: 'application/json' },
        signal: controller.signal
      });
      if (!response.ok) {
        status.dataset.state = 'error';
        status.textContent = response.status === 429
          ? 'Trenutačno nije moguće poslati upit. Pokušajte kasnije ili nam pišite na info@mon-ami.hr. Vaši podaci ostaju u obrascu.'
          : 'Upit nije prihvaćen. Pokušajte ponovno ili nam pišite na info@mon-ami.hr. Vaši podaci ostaju u obrascu.';
        return;
      }
      form.reset();
      status.dataset.state = 'success';
      status.textContent = 'Vaš upit je uspješno poslan. Hvala vam! Javit ćemo vam se uskoro.';
    } catch {
      status.dataset.state = 'error';
      status.textContent = 'Nismo mogli potvrditi slanje upita. Provjerite internetsku vezu ili nam pišite na info@mon-ami.hr. Vaši podaci ostaju u obrascu.';
    } finally {
      clearTimeout(timeout);
      sending = false;
      button.disabled = false;
      button.innerHTML = label;
      form.removeAttribute('aria-busy');
    }
  });
})();
