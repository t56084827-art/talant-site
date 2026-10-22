(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#primary-nav');
  const form = document.querySelector('#request-form');
  const status = document.querySelector('#form-status');
  const year = document.querySelector('#current-year');
  const requestIntent = form?.querySelector('[name="request_intent"]');

  if (year) year.textContent = String(new Date().getFullYear());

  document.querySelectorAll('[data-request-intent]').forEach((link) => {
    link.addEventListener('click', () => {
      if (requestIntent) requestIntent.value = link.dataset.requestIntent || 'Расчёт';
    });
  });

  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!open));
      menuButton.setAttribute('aria-label', open ? 'Открыть меню' : 'Закрыть меню');
      nav.classList.toggle('is-open', !open);
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', 'Открыть меню');
        nav.classList.remove('is-open');
      });
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', 'Открыть меню');
        nav.classList.remove('is-open');
        menuButton.focus();
      }
    });
  }

  if (form && status) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      const lead = Object.fromEntries(new FormData(form).entries());
      document.dispatchEvent(new CustomEvent('talant:lead-submit', { detail: lead }));
      const message = [
        'Здравствуйте! Хочу получить расчёт от BusinessKingdom.',
        `Имя: ${lead.name}`,
        `Телефон / WhatsApp: ${lead.phone}`,
        `Что требуется: ${lead.scope}`,
        `Описание задачи: ${lead.message}`,
        lead.request_intent ? `Тема обращения: ${lead.request_intent}` : ''
      ].filter(Boolean).join('\n');
      const whatsappUrl = `https://wa.me/77084402007?text=${encodeURIComponent(message)}`;
      const whatsappWindow = window.open(whatsappUrl, '_blank');

      if (whatsappWindow) {
        whatsappWindow.opener = null;
        status.textContent = 'WhatsApp открылся с заполненным сообщением. Проверьте его и нажмите «Отправить».';
      } else {
        const link = document.createElement('a');
        link.href = whatsappUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = 'Открыть подготовленное сообщение в WhatsApp';
        status.replaceChildren(document.createTextNode('Браузер заблокировал новое окно. '), link);
      }
    });
  }
})();
