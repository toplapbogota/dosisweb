import StepperManager from "./StepperManager";

let stepperMotor;
let sm;
function stepper(configuracion){
    console.log("configuracion 1 : ",configuracion);

    const ejecutar = () => {
        stepperMotor.actualizar(configuracion);
        stepperMotor.ejecutarInstruccion(configuracion);
    };

    if(!stepperMotor){
        stepperMotor = new StepperManager(configuracion);
        sm = stepperMotor.fiveStepper;
        ejecutar();
    }else{
        stepperMotor.stop();
        // Si el motor sigue físicamente en movimiento, esperar a que termine
        // antes de mandar el siguiente comando (ver StepperManager.alTerminar).
        stepperMotor.alTerminar(ejecutar);
    }
}

function detenerPAP() {
  if(stepperMotor){
    stepperMotor.stop();
  }
}


global.stepper = stepper
global.detenerPAP = detenerPAP
global.detenerStepper = detenerPAP