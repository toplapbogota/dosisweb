import './ui/gui'
import './polyfills/hrtime'

import Editor from './editor'
import handleEval from './evaluation'
import { appStorage } from './storage/appStorage'


const editorTextArea = document.querySelector('textarea')

const editor = new Editor(editorTextArea)

const storedCode = appStorage.getItem('code');
storedCode && editor.cm.setValue(storedCode)

editor.on('eval', handleEval)