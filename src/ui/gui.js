import GUI from 'lil-gui'; 
import init from '../init.js';

const gui = new GUI();

gui.add(window.location,'reload').name('recargar')

gui.add({init},'init').name('iniciar')


export default gui