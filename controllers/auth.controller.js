const { response } = require('express');
const bcrypt = require('bcryptjs');

const Abonado = require('../models/abonado.model');

const { generarJWT } = require('../helpers/jwt');

/** =====================================================================
 *  LOGIN
 =========================================================================*/
const login = async(req, res = response) => {

    const { usuario, password } = req.body;

    try {

        // VALIDATE USER
        const abonadoDB = await Abonado.findOne({ usuario });
        if (!abonadoDB) {

            return res.status(404).json({
                ok: false,
                msg: 'El usuario o la contraseña es incorrecta'
            });

        }
        // VALIDATE USER

        // PASSWORD
        const validPassword = bcrypt.compareSync(password, abonadoDB.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario o la contraseña es incorrecta'
            });
        } else {

            if (abonadoDB.status) {
                const token = await generarJWT(abonadoDB.id);

                res.json({
                    ok: true,
                    token
                });
            } else {
                return res.status(401).json({
                    ok: false,
                    msg: 'Tu cuenta a sido desactivada por un administrador'
                });
            }

        }

        // JWT - JWT

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });

    }


};
/** =====================================================================
 *  LOGIN
=========================================================================*/

/** =====================================================================
 *  RENEW TOKEN
======================================================================*/
const renewJWT = async(req, res = response) => {

    const aid = req.aid;

    // GENERAR TOKEN - JWT
    const token = await generarJWT(aid);

    // SEARCH USER
    const abonado = await Abonado.findById(aid, 'usuario name password clients valid status fecha');
    // SEARCH USER

    res.status(200).json({
        ok: true,
        token,
        abonado
    });

};
/** =====================================================================
 *  RENEW TOKEN
=========================================================================*/


module.exports = {
    login,
    renewJWT
};