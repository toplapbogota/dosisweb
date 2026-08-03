# Pines

## Control de pines individuales

### `prender`

`n` puede ser un número o una lista de números separados por comas. En ambos casos se enciende o se prende el pin o los pines indicados.

`encender` es un alias de `prender`.

```js
prender(n)
```

#### Ejemplos

El pin 13 es el pin del led integrado en la placa (en los arduinos uno, nano y mega), por lo que es un buen pin para hacer pruebas.

```js
prender(13)
```

```js
prender(7,8,12,13)
```

### `apagar`

`n` puede ser un número o una lista de números separados por comas. En ambos casos se apaga el pin o los pines indicados.

```js
apagar(n)
```

#### Ejemplos

El pin 13 es el pin del led integrado en la placa (en los arduinos uno, nano y mega), por lo que es un buen pin para hacer pruebas.

```js
apagar(13)
```

```js
apagar(7,8,12,13)
```

## Control de pines en grupos

### `serie`

Se encienden en serie los pines indicados, uno tras otro, con un intervalo (que por defecto es) de 1000 milisegundos (o lo que es lo mismo 1 segundo) entre cada pin. Se enciende sólo una vez la serie. Se debe indicar más de un pin para que funcione.

```js
serie(7,8);
```

### Bucle

Se encienden en serie los pines indicados, uno tras otro, con un intervalo (que por defecto es) de 1000 milisegundos entre cada pin. Se repite la serie indefinidamente hasta que se llame a `detenerBucle()` o `apagarTodo()`.
```js
bucle(7,8,12,13) 
```
### Cambio de velocidad
#### `cambiarIntervalo` 
Para cambiar la velocidad del _bucle_
t está en milisegundos y por defecto es 1000 (1 segundo). Se puede cambiar la velocidad del bucle en cualquier momento, incluso mientras se está ejecutando.
```js
cambiarIntervalo(t)
```
Si se ejecuta `cambiarIntervalo(t)` el bucle se reinicia y se vuelve a ejecutar con el nuevo intervalo. Si se ejecuta `cambiarIntervalo(t)` mientras se está ejecutando el bucle, el bucle se detiene y se reinicia con el nuevo intervalo.
**bicho**: si se ejecuta `cambiarIntervalo(t)` y el bucle no se está ejecutando, el bucle se inicia con el nuevo intervalo. 

##### Ejemplo
```js
cambiarIntervalo(500)
```
También afecta la velocidad del [serie](#serie)
#### Detener bucle
Para detener el bucle se debe llamar a la función `detenerBucle()`. Esto detiene el bucle y apaga todos los pines que estaban encendidos por el bucle
```js
detenerBucle()
```
**bicho**: no se apaga el último pin que se le pasó al bucle, por lo que si se quiere apagar todos los pines se debe llamar a `apagarTodo()` después de `detenerBucle()`.


#### `paralelo`
`paralelo` recibe una lista de objetos con las propiedades `pin`, `inicio` y `lapso`. Se encienden los pines indicados en paralelo, es decir, todos simultaneamente, pero cada uno con un tiempo de inicio y un tiempo de apagado diferente. El tiempo de `inicio` es el tiempo que tarda en encenderse el pin, y el tiempo `lapso` es el tiempo que tarda en apagarse el pin. El tiempo se indica en segundos. Cada pin entra en un bucle determinado por el `lapso`. El tiempo de `inicio` sólo se aplica la primera vez que se enciende el pin, después de eso el pin se enciende y apaga según el `lapso` indicado. 

##### Ejemplos 
```js
paralelo({pin:7,inicio:2,lapso:4},{pin:8,inicio:2,lapso:4},{pin:9,inicio:2,lapso:4})
```
```js
paralelo({pin:7,inicio:1,lapso:4},{pin:8,inicio:2,lapso:4},{pin:12,inicio:3,lapso:4})

```
#### Silencio
Se pueden apagar todos los pines encendidos por el `bucle` o por el `paralelo`  o por cualquier otra función con la función `apagarTodo()`. Esto apaga todos los pines que estén encendidos, sin importar si están en un bucle o en paralelo.
```js
apagarTodo()
```
