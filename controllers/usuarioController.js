import {check, validationResult} from 'express-validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Usuario from '../models/Usuario.js'
import {generarJWT, generarId } from '../helpers/tokens.js'
import {emailRegistro, emailOlvidePassword} from '../helpers/emails.js'

const formularioLogin = (req, res) => {
    res.render('auth/login', {
        pagina: 'Iniciar Sesión',
        csrfToken: req.csrfToken()
    })

}

const autenticar = async (req, res) => {
    //validacion
    await check('email').isEmail().withMessage('El email es obligatorio').run(req)
    await check ('password').notEmpty().withMessage('El password es obligatorio').run(req) 

    let resultado = validationResult(req)


    // return res.json({errores: resultado.array()})
     //verificar que el resultado este vacio
     if(!resultado.isEmpty()) {
         //errores
         return res.render('auth/login', {
             pagina: 'Iniciar sesión',
             csrfToken: req.csrfToken(),
             errores: resultado.array(),
           
         })
 
     }

     const { email, password} = req.body

     //comprobar si el usuario existe
     const usuario = await Usuario.findOne({ where: {email}})
     if(!usuario) {
        return res.render('auth/login',{
            pagina: 'Iniciar sesión',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'El usuario no existe'}]
        })
     }
     // comprobar si el usuario esta confirmado
     if(!usuario.confirmado) {
        return res.render('auth/login',{
            pagina: 'Iniciar sesión',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'Tu cuenta no ha sido confirmada'}]
        })

     }
     //Revisar el password
     if(!usuario.verificarPassword(password)){
        return res.render('auth/login',{
            pagina: 'Iniciar sesión',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'El password es incorrecto'}]
        })

     }
     //Autenticar al usuario
     const token = generarJWT({ id: usuario.id, nombre: usuario.nombre })

     console.log(token)
     //almacenar en un cookie
     return res.cookie('_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: true
     }).redirect('/mis-propiedades')
  


}

const formularioRegistro = (req, res) => {
    res.render('auth/registro', {
        pagina: 'Crear cuenta',
        csrfToken: req.csrfToken()  
    })
}

const registrar = async (req, res) => {
    console.log(req.body)
    //validacion
    await check('nombre').notEmpty().withMessage('El nombre no puede ir vacío').run(req)
    await check('email').isEmail().withMessage('Email inválido').run(req)
    await check ('password').isLength({min: 8}).withMessage('El password debe ser de al menos 8 caracteres').run(req)
    await check ('repetir_password').equals(req.body.password).withMessage('Los passwords no son iguales').run(req)

    let resultado = validationResult(req)


   // return res.json({errores: resultado.array()})
    //verificar que el resultado este vacio
    if(!resultado.isEmpty()) {
        //errores
        return res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        })

    }

    //extraer datos
    const { nombre, email, password} = req.body

//verificar que el email no este duplicado
    const existeUsuario = await Usuario.findOne({ where : {email}})

    if(existeUsuario){
        return res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            csrfToken: req.csrfToken(),
            errores:[{msg : 'El usuario ya esta registrado'}],
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        })

    }
    //console.log(existeUsuario)
    //return;    

//almacenar un usuario

    const usuario = await Usuario.create({
        nombre,
        email,
        password,
        token: generarId()
    })

    //envia email de confirmacion
    emailRegistro({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token
    })

    //mostrar mensaje de confirmacion
    res.render('templates/mensaje', {
        pagina: 'Cuenta creada correctamente',
        mensaje: 'Hemos enviado un email de confirmacion presiona en el enlace'
    })

}
//funcion que comprueba una cuenta

const confirmar = async (req, res) => {
    const { token } = req.params;
    //verificar si es valido
    const usuario = await Usuario.findOne({where: {token}})

    if(!usuario){
        return res.render('auth/confirmar-cuenta', {
            pagina: 'Error al confirmar tu cuenta',
            mensaje: 'Hubo un error al confirmar tu cuenta, intenta de nuevo',
            error: true

        })
    }

    //confirmar la cuenta
    usuario.token = null;
    usuario.confirmado = true;
    await usuario.save();

    res.render('auth/confirmar-cuenta', {
        pagina: 'Cuenta confirmada',
        mensaje: 'La cuenta se confirmo correctamente'

    })



    console.log(usuario)
  
   
}


const formularioOlvidePassword = (req, res) => {
    res.render('auth/olvide-password', {
        pagina: 'Recupera tu acceso a bienes raices',
        csrfToken: req.csrfToken(),
        
    })

}

const resetPassword = async (req, res) => {
     //validacion
     await check('email').isEmail().withMessage('Email inválido').run(req)
   
 
     let resultado = validationResult(req)
 
 
    // return res.json({errores: resultado.array()})
     //verificar que el resultado este vacio
     if(!resultado.isEmpty()) {
         //errores
         return res.render('auth/olvide-password', {
             pagina: 'Recupera tu cuenta a Bienes Raices',
             csrfToken: req.csrfToken(),
             errores: resultado.array()
            
         
         })
 
     }
     //buscar usuario
     const { email } = req.body
     const usuario = await Usuario.findOne({where: {email}})
     if (!usuario){
        return res.render('auth/olvide-password',{
            pagina: 'Recupera tu acceso a Bienes Raices',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'El email no pertenece a ningun usuario'}]
        })
     }

     //generar un token y envIAR EL EMAIL
     usuario.token = generarId();
     await usuario.save();
     //enviar email
     emailOlvidePassword({
        email: usuario.email,
        nombre: usuario.nombre,
        token: usuario.token
     })


     //renderizar un mensaje
     res.render('templates/mensaje', {
        pagina: 'Restablece tu password',
        mensaje: 'Hemos enviado un email con las instrucciones'
    })

}

const comprobarToken = async (req, res, ) => {
    const { token } = req.params;
    const usuario = await Usuario.findOne({where : {token}})
    if(!usuario) {
        return res.render('auth/confirmar-cuenta',{
            pagina: 'Reestablece tu password',
            mensaje: 'Hubo un error al validar tu información, intenta de nuevo',
            error: true
        })
    }
   // mostrar formulario para modificar password
   res.render('auth/reset-password', {
    pagina: 'Reestablece tu password',
    csrfToken: req.csrfToken()
   })

}

const nuevoPassword = async (req, res) => {
    //validar password 
    await check ('password').isLength({ min : 8 }).withMessage('El password debe ser de al menos 8 caracteres').run(req)
    let resultado = validationResult(req)

    if(!resultado.isEmpty()) {
        //errores
        return res.render('auth/reset-password', {
            pagina: 'Reestablece tu password',
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
        })

    }
    const { token } = req.params
    const {password} = req.body;
    //identificar quien hace el cambio
    const usuario = await Usuario.findOne({where: {token}})

    //hashear el nuevo password
    const salt = await bcrypt.genSalt(10)
    usuario.password = await bcrypt.hash( password, salt);
    usuario.token = null;

    await usuario.save();

    res.render('auth/confirmar-cuenta', {
        pagina: 'Password reestablecido',
        mensaje: 'El password se guardo correctamente'
    })

}



export {
    formularioLogin,
    autenticar,
    formularioRegistro,
    registrar,
    confirmar,
    formularioOlvidePassword,
    resetPassword,
    comprobarToken,
    nuevoPassword
}