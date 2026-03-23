const NES_GAMES = [
  // Add your NES ROMs here — example:
  // { name: 'Super Mario Bros.', file: 'apps/nes/assets/roms/Super Mario Bros. (World).nes', cover: '' },
];

window.NES_GAMES = NES_GAMES;

let nesPlaytimes = {};
let nesStartTime = 0;
let nesCurrentGame = null;
let nesCurrentIndex = 0;

export default async function renderNes(container) {
  if (window.Auth && window.Auth.currentUser && window.Firestore) {
    try {
      const uid = window.Auth.currentUser.uid;
      const docRef = window.Firestore.doc(window.FirebaseDB, 'users', uid);
      const docSnap = await window.Firestore.getDoc(docRef);
      if (docSnap.exists() && docSnap.data().nes_playtimes) {
        nesPlaytimes = docSnap.data().nes_playtimes;
      }
    } catch (e) {
      console.error('Error loading NES playtimes:', e);
    }
  }
  renderNesMenu(container);
}

function renderNesMenu(container) {
  if (!document.getElementById('nes-emu-styles')) {
    const style = document.createElement('style');
    style.id = 'nes-emu-styles';
    style.textContent = `
      .nes-menu-wrapper {
        display:flex; flex-direction:column; width:100%; height:100%;
        font-family:'Inter',sans-serif; background:transparent; color:#fff;
        overflow:hidden; position:relative; animation:nesFadeIn 0.3s ease-out;
      }
      @keyframes nesFadeIn { from { opacity:0; transform:scale(1.02); } to { opacity:1; transform:scale(1); } }

      .nes-covers-row {
        flex:1; display:flex; align-items:center; justify-content:flex-start;
        padding:0 50vw; overflow-x:hidden; scroll-behavior:smooth; gap:40px;
      }
      .nes-cover-item {
        flex-shrink:0; width:220px; height:320px; border-radius:8px; cursor:pointer;
        position:relative; transition:all 0.3s cubic-bezier(0.2,1,0.3,1);
        filter:brightness(0.5) grayscale(0.8); box-shadow:0 10px 30px rgba(0,0,0,0.5);
      }
      .nes-cover-item.active {
        filter:brightness(1) grayscale(0); transform:scale(1.15) translateY(-10px);
        box-shadow:0 0 40px rgba(255,100,100,0.6), 0 20px 40px rgba(0,0,0,0.8);
        z-index:10; border:2px solid rgba(255,255,255,0.8);
      }
      .nes-cover-img { width:100%; height:100%; object-fit:cover; border-radius:6px; display:block; }
      .nes-fallback {
        width:100%; height:100%; display:flex; flex-direction:column; align-items:center;
        justify-content:center; background:linear-gradient(135deg,#5c1010,#2e0000); border-radius:6px;
        text-align:center; padding:15px;
      }
      .nes-info-panel {
        height:160px; width:100%; display:flex; flex-direction:column; align-items:center;
        justify-content:flex-end; padding-bottom:30px; gap:12px; z-index:1000;
        background:linear-gradient(to top,rgba(0,0,0,0.95),transparent);
        border-top:1px solid rgba(255,255,255,0.1);
      }
      .nes-title { font-size:34px; font-weight:900; color:white; text-shadow:0 4px 15px rgba(0,0,0,1); margin:0; }
      .nes-playtime { font-size:15px; color:#ff6b6b; font-weight:700; text-transform:uppercase; letter-spacing:1.5px; }
      .nes-controls { display:flex; gap:25px; margin-top:15px; position:relative; z-index:1001; }
      .nes-btn {
        display:flex; align-items:center; gap:10px; background:rgba(255,255,255,0.1);
        border:2px solid rgba(255,255,255,0.3); border-radius:40px; padding:10px 25px;
        font-size:16px; color:#fff; font-weight:800; cursor:pointer; transition:all 0.2s;
      }
      .nes-btn:hover { background:rgba(255,255,255,0.3); transform:scale(1.05); border-color:#fff; }
      .nes-btn.primary {
        background:#cc0000; color:#fff; border:none;
        box-shadow:0 0 20px rgba(204,0,0,0.4); width:240px; justify-content:center;
      }
      .nes-btn.primary:hover { background:#ff2222; transform:scale(1.1); box-shadow:0 0 30px rgba(204,0,0,0.7); }
      .nes-btn b { background:#fff; color:#000; border-radius:50%; width:22px; height:22px; display:flex; align-items:center; justify-content:center; font-size:13px; }
      .nes-arrow {
        position:absolute; top:calc(50% - 80px); transform:translateY(-50%); z-index:1000;
        width:80px; height:120px; border-radius:18px; border:2px solid rgba(255,255,255,0.2);
        background:rgba(0,0,0,0.7); color:white; cursor:pointer; display:flex; align-items:center;
        justify-content:center; transition:all 0.2s; box-shadow:0 10px 40px rgba(0,0,0,0.6); outline:none;
      }
      .nes-arrow:hover { background:rgba(0,0,0,0.9); transform:translateY(-50%) scale(1.1); border-color:#ff6b6b; }
      .nes-arrow:active { transform:translateY(-50%) scale(0.95); }
      #nes-btn-prev { left:40px; }
      #nes-btn-next { right:40px; }
      .nes-arrow svg { width:45px; height:45px; opacity:1; stroke:#ff6b6b; }
      .nes-arrow:hover svg { stroke:#fff; }
      .nes-no-games {
        flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center;
        gap:16px; opacity:0.7;
      }
      .nes-no-games span:first-child { font-size:64px; }
      .nes-no-games p { font-size:18px; font-weight:700; text-align:center; max-width:400px; opacity:0.8; }
    `;
    document.head.appendChild(style);
  }

  if (nesCurrentIndex < 0) nesCurrentIndex = 0;
  if (nesCurrentIndex >= NES_GAMES.length) nesCurrentIndex = Math.max(0, NES_GAMES.length - 1);

  let coversHtml = '';
  NES_GAMES.forEach((game, index) => {
    const content = game.cover
      ? `<img src="${game.cover}" class="nes-cover-img" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';" />
         <div class="nes-fallback" style="display:none;"><span style="font-size:40px;">🎮</span><span style="font-weight:bold;margin-top:10px;font-size:16px;">${game.name}</span></div>`
      : `<div class="nes-fallback"><span style="font-size:40px;">🎮</span><span style="font-size:12px;opacity:0.7;margin-top:5px;">NES</span><span style="font-weight:bold;margin-top:10px;font-size:16px;">${game.name}</span></div>`;
    coversHtml += `<div class="nes-cover-item" id="nes-item-${index}" data-index="${index}">${content}</div>`;
  });

  const noGamesHtml = NES_GAMES.length === 0
    ? `<div class="nes-no-games">
        <span>🎮</span>
        <p>Aucun jeu NES disponible.<br>Ajoutez des ROMs dans <code>apps/nes/assets/roms/</code></p>
       </div>`
    : `<div class="nes-covers-row" id="nes-scroll-row">${coversHtml}</div>`;

  container.innerHTML = `
    <div class="nes-menu-wrapper" tabindex="-1">
      ${NES_GAMES.length > 0 ? `
        <button id="nes-btn-prev" class="nes-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="15 18 9 12 15 6"/></svg></button>
        <button id="nes-btn-next" class="nes-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="9 18 15 12 9 6"/></svg></button>
      ` : ''}
      ${noGamesHtml}
      <div class="nes-info-panel">
        <h2 class="nes-title" id="nes-ui-title">${NES_GAMES.length > 0 ? NES_GAMES[0].name : 'Nintendo Entertainment System'}</h2>
        <div class="nes-playtime" id="nes-ui-playtime">${NES_GAMES.length === 0 ? 'Ajoutez des jeux pour commencer' : '...'}</div>
        <div class="nes-controls">
          ${NES_GAMES.length > 0 ? `<button class="nes-btn primary" id="nes-launch-btn"><b>A</b> JOUER</button>` : ''}
          <button class="nes-btn" id="nes-quit-btn"><b>B</b> QUITTER</button>
        </div>
      </div>
    </div>
  `;

  const wrapper = container.querySelector('.nes-menu-wrapper');
  wrapper.focus();

  if (NES_GAMES.length > 0) {
    updateNesCarousel(container);

    container.querySelectorAll('.nes-cover-item').forEach(item => {
      item.addEventListener('click', () => {
        const idx = parseInt(item.getAttribute('data-index'), 10);
        if (nesCurrentIndex === idx) {
          if (typeof AudioManager !== 'undefined') AudioManager.playClick();
          launchNesEmulator(container, NES_GAMES[nesCurrentIndex]);
        } else {
          nesCurrentIndex = idx;
          if (typeof AudioManager !== 'undefined') AudioManager.playClick();
          updateNesCarousel(container);
        }
      });
    });

    container.querySelector('#nes-launch-btn').addEventListener('click', () => {
      if (typeof AudioManager !== 'undefined') AudioManager.playClick();
      launchNesEmulator(container, NES_GAMES[nesCurrentIndex]);
    });

    container.querySelector('#nes-btn-prev').addEventListener('click', e => {
      e.stopPropagation();
      if (nesCurrentIndex > 0) { nesCurrentIndex--; if (typeof AudioManager !== 'undefined') AudioManager.playClick(); updateNesCarousel(container); }
    });

    container.querySelector('#nes-btn-next').addEventListener('click', e => {
      e.stopPropagation();
      if (nesCurrentIndex < NES_GAMES.length - 1) { nesCurrentIndex++; if (typeof AudioManager !== 'undefined') AudioManager.playClick(); updateNesCarousel(container); }
    });

    const keyHandler = e => {
      if (!document.querySelector('.nes-menu-wrapper')) { window.removeEventListener('keydown', keyHandler, true); return; }
      if (document.querySelector('iframe[src*="emu_player.html?type=nes"]')) return;
      const keys = ['ArrowRight', 'ArrowLeft', 'Enter', 'b', 'Escape'];
      if (keys.includes(e.key)) {
        e.preventDefault(); e.stopPropagation();
        if (e.key === 'ArrowRight' && nesCurrentIndex < NES_GAMES.length - 1) { nesCurrentIndex++; if (typeof AudioManager !== 'undefined') AudioManager.playClick(); updateNesCarousel(container); }
        else if (e.key === 'ArrowLeft' && nesCurrentIndex > 0) { nesCurrentIndex--; if (typeof AudioManager !== 'undefined') AudioManager.playClick(); updateNesCarousel(container); }
        else if (e.key === 'Enter') { if (typeof AudioManager !== 'undefined') AudioManager.playClick(); launchNesEmulator(container, NES_GAMES[nesCurrentIndex]); }
        else if (e.key === 'b' || e.key === 'Escape') container.querySelector('#nes-quit-btn')?.click();
      }
    };
    if (window._nesKeyHandler) window.removeEventListener('keydown', window._nesKeyHandler, true);
    window._nesKeyHandler = keyHandler;
    window.addEventListener('keydown', keyHandler, true);
  }

  container.querySelector('#nes-quit-btn').addEventListener('click', () => {
    if (typeof AudioManager !== 'undefined') AudioManager.playClick();
    if (window._nesKeyHandler) { window.removeEventListener('keydown', window._nesKeyHandler, true); window._nesKeyHandler = null; }
    if (window.AppRegistry['nes'] && window.AppRegistry['nes'].close) window.AppRegistry['nes'].close();
  });
}

function updateNesCarousel(container) {
  const row = container.querySelector('#nes-scroll-row');
  const items = container.querySelectorAll('.nes-cover-item');
  const titleEl = container.querySelector('#nes-ui-title');
  const playtimeEl = container.querySelector('#nes-ui-playtime');
  if (!row || !items.length) return;

  const game = NES_GAMES[nesCurrentIndex];
  if (titleEl) titleEl.textContent = game.name;
  if (playtimeEl) {
    const mins = nesPlaytimes[game.name] || 0;
    playtimeEl.textContent = mins === 0 ? 'Temps de jeu : Vierge' : `Temps de jeu : ${Math.floor(mins / 60) > 0 ? Math.floor(mins / 60) + 'h ' : ''}${Math.floor(mins % 60)}m`;
  }
  items.forEach((item, i) => item.classList.toggle('active', i === nesCurrentIndex));
  const activeItem = items[nesCurrentIndex];
  if (activeItem) {
    row.scrollTo({ left: (nesCurrentIndex * 260) + 110, behavior: 'smooth' });
  }
}

function launchNesEmulator(container, game) {
  const romUrl = encodeURIComponent(game.file);
  const gameName = encodeURIComponent(game.name);
  nesStartTime = Date.now();
  nesCurrentGame = game.name;

  if (typeof AudioManager !== 'undefined') { AudioManager.pauseMusic(); }

  container.innerHTML = `
    <div style="display:flex;flex-direction:column;width:100%;height:100%;background:#000;overflow:hidden;animation:nesFadeIn 0.3s ease-out;">
      <div style="padding:12px 20px;background:rgba(30,30,30,0.9);backdrop-filter:blur(10px);display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid rgba(255,255,255,0.1);z-index:100;">
        <div id="nes-back-btn" style="display:flex;align-items:center;gap:8px;background:rgba(255,255,255,0.1);border:2px solid rgba(255,255,255,0.2);border-radius:40px;padding:6px 18px;color:white;cursor:pointer;font-weight:700;transition:0.2s;">
          <span style="background:white;color:black;border-radius:50%;width:20px;height:20px;text-align:center;line-height:20px;font-size:13px;">B</span> Quitter
        </div>
        <h3 style="margin:0;color:white;font-size:20px;font-weight:400;letter-spacing:1px;">${game.name}</h3>
        <div style="width:100px;"></div>
      </div>
      <div style="flex:1;position:relative;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle,#1a0a0a,#000);">
        <iframe src="/apps/nes/emu_player.html?type=nes&rom=${romUrl}&name=${gameName}&core=fceumm" style="border:none;width:100%;height:100%;max-width:1280px;" allow="autoplay;fullscreen"></iframe>
      </div>
    </div>
  `;

  const backBtn = container.querySelector('#nes-back-btn');
  backBtn.addEventListener('mouseover', () => backBtn.style.background = 'rgba(255,255,255,0.2)');
  backBtn.addEventListener('mouseout', () => backBtn.style.background = 'rgba(255,255,255,0.1)');
  backBtn.addEventListener('click', () => {
    if (typeof AudioManager !== 'undefined') { AudioManager.playClick(); AudioManager.playAppLaunchTransition(null, null); }
    const elapsedMins = Math.max(1, Math.floor((Date.now() - nesStartTime) / 60000));
    nesPlaytimes[nesCurrentGame] = (nesPlaytimes[nesCurrentGame] || 0) + elapsedMins;
    if (window.Auth?.currentUser && window.Firestore) {
      const docRef = window.Firestore.doc(window.FirebaseDB, 'users', window.Auth.currentUser.uid);
      window.Firestore.setDoc(docRef, { nes_playtimes: nesPlaytimes }, { merge: true }).catch(e => console.error(e));
    }
    renderNesMenu(container);
  });

  const iframe = container.querySelector('iframe');
  if (iframe) {
    iframe.onload = () => { setTimeout(() => { iframe.focus(); if (iframe.contentWindow) iframe.contentWindow.focus(); }, 500); };
  }
}
