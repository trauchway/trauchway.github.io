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

// ============ HERO VIDEO REEL ============
// Plays a looping, cross-fading sequence of whatever clips exist in
// assets/homescreen_media. The playlist is discovered at runtime via the
// GitHub API against main, so dropping a new video in that folder and
// pushing is the only step needed — nothing to rebuild or hand-edit here.
// If the API is unreachable (offline, rate-limited, GitHub down) this falls
// back to a hardcoded file list; if that also comes up empty, the section
// just keeps its plain dark background — the hero never breaks.
document.addEventListener('DOMContentLoaded', () => {
  const reel = document.getElementById('heroReel');
  if (!reel) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const prefersReducedData = navigator.connection && navigator.connection.saveData;
  if (prefersReducedMotion || prefersReducedData) return;

  const MEDIA_DIR = 'assets/homescreen_media';
  const API_URL = `https://api.github.com/repos/trauchway/trauchway.github.io/contents/${MEDIA_DIR}?ref=main`;
  const VIDEO_EXT = /\.(mp4|webm|m4v)$/i;
  // Keep roughly in sync with the folder; only used if the API call above fails.
  const FALLBACK_FILES = ['IMG_0205.mp4', 'IMG_2823.mp4', 'IMG_3006.mp4', 'IMG_3358.mp4', 'IMG_4374.mp4', 'uav-flight-video.mp4'];
  const CROSSFADE_SEC = 1.1;

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  async function getPlaylist() {
    try {
      const res = await fetch(API_URL, { headers: { Accept: 'application/vnd.github+json' } });
      if (!res.ok) throw new Error(`GitHub API responded ${res.status}`);
      const items = await res.json();
      const files = items
        .filter((it) => it.type === 'file' && VIDEO_EXT.test(it.name))
        .map((it) => it.name);
      if (!files.length) throw new Error('folder listing had no video files');
      return files;
    } catch (err) {
      console.warn('Hero reel: GitHub API lookup failed, using fallback list —', err.message);
      return FALLBACK_FILES.slice();
    }
  }

  getPlaylist().then((files) => {
    const playlist = shuffle(files).map((name) => `${MEDIA_DIR}/${name}`);
    if (!playlist.length) return;

    const els = [reel.querySelector('.is-front'), reel.querySelector('.is-back')];
    let activeSlot = 0;
    let cursor = 0;
    let crossfading = false;
    let errorStreak = 0;

    function loadInto(el, src) {
      el.pause();
      el.src = src;
      el.load();
    }

    function playSlot(slot) {
      const p = els[slot].play();
      if (p && p.catch) p.catch(() => {});
    }

    function crossfadeToNext() {
      if (crossfading || errorStreak > playlist.length) return;
      crossfading = true;
      const nextSlot = activeSlot === 0 ? 1 : 0;
      cursor = (cursor + 1) % playlist.length;
      loadInto(els[nextSlot], playlist[cursor]);
      playSlot(nextSlot);
      els[nextSlot].classList.add('is-active');
      els[activeSlot].classList.remove('is-active');
      const finishedSlot = activeSlot;
      activeSlot = nextSlot;
      setTimeout(() => {
        els[finishedSlot].pause();
        crossfading = false;
      }, CROSSFADE_SEC * 1000);
    }

    els.forEach((el) => {
      el.addEventListener('timeupdate', () => {
        if (crossfading || el !== els[activeSlot]) return;
        if (!isFinite(el.duration) || el.duration < CROSSFADE_SEC * 2) return;
        if (el.currentTime >= el.duration - CROSSFADE_SEC) crossfadeToNext();
      });
      // Catches very short clips that end before the timeupdate window above fires.
      el.addEventListener('ended', () => {
        if (el === els[activeSlot] && !crossfading) crossfadeToNext();
      });
      el.addEventListener('error', () => {
        if (el !== els[activeSlot]) return;
        errorStreak += 1;
        crossfadeToNext();
      });
      el.addEventListener('playing', () => { errorStreak = 0; });
    });

    loadInto(els[0], playlist[0]);
    els[0].classList.add('is-active');
    playSlot(0);
    reel.classList.add('is-ready');
  });
});
