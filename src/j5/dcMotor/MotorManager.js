class MotorManager {
    constructor(opt)   {
    console.log("opts : ", opt);
    this.fiveMotor = new Motor([opt.pin1, opt.pin2, opt.pin3]);
    }
    elegirEstrategia(type) {
        console.log("type : ", type);
        if (this.strategy) this.strategy.stop();
        switch (type) {
            case 0:
                this.strategy = new Mover(this);
                break;
            case 1:
                this.strategy = new MoverAscDesc(this);
                break;
            case 2:
                this.strategy = new PrenderAscDesc(this);
                break;
            default:
                this.strategy = new Mover(this)
        }
    }
    actualizar(opts) {
        console.log("opts : ", opts);
        if (this.strategy) this.strategy.reset();
        console.log("opts.estado : ", opts.estado);
        this.elegirEstrategia(opts.estado);
    }
    ejecutarInstruccion(parametros) {
        this.strategy.muevase(parametros)
    }
    stop() {
        this.fiveMotor.stop();
        this.strategy.stop();
    }
}

class Strategy {
    constructor(motorManager) {
        this.motorManager = motorManager;
    }
    muevase(parametros) {
        console.log('muevase usando .fiveMotor');
    }
    stop() { }
    reset() { }
}

class Mover extends Strategy {
    constructor(motorManager) {
        super(motorManager);
        console.log('Mover created');
    }
    muevase(parametros) {
        let {dir, vel} = parametros;
        if(dir === 'derecha') {
            this.motorManager.fiveMotor.forward(vel);           
        }
        else if(dir === 'izquierda') {
            this.motorManager.fiveMotor.reverse(vel);
        }
    }
}

class MoverAscDesc extends Strategy {
    constructor(motorManager) {
        super(motorManager);
        this._intervalo = null;
        this._contadorVel = 30;
        console.log('MoverAscDesc created');
    }
    stop() {
        clearInterval(this._intervalo);
        this._intervalo = null;
    }
    muevase(parametros) {
        let {dir, tiempo, modo} = parametros;
        if(dir === 'derecha') {
            if(modo === 'ascendente') {
                let tiempoMillis = tiempo || 1000;
                if (this._intervalo) return;
                this._contadorVel = 30;
                this._intervalo = setInterval(() => {
                    this._contadorVel += 10;
                    //console.log('contadorVel : ', this._contadorVel);
                    if (this._contadorVel > 150) {
                        this._contadorVel = 150;
                    }
                    this.motorManager.fiveMotor.forward(this._contadorVel);
                }, tiempoMillis);
            }
            else if(modo === 'descendente') {
                let tiempoMillis = tiempo || 1000;
                //console.log('tiempoMillis : ', tiempoMillis);
                if (this._intervalo) return;
                this._contadorVel = 150;
                this._intervalo = setInterval(() => {
                    this._contadorVel -= 10;
                    //console.log('contadorVel : ', this._contadorVel);
                    if (this._contadorVel < 30) {
                        this._contadorVel = 30;
                    }
                    this.motorManager.fiveMotor.forward(this._contadorVel);
                }, tiempoMillis);
            }
        }
        else if(dir === 'izquierda') {
            if(modo === 'ascendente') {
                let tiempoMillis = tiempo || 1000;
                if (this._intervalo) return;
                this._contadorVel = 30;
                this._intervalo = setInterval(() => {
                    this._contadorVel += 10;
                    if (this._contadorVel > 150) {
                        this._contadorVel = 150;
                    }
                    this.motorManager.fiveMotor.reverse(this._contadorVel);
                }, tiempoMillis);
            }
            else if(modo === 'descendente') {
                let tiempoMillis = tiempo || 1000;
                if (this._intervalo) return;
                this._contadorVel = 150;
                this._intervalo = setInterval(() => {
                    this._contadorVel -= 10;
                    if (this._contadorVel < 30) {
                        this._contadorVel = 30;
                    }
                    this.motorManager.fiveMotor.reverse(this._contadorVel);
                }, tiempoMillis);
            }
        }
    }
}

class PrenderAscDesc extends Strategy {
    constructor(motorManager) {
        super(motorManager);
        console.log('PrenderAscDesc created');
    }
    muevase(parametros) {
        let {dir, vel, tiempo} = parametros;
        console.log('PrenderAscDesc muevase : ', parametros);
        let tiempoMillis = tiempo || 1000;
        if (this._timer) return;
        if (dir === 'derecha') {
            this.motorManager.fiveMotor.forward(vel);
        } else if (dir === 'izquierda') {
            this.motorManager.fiveMotor.reverse(vel);
        } else {
            return;
        }
        this._timer = setTimeout(() => {
            this.motorManager.fiveMotor.stop();
            this._timer = null;
        }, tiempoMillis);
    }
}


export default MotorManager;




