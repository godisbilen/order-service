import express from 'express';
import validator from 'validator';
import get_regions from '../../controllers/get_regions';
import { removeKeysExcept } from '../../helpers';

const router = express.Router();

router.get('/', (req, res) => {
    // Copy body object
    const filter = Object.assign(req.query);

    // Remove keys that we don´t need
    removeKeysExcept(filter, ['id', 'name', 'active', 'intersects']);

    // Validate fields
    if (filter['id'] !== undefined && !validator.isMongoId(filter.id)) {
        return res.status(400).json({
            status: 'Bad Request',
            message: "Field 'id' is not a valid MongoDB ObjectID",
        });
    }
    if (filter['active'] !== undefined && !validator.isBoolean(filter.active)) {
        return res.status(400).json({
            status: 'Bad Request',
            message: "Field 'active' is not a valid boolean",
        });
    }

    get_regions(filter)
        .then((regions) => {
            return res.json(regions);
        })
        .catch((err) => {
            return res.json(err);
        });
});

router.get('/:region_id', (req, res) => {
    if (validator.isMongoId(req.params.region_id)) {
        return res.status(400).json({
            status: 'Bad Request',
            message: `'${req.params.region_id}' is not an valid Mongo ObjectID`,
        });
    }
    get_regions({ id: req.params.region_id })
        .then((regions) => {
            if (!regions[0]) {
                return res.status(404).json({
                    status: 'Not Found',
                    message: 'Could not find a region with that id',
                });
            }
            return res.json(regions[0]);
        })
        .catch((err) => {
            return res.json(err);
        });
});

export default router;
