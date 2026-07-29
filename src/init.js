import handleIOReady from './j5/controlSystem';
import handleStart from './serial/handleStart';

function init(port){
  handleStart(handleIOReady, port)
}

export default init