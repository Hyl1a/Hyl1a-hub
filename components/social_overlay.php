<?php
// Social Overlay Component (Mon Profil / Amis)
?>
<div id="social-overlay" class="hidden">
  <div class="social-backdrop" onclick="SocialSystem.closeOverlay()"></div>
  <div class="social-window mii-glass-panel">
    <!-- Close button -->
    <div class="social-close" onclick="SocialSystem.closeOverlay()">✕</div>

    <!-- Layout: Left Column (List) / Right Column (Focus) -->
    <div class="social-content">
      
      <!-- LEFTMOST SIDEBAR (Inside Overlay) -->
      <?php include 'sidebar.php'; ?>
      
      <!-- MIDDLE COLUMN: LIST -->
      <div id="social-left-col" class="social-col">
        <!-- Header -->
        <div id="social-header" class="social-header">Amis</div>
        
        <!-- List container -->
        <div id="social-list" class="social-list-scroll">
          <!-- Dynamically populated via JS -->
        </div>
      </div>

      <!-- RIGHT COLUMN: FOCUS ZONE -->
      <div id="social-right-col" class="social-col">
         <!-- Giant Bio Bubble -->
         <div id="social-focus-speech" class="speech-bubble mii-glass-panel">
           <span id="stat-bio">Ceci est une bio de test.</span>
         </div>
         
         <div id="social-focus-mii-container">
           <!-- Giant Mii Render -->
           <img id="social-focus-mii" src="public/assets/images/default_mii.png" alt="Mii" style="opacity: 0;">
         </div>

         <!-- Statistics Panel -->
         <div id="social-focus-stats" class="stats-panel mii-glass-panel">
            <div class="stat-wrapper">
              <div class="stat-header" id="stat-display-name">Username#0000</div>
            </div>
            <div class="stat-wrapper">
               <div class="stat-label">Sexe</div>
               <div class="stat-value" id="stat-gender">--</div>
            </div>
            <div class="stat-wrapper">
              <div class="stat-label">Début</div>
              <div class="stat-value" id="stat-creation">--</div>
            </div>
            <div class="stat-wrapper">
              <div class="stat-label">Jeu préféré</div>
              <div class="stat-value" id="stat-favapp">--</div>
            </div>
         </div>
      </div>
    </div>
  </div>
</div>
