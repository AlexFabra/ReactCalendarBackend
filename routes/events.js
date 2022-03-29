/*
rutas: 
/api/events 
*/

const { Router } = require("express");
const { check } = require('express-validator');

const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require("../controllers/events");
const { isDate } = require("../helpers/isDate");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");

const router = Router()

//todas tienen que pasar por la validación de JWT
router.use(validarJWT)

//obtener eventos:
router.get('/', getEventos)

//crear nuevo evento:
router.post(
    '/',
    [
        check('title', 'El título es obligatorio').not().isEmpty(),
        check('start', 'fecha de inicio obligatoria').custom(isDate),
        check('end', 'fecha final obligatoria').custom(isDate),
        validarCampos
    ],
    crearEvento)

//actualizar evento:
router.put(
    '/:id',
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio es obligatoria').custom(isDate),
        check('end', 'Fecha de finalización es obligatoria').custom(isDate),
        validarCampos
    ],
    actualizarEvento)

//eliminar evento:
router.delete(
    '/:id',
    eliminarEvento)

module.exports = router;