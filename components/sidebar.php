<?php
// Left Sidebar Navigation Component
?>
<div id="main-sidebar">
  <div class="sidebar-logo">iiSU</div>
  
  <div class="sidebar-nav">
    <div class="sidebar-btn" id="btn-my-profile" onclick="SocialSystem.openOverlay('profile')">
      <div class="sidebar-icon">
        <!-- Emplacement icone (vide pour l'instant) -->
      </div>
      <div class="sidebar-label">Mon Profil</div>
    </div>

    <div class="sidebar-btn" id="btn-friends" onclick="SocialSystem.openOverlay('friends')">
      <div class="sidebar-icon"></div>
      <div class="sidebar-label">Amis</div>
    </div>

    <div class="sidebar-btn" id="btn-global" onclick="SocialSystem.openOverlay('global')">
      <div class="sidebar-icon"></div>
      <div class="sidebar-label">Global</div>
    </div>

    <div class="sidebar-btn" id="btn-messages" onclick="SocialSystem.openOverlay('messages')">
      <div class="sidebar-icon"></div>
      <div class="sidebar-label">Messages</div>
    </div>
  </div>
</div>
