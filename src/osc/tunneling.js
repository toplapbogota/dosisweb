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
                    else if (callback == "servoAnalogo") {
                        let v = mapearDato(
                            parseFloat(msg.args[0]),
                            [valor.oscMin, valor.oscMax],
                            [valor.start, valor.final]
                        );

                        let valorServo = {
                            pin: valor.pin,
                            start: valor.start,
                            final: v,
                            tiempo: 0,
                            estado: 2,
                            pasos: 0
                        };
                        servo(valorServo);
                    }
                    else if (callback == "switchAnalogo") {
                        if (valor.tipo === 1) {
                            if (valor.umbral[0] <= parseFloat(msg.args[0])
                                && valor.umbral[1] >= parseFloat(msg.args[0])) {
                                prender(valor.pin);
                            }
                            else {
                                apagar(valor.pin);
                            }
                        }
                        else {
                            if (valor.umbral[0] <= parseFloat(msg.args[0])
                                && valor.umbral[1] >= parseFloat(msg.args[0])) {
                                apagar(valor.pin);
                            }
                            else {
                                prender(valor.pin);
                            }
                        }
                    }
                    else if (callback == "stepper") {
                        stepper(valor);
                    }
                    else if (callback == "detenerStepper") {
                        detenerPAP();
                    }
                    else if (callback == "stepperAnalogo") {
                        valor.estado = 1;
                        if (parseFloat(msg.args[0]) > valor.umbral[0]
                            && parseFloat(msg.args[0]) < valor.umbral[1]) {
                            console.log("detener stepper");
                            detenerPAP();
                        }
                        else if (valor.umbral[0] <= parseFloat(msg.args[0])) {
                            console.log("anti");
                            valor.sentido = "anti";
                            stepper(valor);
                        }
                        else if (valor.umbral[1] >= parseFloat(msg.args[0])) {
                            console.log("horario");
                            valor.sentido = "horario";
                            stepper(valor);
                        }
                    }
                    else if (callback == "stepperAnalogoContinuo") {
                        valor.estado = 3;
                        if (parseFloat(msg.args[0]) > valor.umbral[0]
                            && parseFloat(msg.args[0]) < valor.umbral[1]) {
                            console.log("detener stepper");
                            detenerPAP();
                        }
                        else if (valor.umbral[0] <= parseFloat(msg.args[0])) {
                            console.log("anti");
                            valor.sentido = "anti";
                            stepper(valor);
                        }
                        else if (valor.umbral[1] >= parseFloat(msg.args[0])) {
                            console.log("horario");
                            valor.sentido = "horario";
                            stepper(valor);
                        }
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

function mapearDato(valor, rango1, rango2) {

    let valorMapeado = (valor - rango1[0]) * (rango2[1] - rango2[0]) / (rango1[1] - rango1[0]) + rango2[0];
    return valorMapeado;
}   