import CodeMirror from 'codemirror-minified/lib/codemirror'
import 'codemirror-minified/mode/javascript/javascript'
import EventEmitter from 'events'
import { appStorage } from '../storage/appStorage'

export default class Editor extends EventEmitter {
  constructor(parent) {
    super()

    const opts = {
      mode: { name: 'javascript', globalVars: true },
      value: 'dosis',
      theme: 'tomorrow-night-eighties',
      extraKeys: this.extraKeys(),
      lineNumbers: true,
      lineWrapping: true,
    }
    this.cm = CodeMirror.fromTextArea(parent, opts)
    window.cm = this.cm
    this.cm.refresh()

    this.cm.setValue('\n \n console.log("Dosis Web - Live Coding & Harware Hacking") \n\n toplap Bogotá ::  CTRL+enter')

    this.isVisible = true;
    this.domElement = this.cm.getWrapperElement();

  }
  extraKeys() {
    self = this
    return {
      'Ctrl-Alt-Enter': (cm) => {
        var text = this.selectLine(cm)
        this.localStorageSave(cm);
        this.emit('eval', text)
      },
      'Ctrl-Enter': (cm) => {
        let text = this.selectCurrentBlock(cm);
        this.localStorageSave(cm)
        this.emit('eval', text)
      },
      'Shift-Ctrl-H': (cm)=>{
        if(this.isVisible){
          this.domElement.style.opacity = '0'
          this.isVisible = false
        }else{
          this.domElement.style.opacity = '1'
          this.isVisible = true
        }
        this.emit('hide-all',this.isVisible)
      }
    }
  }
  selectLine(cm) {
    const line = cm.getLine(cm.getCursor().line);
    return line
  }

  selectCurrentBlock(cm) { // thanks to graham wakefield + gibber
    var pos = cm.getCursor()
    var startline = pos.line
    var endline = pos.line
    var currentText = cm.getLine(startline).trim();
    while (startline > 0 && currentText !== '') {
      startline--
      currentText = cm.getLine(startline).trim();
    }
    currentText = cm.getLine(endline).trim();
    while (endline < cm.lineCount() && currentText !== '') {
      endline++
      currentText = cm.getLine(endline)?.trim();
    }
    var pos1 = {
      line: startline,
      ch: 0
    }
    var pos2 = {
      line: endline,
      ch: 0
    }
    var str = cm.getRange(pos1, pos2)
    return str
  }
  localStorageSave(cm) {
    let lastCode = cm.doc.getValue();
    appStorage.setItem('code', lastCode)
  }
}
