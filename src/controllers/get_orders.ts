import dayjs from 'dayjs';
import mongoose from 'mongoose';
import Car from '../models/car';
import { order } from '@godisbilen/types';

type filterDate =
    | dayjs.Dayjs
    | Date
    | string
    | boolean
    | [
          dayjs.Dayjs | Date | string | undefined,
          dayjs.Dayjs | Date | string | undefined,
      ];

interface filter {
    region_id?: string;
    car_id?: string;
    driver_id?: string;
    id?: string;
    phone_number?: string;
    email?: string;
    placed?: filterDate;
    started?: filterDate;
    arrival_time?: filterDate;
    arrived?: filterDate;
    completed?: filterDate;
}

type sort = Record<string, -1 | 1> | null;

const filter_date = (field: string, filter: filterDate) => {
    const temp: Record<string, Record<string, Date | string>> = {};
    temp[field] = {};

    // If it is an array, filter by greater than filter[0], and less than filter[1]
    // Both doesn´t have to be set
    if (Array.isArray(filter)) {
        if (filter[0]) {
            temp[field].$gt = dayjs(filter[0]).toDate();
        }
        if (filter[1]) {
            temp[field].$lt = dayjs(filter[1]).toDate();
        }

        // Field is set
    } else if (filter === true || filter === 'true') {
        temp[field].$gt = null;
    }
    // Field is not set
    else if (filter === false || filter === 'false') {
        temp[field].$lte = null;
    }

    return temp;
};

const validate_filter = (filter: filter): boolean => {
    if (filter.region_id && !mongoose.Types.ObjectId.isValid(filter.region_id))
        return false;

    if (filter.car_id && !mongoose.Types.ObjectId.isValid(filter.car_id))
        return false;

    if (filter.driver_id && !mongoose.Types.ObjectId.isValid(filter.driver_id))
        return false;

    return true;
};

const get_orders = (filter: filter = {}, sort?: sort): Promise<order[]> => {
    return new Promise((resolve, reject) => {
        // Validate filter
        if (!validate_filter(filter))
            reject(new Error('Filter argument is not valid.'));
        const aggregate = [
            {
                $match: {
                    ...(filter.region_id && {
                        region: new mongoose.Types.ObjectId(filter.region_id),
                    }),
                    ...(filter.car_id && {
                        _id: new mongoose.Types.ObjectId(filter.car_id),
                    }),
                    ...(filter.driver_id && {
                        driver: new mongoose.Types.ObjectId(filter.driver_id),
                    }),
                },
            },
            {
                $unwind: '$orders',
            },
            {
                $match: {
                    ...(filter.id && {
                        'orders._id': {
                            $eq: filter.id,
                        },
                    }),
                    ...(filter.phone_number && {
                        'orders.phone_number': {
                            $eq: filter.phone_number,
                        },
                    }),
                    ...(filter.email && {
                        'orders.email': {
                            $eq: filter.email,
                        },
                    }),
                    ...(filter.placed &&
                        filter_date('orders.placed', filter.placed)),
                    ...(filter.started &&
                        filter_date('orders.started', filter.started)),
                    ...(filter.arrival_time &&
                        filter_date(
                            'orders.arrival_time',
                            filter.arrival_time,
                        )),
                    ...(filter.arrived &&
                        filter_date('orders.arrived', filter.arrived)),
                    ...(filter.completed &&
                        filter_date('orders.completed', filter.completed)),
                },
            },
            ...(sort ? [{ $sort: sort }] : []),
            {
                $group: {
                    _id: null as null,
                    orders: {
                        $push: '$orders',
                    },
                },
            },
        ];

        Car.aggregate(aggregate)
            .allowDiskUse(true)
            .exec((err, res) => {
                if (err) {
                    return reject(err);
                }
                resolve(res && res[0] ? res[0].orders : []);
            });
    });
};

export default get_orders;
