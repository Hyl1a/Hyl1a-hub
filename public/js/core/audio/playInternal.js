import { AudioState } from './state.js';
import init from './init.js';
export default function _play(key) {
  if (AudioState.isMuted) return;
  if (!AudioState._initialized) init();
  const sound = AudioState.sounds[key];
  if (sound) {
    if (key === 'click' || key === 'pop') {
      sound.currentTime = 0;
      sound.play().catch(() => {});
    } else {
      const clone = sound.cloneNode();
      clone.volume = sound.volume;
      clone.play().catch(() => { });
    }
  }
}