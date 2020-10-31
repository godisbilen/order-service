import express from 'express';

import get from './get';
import post from './post';
import put from './put';
import del from './delete';

const path = '/driver';

const router = express.Router();

router.use(path, get);
router.use(path, post);
router.use(path, put);
router.use(path, del);

export default router;
