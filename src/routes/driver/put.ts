import express from 'express';
import validator from 'validator';
import Driver from '../../models/driver';
import { removeKeys, removeKeysExcept } from '../../helpers';

const router = express.Router();

router.put('/:driver_id', (req, res) => {
    if (!validator.isMongoId(req.params.driver_id)) {
        return res
            .status(400)
            .json({ status: 'Bad Request', message: `'${req.params.driver_id}' is not an valid Mongo ObjectID` });
    }

    // Copy body object
    const data = Object.assign(req.body);

    // Remove keys that we don´t need
    removeKeysExcept(data, ['username', 'firstname', 'lastname', 'password']);

    if (Object.keys(data).length < 1) {
        return res.status(400).json({ status: 'Bad Request', message: 'Atleast one field has to be updated' });
    }

    if (data.hasOwnProperty('firstname') && !validator.isLength(data.firstname, { min: 2 })) {
        return res
            .status(400)
            .json({ status: 'Bad Request', message: "Field 'firstname' should have a minimun length of 2" });
    }
    if (data.hasOwnProperty('lastname') && !validator.isLength(data.lastname, { min: 2 })) {
        return res
            .status(400)
            .json({ status: 'Bad Request', message: "Field 'lastname' should have a minimun length of 2" });
    }
    if (data.hasOwnProperty('username') && !validator.isLength(data.username, { min: 6 })) {
        return res
            .status(400)
            .json({ status: 'Bad Request', message: "Field 'username' should have a minimun length of 6" });
    }
    if (data.hasOwnProperty('password') && !validator.isLength(data.password, { min: 6 })) {
        return res
            .status(400)
            .json({ status: 'Bad Request', message: "Field 'password' should have a minimun length of 6" });
    }

    Driver.findByIdAndUpdate(req.params.driver_id, data)
        .exec()
        .then((driver) => {
            if (driver === null) {
                return res.status(404).json({ status: 'Not Found', message: 'Could not find a driver with that id' });
            }
            const response = Object.assign(driver.toObject(), data);
            removeKeys(response, ['password', '__v']);
            return res.json(response);
        })
        .catch((err) => {
            return res.json(err);
        });
});

export default router;
