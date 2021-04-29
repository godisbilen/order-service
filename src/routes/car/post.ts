import express from 'express';
import validator from 'validator';
import Car from '../../models/car';
import { removeKeys, removeKeysExcept, isLngLat } from '../../helpers';

const router = express.Router();

router.post('/', (req, res) => {
    // Copy body object
    const data = Object.assign(req.body);

    // Remove keys that we don´t need
    removeKeysExcept(data, [
        'nickname',
        'driver',
        'region',
        'start_time',
        'start_pos',
    ]);

    if (
        !data.hasOwnProperty('nickname') ||
        !validator.isLength(data.nickname, { min: 4 })
    ) {
        return res.status(400).json({
            status: 'Bad Request',
            message: "Field 'nickname' is required and minimun length of 4",
        });
    }
    if (data.hasOwnProperty('driver') && !validator.isMongoId(data.driver)) {
        return res.status(400).json({
            status: 'Bad Request',
            message: "Field 'driver' is not an valid MongoDB ObjectID",
        });
    }
    if (data.hasOwnProperty('region') && !validator.isMongoId(data.region)) {
        return res.status(400).json({
            status: 'Bad Request',
            message: "Field 'region' is not aa valid MongoDB ObjectID",
        });
    }
    if (
        data.hasOwnProperty('start_time') &&
        !validator.isNumeric('' + data.start_time)
    ) {
        return res.status(400).json({
            status: 'Bad Request',
            message: "Field 'start_time' is not a valid numeric value",
        });
    }
    if (!data.hasOwnProperty('start_pos') || !isLngLat(data.start_pos)) {
        return res.status(400).json({
            status: 'Bad Request',
            message: "Field 'start_pos' is not a valid LngLat value",
        });
    }

    data.start_pos = {
        type: 'Point',
        coordinates: data.start_pos,
    };

    const car = new Car(data);
    car.save()
        .then((car) => {
            const temp = car.toObject();
            removeKeys(temp, ['__v']);
            return res.json(temp);
        })
        .catch((err) => {
            return res.json(err);
        });
});

export default router;
