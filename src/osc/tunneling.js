import { Client, Message } from 'browserglue';



const osc = new Client();

let boton1 = false;
let mensajeControl;
let mensajeValor;

let escuchar = false;
let control;
let valor;
let callback;



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
            
            
            if(mensajeControl === control && escuchar)
            {
                if(callback == "prender")
                {
                    prender(valor);
                }
                else if(callback == "apagar")
                {
                    apagar(valor);
                }
              
            }
               

        });   
    });    
}

global.activarOSC = activarOSC;

function oscEscuchar(msgControl, msgValor, msgCallback) {
    console.log("oscEscuchar : ", control, valor);
    escuchar = true;
    control = msgControl;
    valor = msgValor;
    callback = msgCallback;
}
global.oscEscuchar = oscEscuchar;