class ServoManager {
  // class DosisServoMotor {
  constructor(opts) {
    console.log("opts : ", opts);
    this.fiveServo = new Servo(opts);


    // console.log('servo en pin no. :', pin)
    // thispinValue = opts.pin ;
    // this.range = opts.range

  }
  elegirEstrategia(type) {
    console.log("type : ", type);
    if (this.strategy) this.strategy.stop();
    switch (type) {
      case 0:
        this.strategy = new Bucle(this);
        break;
      case 1:
        this.strategy = new Ir(this)
        break;
      case 2:
        this.strategy = new IrRapido(this)
        break;
      case 3:
        this.strategy = new PorPasos(this)
        break;
      case 4:
        this.strategy = new BucleConPausa(this)
        break;
      case 5:
        this.strategy = new PorPasosEnBucle(this)
        break;
      default:
        this.strategy = new Bucle(this)
    }
  }
  actualizar(opts) {
    this.fiveServo.range = opts.range;
    if (this.strategy) this.strategy.reset();
    this.elegirEstrategia(opts.estrategia);
  }
  ejecutarInstruccion(parametros) {
    this.strategy.muevase(parametros)
  }
  stop() {
    this.fiveServo.stop();
    this.strategy.stop();
  }
}
/*
class DosisLed {
  constructor(pin){
    this.fiveServo = new FiveLed(pin)
    console.log('fiveServo en pin no. :', pin)
  }
  elegirEstrategia(type){
    switch(type) {
      case 0:
        this.strategy = new Bucle(this)
        break
      case 1:
        this.strategy = new Ir(this)
        break
      default:
        this.strategy = new Bucle(this)
    }
  }

  ejecutarInstruccion (parametros){
    this.strategy.muevase(parametros)
  }
}
*/
class Strategy {
  constructor(motor) {
    this.servoDosis = motor;
  }
  //AlgorithmInterface
  muevase(parametros) {
    console.log('muevase usando five.animation api');
  }
  stop() { }
  reset() { }
}

// fiveServo.to(grados, tiempo) delega en el Animation de johnny-five, que
// para movimientos de menos de 5s usa el paquete "temporal" (ver
// animation.js: "temporal can push CPU utilization to 100%") en vez de
// setInterval. Ese busy-loop monopoliza el hilo de JS mientras dura el
// movimiento: ninguna otra instrucción (otro servo, dcmotor, teclado, nuevo
// código evaluado) puede correr hasta que termine. Tween reemplaza esa
// animación por una interpolación propia con setInterval, que sí cede el
// control al event loop entre cada paso, y escribe con fiveServo.to(angulo)
// sin tiempo (la rama de escritura inmediata de johnny-five, sin Animation).
class Tween {
  constructor({ fiveServo, keyFrames, cuePoints, duracionMs, pasoMs = 30, metronomic = false, oncomplete }) {
    this.fiveServo = fiveServo;
    this.keyFrames = keyFrames;
    this.cuePoints = cuePoints || keyFrames.map((_, i) => i / (keyFrames.length - 1));
    this.duracionMs = duracionMs;
    this.pasoMs = pasoMs;
    this.metronomic = metronomic;
    this.oncomplete = oncomplete;
    this._intervalo = null;
    this._inicioTiempo = 0;
  }
  iniciar() {
    this.detener();
    this._inicioTiempo = Date.now();
    this._intervalo = setInterval(() => this._tick(), this.pasoMs);
    this._tick();
  }
  _tick() {
    const transcurrido = Date.now() - this._inicioTiempo;
    const progreso = this.duracionMs > 0 ? Math.min(transcurrido / this.duracionMs, 1) : 1;
    this.fiveServo.to(this._valorEn(progreso));
    if (progreso >= 1) {
      if (this.metronomic) {
        this.keyFrames = [...this.keyFrames].reverse();
        this._inicioTiempo = Date.now();
      } else {
        this.detener();
        if (this.oncomplete) this.oncomplete();
      }
    }
  }
  _valorEn(progreso) {
    let i = this.cuePoints.findIndex(c => c >= progreso);
    if (i <= 0) i = 1;
    const izq = this.cuePoints[i - 1];
    const der = this.cuePoints[i];
    const t = der > izq ? (progreso - izq) / (der - izq) : 1;
    const valIzq = this.keyFrames[i - 1];
    const valDer = this.keyFrames[i];
    return valIzq + (valDer - valIzq) * t;
  }
  detener() {
    if (this._intervalo) {
      clearInterval(this._intervalo);
      this._intervalo = null;
    }
  }
}

class Bucle extends Strategy {
  constructor(motor) {
    super(motor)
    this._tween = null;
    console.log('Bucle created')
  }

  muevase(parametros) {
    console.log("parametros : Bucle", parametros);
    this.stop();
    const fiveServo = this.servoDosis.fiveServo;
    const [desde, hasta] = fiveServo.range;
    // Equivalente a sweep() de johnny-five (va y vuelve sin parar) pero
    // con Tween en vez de Animation/temporal.
    this._tween = new Tween({
      fiveServo,
      keyFrames: [desde, hasta],
      duracionMs: 1000,
      metronomic: true
    });
    this._tween.iniciar();
  }
  stop() {
    if (this._tween) {
      this._tween.detener();
      this._tween = null;
    }
  }
}

class Ir extends Strategy {
  constructor(motor) {
    super(motor)
    this._tween = null;
    console.log('Ir created')
  }

  muevase(parametros) {
    console.log("parametros : Ir", parametros);
    this.stop();

    const fiveServo = this.servoDosis.fiveServo;
    const final = parametros.final;
    const duracionMs = (parametros.tiempo || 0) * 1000;

    if (!duracionMs) {
      fiveServo.to(final);
      return;
    }

    const inicio = fiveServo.position >= 0 ? fiveServo.position : (parametros.start ?? final);
    this._tween = new Tween({ fiveServo, keyFrames: [inicio, final], duracionMs });
    this._tween.iniciar();
  }

  stop() {
    if (this._tween) {
      this._tween.detener();
      this._tween = null;
    }
  }
}
class IrRapido extends Strategy {
  constructor(motor) {
    super(motor)
  }

  muevase(parametros) {
    // Sin tiempo: escritura inmediata de johnny-five, no pasa por Animation.
    this.servoDosis.fiveServo.to(parametros.final)
  }
}

class PorPasos extends Strategy {
  constructor(motor) {
    super(motor)
    this._tween = null;
  }

  muevase(parametros) {
    this.stop();
    const fiveServo = this.servoDosis.fiveServo;
    const final = parametros.final;
    const duracionMs = (parametros.tiempo || 0) * 1000;

    if (!duracionMs) {
      fiveServo.to(final);
      return;
    }

    const inicio = fiveServo.position >= 0 ? fiveServo.position : (parametros.start ?? final);
    // parametros.pasos hacía antes de "rate" (fps) para fiveServo.to(); se
    // conserva el mismo significado como frecuencia de la interpolación.
    const pasoMs = parametros.pasos ? Math.max(10, Math.round(1000 / parametros.pasos)) : 30;
    this._tween = new Tween({ fiveServo, keyFrames: [inicio, final], duracionMs, pasoMs });
    this._tween.iniciar();
  }

  stop() {
    if (this._tween) {
      this._tween.detener();
      this._tween = null;
    }
  }
}
class PorPasosEnBucle extends Strategy {
  constructor(motor) {
    super(motor)
    this.flag = true;
    this._tween = null;
  }

  muevase(parametros) {
    if (parametros) {
      this.parametros = parametros;
    } else {
      parametros = this.parametros;
    }
    this.stop();

    const fiveServo = this.servoDosis.fiveServo;
    const { start, final, tiempo, pasos } = parametros;
    const objetivo = this.flag ? final : start;
    const duracionMs = (tiempo || 0) * 1000;
    const inicio = fiveServo.position >= 0 ? fiveServo.position : (this.flag ? start : final);
    const pasoMs = pasos ? Math.max(10, Math.round(1000 / pasos)) : 30;

    this._tween = new Tween({
      fiveServo,
      keyFrames: [inicio, objetivo],
      duracionMs,
      pasoMs,
      oncomplete: () => {
        this.flag = !this.flag;
        this.muevase();
      }
    });
    this._tween.iniciar();
  }
  stop() {
    if (this._tween) {
      this._tween.detener();
      this._tween = null;
    }
  }
  reset() {
    this.stop()
  }
}
class BucleConPausa extends Strategy {
  constructor(motor) {
    super(motor);
    this._tween = null;
    this.setTimeoutId = 0;
  }

  muevase(parametros) {
    console.log("parametros : ", parametros);
    if (this._tween) {
      this._tween.detener();
      this._tween = null;
    }
    const fiveServo = this.servoDosis.fiveServo;
    this._tween = new Tween({
      fiveServo,
      keyFrames: [parametros.start, parametros.final, parametros.start, parametros.final],
      cuePoints: [0, 0.3, 0.6, 1.0],
      duracionMs: (parametros.tiempoMov || 0) * 1000,
      oncomplete: () => {
        if (this.setTimeoutId === -1) return
        this.setTimeoutId = setTimeout(() => {
          if (this.setTimeoutId === -1) return
          this.muevase(parametros)
        }, (parametros.tiempoPausa || 0) * 1000);
      }
    });
    this._tween.iniciar();
  }
  stop() {
    clearTimeout(this.setTimeoutId);
    this.setTimeoutId = -1;
    if (this._tween) {
      this._tween.detener();
      this._tween = null;
    }
  }
}

function init_Strategy() {
  //Contexttt
  console.log('usuario envia primera orden xxxxxxxxxxxxxxxxxxxxx');
  let servoMotor = new DosisServoMotor(9)
  //nuevo: cuando llega el comando del usuario.
  servoMotor.elegirEstrategia("A")
  let configBucle = {
    duration: 2000,
    cuePoints: [0, 0.25, 0.5, 0.75, 1.0],
    keyFrames: [{ degrees: 0 }, { degrees: 135 }, { degrees: 45 }, { degrees: 180 }, { degrees: 0 }]
  }
  //en otro momento por definir
  servoMotor.ejecutarInstruccion(configBucle);
  //nuevo: cuando llega el comando del usuario.
  console.log('usuario envia otra orden +++++++++++++++++++++++++++');
  servoMotor.elegirEstrategia("B");
  servoMotor.ejecutarInstruccion();

  // let contextB = new DosisServoMotor("B")
  // contextB.ejecutarInstruccion()
}
// init_Strategy()
export default ServoManager