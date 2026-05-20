import GUI from 'lil-gui';

import init from '../init.js';

import ThemeController from '../editor/themes/themesController.js';
import themesBackgroundColors from '../editor/themes/themesBackgroundsColors.js';

const gui = new GUI();

gui.add(window.location, 'reload').name('recargar');

gui.add({ init }, 'init').name('iniciar');

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
      document.body.style.backgroundColor =
        backgroundColor;
    }
  });
  return themeController;
}

export default gui;
