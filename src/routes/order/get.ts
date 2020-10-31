import dayjs from 'dayjs';
import express from 'express';
import validator from 'validator';
import get_orders from '../../controllers/get_orders';
import { removeKeysExcept } from '../../helpers';

const router = express.Router();

router.get('/', (req, res) => {
    // Copy body object
    const filter = Object.assign(req.body);

    // Remove keys that we don´t need
    removeKeysExcept(filter, [
        'id',
        'region_id',
        'car_id',
        'driver_id',
        'phone_number',
        'email',
        'placed',
        'started',
        'arrival_time',
        'arrived',
        'completed',
    ]);

    if (filter.hasOwnProperty('region_id') && !validator.isMongoId(filter.region_id)) {
        return res
            .status(400)
            .json({ status: 'Bad Request', message: "Field 'region_id' is not a valid MongoDB ObjectID" });
    }
    if (filter.hasOwnProperty('car_id') && !validator.isMongoId(filter.car_id)) {
        return res
            .status(400)
            .json({ status: 'Bad Request', message: "Field 'car_id' is not a valid MongoDB ObjectID" });
    }
    if (filter.hasOwnProperty('driver_id') && !validator.isMongoId(filter.driver_id)) {
        return res
            .status(400)
            .json({ status: 'Bad Request', message: "Field 'driver_id' is not a valid MongoDB ObjectID" });
    }
    if (filter.hasOwnProperty('id') && !validator.isMongoId(filter.id)) {
        return res.status(400).json({ status: 'Bad Request', message: "Field 'id' is not a valid MongoDB ObjectID" });
    }
    if (filter.hasOwnProperty('phone_number') && !validator.isMobilePhone(filter.phone_number)) {
        return res
            .status(400)
            .json({ status: 'Bad Request', message: "Field 'phone_number' is not a valid mobile number" });
    }
    if (filter.hasOwnProperty('email') && !validator.isEmail(filter.email)) {
        return res.status(400).json({ status: 'Bad Request', message: "Field 'email' is not a valid email address" });
    }
    if (filter.hasOwnProperty('placed') && !dayjs(filter.placed).isValid()) {
        return res.status(400).json({ status: 'Bad Request', message: "Field 'placed' is not a valid date" });
    }
    if (filter.hasOwnProperty('started') && !dayjs(filter.started).isValid()) {
        return res.status(400).json({ status: 'Bad Request', message: "Field 'started' is not a valid date" });
    }
    if (filter.hasOwnProperty('arrival_time') && !dayjs(filter.arrival_time).isValid()) {
        return res.status(400).json({ status: 'Bad Request', message: "Field 'arrival_time' is not a valid date" });
    }
    if (filter.hasOwnProperty('arrived') && !dayjs(filter.arrived).isValid()) {
        return res.status(400).json({ status: 'Bad Request', message: "Field 'arrived' is not a valid date" });
    }
    if (filter.hasOwnProperty('completed') && !dayjs(filter.completed).isValid()) {
        return res.status(400).json({ status: 'Bad Request', message: "Field 'completed' is not a valid date" });
    }
    get_orders(filter)
        .then((orders) => {
            res.json(orders);
        })
        .catch((err) => {
            res.json(err);
        });
});

router.get('/:order_id', (req, res) => {
    if (!validator.isMongoId(req.params.order_id)) {
        return res
            .status(400)
            .json({ status: 'Bad Request', message: `'${req.params.order_id}' is not a valid MongoDB ObjectID` });
    }
    get_orders({ id: req.params.order_id })
        .then((orders) => {
            if (!orders[0]) {
                return res.status(404).json({ status: 'Not Found', message: 'Could not find a order with that id' });
            }
            return res.json(orders[0]);
        })
        .catch((err) => {
            return res.json(err);
        });
});

export default router;
