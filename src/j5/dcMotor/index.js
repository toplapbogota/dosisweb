import MotorManager from "./MotorManager";
import { getBoard } from "../boards";

// Pausa de frenado antes de invertir dirección/velocidad, para evitar el pico
// de corriente (back-EMF) de un cambio brusco de sentido en el puente H.
// Mismo valor que ya usaba la estrategia VaYVuelve internamente.
const BRAKE_DELAY_MS = 150;

const motorsByBoard = new WeakMap();

function dcmotor(configuracion) {
    console.log("configuracion : ", configuracion);
    const board = getBoard(configuracion.board);
    let motorState = motorsByBoard.get(board);
    if (!motorState) {
        motorState = { motorDC: null, pendingTimeout: null };
        motorsByBoard.set(board, motorState);
    }

    if (motorState.pendingTimeout) {
        clearTimeout(motorState.pendingTimeout);
        motorState.pendingTimeout = null;
    }

    const ejecutar = () => {
        motorState.pendingTimeout = null;
        motorState.motorDC.actualizar(configuracion);
        motorState.motorDC.ejecutarInstruccion(configuracion);
    };

    if (!motorState.motorDC) {
        motorState.motorDC = new MotorManager({ ...configuracion, board });
        ejecutar();
    } else {
        motorState.motorDC.stop();
        motorState.pendingTimeout = setTimeout(ejecutar, BRAKE_DELAY_MS);
    }
}


function apagarMotoresDC(boardId) {
    const motorState = motorsByBoard.get(getBoard(boardId));
    if (!motorState) return;
    if (motorState.pendingTimeout) {
        clearTimeout(motorState.pendingTimeout);
        motorState.pendingTimeout = null;
    }
    //if there are not pins, stop all motors
    if (motorState.motorDC) {
        console.log('stopping motor');
        motorState.motorDC.stop();
        console.log(motorState.motorDC);
    }
}

global.dcmotor = dcmotor;
global.apagarMotoresDC = apagarMotoresDC;