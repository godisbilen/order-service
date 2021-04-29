import express from 'express';
import validator from 'validator';
import Region from '../../models/region';
import {
    arrayEquals,
    isLngLat,
    removeKeys,
    removeKeysExcept,
} from '../../helpers';

const router = express.Router();

router.put('/:region_id', (req, res) => {
    if (validator.isMongoId(req.params.region_id)) {
        return res.status(400).json({
            status: 'Bad Request',
            message: `'${req.params.region_id}' is not an valid Mongo ObjectID`,
        });
    }

    // Copy body object
    const data = Object.assign(req.body);

    // Remove keys that we don´t need
    removeKeysExcept(data, ['name', 'active', 'bounds']);

    if (
        data['active'] !== undefined &&
        !(data.active === false || data.active === true)
    ) {
        return res.status(400).json({
            status: 'Bad Request',
            message: "Field 'active' is not a boolean",
        });
    }

    if (data['bounds'] !== undefined) {
        // Validate coordinates in bounds
        Object.values(data.bounds).forEach((coordinate: [number, number]) => {
            if (!isLngLat(coordinate)) {
                return res.status(400).json({
                    status: 'Bad Request',
                    message:
                        'One or more coordinates in bounds is not a LngLat Array',
                });
            }
        });
        if (!arrayEquals(data.bounds[0], data.bounds[data.bounds.length - 1])) {
            return res.status(400).json({
                status: 'Bad Request',
                message:
                    'The first and last coordinates in bounds has to be indentical',
            });
        }
    }

    Region.findByIdAndUpdate(req.params.region_id, data)
        .exec()
        .then((region) => {
            const response = Object.assign(region.toObject(), data);
            removeKeys(response, ['__v']);
            return res.json(response);
        })
        .catch((err) => {
            res.json(err);
        });
});

export default router;
