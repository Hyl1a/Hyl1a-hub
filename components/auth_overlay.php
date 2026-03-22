<?php
// Authentication Overlay Component
?>
  <div id="auth-overlay"
    style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15, 15, 15, 0.85); display: flex; align-items: center; justify-content: center; z-index: 10000; flex-direction: column; backdrop-filter: blur(10px); overflow: hidden;">

    <!-- Background layer for Miis -->
    <div id="auth-bg" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: -1;">
    </div>

    <!-- Hylia Plaza Logo -->
    <img src="public/assets/icons/logov2.webp" alt="Hylia Plaza Logo" class="auth-logo" style="width: 320px; margin-bottom: 20px;">

    <!-- Auth Container -->
    <div
      style="position: relative; z-index: 10; background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(255,255,255,0.2); border-radius: 24px; padding: 40px; text-align: center; color: white; width: 420px; box-shadow: 0 20px 50px rgba(0,0,0,0.6), inset 0 0 20px rgba(255,255,255,0.05); backdrop-filter: blur(25px); animation: fadeIn 0.8s ease-out; overflow: hidden;">

      <!-- Common Error Message -->
      <div id="auth-error"
        style="color: #ff6b6b; font-size: 13px; margin-bottom: 20px; display: none; background: rgba(255,107,107,0.1); padding: 12px; border-radius: 8px; border: 1px solid rgba(255,107,107,0.3);">
      </div>

      <!-- Login Panel -->
      <div id="login-panel" style="display: block; transition: all 0.3s;">
        <h2 style="margin: 0 0 10px 0; font-size: 24px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">Connexion</h2>
        <p style="margin-bottom: 30px; font-size: 14px; color: rgba(255,255,255,0.6);">
          Entrez vos identifiants pour continuer.
        </p>

        <div style="margin-bottom: 20px;">
          <input type="text" id="auth-login-username" placeholder="Nom d'utilisateur" class="auth-input">
        </div>

        <div style="margin-bottom: 30px;">
          <input type="password" id="auth-login-password" placeholder="Mot de passe" class="auth-input">
        </div>

        <button id="btn-login-submit" class="auth-btn highlight">Se Connecter</button>
        <p style="margin-top: 20px; font-size: 13px; color: rgba(255,255,255,0.5);">
          Pas encore de compte ? <span id="toggle-to-register" style="color: #7ec4ff; cursor: pointer; font-weight: bold; text-decoration: underline;">S'inscrire</span>
        </p>
      </div>

      <!-- Register Panel -->
      <div id="register-panel" style="display: none; transition: all 0.3s;">
        <h2 style="margin: 0 0 10px 0; font-size: 24px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">Inscription</h2>
        <p style="margin-bottom: 30px; font-size: 14px; color: rgba(255,255,255,0.6);">
          Créez un compte pour sauvegarder vos données.
        </p>

        <div style="margin-bottom: 20px;">
          <input type="text" id="auth-reg-username" placeholder="Choisissez un pseudo" class="auth-input">
        </div>

        <div style="margin-bottom: 30px;">
          <input type="password" id="auth-reg-password" placeholder="Créez un mot de passe" class="auth-input">
        </div>

        <button id="btn-register-submit" class="auth-btn highlight">Créer mon compte</button>
        <p style="margin-top: 20px; font-size: 13px; color: rgba(255,255,255,0.5);">
          Déjà un compte ? <span id="toggle-to-login" style="color: #7ec4ff; cursor: pointer; font-weight: bold; text-decoration: underline;">Se connecter</span>
        </p>
      </div>

    </div>
  </div>

<style>
.auth-input {
  width: 100%; 
  padding: 14px 18px; 
  border-radius: 12px; 
  border: 1px solid rgba(255,255,255,0.15); 
  background: rgba(255,255,255,0.05); 
  color: white; 
  outline: none; 
  box-sizing: border-box; 
  transition: all 0.3s; 
  font-size: 15px;
}
.auth-input:focus {
  background: rgba(255,255,255,0.1);
  border-color: #7ec4ff;
  box-shadow: 0 0 15px rgba(126,196,255,0.3);
}
.auth-btn {
  width: 100%;
  padding: 14px;
  border-radius: 12px;
  border: none;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
}
.auth-btn.highlight {
  background: linear-gradient(135deg, #7ec4ff, #4a9fff);
  color: white;
  box-shadow: 0 4px 15px rgba(74, 159, 255, 0.4);
}
.auth-btn.highlight:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(74, 159, 255, 0.6);
}
.auth-btn.highlight:active {
  transform: scale(0.98);
}
</style>
