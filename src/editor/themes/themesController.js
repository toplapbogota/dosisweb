import { EventEmitter } from 'events';
import themes from './themes.js';

export default class ThemeController extends EventEmitter {
  constructor(editor, gui) {
    super();

    this.editor = editor;
    this.gui = gui;
    this.isSyncing = false;

    this.controller = this.gui
      .add(themes, 'current', themes.allThemes)
      .name('Theme')
      .onChange(this.handleChange.bind(this));
  }

  handleChange(theme) {
    if (this.isSyncing) return;

    this._setTheme(theme);
  }

  /**
  * If we don't do this _setTheme + setTheme + isSyncing guard, we will get an infinite loop.
  * Example: calling setTheme() programmatically from outside triggers controller.setValue(),
  * which fires the GUI onChange handler, which calls handleChange(),
  * which again calls _setTheme() → causing a feedback loop between
  * programmatic updates and user-change events.
  */
  setTheme(theme) {
    this.isSyncing = true;

    try {
      this.controller.setValue(theme);
    } finally {
      this.isSyncing = false;
    }

    this._setTheme(theme);
  }

  _setTheme(theme) {
    if (this.editor.getOption('theme') === theme) {
      return;
    }

    this.editor.setOption('theme', theme);

    this.emit('themeChanged', theme);
  }
}