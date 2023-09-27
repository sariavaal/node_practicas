import { validationResult} from 'express-validator'
import { Precio, Categoria, Propiedad} from '../models/index.js'

const admin = (req, res) =>{
    res.render('propiedades/admin',{
        pagina: 'Mis propiedades'
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
                csrfToken: req.csrfToken(),
                categorias,
                precios,
                errores: resultado.array(),
                datos: req.body
        })
    }
    //crear un registro
    const { titulo, descripcion, habitaciones, estacionamiento, wc, calle, lat, lng, precio: precioId, categoria: categoriaId } = req.body

    const {id: usuarioId} = req.usuario

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
            categoriaId, 
            usuarioId,
            imagen:''


        })

        const { id } = propiedadGuardada
        res.redirect(`/propiedades/agregar-imagen/${id}`)

    } catch(error){
        console.log(error)
    }

} 
const agregarImagen = async (req, res) => {
    const { id } = req.params
    //validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id)
    if(!propiedad){
        return res.redirect('/mis-propiedades')
    }
    //validar que no este publicada
    if (propiedad.publicado){
        return res.redirect('/mis-propiedades')
    }
    //validar que la propiedad pertenece a quien visita la pagina
    if (req.usuario.id.toString() !== propiedad.usuarioId.toString()){
        return res.redirect('/mis-propiedades')
    }
    res.render('propiedades/agregar-imagen', {
        pagina:`Agregar Imagen: ${propiedad.titulo}`,
        propiedad
    })

}

export {
    admin,
    crear,
    guardar,
    agregarImagen
}