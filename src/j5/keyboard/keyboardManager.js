class KeyboardManager {

    constructor(opts) {
        console.log("opts : ", opts);


    }
    elegirEstrategia(type) {
        console.log("type : ", type);
        if (this.strategy) this.strategy.stop();
        switch (type) {
            case 0:
                this.strategy = new Temporizador(this);
                break;
            case 1:
                this.strategy = new Presionado(this)
                break;
            default:
                this.strategy = new Temporizador(this)
        }
    }
    actualizar(opts) {
        if (this.strategy) this.strategy.reset();
        this.elegirEstrategia(opts.estado);
    }
    ejecutarInstruccion(parametros) {
        this.strategy.prendase(parametros)
    }
    stop() {
        this.strategy.stop();
    }
}


class Strategy {
    constructor(keyboardManager) {
        this.keyboardManager = keyboardManager;
        this.eventosAsignados = false;
        this.presionarTecla = null;
    }
    esTeclaNumerica(key) {
        return /^[2-9]$/.test(key);
    }
    prendase(parametros) {
        console.log('prendase usando prender()');
    }
    stop() { }
    reset() { }
}


class Temporizador extends Strategy {
    constructor(keyboardManager) {
        super(keyboardManager)
        // Un timer por tecla activa. El navegador dispara "keydown" repetidas
        // veces mientras se mantiene la tecla presionada, y cada pulsación de
        // una misma tecla debe reiniciar su propia ventana de tiempo en vez de
        // apilar timeouts independientes: sin esto, un timeout viejo de una
        // pulsación anterior puede apagar el pin justo después de reactivarlo.
        this._timers = new Map();
        console.log('temporizador created')
    }

    manejarTecla(tiempo, event) {
        console.log('Tecla presionada:', event.key, tiempo);
        if (!this.esTeclaNumerica(event.key)) return;
        const key = event.key;
        const timerExistente = this._timers.get(key);
        if (timerExistente) {
            clearTimeout(timerExistente);
        } else {
            prender(key);
        }
        this._timers.set(key, setTimeout(() => {
            this._timers.delete(key);
            apagar(key);
        }, tiempo));
    }

    prendase(parametros) {

        this.presionarTecla = this.manejarTecla.bind(this, parametros.tiempo);
        if (!this.eventosAsignados) {
            document.addEventListener('keydown', this.presionarTecla);
            this.eventosAsignados = true;
        }
    }

    stop() {
        if (this.presionarTecla)
            document.removeEventListener('keydown', this.presionarTecla);
        this._timers.forEach((id, key) => {
            clearTimeout(id);
            apagar(key);
        });
        this._timers.clear();
    }
}

class Presionado extends Strategy {
    constructor(keyboardManager) {
        super(keyboardManager);

        this.soltarTecla = null;
        this.teclasActivas = new Set();

        console.log('Presionado created');
    }

    prendase(parametros) {

        // Remueve handlers anteriores si existen
        //if (this.presionarTecla) document.removeEventListener('keydown', this.presionarTecla);
        //if (this.soltarTecla) document.removeEventListener('keyup', this.soltarTecla);

        this.presionarTecla = (event) => {
            if (this.esTeclaNumerica(event.key) && !this.teclasActivas.has(event.key)) {
                this.teclasActivas.add(event.key);
                prender(event.key);
            }
        };

        this.soltarTecla = (event) => {
            if (this.esTeclaNumerica(event.key) && this.teclasActivas.has(event.key)) {
                this.teclasActivas.delete(event.key);
                apagar(event.key);
            }
        };

        if (!this.eventosAsignados) {
            document.addEventListener('keydown', this.presionarTecla);
            document.addEventListener('keyup', this.soltarTecla);
            this.eventosAsignados = true;
        }

    }

    stop() {
        if (this.presionarTecla) document.removeEventListener('keydown', this.presionarTecla);
        if (this.soltarTecla) document.removeEventListener('keyup', this.soltarTecla);
        this.teclasActivas.forEach(key => apagar(key));
        this.teclasActivas.clear();
    }

    reset() {
        this.stop();
    }

}
export default KeyboardManager