import GUI from 'lil-gui';

import init from '../init.js';

import ThemeController from '../editor/themes/themesController.js';
import themesBackgroundColors from '../editor/themes/themesBackgroundsColors.js';
import { getAuthorizedPort } from '../serial/serialport.js';

const gui = new GUI();

gui.add(window.location, 'reload').name('recargar');

const initArduinoController = gui.add({ init }, 'init').name('iniciar');

// Reconexión automática: si el navegador recuerda un puerto ya autorizado nos
// conectamos solos al cargar y mostramos un indicador deshabilitado. Si no hay
// ningún puerto autorizado ofrecemos el botón "iniciar" para que el usuario
// elija la arduino por primera vez (lo que muestra el selector de Web Serial).
const estadoArduino = { arduino: '' };

getAuthorizedPort().then((port) => {
  if (port) {
    init(port);
    estadoArduino.arduino = 'arduino detectado';
    gui.add(estadoArduino, 'arduino').name('arduino').disable();
    initArduinoController.destroy();
  } 
});

export function setupThemeController(editor) {
  const themeController = new ThemeController(editor, gui);

  themeController.on('themeChanged', (theme) => {
    console.log(
      '%c Theme changed to:',
      'color: #0e93e0;background: #aaefe5;',
      theme
    );
    const backgroundColor =
      themesBackgroundColors[theme];
  
    if (backgroundColor) {
      document.documentElement.style.backgroundColor = backgroundColor;
      document.body.style.backgroundColor = backgroundColor;
      const editorContainer = document.getElementById('editor-container');
      if (editorContainer) {
        editorContainer.style.backgroundColor = backgroundColor;
      }
    }
  });
  return themeController;
}

export default gui;
