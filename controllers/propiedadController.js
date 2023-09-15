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
        Precio.findAll()

    ])
    res.render('propiedades/crear',{
        pagina: 'Crear propiedad',
        barra: true, 
        categorias,
        precios

})
}

const guardar = (req, res) => {

} 

export {
    admin,
    crear,
    guardar
}