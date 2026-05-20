
import KeyboardManager from "./keyboardManager";

let keyboard;

function teclado(configuracion) {
    console.log("configuracion : ", configuracion);


    keyboard = new KeyboardManager(configuracion);

    keyboard.actualizar(configuracion);
    keyboard.ejecutarInstruccion(configuracion);
}

global.teclado = teclado

function pararTeclado() {
    keyboard.stop();
}

global.pararTeclado = pararTeclado