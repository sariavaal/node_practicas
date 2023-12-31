import express from 'express'
import csrf from 'csurf'
import cookieParser from 'cookie-parser'
import usuarioRoutes from './routes/usuarioRoutes.js'
import propiedadesRoutes from './routes/propiedadesRoutes.js'
import db from './config/db.js'

//crear la app
const app = express()

//habilitar lectura de datos de formularios
app.use( express.urlencoded({extended: true}) )


//habilitar cookie parser
app.use( cookieParser())

app.use(express.json()) 

//habilitar csrf
app.use( csrf({cookie: true}) )
//conexion a la bd

try {
    await db.authenticate();
    db.sync()
    console.log('conexion correcta a la bd')

}catch(error){
    console.log(error)

}


// habilitar pug 
app.set('view engine','pug')
app.set('views','./views')

//carpeta publica
app.use( express.static('public'))


//routing
app.use('/auth', usuarioRoutes)
app.use('/', propiedadesRoutes)





//definir puerto y conectar con el puerto la app
const port = process.env.PORT || 3000;
app.listen(port, () =>{
    console.log(`El servidor esta funcionando en el puerto ${port}`)
});
