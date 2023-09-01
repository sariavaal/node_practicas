import  express  from "express";

const router = express.Router();

router.get('/', function(req,res){
    res.send('hola mundo en express')

});

router.post('/', function(req,res){
    res.json({msg: 'Respuesta de tipo post'})

});

export default router