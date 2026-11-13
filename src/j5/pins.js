import { getPinsManager, checkPins } from "./pins/pinsManager";

const statesByPinsManager = new WeakMap();

function getState(pinsManager) {
  let state = statesByPinsManager.get(pinsManager);
  if (!state) {
    state = {
      contadorIndice: 0,
      pines_global: undefined,
      intervalo: 1000,
      bucleID: -1,
      bucleIds: [],
      pinesParalelo: undefined
    };
    statesByPinsManager.set(pinsManager, state);
  }
  return state;
}

function prenderEn(board, ...pinesID) {
  const pinsManager = getPinsManager(board);
  checkPins(pinesID, 'prender', board);
  for (const pinId of pinesID) {
    pinsManager.getPinById(pinId).high();
  }
}

function prender(...pinesID) {
  prenderEn(undefined, ...pinesID);
}
global.prender = prender;
global.encender = prender;

function apagarEn(board, ...pinesID) {
  const pinsManager = getPinsManager(board);
  checkPins(pinesID, 'apagar', board);
  for (const pinId of pinesID) {
    pinsManager.getPinById(pinId).low();
  }
}

function apagar(...pinesID) {
  apagarEn(undefined, ...pinesID);
}
global.apagar = apagar;

function serie(...pinesID) {
  const pinsManager = getPinsManager();
  const state = getState(pinsManager);
  checkPins(pinesID, 'bucleArduino', pinsManager.board);
  let intervalId;
  intervalId = setInterval(() => {
    doBuclePins(pinesID, pinsManager, state, () => clearInterval(intervalId));
  }, state.intervalo);
  state.bucleID = intervalId;
  state.bucleIds.push(state.bucleID);
}
global.serie = serie;

function cambiarIntervalo(argument) {
  const pinsManager = getPinsManager();
  const state = getState(pinsManager);
  state.intervalo = argument;
  clearInterval(state.bucleID);
  if (state.pines_global) {
    startBucle(pinsManager, state, state.pines_global);
  }
}
global.cambiarIntervalo = cambiarIntervalo;

function bucle(...pinesID) {
  const pinsManager = getPinsManager();
  const state = getState(pinsManager);
  if (pinesID.length !== 0) {
    state.pines_global = pinesID;
  } else {
    pinesID = state.pines_global;
  }
  startBucle(pinsManager, state, pinesID);
}

function startBucle(pinsManager, state, pinesID) {
  checkPins(pinesID, 'bucleArduino', pinsManager.board);
  state.bucleID = setInterval(() => doBuclePins(pinesID, pinsManager, state), state.intervalo);
  state.bucleIds.push(state.bucleID);
}
global.bucle = bucle;

function detenerBucle() {
  const state = getState(getPinsManager());
  clearInterval(state.bucleID);
}
global.detenerBucle = detenerBucle;

function apagarTodo() {
  const pinsManager = getPinsManager();
  const state = getState(pinsManager);
  pinsManager.stopAll();
  state.bucleIds.forEach(id => clearInterval(id));
  state.bucleID = null;
  apagarPinesParalelo(state);
}
global.apagarTodo = apagarTodo;

function apagarPinesParalelo(state) {
  if (state.pinesParalelo) {
    state.pinesParalelo.forEach((pin_object) => {
      clearTimeout(pin_object.init_id);
      clearTimeout(pin_object.stop_id);
    });
    state.pinesParalelo.length = 0;
  }
}

function paralelo(...pinesData) {
  const pinsManager = getPinsManager();
  const state = getState(pinsManager);
  apagarPinesParalelo(state);
  const pinesIds = pinesData.map(pinDatum => pinDatum.pin);
  checkPins(pinesIds, 'sameTime', pinsManager.board);
  state.pinesParalelo = pinesData;
  for (let i = 0; i < pinesData.length; i++) {
    pinesData[i].id = i;
    pinesData[i].fivePin = pinsManager.getPinById(pinesData[i].pin);
    pinesData[i].ciclo = function () {
      this.init_id = setTimeout(() => {
        this.fivePin.high();
        this.stop_id = setTimeout(() => {
          this.fivePin.low();
          state.pinesParalelo[this.id].ciclo();
        }, this.lapso * 1000);
      }, this.inicio * 1000);
    };
    pinesData[i].ciclo();
  }
}
global.paralelo = paralelo;

function doBuclePins(pinesID, pinsManager, state, onComplete) {
  const currentId = pinesID[state.contadorIndice];
  const previousId = state.contadorIndice > 0 ? pinesID[state.contadorIndice - 1] : pinesID[pinesID.length - 1];
  pinsManager.getPinById(currentId).high();
  pinsManager.getPinById(previousId).low();

  state.contadorIndice++;
  if (state.contadorIndice >= pinesID.length) {
    state.contadorIndice = 0;
    if (onComplete) onComplete();
  }
}

export { prenderEn, apagarEn };
