import './ui/gui'
import './polyfills/hrtime'
import './camera/index'

import Editor from './editor'
import handleEval from './evaluation'
import storedObject from './session'


const editorTextArea = document.querySelector('textarea')

const editor = new Editor(editorTextArea)
storedObject && editor.cm.setValue(storedObject.code)

editor.on('eval', handleEval)