//

const path = require('path');
const fs = require('fs');

const sharp = require('sharp');

const { response } = require('express');
const { v4: uuidv4 } = require('uuid');

// HELPERS
const { updateImage } = require('../helpers/update-image');

// MODELS
const Preventive = require('../models/preventives.model');
const Corrective = require('../models/correctives.model');


/** =====================================================================
 *  GET IMAGES
=========================================================================*/
const getImages = (req, res = response) => {

    const tipo = req.params.tipo;
    const image = req.params.image;

    const pathImg = path.join(__dirname, `../uploads/${tipo}/${image}`);

    // IMAGE DEFAULT
    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else {

        // CHECK TYPE
        if (tipo !== 'user') {
            const pathImg = path.join(__dirname, `../uploads/default.png`);
            res.sendFile(pathImg);
        } else {
            const pathImg = path.join(__dirname, `../uploads/user/user-default.png`);
            res.sendFile(pathImg);
        }

    }

};
/** =====================================================================
 *  GET IMAGES
=========================================================================*/

/** =====================================================================
 *  DELETE IMAGES
=========================================================================*/
const deleteImg = async(req, res = response) => {

    try {
        const type = req.params.type;
        const id = req.params.id;
        const desc = req.params.desc;
        const img = req.params.img;

        switch (type) {
            case 'preventives':

                let preventiveUpdate;
                if (desc === 'imgBef') {
                    preventiveUpdate = await Preventive.updateOne({ _id: id }, { $pull: { imgBef: { img } } });
                } else if (desc === 'imgAft') {
                    preventiveUpdate = await Preventive.updateOne({ _id: id }, { $pull: { imgAft: { img } } });
                }

                // VERIFICAR SI SE ACTUALIZO
                if (preventiveUpdate.nModified === 0) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'No se pudo eliminar esta imagen, porfavor intente de nuevo'
                    });
                }

                // ELIMINAR IMAGEN DE LA CARPETA
                const path = `./uploads/${ type }/${ img }`;
                if (fs.existsSync(path)) {
                    // DELET IMAGE OLD
                    fs.unlinkSync(path);
                }

                const preventive = await Preventive.findById(id)
                    .populate('create', 'name role img')
                    .populate('staff', 'name role img')
                    .populate('notes.staff', 'name role img')
                    .populate('client', 'name cedula phone email address city')
                    .populate('product', 'code serial brand model year status estado next img');

                res.json({
                    ok: true,
                    preventive
                });

                break;

            case 'correctives':

                let correctiveUpdate;
                if (desc === 'imgBef') {
                    correctiveUpdate = await Corrective.updateOne({ _id: id }, { $pull: { imgBef: { img } } });
                } else if (desc === 'imgAft') {
                    correctiveUpdate = await Corrective.updateOne({ _id: id }, { $pull: { imgAft: { img } } });
                }

                // VERIFICAR SI SE ACTUALIZO
                if (correctiveUpdate.nModified === 0) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'No se pudo eliminar esta imagen, porfavor intente de nuevo'
                    });
                }

                // ELIMINAR IMAGEN DE LA CARPETA
                const pathc = `./uploads/${ type }/${ img }`;
                if (fs.existsSync(pathc)) {
                    // DELET IMAGE OLD
                    fs.unlinkSync(pathc);
                }

                const corrective = await Corrective.findById(id)
                    .populate('create', 'name role img')
                    .populate('staff', 'name role img')
                    .populate('notes.staff', 'name role img')
                    .populate('client', 'name cedula phone email address city')
                    .populate('product', 'code serial brand model year status estado next img');

                res.json({
                    ok: true,
                    corrective
                });

                break;

            default:
                return res.status(400).json({
                    ok: false,
                    msg: 'Ha ocurrido un error, porfavor intente de nuevo'
                });
                break;
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, porfavor intente nuevamente'
        });
    }

};

/** =====================================================================
 *  DELETE IMAGES
=========================================================================*/

// EXPORTS
module.exports = {
    getImages,
    deleteImg
};