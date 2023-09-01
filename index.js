import express from 'express';
import usuarioRoutes from './routes/usuarioRoutes.js'
//crear la app
const app = express()

app.use('/', usuarioRoutes)



//definir puerto y conectar con el puerto la app
const port = 3000;
app.listen(port, () =>{
    console.log(`El servidor esta funcionando en el puerto ${port}`)
});