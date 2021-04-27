import express from 'express';

import get from './get';
import post from './post';
import put from './put';
import del from './delete';
import authenticate from './authenticate';

const path = '/driver';

const router = express.Router();

router.use(path, get);
router.use(path, post);
router.use(path, put);
router.use(path, del);
router.use(path, authenticate);

export default router;
