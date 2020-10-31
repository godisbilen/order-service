import express from 'express';

import get from './get';
import post from './post';
import put from './put';

const path = '/car';

const router = express.Router();

router.use(path, get);
router.use(path, post);
router.use(path, put);
// No delete, because we don´t want to remove all orders that was assigned to a car

export default router;
