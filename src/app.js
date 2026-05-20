import './ui/gui'
import './polyfills/hrtime'
import './camera/index'

import Editor from './editor'
import handleEval from './evaluation'
import { appStorage } from './storage/appStorage'
import { setupThemeController } from './ui/gui'


const editorTextArea = document.querySelector('textarea')

const editor = new Editor(editorTextArea)
editor.on('eval', handleEval)

const storedCode = appStorage.getItem('code');
storedCode && editor.cm.setValue(storedCode)

const themeController = setupThemeController(editor.cm)
themeController.on('themeChanged', (theme) => {
  appStorage.setItem('theme', theme);
})

const storedTheme = appStorage.getItem('theme');
storedTheme && themeController.setTheme(storedTheme)