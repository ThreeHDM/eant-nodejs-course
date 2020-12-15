const express = require("express")
const nodemailer = require("nodemailer")
const Joi = require("joi")
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
app.use( express.urlencoded({ extended : true }) )


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

    //paso como param mi objeto contacto para que se apliquen las reglas de validación
    const validate = schema.validate(contacto)

    console.log(validate)

    if(validate.error){
        res.end(error)
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