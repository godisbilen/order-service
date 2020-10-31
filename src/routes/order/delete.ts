import express from 'express';

const router = express.Router();

router.delete('/:order_id', (req, res) => {
    res.send('Not implemented');
});

export default router;
