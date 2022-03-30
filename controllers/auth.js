const bcrypt = require('bcryptjs/dist/bcrypt');
const { response } = require('express');
const { generarJWT } = require('../helpers/jwt');
const Usuario = require('../models/Usuario');

const crearUsuario = async (req, res = response) => {

    const { email, password } = req.body;

    try {
        let usuario = await Usuario.findOne({ email });
        if (usuario) {
            return res.status(400).json(
                {
                    ok: false,
                    msg: 'El usuario ya existe'
                }
            );
        }

        usuario = new Usuario(req.body);

        //encriptar password:
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        //guardar en bdd:
        await usuario.save();

        //generar JWT:
        const token = await generarJWT(usuario.id, usuario.name);


        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'error de registro'
        })
    }

};

const loginUsuario = async (req, res = response) => {

    const { email, password } = req.body;

    try {
        //confirmar mail existente:
        let usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe'
            });
        }
        //confirmar passwords:
        const validPassword = bcrypt.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'contraseña incorrecta'
            });
        }

        //generar JWT:
        const token = await generarJWT(usuario.id, usuario.name);

        //generar jsonWebToken
        res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'error de registro'
        })
    }
}

const revalidarToken = async (req, res = response) => {
    const { uid, name } = req;

    //generar un nuevo JWT Y retornarlo en esta petición:
    //generar JWT:
    const token = await generarJWT(uid, name);

    res.json({
        ok: true,
        uid,
        name,
        token
    });
}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}