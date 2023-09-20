import { validationResult} from 'express-validator'
import { Precio, Categoria, Propiedad} from '../models/index.js'

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
    
    res.render('propiedades/crear',{
        pagina: 'Crear propiedad',
        barra: true, 
        csrfToken: req.csrfToken(),
        categorias,
        precios,
        datos: {}

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
    const { titulo, descripcion, habitaciones, estacionamiento, wc, calle, lat, lng, precio: precioId, categoria: categoriaId } = req.body

    try {
        const propiedadGuardada = await Propiedad.create({
            titulo,
            descripcion,
            habitaciones, 
            estacionamiento, 
            wc, 
            calle, 
            lat, 
            lng,
            precioId,
            categoriaId 


        })

    } catch(error){
        console.log(error)
    }

} 

export {
    admin,
    crear,
    guardar
}