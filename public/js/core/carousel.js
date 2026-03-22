/**
 * Flat Carousel Manager
 * Wii U / IISU-inspired horizontal tile row with instant wrapping.
 */

const CarouselManager = {
  lastNavTime: 0,
  navCooldown: 200,
  currentIndex: 0,
  previousIndex: 0,
  tileSpacing: 190, // px between tile centers

  init: function() {
    this.tiles = Array.from(document.querySelectorAll('.grid-tile:not(.webm-tile)'));
    if (this.tiles.length === 0) return;

    this.setupInputs();
    this.setActive(0, true);
  },

  setupInputs: function() {
    document.addEventListener('keydown', (e) => {
      if (document.getElementById('auth-overlay').style.display !== 'none') return;
      if (document.body.classList.contains('app-open-active')) return;
      if (document.querySelector('.mii-fullscreen-container')) return;

      if (e.key === 'ArrowRight') {
        this.next();
        if (typeof AudioManager !== 'undefined') AudioManager.playClick();
      } else if (e.key === 'ArrowLeft') {
        this.prev();
        if (typeof AudioManager !== 'undefined') AudioManager.playClick();
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.tiles[this.currentIndex].click();
      }
    });

    // Mouse wheel
    window.addEventListener('wheel', (e) => {
      if (document.getElementById('auth-overlay').style.display !== 'none') return;
      if (document.body.classList.contains('app-open-active')) return;
      if (document.querySelector('.mii-fullscreen-container')) return;
      if (Math.abs(e.deltaY) < 10) return;

      if (e.deltaY > 0) this.next();
      else this.prev();
    }, { passive: true });

    // On-screen arrows
    const btnPrev = document.getElementById('carousel-nav-prev');
    const btnNext = document.getElementById('carousel-nav-next');
    if (btnPrev) {
      btnPrev.addEventListener('click', (e) => {
        if (document.getElementById('auth-overlay').style.display !== 'none') return;
        e.stopPropagation();
        this.prev();
        if (typeof AudioManager !== 'undefined') AudioManager.playClick();
      });
    }
    if (btnNext) {
      btnNext.addEventListener('click', (e) => {
        if (document.getElementById('auth-overlay').style.display !== 'none') return;
        e.stopPropagation();
        this.next();
        if (typeof AudioManager !== 'undefined') AudioManager.playClick();
      });
    }

    // Click / hover
    this.tiles.forEach((tile, i) => {
      tile.addEventListener('click', (e) => {
        if (document.getElementById('auth-overlay').style.display !== 'none') return;
        if (this.currentIndex !== i) {
          e.preventDefault();
          this.setActive(i);
          if (typeof AudioManager !== 'undefined') AudioManager.playClick();
        } else {
          if (window.handleAppLaunch) {
            window.handleAppLaunch(tile);
          }
        }
      });

      tile.addEventListener('mouseenter', () => {
        if (document.getElementById('auth-overlay').style.display !== 'none') return;
        if (typeof AudioManager !== 'undefined') AudioManager.playClick();
      });
    });
  },

  next: function() {
    this.setActive((this.currentIndex + 1) % this.tiles.length);
  },

  prev: function() {
    this.setActive((this.currentIndex - 1 + this.tiles.length) % this.tiles.length);
  },

  setActive: function(index, force = false) {
    if (this.currentIndex === index && !force) return;

    this.previousIndex = this.currentIndex;
    this.currentIndex = index;
    this.lastNavTime = Date.now();
    this.update();

    // Update Floating Title Bubble with Fade Animation
    const tile = this.tiles[index];
    const title = tile.getAttribute('data-title');
    const titleText = document.getElementById('floating-title-text');
    const titlePill = document.getElementById('floating-title-pill');
    
    if (titlePill && titleText && title) {
      // Update app description if available
      const description = tile.getAttribute('data-description');
      const descBox = document.getElementById('app-description-box');
      const descText = document.getElementById('app-description-text');

      // Only animate if the title is actually changing
      if (titleText.textContent !== title) {
        titlePill.style.opacity = '0'; // force fade out
        if (descBox) descBox.style.opacity = '0';
        
        // Wait for fade out, change text, then fade in
        setTimeout(() => {
          titleText.textContent = title;
          titlePill.style.opacity = '1';
          titlePill.classList.remove('hidden');

          if (descBox && descText && description) {
            descText.textContent = description;
            descBox.classList.remove('hidden');
            descBox.style.opacity = '1';
          } else if (descBox) {
            descBox.classList.add('hidden');
          }
        }, 150); // Fast 150ms fade
      } else {
        titlePill.style.opacity = '1';
        titlePill.classList.remove('hidden');
        if (descBox && description) {
          descBox.classList.remove('hidden');
          descBox.style.opacity = '1';
          if (descText) descText.textContent = description;
        }
      }
    }

    // Update Global Accent Color
    if (window.setGlobalHueFromIndex) {
      window.setGlobalHueFromIndex(index);
    }
  },

  /**
   * Calculates the circular offset for tile `i` relative to `currentIndex`.
   * Returns a value in [-total/2, total/2].
   */
  _circularOffset: function(i, centerIndex) {
    const total = this.tiles.length;
    let offset = i - centerIndex;
    if (offset > total / 2) offset -= total;
    if (offset < -total / 2) offset += total;
    return offset;
  },

  update: function() {
    const total = this.tiles.length;

    this.tiles.forEach((tile, i) => {
      const newOffset = this._circularOffset(i, this.currentIndex);
      const oldOffset = this._circularOffset(i, this.previousIndex);

      // Detect wrapping: if the offset jumped by more than half the total, it wrapped
      const didWrap = Math.abs(newOffset - oldOffset) > total / 2;

      if (didWrap) {
        // Temporarily kill the CSS transition so it teleports
        tile.style.transition = 'none';
      }

      // Positioning: flat horizontal row
      const x = newOffset * this.tileSpacing;
      const isActive = (i === this.currentIndex);

      // Scale: active = 1.4, neighbors = 0.95, far = 0.88
      const absOffset = Math.abs(newOffset);
      let scale;
      if (isActive) {
        scale = 1.4;
      } else if (absOffset <= 1) {
        scale = 0.95;
      } else if (absOffset <= 2) {
        scale = 0.88;
      } else {
        scale = Math.max(0.7, 0.88 - (absOffset - 2) * 0.05);
      }

      // Opacity
      const opacity = isActive ? 1 : Math.max(0.15, 1 - absOffset * 0.2);

      // Apply transform
      tile.style.transform = `translate3d(${x}px, 0, 0) scale(${scale})`;
      tile.style.zIndex = isActive ? 100 : Math.max(1, 50 - Math.round(absOffset * 10));
      tile.style.opacity = opacity;
      tile.style.pointerEvents = opacity < 0.15 ? 'none' : 'auto';

      // Active class
      if (isActive) {
        tile.classList.add('active-carousel-tile');
      } else {
        tile.classList.remove('active-carousel-tile');
      }

      // If we killed the transition for wrapping, restore it after the browser processes the new position
      if (didWrap) {
        // Force a reflow so the browser applies the position without transition
        void tile.offsetWidth;
        // Restore transition
        tile.style.transition = '';
      }
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  CarouselManager.init();
});
