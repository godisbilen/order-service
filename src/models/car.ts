import mongoose from 'mongoose';
import orderSchema from './schemas/order';

const schema = new mongoose.Schema({
    nickname: {
        type: String,
        required: true,
    },
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver',
        required: false,
    },
    region: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Region',
        required: false,
    },
    start_time: {
        type: Number,
        required: true,
        default: 10,
    },
    start_pos: {
        type: mongoose.Schema.Types.Point,
        required: true,
    },
    orders: [orderSchema],
});

export default mongoose.model('Car', schema);
