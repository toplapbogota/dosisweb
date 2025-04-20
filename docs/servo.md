# Estados o Estratregias

# 0 Bucle

bucle entre `starts` y `final`

## Johnny-five

```js
s = new Five.Servo()
s.range = [starts,final]
s.sweep()
```

# 1 Ir

va al angulo `final` en el tiempo `tiempo`

## Johnny-five

```js
to(final, tiempo)
```

# 2 Ir rapido

va al ángulo `final` lo más rapido posible

## Johnny-five

```js
to(final)
```

# 3 Ir por pasos
va al ángulo `final` en tiempo `tiempo` en `pasos` pasos

## Johnny-five

```js
to(final,time,pasos)
```

