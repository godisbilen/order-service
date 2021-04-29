import { LatLngArray } from '@googlemaps/google-maps-services-js';
import { Document } from 'mongoose';
import Region from '../models/region';

const get_regions = (filter: {
    id?: string;
    name?: string;
    intersects?: LatLngArray;
}): Promise<Document[]> => {
    return new Promise((resolve, reject) => {
        Region.find({
            ...(filter.id && {
                _id: filter.id,
            }),
            ...(filter.name && {
                name: filter.name,
            }),
            ...(filter.intersects && {
                bounds: {
                    $geoIntersects: {
                        $geometry: {
                            type: 'Point',
                            coordinates: filter.intersects,
                        },
                    },
                },
            }),
        })
            .select({ __v: 0 })
            .exec((err, res) => {
                if (err) {
                    reject(err);
                }
                resolve(res);
            });
    });
};

export default get_regions;
