# Login

### mysql (Object)

### cargarUsuario (Function)

```js
cargarUsuario();
```

### callback (Callback)

> Access: public

Pues, el callback que le quieras pasar.

#### Params

| Name | Type | Optional | Desciption |
| ---- | ---- | -------- | ---------- |
| req | Object | False | El http request. |
| res | Object | False | El http response. |
| usuario | string | False | Nombre del usuario a validar |
| contrasenia | string | False | Contrasenia del usuario a validar. |

#### Returns

| Name | Type | Desciption |
| ---- | ---- | ---------- |
| return | boolean | Regresa 'true' si la sesion fue abierta exitosamente. Regresa 'false' en cualquier otro caso. |

### cerrarSesion (Function)

> Access: public

```js
var cerrarsesion = cerrarSesion(usuario, contrasenia);
```

#### Params

| Name | Type | Optional | Desciption |
| ---- | ---- | -------- | ---------- |
| usuario | string | False | Nombre del usuario a validar. |
| contrasenia | string | False | Contrasena del usuario a validar. |

#### Returns

| Name | Type | Desciption |
| ---- | ---- | ---------- |
| return | boolean | Regresa 'true' si la sesion cerrada exitosamente. Regresa 'false' en cualquier otro caso. |