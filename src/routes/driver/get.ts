import express from 'express';
import validator from 'validator';
import Driver from '../../models/driver';
import { removeKeysExcept, renameKey } from '../../helpers';

const router = express.Router();

router.get('/', (req, res) => {
    // Copy body object
    const filter = Object.assign(req.query);

    // Remove keys that we don´t need
    removeKeysExcept(filter, ['id', 'username', 'firstname', 'lastname']);

    if (filter.hasOwnProperty('id') && !validator.isMongoId(filter.id)) {
        return res.status(400).json({
            status: 'Bad Request',
            message: "Field 'id' is not a valid MongoDB ObjectID",
        });
    }
    if (
        filter.hasOwnProperty('username') &&
        !validator.isLength(filter.username, { min: 6 })
    ) {
        return res.status(400).json({
            status: 'Bad Request',
            message: "Field 'username' needs to have a minimun length of 6",
        });
    }
    if (
        filter.hasOwnProperty('firstname') &&
        !validator.isLength(filter.firstname, { min: 2 })
    ) {
        return res.status(400).json({
            status: 'Bad Request',
            message: "Field 'firstname' needs to have a minimun length of 2",
        });
    }
    if (
        filter.hasOwnProperty('lastname') &&
        !validator.isLength(filter.lastname, { min: 2 })
    ) {
        return res.status(400).json({
            status: 'Bad Request',
            message: "Field 'lastname' needs to have a minimun length of 2",
        });
    }

    // Rename the key 'id' to '_id'
    renameKey(filter, 'id', '_id');
    Driver.find(filter, { __v: 0, password: 0 })
        .exec()
        .then((drivers) => {
            return res.json(drivers);
        })
        .catch((err) => {
            return res.json(err);
        });
});

router.get('/:driver_id', (req, res) => {
    if (!validator.isMongoId(req.params.driver_id)) {
        return res.status(400).json({
            status: 'Bad Request',
            message: `'${req.params.driver_id}' is not a valid MongoDB ObjectID`,
        });
    }

    Driver.find({ _id: req.params.driver_id }, { __v: 0, password: 0 })
        .exec()
        .then((drivers) => {
            if (!drivers[0]) {
                return res.status(404).json({
                    status: 'Not Found',
                    message: 'Could not find a driver with that id',
                });
            }
            return res.json(drivers[0]);
        })
        .catch((err) => {
            return res.json(err);
        });
});

export default router;
