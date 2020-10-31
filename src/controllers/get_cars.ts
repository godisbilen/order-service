import { LatLngArray } from '@googlemaps/google-maps-services-js';
import Region from '../models/region';
import { car } from '../types';

interface filter {
    id?: string;
    nickname?: string;
    driver_id?: string;
    intersects?: LatLngArray;
}

const get_cars = (filter: filter): Promise<car[]> => {
    return new Promise((resolve, reject) => {
        const aggregate = [
            {
                $lookup: {
                    from: 'cars',
                    localField: 'cars',
                    foreignField: '_id',
                    as: 'cars',
                },
            },
            {
                $unwind: '$cars',
            },
            {
                $match: {
                    ...(filter.id && {
                        'cars._id': {
                            $eq: filter.id,
                        },
                    }),
                    ...(filter.nickname && {
                        'cars.nickname': {
                            $eq: filter.nickname,
                        },
                    }),
                    ...(filter.driver_id && {
                        'cars.driver': {
                            $eq: filter.driver_id,
                        },
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
                },
            },
            {
                $group: {
                    _id: null as null,
                    cars: {
                        $push: '$cars',
                    },
                },
            },
            {
                $project: {
                    'cars.orders': 0,
                    'cars.__v': 0,
                },
            },
        ];

        Region.aggregate(aggregate)
            .allowDiskUse(true)
            .exec((err, res) => {
                if (err) {
                    reject(err);
                }
                resolve(res && res[0] ? res[0].cars : []);
            });
    });
};

export default get_cars;
