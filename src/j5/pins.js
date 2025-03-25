import { pinsManager, checkPins } from "./pins/pinsManager";

const pines = [];
let contadorIndice = 0;
let pines_global;
let intervalo = 1000;
let bucleID = -1;
let bucleIds = [];


function prender(...pinesID) {
  checkPins(pinesID, 'prender');
  console.log("pines : ", pinesID);

  for (let i = 0; i < pinesID.length; i++) {
    console.log(i);
    pinsManager.getPinById(pinesID[i]).high();
    // pines[pinesID[i]].high();
  }
}
global.prender = prender;
global.encender = prender;
global.OnArduino = prender;

function apagar(...pinesID) {
  checkPins(pinesID, 'prender');
  console.log("pines : ", pinesID);

  for (let i = 0; i < pinesID.length; i++) {
    console.log(i);
    pinsManager.getPinById(pinesID[i]).low();
  }
}

global.apagar = apagar;
global.OffArduino = apagar;

function serie(...pinesID) {
  checkPins(pinesID, 'bucleArduino');
  // let pines = pinsManager.j5Pins
  bucleID = setInterval(() => { doBuclePins(pinesID, true) }, intervalo);
  bucleIds.push(bucleID);
}

global.serie = serie;
global.OnceArduino = serie;

function cambiarIntervalo(argument) {
  intervalo = argument;
  clearInterval(bucleID);
  bucle();
}

global.cambiarIntervalo = cambiarIntervalo;

function bucle(...pinesID) {
  checkPins(pinesID, 'bucleArduino');
  // let pines = pinsManager.j5Pins
  if (pinesID.length !== 0) {
    pines_global = pinesID;
  }
  else {
    pinesID = pines_global;
  }


  bucleID = setInterval(() => { doBuclePins(pinesID) }, intervalo)
  bucleIds.push(bucleID);
}

global.bucle = bucle;
global.LoopArduino = bucle;

function detenerBucle() {
  clearInterval(bucleID);
}

global.detenerBucle = detenerBucle;
global.PararArduino = detenerBucle;

function apagarTodo() {
  const pins = pinsManager.pins;
  console.log('apagarTodo : ', pins);
  pinsManager.stopAll();
  clearInterval(bucleID);
  bucleID = null;
  bucleIds.forEach(x => {
    clearInterval(x)

  })
  // apagarServos();
  apagarPinesParalelo();
}

function apagarPinesParalelo() {
  if (pinesParalelo) {
    pinesParalelo.forEach(function (pin_object) {
      clearTimeout(pin_object.init_id)
      clearTimeout(pin_object.stop_id)
    })
    pinesParalelo.length = 0;
  }
}

global.apagarTodo = apagarTodo

let pinesParalelo;
/**
 * 
 * @param  {...any} pinesData a list of {pin,inicio,lapso} objects
 */
function paralelo(...pinesData) {
  apagarPinesParalelo();
  //console.log("PinesData : ",PinesData);
  var pinesIds = pinesData.map(pinDatum => pinDatum.pin);
  let fivePins = checkPins(pinesIds, 'sameTime');
  // return;
  pinesParalelo = pinesData;
  for (var i = 0; i < pinesData.length; i++) {
    let pinId = pinesData[i].pin;
    pinesData[i].id = i;
    pinesData[i].fivePin = pinsManager.getPinById(pinId);
    pinesData[i].ciclo = function () {
      this.init_id = setTimeout(() => {
        console.log('inicio', this.pin);
        this.fivePin.high();
        this.stop_id = setTimeout(() => {
          console.log('stop', this.pin);
          this.fivePin.low();
          pinesParalelo[this.id].ciclo();
        },
          this.lapso * 1000)
      }, this.inicio * 1000)
    }
    pinesData[i].ciclo();

  }

}

global.paralelo = paralelo


function doBuclePins(pinesID, isOnce = false) {

  console.log('-------------------------------')
  let currentId = pinesID[contadorIndice];
  let previousId;
  let lastId = pinesID[pinesID.length - 1];
  pinsManager.getPinById(currentId).high();
  // pines[].high();

  if (contadorIndice > 0) {
    previousId = pinesID[contadorIndice - 1];
    pinsManager.getPinById(previousId).low();
    // pines[previousId].low();
  }
  else {
    pinsManager.getPinById(lastId).low();
    // pines[lastId].low();   
  }

  contadorIndice++;

  if (contadorIndice >= pinesID.length) {
    contadorIndice = 0;
    if (isOnce) clearInterval(bucleID);
  }


}