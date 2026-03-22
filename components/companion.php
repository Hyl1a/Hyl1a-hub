<?php
// Unified Bottom Bar — Marquee + Music Controls
?>
  <!-- Marquee Bar -->
  <div id="marquee-bar">
    <div class="welcome-marquee">
      <span class="marquee-text">Bienvenue à Hylia Plaza ! Explorez vos applications, personnalisez votre profil et profitez de l'ambiance • Welcome to Hylia Plaza! Explore your apps, customize your profile, and enjoy the vibe •</span>
      <span class="marquee-text">Bienvenue à Hylia Plaza ! Explorez vos applications, personnalisez votre profil et profitez de l'ambiance • Welcome to Hylia Plaza! Explore your apps, customize your profile, and enjoy the vibe •</span>
    </div>
  </div>

  <!-- Music Bar -->
  <div id="music-bar-container">
    <div class="music-controls">
      <button id="vis-prev" class="vis-btn bottom-music-btn">⏮</button>
      <button id="vis-play" class="vis-btn play-btn bottom-music-btn">▶</button>
      <button id="vis-next" class="vis-btn bottom-music-btn">⏭</button>
    </div>
    <div class="music-info">
      <span class="music-icon">🎵</span>
      <span id="vis-track-title">Aucune musique</span>
    </div>
    <div class="music-time">
      <span id="vis-time-current">00:00</span> / <span id="vis-time-total">--:--</span>
    </div>
  </div>

  <!-- Virtual Companion Widget -->
  <div id="companion-widget">
    <div id="companion-bubble">Poyo !</div>
    <div class="companion-glass">
      <video autoplay loop muted playsinline id="companion-avatar" src="public/assets/gif/kirby-nintendo.webm" alt="Companion"></video>
    </div>
  </div>
