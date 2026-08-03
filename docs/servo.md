# `servo`
```js
servo({pin:n,estado:n, start:a0, final:a1, tiempo:t, pasos:p})
```
# estado 0 -- Bucle
El servo va y vuelve desde el ángulo `start` hasta el ángulo `final` a la velocidad natural del servo. No se puede controlar la velocidad del servo. El servo se mueve en un bucle indefinido hasta que se llame a `apagarServos()`. Se basa en la función [`sweep`](https://johnny-five.io/api/servo/#sweep) de *Johnny-Five*. 

# estado 1 -- Ir
El servo va desde el ángulo en el que esté  hasta el ángulo `final` a la velocidad natural del servo. El servo se mueve una sola vez y se detiene en el ángulo `final`. Se basa en la función [`to`](https://johnny-five.io/api/servo/#todegrees-0180--ms--rate) de *Johnny-Five*.