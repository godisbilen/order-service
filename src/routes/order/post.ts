import dayjs from 'dayjs';
import express from 'express';
import validator from 'validator';
import create_order from '../../controllers/create_order';
import { isLngLat, removeKeysExcept } from '../../helpers';

const router = express.Router();

router.post('/', (req, res) => {
    // Copy body object
    const data = Object.assign(req.body);

    // Remove keys that we don´t need
    removeKeysExcept(data, ['coordinates', 'full_address', 'phone_number', 'email', 'stop_time', 'from']);

    // Check so all required fields is set
    if (!data.coordinates || !(data.phone_number || data.email)) {
        return res.status(400).json({ status: 'Bad Request', message: 'One or more required fields was not set' });
    }

    // Validate fields
    if (!isLngLat(data.coordinates)) {
        return res
            .status(400)
            .json({ status: 'Bad Request', message: "Field 'coordinates' is not a valid LngLat object" });
    }
    if (data.hasOwnProperty('phone_number') && !validator.isMobilePhone(data.phone_number, 'sv-SE')) {
        return res
            .status(400)
            .json({ status: 'Bad Request', message: "Field 'phone_number' is not a valid phone number" });
    }
    if (data.hasOwnProperty('email') && !validator.isEmail(data.email)) {
        return res.status(400).json({ status: 'Bad Request', message: "Field 'email' is not a valid email-address" });
    }
    if (data.hasOwnProperty('stop_time') && isNaN(data.stop_time)) {
        return res
            .status(400)
            .json({ status: 'Bad Request', message: "Field 'stop_time' is not a valid numeric value" });
    }
    if (data.hasOwnProperty('from')) {
        if (!dayjs(data.from).isValid()) {
            return res.status(400).json({ status: 'Bad Request', message: "Field 'from' is not a valid date value" });
        }
        if (validator.isBefore(data.from, dayjs().toISOString())) {
            return res.status(400).json({ status: 'Bad Request', message: "Field 'from' is not an upcomming date" });
        }
    }
    create_order(data)
        .then((order_info) => {
            return res.json(order_info);
        })
        .catch((err) => {
            return res.status(500).json(err.message);
        });
});

export default router;
