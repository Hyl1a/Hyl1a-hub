<?php
// Top Navigation Component
?>
  <!-- User Panel — floating top-left pill -->
  <div id="user-panel" onclick="if(window.SocialSystem) SocialSystem.openOverlay('profile')" style="cursor: pointer; transition: transform 0.2s, filter 0.2s;">
    <div id="user-avatar-wrap">
      <div id="top-avatar-container"></div>
      <div class="online-dot avatar-dot"></div>
    </div>
    <div id="user-info-text">
      <!-- We keep the ID top-username for JS compatibility, but style it as the main name -->
      <div id="top-username" class="top-name">Guest</div>
      <div class="top-subname">username <div class="online-dot text-dot"></div></div>
    </div>
    <div class="settings-gear" style="margin-left:15px; font-size: 20px; opacity:0.8; filter: drop-shadow(0 2px 2px rgba(0,0,0,0.1));">⚙️</div>
  </div>

  <!-- Clock Panel — floating top-right block -->
  <div id="clock-panel">
    <div id="top-time">12:00 <span class="am-pm">PM</span></div>
    <div id="top-date">Monday, Jan 01</div>
  </div>
