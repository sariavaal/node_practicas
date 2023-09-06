import {check, validationResult} from 'express-validator'
import Usuario from '../models/Usuario.js'
import { generarId } from '../helpers/tokens.js'


const formularioLogin = (req, res) => {
    res.render('auth/login', {
        pagina: 'Iniciar Sesión'
    })

}

const formularioRegistro = (req, res) => {
    res.render('auth/registro', {
        pagina: 'Crear cuenta'
        
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
    await Usuario.create({
        nombre,
        email,
        password,
        token: generarId()
    })

}


const formularioOlvidePassword = (req, res) => {
    res.render('auth/olvide-password', {
        pagina: 'Recupera tu acceso a bienes raices'
        
    })

}



export {
    formularioLogin,
    formularioRegistro,
    registrar,
    formularioOlvidePassword
}