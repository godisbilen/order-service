import mongoose from 'mongoose';
import 'mongoose-geojson-schema';

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    active: {
        type: Boolean,
        required: true,
        default: true,
    },
    bounds: {
        type: mongoose.Schema.Types.Polygon,
        required: true,
    },
    cars: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Car',
        },
    ],
});

export default mongoose.model('Region', schema);
