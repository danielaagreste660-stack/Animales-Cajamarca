// script.js - modal, reveal on scroll, likes sync, placeholder handled via onerror in img
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('modal');
  const modalImg = document.getElementById('modalImg');
  const modalTitle = document.getElementById('modalTitle');
  const modalText = document.getElementById('modalText');
  const modalLike = document.getElementById('modalLike');
  const modalCloseBtn = document.querySelector('.modal-close');

  // Helper para actualizar estado visual de like en un botón
  function setLikeButton(btn, liked) {
    if (liked) {
      btn.classList.add('active');
      btn.textContent = '❤️';
      btn.setAttribute('aria-pressed', 'true');
    } else {
      btn.classList.remove('active');
      btn.textContent = '🤍';
      btn.setAttribute('aria-pressed', 'false');
    }
  }

  // Inicializa estado de likes desde data-liked (si existe)
  document.querySelectorAll('.card').forEach(card => {
    const likeBtn = card.querySelector('.btn-like');
    const liked = card.dataset.liked === 'true';
    setLikeButton(likeBtn, liked);
  });

  // Manejar apertura de modal
  document.querySelectorAll('[data-role="open"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = e.target.closest('.card');
      if (!card) return;
      const img = card.querySelector('.card-img');
      modalImg.src = card.dataset.large || img.src;
      modalImg.alt = card.querySelector('h4')?.textContent || img.alt || '';
      modalTitle.textContent = card.querySelector('h4')?.textContent || '';
      modalText.textContent = card.dataset.info || '';
      modal.dataset.sourceId = card.dataset.id || '';
      // sincroniza like del modal con la tarjeta
      const cardLikeBtn = card.querySelector('.btn-like');
      setLikeButton(modalLike, cardLikeBtn.classList.contains('active'));
      modal.setAttribute('aria-hidden', 'false');
      // focus for accessibility
      modalCloseBtn.focus();
    });
  });

  // Cerrar modal
  function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
    modal.dataset.sourceId = '';
  }
  modalCloseBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // Toggle like en tarjetas - sincroniza dataset.liked
  document.querySelectorAll('.card .btn-like').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = e.currentTarget.closest('.card');
      const liked = !card.dataset.liked || card.dataset.liked === 'false' ? true : false;
      card.dataset.liked = liked.toString();
      setLikeButton(e.currentTarget, liked);
      // if modal open and source matches, sync modal like
      if (modal.dataset.sourceId === card.dataset.id) {
        setLikeButton(modalLike, liked);
      }
    });
  });

  // Like dentro del modal: sincroniza con la tarjeta origen
  modalLike.addEventListener('click', () => {
    const srcId = modal.dataset.sourceId;
    const sourceCard = document.querySelector(`.card[data-id="${srcId}"]`);
    const currentlyLiked = modalLike.classList.contains('active');
    const newLiked = !currentlyLiked;
    setLikeButton(modalLike, newLiked);
    if (sourceCard) {
      const cardLikeBtn = sourceCard.querySelector('.btn-like');
      sourceCard.dataset.liked = newLiked.toString();
      setLikeButton(cardLikeBtn, newLiked);
    }
  });

  // Reveal on scroll
  const revealEls = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // optionally unobserve to animate once
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => observer.observe(el));

  // Accessibility: open card modal on Enter when focused
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const openBtn = card.querySelector('[data-role="open"]');
        if (openBtn) openBtn.click();
      }
    });
  });
});
