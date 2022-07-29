const { response } = require('express');

const Client = require('../models/clients.model');
const Product = require('../models/products.model');
const Preventive = require('../models/preventives.model');

/** =====================================================================
 *  SEARCH FOR TABLE
=========================================================================*/
const search = async(req, res = response) => {

    const busqueda = req.params.busqueda;
    const tabla = req.params.tabla;
    const regex = new RegExp(busqueda, 'i');
    const desde = Number(req.query.desde) || 0;
    const hasta = Number(req.query.hasta) || 50;

    let data = [];
    let total;

    const numeros = /^[0-9]+$/;
    let number = false;

    if (busqueda.match(numeros)) {
        number = true;
    } else {
        number = false;
    }

    switch (tabla) {

        case 'clients':

            // data = await Client.find({ name: regex });
            [data, total] = await Promise.all([
                Client.find({
                    $or: [
                        { name: regex },
                        { cedula: regex },
                        { phone: regex },
                        { email: regex },
                        { address: regex },
                        { city: regex },
                        { Department: regex }
                    ]
                }),
                Client.countDocuments()
            ]);
            break;
        case 'products':

            // data = await Client.find({ name: regex });
            [data, total] = await Promise.all([
                Product.find({
                    $or: [
                        { code: regex },
                        { serial: regex },
                        { brand: regex },
                        { model: regex },
                        { estado: regex }
                    ]
                })
                .populate('client', 'name phone cid'),
                Product.countDocuments()
            ]);
            break;

        case 'preventives':

            // COMPROBAR SI ES NUMERO
            if (number) {

                [data, total] = await Promise.all([
                    Preventive.find({
                        $or: [
                            { control: busqueda }
                        ]
                    })
                    .populate('client', 'name cedula phone email address city')
                    .populate('create', 'name')
                    .populate('staff', 'name')
                    .populate('product', 'code serial brand model year status estado next img'),
                    Preventive.countDocuments()
                ]);

            } else {
                [data, total] = await Promise.all([
                    Preventive.find({
                        $or: [
                            { estado: regex }
                        ]
                    })
                    .populate('client', 'name cedula phone email address city')
                    .populate('create', 'name')
                    .populate('staff', 'name')
                    .populate('product', 'code serial brand model year status estado next img'),
                    Preventive.countDocuments()
                ]);
            }


            break;

        default:
            res.status(400).json({
                ok: false,
                msg: 'Error en los parametros de la busquedad'
            });
            break;

    }

    res.json({
        ok: true,
        resultados: data,
        total
    });

};
/** =====================================================================
 *  SEARCH FOR TABLE
=========================================================================*/


// EXPORTS
module.exports = {
    search
};