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
        console.log('temporizador created')
    }

    manejarTecla(tiempo, event) {
        console.log('Tecla presionada:', event.key, tiempo);
        if (this.esTeclaNumerica(event.key)) {
            prender(event.key);
            setTimeout(() => { apagar(event.key); }, tiempo);
        }
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