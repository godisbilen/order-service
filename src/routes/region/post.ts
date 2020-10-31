import express from 'express';
import Region from '../../models/region';
import { arrayEquals, isLngLat, removeKeys, removeKeysExcept } from '../../helpers';

const router = express.Router();

router.post('/', (req, res) => {
    // Copy body object
    const data = Object.assign(req.body);

    // Remove keys that we don´t need
    removeKeysExcept(data, ['name', 'active', 'bounds']);

    // Validate fields
    if (!data.hasOwnProperty('name')) {
        return res.status(400).json({ status: 'Bad Request', message: "Field 'name' is required" });
    }
    if (data.hasOwnProperty('active') && !(data.active === false || data.active === true)) {
        return res.status(400).json({ status: 'Bad Request', message: "Field 'active' is not a boolean" });
    }
    if (!data.hasOwnProperty('bounds')) {
        return res.status(400).json({ status: 'Bad Request', message: "Field 'bounds' is required" });
    }

    // Validate coordinates in bounds
    Object.values(data.bounds).forEach((coordinate: [number, number]) => {
        if (!isLngLat(coordinate)) {
            return res
                .status(400)
                .json({ status: 'Bad Request', message: 'One or more coordinates in bounds is not a LngLat Array' });
        }
    });
    if (!arrayEquals(data.bounds[0], data.bounds[data.bounds.length - 1])) {
        return res
            .status(400)
            .json({ status: 'Bad Request', message: 'The first and last coordinates in bounds has to be indentical' });
    }

    data.bounds = {
        type: 'Polygon',
        coordinates: [data.bounds],
    };

    const region = new Region(data);
    region
        .save()
        .then((region) => {
            const temp = region.toObject();
            removeKeys(temp, ['__v']);
            return res.json(temp);
        })
        .catch((err) => {
            return res.json(err);
        });
});

export default router;
