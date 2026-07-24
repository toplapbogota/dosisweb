import SerialPort from 'avrgirl-arduino/lib/browser-serialport';

const serialPortCallback = (serialError) => {
  console.log('serialport callback')
  if (serialError !== undefined && serialError !== null) {
    console.error('serialError: ', serialError);
  }
}

const serialPort = new SerialPort(null, { autoOpen: false, callback: serialPortCallback });


// Web Serial recuerda los puertos que el usuario ya autorizó al menos una vez.
// navigator.serial.getPorts() los devuelve sin volver a mostrar el selector, lo
// que permite reconectar automáticamente. Devuelve el primer puerto autorizado
// o null si no hay ninguno (o si el navegador no soporta Web Serial).
export async function getAuthorizedPort() {
  if (!navigator.serial) return null;
  const ports = await navigator.serial.getPorts();
  return ports[0] || null;
}

export default serialPort