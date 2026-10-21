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
      status.textContent = 'Спасибо! Заявка принята. Мы свяжемся с вами для уточнения задачи.\nДемо-режим: данные не переданы, пока не подключён канал отправки.';
    });
  }
})();
