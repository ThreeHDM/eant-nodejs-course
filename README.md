# Notas de curso de Node.js de la Escuela Argentina de Nuevas Tecnologías

# Clase 1

## Temas
- creacion de proyecto

---

# Clase 2

## Temas
- enviar datos desde formulario en carpeta public
- enviar mails usando nodemailer

---

# Clase 3

## Temas
- creación de variables de entorno
    - creación de archivo .env
- creacion de scripts custom en package.json
- Validación desde lado del servidor con la libreria `joi`

### Scripts personalizados
Con el comando run puedo correr los comandos peronalizados que cree en "scripts" del arechiv package.json

`npm run mi-comando-personalizado`

Ejemplo de script personalizado. Puedo ejecutar varios comandos con uno.

```json
"scripts": {
    "start": "nodemon -r dotenv/config app.js",
    "saludo": "echo \"Hola!\""
  }
```

Con el comando `start` corremos dotenv y nodemon al iniciar el servidor. `-r` es flag para run y luego le especifico lo que esta en el directorio dotenv/config.js. El `.js` no es necesario.

Una vez configurado puedo iniciar mi proyecto con `npm start`.

### Validacion de datos con la liberia Joi

Esta librería [JOI](https://joi.dev/api/?v=17.3.0) permite configurar qué características debe tener cada uno de los datos que recibo

---

# Clase 4

## Temas



