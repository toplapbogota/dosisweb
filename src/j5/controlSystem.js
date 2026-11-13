import five, { Board, Stepper, Motor, Servo } from 'johnny-five';
import './pins';
import './servo';
import './stepper';
import './keyboard';
import './dcMotor';
import { registerBoard } from './boards';

global.five = five
global.Stepper = Stepper
global.Motor = Motor
global.Servo = Servo

function handleIOReady(id) {
  return (io) => () => {
    console.log('handleIOReady')
    const board = new Board({ io, repl: false, id });
    registerBoard(id, board);
    board.on('message', (msg) => {
      console.log("board message: ", msg);
    });
    board.on('ready', () => {
      console.log('johnny five in browser !!!!');
      document.getElementById('board-overlay')?.classList.add('board-ready');
      window.dispatchEvent(new CustomEvent('arduino-ready', { detail: { id } }));
    });
    board.on('error', console.error);
  }
}

export default handleIOReady