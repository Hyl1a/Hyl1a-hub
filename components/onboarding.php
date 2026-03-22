<?php
// Onboarding Presentation Sequence
?>
<script>
window.showOnboardingPresentation = function(username, onComplete) {
  const overlay = document.createElement('div');
  overlay.className = 'onboarding-overlay';
  overlay.innerHTML = `
    <div class="onboarding-content">
      <img src="public/assets/icons/logov2.webp" alt="Hylia Plaza" style="width: 200px; margin-bottom: 20px; filter: drop-shadow(0 10px 20px rgba(0,0,0,0.5));">
      <h1 class="onboarding-title">Bienvenue à Hylia Plaza, ${username} !</h1>
      <p class="onboarding-text" id="ob-text" style="transition: opacity 0.3s;">Ton Mii est magnifique. Prêt à découvrir ton nouvel espace ?</p>
      <button id="ob-next" class="ob-btn">Continuer</button>
    </div>
  `;
  document.body.appendChild(overlay);

  // Play a soft chime
  if (typeof window.AudioManager !== 'undefined') window.AudioManager.playWindowOpen();

  const style = document.createElement('style');
  style.textContent = `
    .onboarding-overlay {
      position: fixed; top:0; left:0; width:100%; height:100%;
      background: rgba(10, 15, 25, 0.9); backdrop-filter: blur(25px) saturate(150%);
      z-index: 100000; display: flex; align-items: center; justify-content: center;
      opacity: 0; transition: opacity 1s ease-in-out; padding: 20px; text-align: center;
      color: white; font-family: 'Outfit', sans-serif;
    }
    .onboarding-overlay.visible { opacity: 1; }
    .onboarding-content {
      max-width: 650px;
      padding: 50px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 30px;
      box-shadow: 0 30px 60px rgba(0,0,0,0.5), inset 0 0 20px rgba(255,255,255,0.05);
      animation: floatUp 1s cubic-bezier(0.2, 0.8, 0.2, 1);
    }
    .onboarding-title { 
      font-size: 32px; 
      margin-bottom: 20px; 
      background: linear-gradient(135deg, #fff, #abd4ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .onboarding-text { font-size: 22px; line-height: 1.6; color: #ccc; margin-bottom: 40px; font-weight: 300; }
    .ob-btn {
      padding: 16px 45px; font-size: 18px; font-weight: bold; border: none;
      border-radius: 30px; background: linear-gradient(135deg, #7ec4ff, #4a9fff);
      color: white; cursor: pointer; box-shadow: 0 10px 30px rgba(74, 159, 255, 0.4);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .ob-btn:hover { transform: scale(1.05); box-shadow: 0 15px 40px rgba(74, 159, 255, 0.6); }
    @keyframes floatUp { from { transform: translateY(40px) scale(0.95); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
  `;
  document.head.appendChild(style);

  // Trigger fade in
  requestAnimationFrame(() => {
    overlay.classList.add('visible');
  });

  const texts = [
    "Ton Mii est ton avatar officiel dans tout Hylia Plaza.",
    "Ici, tu trouveras différentes applications comme un Émulateur GBA, un Bloc-notes, et une Galerie.",
    "Déplace-toi avec la souris, ou utilise ton clavier (Flèches + Entrée) pour une expérience console.",
    "Laisse la musique tourner, détends-toi, et explore ton système !"
  ];

  let step = 0;
  const nextBtn = document.getElementById('ob-next');
  const textEl = document.getElementById('ob-text');

  nextBtn.onclick = () => {
    if (typeof window.AudioManager !== 'undefined') window.AudioManager.playClick();
    
    if (step < texts.length) {
      textEl.style.opacity = 0;
      setTimeout(() => {
        textEl.textContent = texts[step];
        textEl.style.opacity = 1;
        step++;
        
        if (step === texts.length) {
          nextBtn.textContent = "Commencer l'aventure !";
          nextBtn.style.background = "linear-gradient(135deg, #53ee8f, #00bd48)";
          nextBtn.style.boxShadow = "0 10px 30px rgba(0, 189, 72, 0.4)";
        }
      }, 300);
    } else {
      overlay.classList.remove('visible');
      if (typeof window.AudioManager !== 'undefined') window.AudioManager.playWindowClose();
      setTimeout(() => {
        overlay.remove();
        if(onComplete) onComplete();
      }, 1000);
    }
  };
};
</script>
