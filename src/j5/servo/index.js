import ServoManager from "./ServoManager";
import { getBoard } from "../boards";

const servosByBoard = new WeakMap();

function getServos(board) {
  let servos = servosByBoard.get(board);
  if (!servos) {
    servos = new Map();
    servosByBoard.set(board, servos);
  }
  return servos;
}

function servo(configuracion) {
  console.log("configuracion : ", configuracion);
  const board = getBoard(configuracion.board);
  const servos = getServos(board);
  let pin = configuracion.pin;
  let start = configuracion.start;
  let final = configuracion.final;
  let tiempo = configuracion.tiempo;
  let estrategia = configuracion.estado;
  console.log("estrategia : ", estrategia);
  console.log("pin : ", pin);
  let servoMotor = servos.get(pin);
  let range = [start, final];
  if (!servoMotor) {
    servoMotor = new ServoManager({
      pin,
      range,
      tiempo,
      board
    });
    servos.set(pin, servoMotor);
  } else {
    console.log('stopping servo');
    servoMotor.stop();
  }
  servoMotor.actualizar({ estrategia, range });
  servoMotor.ejecutarInstruccion(configuracion);
}
global.servo = servo

function apagarServos(boardId) {
  const servos = getServos(getBoard(boardId));
  for (const servoMotor of servos.values()) {
    servoMotor.stop();
  }
}

global.apagarServos = apagarServos