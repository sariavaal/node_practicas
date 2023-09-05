import {check, validationResult} from 'express-validator'
import Usuario from '../models/Usuario.js'



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
    await check ('repetir_password').equals('password').withMessage('Los passwords no son iguales').run(req)

    let resultado = validationResult(req)


   // return res.json({errores: resultado.array()})
    //verificar que el resultado este vacio
    if(!resultado.isEmpty()) {
        //errores
        return res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            errores: resultado.array()
        })

    }

    

    const usuario = await Usuario.create(req.body);

    res.json(usuario)

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