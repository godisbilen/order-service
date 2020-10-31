import express from 'express';
import validator from 'validator';
import Car from '../../models/car';
import Region from '../../models/region';
import { removeKeys, removeKeysExcept } from '../../helpers';

const router = express.Router();

router.put('/:car_id', (req, res) => {
    if (!validator.isMongoId(req.params.car_id)) {
        return res
            .status(400)
            .json({ status: 'Bad Request', message: `'${req.params.car_id}' is not a valid MongoDB ObjectID` });
    }

    // Copy body object
    const data = Object.assign(req.body);

    // Remove keys that we don´t need
    removeKeysExcept(data, ['nickname', 'driver', 'region', 'start_time']);

    if (Object.keys(data).length < 1) {
        return res.status(400).json({ status: 'Bad Request', message: 'Atleast one field has to be updated' });
    }
    if (data.hasOwnProperty('nickname') && data.nickname.length < 4) {
        return res
            .status(400)
            .json({ status: 'Bad Request', message: "Field 'nickname' has to be longer than 4 characters" });
    }
    if (data.hasOwnProperty('driver') && !validator.isMongoId(data.driver)) {
        return res
            .status(400)
            .json({ status: 'Bad Request', message: "Field 'driver' is not a valid MongoDB ObjectID" });
    }
    if (data.hasOwnProperty('region') && !validator.isMongoId(data.region)) {
        return res
            .status(400)
            .json({ status: 'Bad Request', message: "Field 'region' is not a valid MongoDB ObjectID" });
    }
    if (data.hasOwnProperty('start_time') && !validator.isNumeric('' + req.body.start_time)) {
        return res
            .status(400)
            .json({ status: 'Bad Request', message: "Field 'start_time' is not a valid numeric value" });
    }

    Car.findByIdAndUpdate(req.params.car_id, data)
        .exec()
        .then(async (car) => {
            if (car === null) {
                return res.status(404).json({ status: 'Not Found', message: 'Could not find a car with that id' });
            }

            const old_car = car.toObject();

            if (data.hasOwnProperty('region') && (data.region != old_car.region || !old_car.hasOwnProperty('region'))) {
                // Remove car from the old region
                if (!old_car.hasOwnProperty('region')) {
                    await Region.findByIdAndUpdate(old_car.region, { $pull: { cars: old_car._id } })
                        .exec()
                        .catch((err) => {
                            return res.json(err);
                        });
                }
                // Add car to the new region
                await Region.findByIdAndUpdate(data.region, {
                    $push: { cars: old_car._id },
                })
                    .exec()
                    .catch((err) => {
                        return res.json(err);
                    });
            }
            const response = Object.assign(old_car, data);
            removeKeys(response, ['__v']);
            return res.json(response);
        })
        .catch((err) => {
            return res.json(err);
        });
});

export default router;
