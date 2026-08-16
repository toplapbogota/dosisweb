import Hydra from 'hydra-synth';

const canvas = document.getElementById('hydra-canvas');


function resolucionPantalla() {
  const dpr = window.devicePixelRatio || 1;
  return {
    width: Math.round(window.innerWidth * dpr),
    height: Math.round(window.innerHeight * dpr)
  };
}

const inicial = resolucionPantalla();
canvas.width = inicial.width;
canvas.height = inicial.height;

const hydra = new Hydra({ canvas, detectAudio: false });

let resizeTimeoutId;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeoutId);
  resizeTimeoutId = setTimeout(() => {
    const { width, height } = resolucionPantalla();
    hydra.setResolution(width, height);
  }, 150);
});