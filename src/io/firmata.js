import { Firmata } from 'firmata-io';
import serialPort from '../serial/serialport'

const initFirmata = (onIOReady) => {
  try {
    
    serialPort.open(serialPortCallback);
    const io = new Firmata(serialPort, firmataCallback);
    // console.log('io: ', io);
    io.once('ready', onIOReady(io));
  } catch (error) {
    console.log('error: ', error);
    
  }
}

function firmataCallback (argF)  {
  console.log("firmata callback")
  if (argF !== undefined && argF !== null) {
    console.log('argF: ', argF);
  }
}

const serialPortCallback = (serialError) => {
  console.log('serialport callback2')
  if (serialError !== undefined && serialError !== null) {
    console.error('serialError2: ', serialError);
  }
}

export default initFirmata