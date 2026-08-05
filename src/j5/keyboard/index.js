
import KeyboardManager from "./keyboardManager";

let keyboard;

function teclado(configuracion) {
    console.log("configuracion : ", configuracion);

    if (keyboard) {
        keyboard.stop();
    }

    keyboard = new KeyboardManager(configuracion);

    keyboard.actualizar(configuracion);
    keyboard.ejecutarInstruccion(configuracion);
}

global.teclado = teclado

function pararTeclado() {
    if (keyboard) {
        keyboard.stop();
    }
}

global.pararTeclado = pararTeclado