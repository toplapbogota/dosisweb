
import KeyboardManager from "./keyboardManager";
import { getBoard } from "../boards";

const keyboardsByBoard = new WeakMap();

function teclado(configuracion) {
    console.log("configuracion : ", configuracion);
    const board = getBoard(configuracion.board);
    let keyboard = keyboardsByBoard.get(board);

    if (keyboard) {
        keyboard.stop();
    }

    keyboard = new KeyboardManager(configuracion, board);
    keyboardsByBoard.set(board, keyboard);

    keyboard.actualizar(configuracion);
    keyboard.ejecutarInstruccion(configuracion);
}

global.teclado = teclado

function pararTeclado(boardId) {
    const keyboard = keyboardsByBoard.get(getBoard(boardId));
    if (keyboard) {
        keyboard.stop();
    }
}

global.pararTeclado = pararTeclado