import express from 'express';
import validator from 'validator';
import Region from '../../models/region';

const router = express.Router();

router.delete('/:region_id', (req, res) => {
    if (validator.isMongoId(req.params.region_id)) {
        return res.status(400).json({
            status: 'Bad Request',
            message: `'${req.params.region_id}' is not an valid Mongo ObjectID`,
        });
    }

    Region.findByIdAndDelete(req.params.region_id)
        .exec()
        .then(() => {
            return res.json({ message: 'Deleted' });
        })
        .catch((err: Error) => {
            res.json(err);
        });
});

export default router;
