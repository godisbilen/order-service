import dayjs from 'dayjs';
import express from 'express';
import validator from 'validator';
import { removeKeysExcept } from '../../helpers';
import Car from '../../models/car';
import { order } from '@godisbilen/types';

const router = express.Router();

router.put('/:order_id', (req, res) => {
    if (!validator.isMongoId(req.params.order_id)) {
        return res.status(400).json({
            status: 'Bad Request',
            message: `'${req.params.order_id}' is not an valid Mongo ObjectID`,
        });
    }
    // Copy body object
    const data = Object.assign(req.body);

    // Remove keys that we don´t need
    removeKeysExcept(data, [
        'phone_number',
        'email',
        'stop_time',
        'started',
        'arrived',
        'completed',
    ]);

    if (Object.keys(data).length < 1) {
        return res.status(400).json({
            status: 'Bad Request',
            message: 'Atleast one field has to be updated',
        });
    }
    if (
        data.hasOwnProperty('phone_number') &&
        !validator.isMobilePhone(data.phone_number, 'sv-SE')
    ) {
        return res.status(400).json({
            status: 'Bad Request',
            message: "Field 'phone_number' is not a valid phone number",
        });
    }
    if (data.hasOwnProperty('email') && !validator.isEmail(data.email)) {
        return res.status(400).json({
            status: 'Bad Request',
            message: "Field 'email' is not a valid email-address",
        });
    }
    if (data.hasOwnProperty('stop_time') && isNaN(data.stop_time)) {
        return res.status(400).json({
            status: 'Bad Request',
            message: "Field 'stop_time' is not a valid numeric value",
        });
    }
    if (data.hasOwnProperty('started') && !dayjs(data.started).isValid()) {
        return res.status(400).json({
            status: 'Bad Request',
            message: "Field 'started' is not a valid date value",
        });
    }
    if (data.hasOwnProperty('arrived') && !dayjs(data.arrived).isValid()) {
        return res.status(400).json({
            status: 'Bad Request',
            message: "Field 'arrived' is not a valid date value",
        });
    }
    if (data.hasOwnProperty('completed') && !dayjs(data.completed).isValid()) {
        return res.status(400).json({
            status: 'Bad Request',
            message: "Field 'completed' is not a valid date value",
        });
    }

    Car.findOneAndUpdate(
        { 'orders._id': req.params.order_id },
        {
            $set: {
                ...(data.hasOwnProperty('phone_number') && {
                    'orders.$.phone_number': data.phone_number,
                }),
                ...(data.hasOwnProperty('email') && {
                    'orders.$.email': data.email,
                }),
                ...(data.hasOwnProperty('stop_time') && {
                    'orders.$.stop_time': data.stop_time,
                }),
                ...(data.hasOwnProperty('started') && {
                    'orders.$.started': data.started,
                }),
                ...(data.hasOwnProperty('arrived') && {
                    'orders.$.arrived': data.arrived,
                }),
                ...(data.hasOwnProperty('completed') && {
                    'orders.$.completed': data.completed,
                }),
            },
        },
    )
        .exec()
        .then((data: any) => {
            const orders: order[] = data.orders as any;
            orders.forEach((order) => {
                if (order._id == req.params.order_id) {
                    return res.json(order).send();
                }
            });
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).send();
        });
});

export default router;
