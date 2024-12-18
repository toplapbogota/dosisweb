import ServoManager from "./ServoManager";

const servos = [];
const pines_servos = [];
function servo(configuracion) {
  console.log("configuracion : ", configuracion);
  let pin = configuracion.pin;
  let start = configuracion.start;
  let final = configuracion.final;
  let tiempo = configuracion.tiempo;
  let estrategia = configuracion.estado;
  console.log("estrategia : ", estrategia);
  console.log("pin : ", pin);
  let servoMotor = servos[pin]
  let range = [start, final]
  if (!servoMotor) {
    pines_servos.push(pin)
    servoMotor = new ServoManager({
      pin,
      range,
      tiempo
    });
    servos[pin] = servoMotor
  } else {
    console.log('stopping servo')
    servoMotor.stop();
  }
  servoMotor.actualizar({ estrategia, range });
  servoMotor.ejecutarInstruccion(configuracion);
}
global.servo = servo

function apagarServos() {
  var pin;
  for (pin in servos) {
    var servo = servos[pin];
    servo.stop();
  }
}

global.apagarServos = apagarServos