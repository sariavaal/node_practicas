import nodemailer from 'nodemailer'

const emailRegistro = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });

    const {email, nombre, token } = datos

    //enviar email
    await transport.sendMail({
        from: 'Bienesraices.com',
        to: email,
        subject: 'Confirma tu cuenta en bienesraices.com',
        text: 'Confirma tu cuenta',
        html: `<p> hola ${nombre}, comprueba tu cuenta en bienesraices.com </p>
        <p> Tu cuenta ya esta lista solo debes confirmarla en el siguiente enlace:
        <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000 } /auth/confirmar/${token}">Confirmar cuenta</a> </p>
        <p> Si tu no creaste esta cuenta puedes ignorar el mensaje </p>
        `
    })

}


const emailOlvidePassword = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });

    const {email, nombre, token } = datos

    //enviar email
    await transport.sendMail({
        from: 'Bienesraices.com',
        to: email,
        subject: 'Restablece tu password en Bienes Raices',
        text: 'Restablece tu password en Bienes Raices',
        html: `<p> hola ${nombre}, has solicitado restablecer tu password en bienesraices.com </p>
        <p> Sigue el siguiente enlace para generar un password nuevo:
        <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000 } /auth/olvide-assword/${token}">Reestablecer password</a> </p>
        <p> Si tu no solicitaste el cambio de password, puedes ignorar el mensaje </p>
        `
    })

}


export{
    emailRegistro,
    emailOlvidePassword
}