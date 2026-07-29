import MotorManager from "./MotorManager";

// Pausa de frenado antes de invertir dirección/velocidad, para evitar el pico
// de corriente (back-EMF) de un cambio brusco de sentido en el puente H.
// Mismo valor que ya usaba la estrategia VaYVuelve internamente.
const BRAKE_DELAY_MS = 150;

let motorDC;
let pendingTimeout;

function dcmotor(configuracion) {
    console.log("configuracion : ", configuracion);

    if (pendingTimeout) {
        clearTimeout(pendingTimeout);
        pendingTimeout = null;
    }

    const ejecutar = () => {
        pendingTimeout = null;
        motorDC.actualizar(configuracion);
        motorDC.ejecutarInstruccion(configuracion);
    };

    if (!motorDC) {
        motorDC = new MotorManager(configuracion);
        ejecutar();
    } else {
        motorDC.stop();
        pendingTimeout = setTimeout(ejecutar, BRAKE_DELAY_MS);
    }
}


function apagarMotoresDC() {
    if (pendingTimeout) {
        clearTimeout(pendingTimeout);
        pendingTimeout = null;
    }
    //if there are not pins, stop all motors
    if (motorDC) {
        console.log('stopping motor');
        motorDC.stop();
        console.log(motorDC);
    }
}

global.dcmotor = dcmotor;
global.apagarMotoresDC = apagarMotoresDC;