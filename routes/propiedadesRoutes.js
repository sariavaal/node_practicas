import express from 'express'
import{ admin, crear, guardar } from '../controllers/propiedadController.js'

const router = express.Router()

router.get('/mis-propiedades', admin)
router.get('/propiedades/crear', crear)
router.post('/propiedades/crear', guardar)




export default router