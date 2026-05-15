import GUI from 'lil-gui';

import init from '../init.js';

import ThemeController from '../editor/themes/themesController.js';

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
  });

  return themeController;
}

export default gui;