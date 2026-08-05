import SerialPort from 'avrgirl-arduino/lib/browser-serialport';

const serialPortCallback = (serialError) => {
  console.log('serialport callback')
  if (serialError !== undefined && serialError !== null) {
    console.error('serialError: ', serialError);
  }
}

const serialPort = new SerialPort(null, { autoOpen: false, callback: serialPortCallback });

export default serialPort