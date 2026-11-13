import handleIOReady from './j5/controlSystem';
import handleStart from './serial/handleStart';

let nextBoardId = 1;

function init() {
  const id = `arduino-${nextBoardId++}`;
  handleStart(handleIOReady(id));
  return id;
}

global.connectArduino = init;

export default init