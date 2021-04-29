import express from 'express';
import validator from 'validator';
import get_cars from '../../controllers/get_cars';
import { isLngLat, removeKeysExcept } from '../../helpers';

const router = express.Router();

router.get('/', (req, res) => {
    // Copy body object
    const filter = Object.assign(req.query);

    // Remove keys that we don´t need
    removeKeysExcept(filter, ['id', 'nickname', 'driver_id', 'intersects']);

    if (filter['id'] !== undefined && !validator.isMongoId(req.body.id)) {
        return res.status(400).json({
            status: 'Bad Request',
            message: "Field 'id' is not a valid MongoDB ObjectID",
        });
    }
    if (
        filter['driver_id'] !== undefined &&
        !validator.isMongoId(req.body.driver_id)
    ) {
        return res.status(400).json({
            status: 'Bad Request',
            message: "Field 'driver_id' is not a valid MongoDB ObjectID",
        });
    }
    if (
        filter['intersects'] !== undefined &&
        !(
            Array.isArray(filter.intersects) &&
            filter.intersects[0] &&
            filter.intersects[1] &&
            !isNaN(filter.intersects[0]) &&
            !isNaN(filter.intersects[1]) &&
            isLngLat(filter.intersects)
        )
    ) {
        return res.status(400).json({
            status: 'Bad Request',
            message: "Field 'intersects' is not valid coordinates",
        });
    }

    get_cars(filter)
        .then((cars) => {
            res.json(cars);
        })
        .catch(() => {
            return res.send('Could not get cars from database');
        });
});

router.get('/:car_id', (req, res) => {
    if (!validator.isMongoId(req.params.car_id)) {
        return res.status(400).json({
            status: 'Bad Request',
            message: `'${req.params.car_id}' is not a valid MongoDB ObjectID`,
        });
    }
    get_cars({ id: req.params.car_id })
        .then((cars) => {
            if (!cars[0]) {
                return res.status(404).json({
                    status: 'Not Found',
                    message: 'Could not find a car with that id',
                });
            }
            return res.json(cars[0]);
        })
        .then((err) => {
            return res.json(err);
        });
});

export default router;
