import five, { Board, Stepper, Motor, Servo } from 'johnny-five';
import './pins';
import './servo'

global.five = five
global.Stepper = Stepper
global.Motor = Motor
global.Servo = Servo

function handleIOReady(io) {
  return () => {
    console.log('handleIOReady')
    const board = global.board = new Board({ io, repl: false });
    board.on('message', (msg) => {
      console.log("board message: ", msg);
    });
    board.on('ready', () => {
      console.log('johnny five in browser !!!!');
    });
    board.on('error', console.error);
  }
}

export default handleIOReady