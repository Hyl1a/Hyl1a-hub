<?php
// Application Grid Component
?>
  <div id="main-container">
    <!-- Title Bubble — floating above active tile -->
    <div id="floating-title-pill" class="hidden">
      <span id="floating-title-text">App Name</span>
    </div>

    <!-- Ambient glow that follows focused tile -->
    <div id="focus-glow"></div>
    <button id="carousel-nav-prev" class="carousel-nav-btn" aria-label="Previous App">‹</button>
    <div id="app-grid">

      <!-- Bio -->
      <div class="grid-tile tile-square app-trigger" data-app="bio" data-title="Hyl1a Bio" tabindex="0">
        <div class="tile-inner">
          <img class="tile-icon" src="public/assets/icons/parametre.webp" alt="Bio">
          <div class="tile-label">Hyl1a Bio</div>
        </div>
      </div>

      <!-- Gallery -->
      <div class="grid-tile tile-square app-trigger" data-app="gallery" data-title="Memory Gallery" tabindex="0">
        <div class="tile-inner">
          <img class="tile-icon" src="public/assets/icons/screen.webp" alt="Gallery">
          <div class="tile-label">Memory Gallery</div>
        </div>
      </div>

      <!-- Themes -->
      <div class="grid-tile tile-square app-trigger" id="theme-tile" data-app="themes" data-title="Themes" tabindex="0">
        <div class="tile-inner">
          <img class="tile-icon" src="public/assets/icons/eshop.webp" alt="Themes">
          <div class="tile-label">Themes</div>
        </div>
      </div>

      <!-- Mii Maker -->
      <div class="grid-tile tile-square app-trigger" data-app="miiMaker" data-title="Mii Maker" tabindex="0">
        <div class="tile-inner">
          <img class="tile-icon" src="public/assets/icons/mii.webp" alt="Mii Maker">
          <div class="tile-label">Mii Maker</div>
          <div class="tile-sublabel">Wii<span style="color:#00befa;font-weight:900;">U</span></div>
        </div>
      </div>

      <!-- Mii Plaza -->
      <div class="grid-tile tile-square app-trigger" data-app="miiPlaza" data-title="Mii Plaza" tabindex="0">
        <div class="tile-inner">
          <img class="tile-icon" src="public/assets/icons/miiverse.webp" alt="Mii Plaza">
          <div class="tile-label">Mii Plaza</div>
        </div>
      </div>

      <!-- Notes -->
      <div class="grid-tile tile-square app-trigger" data-app="notes" data-title="Notepad" tabindex="0">
        <div class="tile-inner">
          <img class="tile-icon" src="public/assets/icons/message.webp" alt="Notepad">
          <div class="tile-label">Notepad</div>
        </div>
      </div>

      <!-- GBA -->
      <div class="grid-tile tile-square app-trigger" data-app="gba" data-title="GBA Emulator" tabindex="0">
        <div class="tile-inner">
          <img class="tile-icon" src="public/assets/icons/gba.webp" alt="GBA Emulator">
          <div class="tile-label">GBA Emulator</div>
        </div>
      </div>

      <!-- Mii Manager -->
      <div class="grid-tile tile-square app-trigger" data-app="miiManager" data-title="Mii Manager" tabindex="0">
        <div class="tile-inner">
          <img class="tile-icon" src="public/assets/icons/attention.webp" alt="Mii Manager">
          <div class="tile-label">Mii Manager</div>
        </div>
      </div>

      <!-- GBA Turbo -->
      <div class="grid-tile tile-square app-trigger" data-app="gbaTurbo" data-title="GBA Turbo" tabindex="0">
        <div class="tile-inner" style="background: linear-gradient(135deg, #ff4b4b, #8b0000);">
          <img class="tile-icon" src="public/assets/icons/gba_turbo.webp" alt="GBA Turbo">
          <div class="tile-label" style="color:white;text-shadow:0 1px 3px rgba(0,0,0,0.5);">GBA Turbo</div>
        </div>
      </div>

    </div>
    <button id="carousel-nav-next" class="carousel-nav-btn" aria-label="Next App">›</button>
  </div>
