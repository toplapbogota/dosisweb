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
            default:
                this.strategy = new Mover(this)
        }
    }
    actualizar(opts) {
        console.log("opts : ", opts);
        if (this.strategy) this.strategy.reset();
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
        console.log('muevase usando mover()');
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

export default MotorManager;




