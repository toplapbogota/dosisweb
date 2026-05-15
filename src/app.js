import './ui/gui'
import './polyfills/hrtime'

import Editor from './editor'
import handleEval from './evaluation'
import storedObject from './session'
import { setupThemeController } from './ui/gui'


const editorTextArea = document.querySelector('textarea')

const editor = new Editor(editorTextArea)
storedObject && editor.cm.setValue(storedObject.code)
const themeController = setupThemeController(editor.cm)
editor.on('eval', handleEval)