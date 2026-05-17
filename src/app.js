import './ui/gui'
import './polyfills/hrtime'

import Editor from './editor'
import handleEval from './evaluation'
import { appStorage } from './storage/appStorage'
import { setupThemeController } from './ui/gui'


const editorTextArea = document.querySelector('textarea')

const editor = new Editor(editorTextArea)

const storedCode = appStorage.getItem('code');
storedCode && editor.cm.setValue(storedCode)

const themeController = setupThemeController(editor.cm)
editor.on('eval', handleEval)