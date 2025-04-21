import { Client, Message } from 'browserglue';



const osc = new Client();

let boton1 = false;

let funciones = [];



export function botonOsc() {
    return boton1;
}

function activarOSC(nombreCanal, puertoRecibir) {

    console.log("Add channel " + nombreCanal + " binded to udp: " + puertoRecibir);

    osc.addChannel(nombreCanal, puertoRecibir).then(channel => {

        channel.on("message", msg => {
            console.log("Received:", msg.address, msg.args);
            let mensajeControl = msg.address.split("/")[2];

            for (let i = 0; i < funciones.length; i++) {

                let funcion = funciones[i];

                let { control, callback, valor } = funcion;

                if (mensajeControl === control) {
                    if (callback == "prender") {
                        prender(valor);
                    }
                    else if (callback == "apagar") {
                        apagar(valor);
                    }
                    else if (callback == "servo") {
                        servo(valor);
                    }
                    else if (callback == "apagarServos") {
                        apagarServos();
                    }

                }

            }

        });
    });
}

global.activarOSC = activarOSC;

function oscEscuchar(msgControl, msgCallback, msgValor) {
    funciones.push({ control: msgControl, callback: msgCallback, valor: msgValor });
}
global.oscEscuchar = oscEscuchar;