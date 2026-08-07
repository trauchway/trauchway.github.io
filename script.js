// Stamps today's date into the footer title block, like a drawing revision date.
document.addEventListener('DOMContentLoaded', () => {
  const rev = document.getElementById('rev-date');
  if (rev) {
    const d = new Date();
    rev.textContent = d.toISOString().slice(0, 10);
  }
});

// Click-to-expand lightbox for project photo grids and cover shots.
// Applies automatically to any current or future page using these classes.
document.addEventListener('DOMContentLoaded', () => {
  const zoomable = document.querySelectorAll('.photo-grid img, .cover-shot img');
  if (!zoomable.length) return;

  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <button class="lightbox-close" aria-label="Close image">&#10005;</button>
    <figure class="lightbox-figure">
      <img class="lightbox-img" src="" alt="">
      <figcaption class="lightbox-caption"></figcaption>
    </figure>
  `;
  document.body.appendChild(lightbox);

  const lbImg = lightbox.querySelector('.lightbox-img');
  const lbCaption = lightbox.querySelector('.lightbox-caption');
  const closeBtn = lightbox.querySelector('.lightbox-close');

  function openLightbox(img) {
    lbImg.src = img.src;
    lbImg.alt = img.alt || '';
    const figcaption = img.closest('figure')?.querySelector('figcaption');
    lbCaption.textContent = figcaption ? figcaption.textContent.trim() : '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  zoomable.forEach((img) => {
    img.addEventListener('click', () => openLightbox(img));
  });
  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
});
