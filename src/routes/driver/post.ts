import express from 'express';
import validator from 'validator';
import Driver from '../../models/driver';
import bcrypt from 'bcrypt';
import { removeKeys, removeKeysExcept } from '../../helpers';

const router = express.Router();

router.post('/', (req, res) => {
    // Copy body object
    const data = Object.assign(req.body);

    // Remove keys that we don´t need
    removeKeysExcept(data, ['username', 'firstname', 'lastname', 'password']);

    if (
        !data.hasOwnProperty('username') ||
        !validator.isLength(data.username, { min: 6 })
    ) {
        return res.status(400).json({
            status: 'Bad Request',
            message: "Field 'username' is required and minimun length of 6",
        });
    }
    if (
        !data.hasOwnProperty('firstname') ||
        !validator.isLength(data.firstname, { min: 2 })
    ) {
        return res.status(400).json({
            status: 'Bad Request',
            message: "Field 'firstname' is required and minimun length of 2",
        });
    }
    if (
        !data.hasOwnProperty('lastname') ||
        !validator.isLength(data.lastname, { min: 2 })
    ) {
        return res.status(400).json({
            status: 'Bad Request',
            message: "Field 'lastname' is required and minimun length of 2",
        });
    }
    if (
        !data.hasOwnProperty('password') ||
        !validator.isLength(data.password, { min: 6 })
    ) {
        return res.status(400).json({
            status: 'Bad Request',
            message: "Field 'password' is required and minimun length of 6",
        });
    }

    const salt = bcrypt.genSaltSync(10);
    data['password'] = bcrypt.hashSync(data['password'], salt);
    const driver = new Driver(data);
    driver
        .save()
        .then((driver) => {
            const temp = driver.toObject();
            removeKeys(temp, ['password', '__v']);
            return res.json(temp);
        })
        .catch((err) => {
            return res.status(500).send(err);
        });
});

export default router;
