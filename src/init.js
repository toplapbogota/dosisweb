import handleIOReady from './j5/controlSystem';
import handleStart from './serial/handleStart';

function init(){
  handleStart(handleIOReady)
}

export default init