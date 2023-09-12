
const admin = (req, res) =>{
    res.render('propiedades/admin',{
        pagina: 'Mis propiedades',
        barra: true
    })
}
//FORMULARIO PARA CREAR PROPIEDAD
const crear = (req, res) => {
    res.render('propiedades/crear',{
        pagina: 'Crear propiedad',
        barra: true

})
}

export {
    admin,
    crear
}