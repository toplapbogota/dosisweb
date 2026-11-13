import StepperManager from "./StepperManager";
import { getBoard } from "../boards";

const steppersByBoard = new WeakMap();

function stepper(configuracion){
    console.log("configuracion 1 : ",configuracion);
    const board = getBoard(configuracion.board);
    let stepperMotor = steppersByBoard.get(board);

    const ejecutar = () => {
        stepperMotor.actualizar(configuracion);
        stepperMotor.ejecutarInstruccion(configuracion);
    };

    if(!stepperMotor){
        stepperMotor = new StepperManager({ ...configuracion, board });
        steppersByBoard.set(board, stepperMotor);
        ejecutar();
    }else{
        stepperMotor.stop();
        // Si el motor sigue físicamente en movimiento, esperar a que termine
        // antes de mandar el siguiente comando (ver StepperManager.alTerminar).
        stepperMotor.alTerminar(ejecutar);
    }
}

function detenerPAP(boardId) {
  const stepperMotor = steppersByBoard.get(getBoard(boardId));
  if(stepperMotor){
    stepperMotor.stop();
  }
}


global.stepper = stepper
global.detenerPAP = detenerPAP
global.detenerStepper = detenerPAP