const express = require("express")
const nodemailer = require("nodemailer")
const Joi = require("joi")
const expressFileUpload = require("express-fileupload")
const app = express()

const port = 1000   //mas allá del 1000 usualmente están disponibles

const miniOutlook = nodemailer.createTransport({
    host: process.env.HOST_MAIL,
    port: process.env.PUERTO_MAIL,
    auth: {
        user: process.env.CASILLA_MAIL,
        pass: process.env.CLAVE_MAIL
    }
})

//Documentación de joi https://joi.dev/api/?v=17.3.0
const schema = Joi.object({
    nombre: Joi.string().max(30).required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    asunto: Joi.number().integer().required(),
    mensaje: Joi.string().required()
})

app.listen(port)
//use permite indicar a la aplicación que use determinadas configuraciones
app.use( express.static('public') )
app.use( express.json()) // <-- convierte de application/json a Object
app.use( express.urlencoded({ extended : true }) ) //<-- esto convierte de application/x-www-form-urlencoded a Object
//Express no tiene una solución nativa para usar "multipart/form-data". Debemos usar utility modules. El que usaremos nosotros es express-fileupload
app.use(expressFileUpload())


/*
// Plantilla modelo para "endpoints" de express() //
app.TIPO_HTTP("/RUTA", (req, res) => {
    #codigo acá
})
*/

app.get("/test", (req, res) => {
    console.log("test"); 
    console.log(process.env.CASILLA_MAIL); 
})

app.post("/enviar", (req, res) => {
    const contacto = req.body
    const { archivo } = req.files

    console.log(req.files)

    const ubicacion = __dirname + "/public/uploads/" + archivo.name
    console.log("Se guarda en: ")
    console.log(ubicacion)
   
    //muevo al archivo a esa ubicación. Configuro un callback para el caso de error
    archivo.mv(ubicacion, error => {
        if (error) {
            console.log("No se movió el archivo")
        }
    })

    return res.end("consola")

    //paso como param mi objeto contacto para que se apliquen las reglas de validación
    // con la sintaxis de llave extrae propiedades de un objeto. El resultado de validate es un objeto y tiene esas propiedades. Las creo en una variable separada
    const { error, value } = schema.validate(contacto);

    if(error){
        console.log(error.details)
        res.end(error.details[0].message)

        const msg = {
            error : error.details.map(e => {
                console.log(e.message)
            })
        }
    } else {
        miniOutlook.sendMail({
            from : contacto.correo, // sender address
            to : "silvio.messina@eant.tech", // list of receivers
            replyTo: contacto.correo,
            subject : `Asunto #${contacto.asunto}`, // Subject line
            html : `<blockquote>${contacto.mensaje}</blockquote>"`, // html body
        })
    
        res.end('Desde acá vamos a enviar un email de contacto :o')
    }
})