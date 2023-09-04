import express from 'express';
import usuarioRoutes from './routes/usuarioRoutes.js'
//crear la app
const app = express()


// habilitar pug 
app.set('view engine','pug')
app.set('views','./views')


//routing
app.use('/auth', usuarioRoutes)




//definir puerto y conectar con el puerto la app
const port = 3000;
app.listen(port, () =>{
    console.log(`El servidor esta funcionando en el puerto ${port}`)
});
