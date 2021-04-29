import express from 'express';

import get from './get';
import post from './post';
import put from './put';

const path = '/order';

const router = express.Router();

router.use(path, get);
router.use(path, post);
router.use(path, put);

export default router;
