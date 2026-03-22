/**
 * WindowManager handles opening, closing, dragging, and z-indexing
 * of the Frutiger Aero floating application panels.
 */
const WindowManager = {
  windows: {},
  zIndexCounter: 100,
  
  openWindow: function(appId, title, contentRenderFn) {
    if (typeof AudioManager !== 'undefined') AudioManager.playWindowOpen();
    
    // If window already open, focus it instead of duplicating
    if (this.windows[appId]) {
      this.focusWindow(appId);
      // add a little bounce effect on the existing window to feedback the click
      this.windows[appId].classList.remove('anim-pop');
      void this.windows[appId].offsetWidth; // trigger reflow
      this.windows[appId].classList.add('anim-pop');
      return;
    }
    
    const layer = document.getElementById('window-layer');
    
    // Create element
    const win = document.createElement('div');
    win.className = 'app-window';
    win.id = `window-${appId}`;
    
    this.zIndexCounter++;
    win.style.zIndex = this.zIndexCounter;
    
    layer.appendChild(win);
    this.windows[appId] = win;
    
    // Create inner body for animation decoupling
    win.innerHTML = `
      <div class="window-body glossy-panel open anim-window-open">
        <div class="window-header bar-glint">
          <span class="window-title">${title}</span>
          <button class="window-close-btn" aria-label="Close"></button>
        </div>
        <div class="window-content" id="content-${appId}">
          <!-- App content injected here -->
        </div>
      </div>
    `;
    
    const winBody = win.querySelector('.window-body');
    
    // Initial position
    const offset = (Object.keys(this.windows).length * 20) % 100;
    win.style.left = `calc(50% + ${offset}px)`;
    win.style.top = `calc(42% + ${offset}px)`;
    
    // Render the App Content
    const contentArea = winBody.querySelector(`#content-${appId}`);
    if (contentRenderFn) {
      contentRenderFn(contentArea);
    }
    
    // Event Listeners
    win.addEventListener('mousedown', () => this.focusWindow(appId));
    
    // Prevent scrolling inside the window from scrolling the carousel
    win.addEventListener('wheel', (e) => {
      e.stopPropagation();
    }, { passive: false });
    
    const closeBtn = winBody.querySelector('.window-close-btn');
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.closeWindow(appId);
    });
    
    this.setupDraggable(win, winBody.querySelector('.window-header'));
    this.focusWindow(appId);
  },
  
  closeWindow: function(appId) {
    if (typeof AudioManager !== 'undefined') AudioManager.playWindowClose();
    
    const win = this.windows[appId];
    if (win) {
      const winBody = win.querySelector('.window-body');
      winBody.classList.remove('anim-window-open');
      winBody.classList.add('anim-window-close');
      
      if (window.restoreCoverflow) window.restoreCoverflow();

      // Wait for bounce out animation
      setTimeout(() => {
        if (win.parentNode) win.parentNode.removeChild(win);
        delete this.windows[appId];
      }, 300);
    }
  },
  
  focusWindow: function(appId) {
    const win = this.windows[appId];
    if (win) {
      this.zIndexCounter++;
      win.style.zIndex = this.zIndexCounter;
      
      // Clear active state on all windows
      Object.values(this.windows).forEach(w => {
        const body = w.querySelector('.window-body');
        if (body) body.classList.remove('active');
      });
      const winBody = win.querySelector('.window-body');
      if (winBody) winBody.classList.add('active');
    }
  },
  
  setupDraggable: function(winElement, handleElement) {
    let isDragging = false;
    let startX, startY, initialTranslateX, initialTranslateY;
    
    handleElement.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      
      const rect = winElement.getBoundingClientRect();
      initialTranslateX = rect.left;
      initialTranslateY = rect.top;
      
      winElement.style.transition = 'none'; 
    });
    
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      e.preventDefault(); 
      
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      
      winElement.style.left = `${initialTranslateX + dx + (winElement.offsetWidth / 2)}px`;
      winElement.style.top = `${initialTranslateY + dy + (winElement.offsetHeight / 2)}px`;
    });
    
    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        winElement.style.transition = 'box-shadow 0.3s ease'; // Restore shadow transition
      }
    });
  }
};
