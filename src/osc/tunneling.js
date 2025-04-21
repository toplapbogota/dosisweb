import { Client, Message } from 'browserglue';



const osc = new Client();

let boton1 = false;
let mensajeControl;
let mensajeValor;

let escuchar = false;
let control;
let valor;
let callback;
let configuration;

let funciones=[];



export function botonOsc() {
    return boton1;    
}

function activarOSC(nombreCanal, puertoRecibir) {    
    
    console.log("Add channel "+ nombreCanal +" binded to udp: "+puertoRecibir);

    osc.addChannel(nombreCanal, puertoRecibir).then(channel => {
        
        channel.on("message", msg => {
            console.log("Received:", msg.address, msg.args);
            mensajeControl = msg.address.split("/")[2];

            console.log("Mensaje : ", mensajeControl);

            console.log(funciones);
            
            for(let i = 0; i < funciones.length; i++) {
                
                let funcion = funciones[i];

                control = funcion.control;
                callback = funcion.callback;
                valor = funcion.valor;
                configuration = funcion.configuration;

                //if(mensajeControl === control && escuchar)
                if(mensajeControl === control)
                {
                    console.log("Mensaje : ", mensajeControl, " Control : ", control, " Valor : ", valor, " Callback : ", callback );
                    if(callback == "prender")
                    {
                        prender(valor);
                    }
                    else if(callback == "apagar")
                    {
                        apagar(valor);
                    }
                    else if(callback == "servo")
                    {
                        servo(configuration);
                    }
                    else if(callback == "apagarServos")
                    {
                        apagarServos();
                    }
    
                }

            }

        });   
    });    
}

global.activarOSC = activarOSC;

function oscEscuchar(msgControl, msgValor, msgCallback, msgConfiguration) {
    console.log("oscEscuchar : ", control, valor);
    //escuchar = true;
    /*
    control = msgControl;
    valor = msgValor;
    callback = msgCallback;
    configuration = msgConfiguration;
    */
   funciones.push({control: msgControl, valor: msgValor, callback: msgCallback, configuration: msgConfiguration});
   console.log("Funciones : ", funciones);
}
global.oscEscuchar = oscEscuchar;