const { response } = require('express');
const Evento = require('../models/Evento');


const getEventos = async (req, res = response) => {

    const eventos = await Evento.find().populate('user', 'name');

    res.status(201).json({
        ok: true,
        eventos
    })
}

const crearEvento = async (req, res = response) => {
    const evento = new Evento(req.body);

    try {
        //modificamos el user porque es el objeto que ya tenemos en la autentificación. 
        evento.user = req.uid;

        const eventoGuardado = await evento.save();
        res.json({
            ok: true,
            eventoGuardado
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'error al crear evento'
        });
    }


}
const actualizarEvento = async (req, res = response) => {

    const eventoId = req.params.id;
    const uid = req.uid;

    try {
        const evento = await Evento.findById(eventoId);
        if (!evento) {
            return res.status(404).json({
                ok: false,
                msg: 'el evento no existe por el id'
            });
        }
        if (evento.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'privilegio de edición no concedido'
            });
        }
        const nuevoEvento = {
            ...req.body,
            user: uid
        }
        //con {new:true} regresa el elemento actualizado, si no lo ponemos regresa el elemento sin actualizar
        const eventoActualizado = await Evento.findByIdAndUpdate(eventoId, nuevoEvento, { new: true });

        res.status(201).json({
            ok: true,
            msg: eventoActualizado
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'evento no actualizado'
        });
    }
}
const eliminarEvento = async (req, res = response) => {

    const eventoId = req.params.id;
    const uid = req.uid;
    try {
        const evento = await Evento.findById(eventoId);
        if (!evento) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe por ese id'
            });
        }
        if (evento.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'Privilegio de eliminación no concedido'
            });
        }
        await Evento.findByIdAndDelete(eventoId);
        res.json({ ok: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'No se ha podido eliminar'
        });
    }
}

module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}