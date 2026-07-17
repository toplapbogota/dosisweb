```js
prender(13)


apagar(13)

 
 console.log("Dosis Web - Live Coding & Hardware Hacking") 

 toplap Bogotá ::  CTRL+enter

activarOSC("/sclang",4000)

oscEscuchar("button1","prender",13)

oscEscuchar("button2","apagar",13)

oscEscuchar("button3","servo",{pin:2,estado:0, start:90, final:180, tiempo:0, pasos:0})

oscEscuchar("button2","apagarServos")

oscEscuchar("slider1","servoAnalogo",{pin:2, oscMin:0, oscMax:1, start:0, final:180})

oscEscuchar("slider2","servoAnalogo",{pin:3, oscMin:0, oscMax:1, start:0, final:180})

oscEscuchar("slider3","servoAnalogo",{pin:4, oscMin:0, oscMax:1, start:0, final:180})


oscEscuchar("slider3","switchAnalogo",{pin:13, umbral:[0.4,0.6], tipo:1})

oscEscuchar("slider4","switchAnalogo",{pin:13, umbral:[0.4,0.6], tipo:2})



servo({pin:2,estado:0, start:90, final:180, tiempo:0, pasos:0})

servo({pin:2,estado:1, start:0, final:20, tiempo:10, pasos:0})


servo({pin:2,estado:2, start:0, final:10, tiempo:0, pasos:0})

servo({pin:2,estado:2, start:0, final:50, tiempo:0, pasos:0})

servo({pin:2,estado:2, start:0, final:180, tiempo:0, pasos:0})

servo({pin:2,estado:2, start:0, final:90, tiempo:0, pasos:0})


servo({pin:2,estado:3, start:0, final:180, tiempo:10, pasos:5})

apagarServos()

dcmotor({pin1:9,pin2:7,pin3:8,dir:"izquierda",vel:50,estado:0,modo:"ascendente",tiempo:2000})
dcmotor({pin1:9,pin2:7,pin3:8,dir:"izquierda",vel:50,estado:1,modo:"ascendente",tiempo:2000})
dcmotor({pin1:9,pin2:7,pin3:8,dir:"derecha",vel:250,estado:2,modo:"descendente",tiempo:3000})
dcmotor({pin1:9,pin2:7,pin3:8,dir:"izquierda",vel:250,modo:0,estado:3,tiempo:800})


apagarMotoresDC()



apagarMotores();




stepper({pines:[12,10,11,13],sentido:"anti",rpm:15,pasos:2048,circuito:"uln2003",motor:"byj48",estado:0})


stepper({pines:[12,10,11,13],sentido:"horario",rpm:15,pasos:200,circuito:"uln2003",motor:"byj48",estado:1})


stepper({pines:[12,10,11,13],sentido:"anti",rpm:15,pasos:2000,circuito:"uln2003",motor:"byj48",estado:2})

detenerStepper()

//activa el pin y lo mantiene activo por un intervalo de tiempo
teclado({estado:0,tiempo:5000})

//activa el pin mientras se mantenga la tecla presionada
teclado({estado:1,tiempo:0})

//desactiva la función de teclado
pararTeclado();


prender(2,3,4,5)

apagar(2,3,4,5)

serie(2,3)

bucle(2,3,4,5)

cambiarIntervalo(500)

detenerBucle()



```
