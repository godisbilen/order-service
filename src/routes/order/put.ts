import express from 'express';
import validator from 'validator';
import { removeKeysExcept } from '../../helpers';

const router = express.Router();

router.put('/:order_id', (req, res) => {
    if (!validator.isMongoId(req.params.order_id)) {
        return res
            .status(400)
            .json({ status: 'Bad Request', message: `'${req.params.order_id}' is not an valid Mongo ObjectID` });
    }
    // Copy body object
    const data = Object.assign(req.body);

    // Remove keys that we don´t need
    removeKeysExcept(data, ['phone_number', 'email', 'full_address', 'stop_time']);

    if (Object.keys(data).length < 1) {
        return res.status(400).json({ status: 'Bad Request', message: 'Atleast one field has to be updated' });
    }

    res.send('Not implemented');
    // Continue code
});

export default router;
