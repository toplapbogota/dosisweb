import StepperManager from "./StepperManager";

let stepperMotor;
let sm;
function stepper(configuracion){
    console.log("configuracion 1 : ",configuracion);
    /*
    let pin = configuracion.pin;
    let start = configuracion.start;
    let final = configuracion.final;
    let tiempo = configuracion.tiempo;
    let estrategia = configuracion.estado;
    console.log("estrategia : ",estrategia);
    console.log("pin : ",pin);
    // let stepperMotor = ste[pin]
    let range = [start, final]
    */
    if(!stepperMotor){
        // pines_servos.push(pin)
        stepperMotor = new StepperManager(configuracion);
        sm = stepperMotor.fiveStepper;
        // console.log("sm : ",sm);
        // servos[pin]=servoMotor
    }else{
        stepperMotor.stop();
    }
    stepperMotor.actualizar(configuracion);
    stepperMotor.ejecutarInstruccion(configuracion);
}

function detenerPAP() {
  if(stepperMotor){
    stepperMotor.stop();
  }
}


global.stepper = stepper