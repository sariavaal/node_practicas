import { validationResult} from 'express-validator'
import Precio from '../models/Precio.js'
import Categoria from '../models/Categoria.js'

const admin = (req, res) =>{
    res.render('propiedades/admin',{
        pagina: 'Mis propiedades',
        barra: true
    })
}
//FORMULARIO PARA CREAR PROPIEDAD
const crear = async (req, res) => {
    //consultar modelo de precios y categorias
    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll(),
        

    ]);
    //obtener id desde reqbody o establecerlo como null
    const CategoriaId = req.body.Categoria || null;

    res.render('propiedades/crear',{
        pagina: 'Crear propiedad',
        barra: true, 
        csrfToken: req.csrfToken(),
        categorias,
        precios,
        datos: {
            categoria: CategoriaId
        }

});
} 

const guardar = async (req, res) => {
    //validacion
    let resultado = validationResult(req)

    if(!resultado.isEmpty()) {

           //consultar modelo de precios y categorias
    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()

    ])
            return res.render('propiedades/crear',{
                pagina: 'Crear propiedad',
                barra: true, 
                csrfToken: req.csrfToken(),
                categorias,
                precios,
                errores: resultado.array(),
                datos: req.body
        })
    }
    //crear un registro
    console.log(req.body)

} 

export {
    admin,
    crear,
    guardar
}