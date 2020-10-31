import express from 'express';
import validator from 'validator';
import Driver from '../../models/driver';
import Car from '../../models/car';

const router = express.Router();

router.delete('/:driver_id', (req, res) => {
    res.send('Not implemented');
    if (!validator.isMongoId(req.params.driver_id)) {
        return res
            .status(400)
            .json({ status: 'Bad Request', message: `'${req.params.driver_id}' is not a valid MongoDB ObjectID` });
    }

    Driver.findByIdAndDelete(req.params.driver_id)
        .exec()
        .then(() => {
            Car.updateMany({ driver: req.params.driver_id }, { $unset: { driver: '' } })
                .exec()
                .then(() => {
                    return res.json({ message: 'Deleted' });
                })
                .catch((err) => {
                    res.json(err);
                });
        })
        .catch((err) => {
            res.json(err);
        });
});

export default router;
