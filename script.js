/* script.js
   - Modal: muestra imagen grande (data-large) y texto (data-info)
   - IntersectionObserver para reveal al hacer scroll
   - Accesibilidad: foco en close, cerrar con Esc y clic fuera
*/

document.addEventListener('DOMContentLoaded', () => {
  // Modal elements (se busca el primero en la página; cada página tiene su propio modal)
  const modal = document.getElementById('modal');
  const modalImg = document.getElementById('modalImg');
  const modalTitle = document.getElementById('modalTitle');
  const modalText = document.getElementById('modalText');
  const modalClose = document.querySelector('.modal-close');

  // Mostrar modal con datos desde la tarjeta
  function openModalFromCard(card) {
    const title = card.querySelector('h4')?.textContent || '';
    const info = card.dataset.info || '';
    const large = card.dataset.large || '';

    modalTitle.textContent = title;
    modalText.textContent = info;
    modalImg.src = large;
    modalImg.alt = title + ' — imagen ampliada';
    // show
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    // focus
    modalClose?.focus();
  }

  function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Event delegation: botones "Ver más" dentro de tarjetas
  document.body.addEventListener('click', e => {
    const btn = e.target.closest('[data-role="open"], .btn[data-role="open"], button[data-role="open"]');
    if (btn) {
      const card = btn.closest('.card');
      if (card) openModalFromCard(card);
    }
  });

  // Also open modal when pressing Enter while focused on card (a11y)
  document.body.addEventListener('keydown', e => {
    if (e.key === 'Enter' && document.activeElement && document.activeElement.classList.contains('card')) {
      openModalFromCard(document.activeElement);
    }
  });

  // Close controls
  modalClose?.addEventListener('click', closeModal);
  // click outside
  modal?.addEventListener('click', e => {
    if (e.target === modal) closeModal();
  });
  // Esc key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal && modal.getAttribute('aria-hidden') === 'false') {
      closeModal();
    }
  });

  // IntersectionObserver reveal
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // if you want once-only: observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // Graceful fallback: if modal not present or close missing, ignore
});

// ❤️ Like toggle
document.addEventListener('click', e => {
  const heart = e.target.closest('.btn-like');
  if (heart) {
    heart.classList.toggle('active');
    heart.textContent = heart.classList.contains('active') ? '❤️' : '🤍';
  }
});



