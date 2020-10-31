import mongoose from 'mongoose';
import 'mongoose-geojson-schema';

const schema = new mongoose.Schema({
    phone_number: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: false,
    },
    region: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Region',
    },
    location: {
        type: mongoose.Schema.Types.Point,
        required: true,
    },
    full_address: {
        type: String,
        required: true,
    },
    stop_time: {
        type: Number,
        required: true,
    },
    placed: {
        type: Date,
        required: true,
    },
    started: {
        type: Date,
        required: false,
    },
    arrival_time: {
        type: Date,
        required: true,
    },
    arrived: {
        type: Date,
        required: false,
    },
    completed: {
        type: Date,
        required: false,
    },
});

export default schema;
