import GUI from 'lil-gui'; 
import init from '../init.js';
import { startWebcam } from '../camera/index.js';
const gui = new GUI();

gui.add(window.location,'reload').name('recargar')

gui.add({init},'init').name('iniciar')

gui.add({startWebcam},'startWebcam').name('encender la cámara')

export default gui