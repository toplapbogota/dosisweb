import MotorManager from "./MotorManager";

const dcmotors = [];
const pines_dcmotors = [];

let motorDC;

function dcmotor(configuracion) {
    console.log("configuracion : ", configuracion);
    
    /*
    let pin1 = configuracion.pin1;    
    let pin2 = configuracion.pin2;
    let estrategia = configuracion.estado;
    let direccion = configuracion.dir;
    let velocidad = configuracion.vel;
    console.log("estrategia : ", estrategia);
    console.log("pin1 : ", pin1);
    console.log("pin2 : ", pin2);
    let motorDC = dcmotors[pin1 + ',' + pin2];
    */
    if (!motorDC) {
       /* motorDC = new MotorManager({
            pin1,
            pin2,
            direccion,
            velocidad
        } 
    );
    dcmotors[pin1 + ',' + pin2] = motorDC;
    } else {
        console.log('stopping motor');
        motorDC.stop();
    }
    motorDC.actualizar({ estrategia, direccion, velocidad });
    motorDC.ejecutarInstruccion(configuracion);
    */

    
        motorDC = new MotorManager(configuracion);
    }
    else 
    {
        motorDC.stop();
    }
    motorDC.actualizar(configuracion);
    motorDC.ejecutarInstruccion(configuracion);
    

}


function apagarMotoresDC() {
    //if there are not pins, stop all motors
    if (motorDC) {
        console.log('stopping motor');
        motorDC.stop();
        console.log(motorDC);   
    }
}

global.dcmotor = dcmotor;
global.apagarMotoresDC = apagarMotoresDC;