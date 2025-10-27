// aves.js - modal, reveal on scroll, likes sync, placeholder handled via img onerror
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('modal');
  const modalImg = document.getElementById('modalImg');
  const modalTitle = document.getElementById('modalTitle');
  const modalText = document.getElementById('modalText');
  const modalLike = document.getElementById('modalLike');
  const modalCloseBtn = document.querySelector('.modal-close');

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

  // Initialize likes (if data-liked present)
  document.querySelectorAll('.card').forEach(card => {
    const likeBtn = card.querySelector('.btn-like');
    const liked = card.dataset.liked === 'true';
    setLikeButton(likeBtn, liked);
  });

  // Open modal
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
      // sync like
      const cardLikeBtn = card.querySelector('.btn-like');
      setLikeButton(modalLike, cardLikeBtn.classList.contains('active'));
      modal.setAttribute('aria-hidden', 'false');
      modalCloseBtn.focus();
    });
  });

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

  // Card like toggle (sync with modal if open)
  document.querySelectorAll('.card .btn-like').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = e.currentTarget.closest('.card');
      const liked = !(card.dataset.liked === 'true');
      card.dataset.liked = liked.toString();
      setLikeButton(e.currentTarget, liked);
      if (modal.dataset.sourceId === card.dataset.id) {
        setLikeButton(modalLike, liked);
      }
    });
  });

  // Modal like toggles and syncs with source card
  modalLike.addEventListener('click', () => {
    const srcId = modal.dataset.sourceId;
    if (!srcId) {
      // toggle only modal
      const newModalLiked = !modalLike.classList.contains('active');
      setLikeButton(modalLike, newModalLiked);
      return;
    }
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
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => observer.observe(el));

  // Keyboard: open modal on Enter when card focused
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const openBtn = card.querySelector('[data-role="open"]');
        if (openBtn) openBtn.click();
      }
    });
  });
});
