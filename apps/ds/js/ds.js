const DS_GAMES = [
  { name: 'Pokémon Platine', file: 'apps/ds/assets/roms/3797 - Pokemon - Platinum Version (Europe) (Rev 10).nds', cover: 'public/assets/icons/pokemon_platinum.png' },
  { name: 'Pokémon Or HeartGold', file: 'apps/ds/assets/roms/4786 - Pokemon - Version Or HeartGold (France) [b].nds', cover: 'public/assets/icons/pokemon_heartgold.png' },
  { name: 'Pokémon Version Noire', file: 'apps/ds/assets/roms/5587 - Pokemon - Version Noire (France) (NDSi Enhanced).nds', cover: 'public/assets/icons/pokemon_black.png' },
];

window.DS_GAMES = DS_GAMES;

let dsPlaytimes = {};
let dsStartTime = 0;
let dsCurrentGame = null;
let dsCurrentIndex = 0;

export default async function renderDs(container) {
  if (window.Auth && window.Auth.currentUser && window.Firestore) {
    try {
      const uid = window.Auth.currentUser.uid;
      const docRef = window.Firestore.doc(window.FirebaseDB, 'users', uid);
      const docSnap = await window.Firestore.getDoc(docRef);
      if (docSnap.exists() && docSnap.data().ds_playtimes) {
        dsPlaytimes = docSnap.data().ds_playtimes;
      }
    } catch (e) {
      console.error('Error loading DS playtimes:', e);
    }
  }
  renderDsMenu(container);
}

function renderDsMenu(container) {
  if (!document.getElementById('ds-emu-styles')) {
    const style = document.createElement('style');
    style.id = 'ds-emu-styles';
    style.textContent = `
      .ds-menu-wrapper {
        display: flex; flex-direction: column; width: 100%; height: 100%;
        font-family: 'Inter', sans-serif; background: transparent; color: #fff;
        overflow: hidden; position: relative; animation: dsFadeIn 0.3s ease-out;
      }
      @keyframes dsFadeIn { from { opacity:0; transform:scale(1.02); } to { opacity:1; transform:scale(1); } }

      .ds-covers-row {
        flex: 1; display: flex; align-items: center; justify-content: flex-start;
        padding: 0 50vw; overflow-x: hidden; scroll-behavior: smooth; gap: 40px;
      }
      .ds-cover-item {
        flex-shrink: 0; width: 220px; height: 320px; border-radius: 8px; cursor: pointer;
        position: relative; transition: all 0.3s cubic-bezier(0.2,1,0.3,1);
        filter: brightness(0.5) grayscale(0.8); box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      }
      .ds-cover-item.active {
        filter: brightness(1) grayscale(0); transform: scale(1.15) translateY(-10px);
        box-shadow: 0 0 40px rgba(200,120,255,0.6), 0 20px 40px rgba(0,0,0,0.8);
        z-index: 10; border: 2px solid rgba(255,255,255,0.8);
      }
      .ds-cover-img { width:100%; height:100%; object-fit:cover; border-radius:6px; display:block; }
      .ds-fallback {
        width:100%; height:100%; display:flex; flex-direction:column; align-items:center;
        justify-content:center; background:linear-gradient(135deg,#3a1f5e,#1a0a2e); border-radius:6px;
        text-align:center; padding:15px;
      }
      .ds-info-panel {
        height:160px; width:100%; display:flex; flex-direction:column; align-items:center;
        justify-content:flex-end; padding-bottom:30px; gap:12px; z-index:1000;
        background:linear-gradient(to top,rgba(0,0,0,0.95),transparent);
        border-top:1px solid rgba(255,255,255,0.1);
      }
      .ds-title { font-size:34px; font-weight:900; color:white; text-shadow:0 4px 15px rgba(0,0,0,1); margin:0; }
      .ds-playtime { font-size:15px; color:#c87fff; font-weight:700; text-transform:uppercase; letter-spacing:1.5px; }
      .ds-controls { display:flex; gap:25px; margin-top:15px; position:relative; z-index:1001; }
      .ds-btn {
        display:flex; align-items:center; gap:10px; background:rgba(255,255,255,0.1);
        border:2px solid rgba(255,255,255,0.3); border-radius:40px; padding:10px 25px;
        font-size:16px; color:#fff; font-weight:800; cursor:pointer; transition:all 0.2s;
      }
      .ds-btn:hover { background:rgba(255,255,255,0.3); transform:scale(1.05); border-color:#fff; }
      .ds-btn.primary {
        background:#9900ff; color:#fff; border:none;
        box-shadow:0 0 20px rgba(153,0,255,0.4); width:240px; justify-content:center;
      }
      .ds-btn.primary:hover { background:#b84dff; transform:scale(1.1); box-shadow:0 0 30px rgba(153,0,255,0.7); }
      .ds-btn b { background:#fff; color:#000; border-radius:50%; width:22px; height:22px; display:flex; align-items:center; justify-content:center; font-size:13px; }
      .ds-arrow {
        position:absolute; top:calc(50% - 80px); transform:translateY(-50%); z-index:1000;
        width:80px; height:120px; border-radius:18px; border:2px solid rgba(255,255,255,0.2);
        background:rgba(0,0,0,0.7); color:white; cursor:pointer; display:flex; align-items:center;
        justify-content:center; transition:all 0.2s; box-shadow:0 10px 40px rgba(0,0,0,0.6); outline:none;
      }
      .ds-arrow:hover { background:rgba(0,0,0,0.9); transform:translateY(-50%) scale(1.1); border-color:#c87fff; }
      .ds-arrow:active { transform:translateY(-50%) scale(0.95); }
      #ds-btn-prev { left:40px; }
      #ds-btn-next { right:40px; }
      .ds-arrow svg { width:45px; height:45px; opacity:1; stroke:#c87fff; }
      .ds-arrow:hover svg { stroke:#fff; }
      .ds-no-games {
        flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center;
        gap:16px; opacity:0.7;
      }
      .ds-no-games span:first-child { font-size:64px; }
      .ds-no-games p { font-size:18px; font-weight:700; text-align:center; max-width:400px; opacity:0.8; }
    `;
    document.head.appendChild(style);
  }

  if (dsCurrentIndex < 0) dsCurrentIndex = 0;
  if (dsCurrentIndex >= DS_GAMES.length) dsCurrentIndex = Math.max(0, DS_GAMES.length - 1);

  let coversHtml = '';
  DS_GAMES.forEach((game, index) => {
    const content = game.cover
      ? `<img src="${game.cover}" class="ds-cover-img" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';" />
         <div class="ds-fallback" style="display:none;"><span style="font-size:40px;">🎮</span><span style="font-weight:bold;margin-top:10px;font-size:16px;">${game.name}</span></div>`
      : `<div class="ds-fallback"><span style="font-size:40px;">🎮</span><span style="font-size:12px;opacity:0.7;margin-top:5px;">DS</span><span style="font-weight:bold;margin-top:10px;font-size:16px;">${game.name}</span></div>`;
    coversHtml += `<div class="ds-cover-item" id="ds-item-${index}" data-index="${index}">${content}</div>`;
  });

  const noGamesHtml = DS_GAMES.length === 0
    ? `<div class="ds-no-games">
        <span>🎮</span>
        <p>Aucun jeu DS disponible.<br>Ajoutez des ROMs dans <code>apps/ds/assets/roms/</code></p>
       </div>`
    : `<div class="ds-covers-row" id="ds-scroll-row">${coversHtml}</div>`;

  container.innerHTML = `
    <div class="ds-menu-wrapper" tabindex="-1">
      ${DS_GAMES.length > 0 ? `
        <button id="ds-btn-prev" class="ds-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="15 18 9 12 15 6"/></svg></button>
        <button id="ds-btn-next" class="ds-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="9 18 15 12 9 6"/></svg></button>
      ` : ''}
      ${noGamesHtml}
      <div class="ds-info-panel">
        <h2 class="ds-title" id="ds-ui-title">${DS_GAMES.length > 0 ? DS_GAMES[0].name : 'Nintendo DS'}</h2>
        <div class="ds-playtime" id="ds-ui-playtime">${DS_GAMES.length === 0 ? 'Ajoutez des jeux pour commencer' : '...'}</div>
        <div class="ds-controls">
          ${DS_GAMES.length > 0 ? `<button class="ds-btn primary" id="ds-launch-btn"><b>A</b> JOUER</button>` : ''}
          <button class="ds-btn" id="ds-quit-btn"><b>B</b> QUITTER</button>
        </div>
      </div>
    </div>
  `;

  const wrapper = container.querySelector('.ds-menu-wrapper');
  wrapper.focus();

  if (DS_GAMES.length > 0) {
    updateDsCarousel(container);

    container.querySelectorAll('.ds-cover-item').forEach(item => {
      item.addEventListener('click', () => {
        const idx = parseInt(item.getAttribute('data-index'), 10);
        if (dsCurrentIndex === idx) {
          if (typeof AudioManager !== 'undefined') AudioManager.playClick();
          launchDsEmulator(container, DS_GAMES[dsCurrentIndex]);
        } else {
          dsCurrentIndex = idx;
          if (typeof AudioManager !== 'undefined') AudioManager.playClick();
          updateDsCarousel(container);
        }
      });
    });

    container.querySelector('#ds-launch-btn').addEventListener('click', () => {
      if (typeof AudioManager !== 'undefined') AudioManager.playClick();
      launchDsEmulator(container, DS_GAMES[dsCurrentIndex]);
    });

    container.querySelector('#ds-btn-prev').addEventListener('click', e => {
      e.stopPropagation();
      if (dsCurrentIndex > 0) { dsCurrentIndex--; if (typeof AudioManager !== 'undefined') AudioManager.playClick(); updateDsCarousel(container); }
    });

    container.querySelector('#ds-btn-next').addEventListener('click', e => {
      e.stopPropagation();
      if (dsCurrentIndex < DS_GAMES.length - 1) { dsCurrentIndex++; if (typeof AudioManager !== 'undefined') AudioManager.playClick(); updateDsCarousel(container); }
    });

    const keyHandler = e => {
      if (!document.querySelector('.ds-menu-wrapper')) { window.removeEventListener('keydown', keyHandler, true); return; }
      if (document.querySelector('iframe[src*="emu_player.html?type=ds"]')) return;
      const keys = ['ArrowRight', 'ArrowLeft', 'Enter', 'b', 'Escape'];
      if (keys.includes(e.key)) {
        e.preventDefault(); e.stopPropagation();
        if (e.key === 'ArrowRight' && dsCurrentIndex < DS_GAMES.length - 1) { dsCurrentIndex++; if (typeof AudioManager !== 'undefined') AudioManager.playClick(); updateDsCarousel(container); }
        else if (e.key === 'ArrowLeft' && dsCurrentIndex > 0) { dsCurrentIndex--; if (typeof AudioManager !== 'undefined') AudioManager.playClick(); updateDsCarousel(container); }
        else if (e.key === 'Enter') { if (typeof AudioManager !== 'undefined') AudioManager.playClick(); launchDsEmulator(container, DS_GAMES[dsCurrentIndex]); }
        else if (e.key === 'b' || e.key === 'Escape') container.querySelector('#ds-quit-btn')?.click();
      }
    };
    if (window._dsKeyHandler) window.removeEventListener('keydown', window._dsKeyHandler, true);
    window._dsKeyHandler = keyHandler;
    window.addEventListener('keydown', keyHandler, true);
  }

  container.querySelector('#ds-quit-btn').addEventListener('click', () => {
    if (typeof AudioManager !== 'undefined') AudioManager.playClick();
    if (window._dsKeyHandler) { window.removeEventListener('keydown', window._dsKeyHandler, true); window._dsKeyHandler = null; }
    if (window.AppRegistry['ds'] && window.AppRegistry['ds'].close) window.AppRegistry['ds'].close();
  });
}

function updateDsCarousel(container) {
  const row = container.querySelector('#ds-scroll-row');
  const items = container.querySelectorAll('.ds-cover-item');
  const titleEl = container.querySelector('#ds-ui-title');
  const playtimeEl = container.querySelector('#ds-ui-playtime');
  if (!row || !items.length) return;

  const game = DS_GAMES[dsCurrentIndex];
  if (titleEl) titleEl.textContent = game.name;
  if (playtimeEl) {
    const mins = dsPlaytimes[game.name] || 0;
    playtimeEl.textContent = mins === 0 ? 'Temps de jeu : Vierge' : `Temps de jeu : ${Math.floor(mins / 60) > 0 ? Math.floor(mins / 60) + 'h ' : ''}${Math.floor(mins % 60)}m`;
  }
  items.forEach((item, i) => item.classList.toggle('active', i === dsCurrentIndex));
  const activeItem = items[dsCurrentIndex];
  if (activeItem) {
    row.scrollTo({ left: (dsCurrentIndex * 260) + 110, behavior: 'smooth' });
  }
}

function launchDsEmulator(container, game) {
  const romUrl = encodeURIComponent(game.file);
  const gameName = encodeURIComponent(game.name);
  dsStartTime = Date.now();
  dsCurrentGame = game.name;

  if (typeof AudioManager !== 'undefined') { AudioManager.pauseMusic(); }

  container.innerHTML = `
    <div style="display:flex;flex-direction:column;width:100%;height:100%;background:#000;overflow:hidden;animation:dsFadeIn 0.3s ease-out;">
      <div style="padding:12px 20px;background:rgba(30,30,30,0.9);backdrop-filter:blur(10px);display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid rgba(255,255,255,0.1);z-index:100;">
        <div id="ds-back-btn" style="display:flex;align-items:center;gap:8px;background:rgba(255,255,255,0.1);border:2px solid rgba(255,255,255,0.2);border-radius:40px;padding:6px 18px;color:white;cursor:pointer;font-weight:700;transition:0.2s;">
          <span style="background:white;color:black;border-radius:50%;width:20px;height:20px;text-align:center;line-height:20px;font-size:13px;">B</span> Quitter
        </div>
        <h3 style="margin:0;color:white;font-size:20px;font-weight:400;letter-spacing:1px;">${game.name}</h3>
        <div style="width:100px;"></div>
      </div>
      <div style="flex:1;position:relative;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle,#1a1a2e,#000);">
        <iframe src="/apps/ds/emu_player.html?type=ds&rom=${romUrl}&name=${gameName}&core=melonds" style="border:none;width:100%;height:100%;max-width:1280px;" allow="autoplay;fullscreen"></iframe>
      </div>
    </div>
  `;

  const backBtn = container.querySelector('#ds-back-btn');
  backBtn.addEventListener('mouseover', () => backBtn.style.background = 'rgba(255,255,255,0.2)');
  backBtn.addEventListener('mouseout', () => backBtn.style.background = 'rgba(255,255,255,0.1)');
  backBtn.addEventListener('click', () => {
    if (typeof AudioManager !== 'undefined') { AudioManager.playClick(); AudioManager.playAppLaunchTransition(null, null); }
    const elapsedMins = Math.max(1, Math.floor((Date.now() - dsStartTime) / 60000));
    dsPlaytimes[dsCurrentGame] = (dsPlaytimes[dsCurrentGame] || 0) + elapsedMins;
    if (window.Auth?.currentUser && window.Firestore) {
      const docRef = window.Firestore.doc(window.FirebaseDB, 'users', window.Auth.currentUser.uid);
      window.Firestore.setDoc(docRef, { ds_playtimes: dsPlaytimes }, { merge: true }).catch(e => console.error(e));
    }
    renderDsMenu(container);
  });

  const iframe = container.querySelector('iframe');
  if (iframe) {
    iframe.onload = () => { setTimeout(() => { iframe.focus(); if (iframe.contentWindow) iframe.contentWindow.focus(); }, 500); };
  }
}
