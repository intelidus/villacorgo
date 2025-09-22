// Villa Corgo — Interações
(function () {
  const doc = document;

  // Mobile nav toggle
  const toggleButton = doc.querySelector('.nav-toggle');
  const menu = doc.querySelector('#primary-menu');
  if (toggleButton && menu) {
    toggleButton.addEventListener('click', () => {
      const expanded = toggleButton.getAttribute('aria-expanded') === 'true';
      toggleButton.setAttribute('aria-expanded', String(!expanded));
      menu.classList.toggle('open');
    });

    // Close when clicking a link
    menu.addEventListener('click', (e) => {
      const target = e.target;
      if (target && target.tagName === 'A') {
        menu.classList.remove('open');
        toggleButton.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Smooth scrolling for in-page links
  doc.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;
    const href = anchor.getAttribute('href');
    if (!href || href === '#' || href.length < 2) return;
    const el = doc.querySelector(href);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // Lead form handling (demo only)
  const form = doc.getElementById('lead-form');
  const feedback = doc.querySelector('.form-feedback');
  if (form && feedback) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const payload = Object.fromEntries(data.entries());

      // Basic validation
      if (!payload.nome || !payload.email) {
        feedback.hidden = false;
        feedback.textContent = 'Por favor, preencha Nome e Email.';
        feedback.style.color = '#ffb3b3';
        return;
      }

      // Simulate submission (replace with real endpoint)
      try {
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'A enviar...';
        await new Promise((r) => setTimeout(r, 900));
        feedback.hidden = false;
        feedback.style.color = '';
        feedback.textContent = 'Obrigado! Entraremos em contacto brevemente.';
        form.reset();
        submitButton.disabled = false;
        submitButton.textContent = originalText;
      } catch (err) {
        feedback.hidden = false;
        feedback.style.color = '#ffb3b3';
        feedback.textContent = 'Ocorreu um erro. Tente novamente.';
      }
    });
  }
})();

