import dayjs from 'dayjs';
import is_within_regions from './is_within_regions';
import fastest_start_time from './fastest_start_time';
import time_between from './time_between';
import get_cars from './get_cars';
import Car from '../models/car';
//import BudgetSMS from './BudgetSMS';
import { LatLngArray } from '@googlemaps/google-maps-services-js';
import { order, point } from '../types';

interface orderInfo {
    coordinates: LatLngArray;
    full_address: string;
    phone_number?: string;
    email?: string;
    stop_time?: number;
    from?: Date;
}

const create_order = (orderinfo: orderInfo, force = true): Promise<order> => {
    return new Promise(async (resolve, reject) => {
        // Check so all required arguments is set
        if (!orderinfo.coordinates || !(orderinfo.phone_number || orderinfo.email)) {
            return reject(new Error('Insufficient arguments'));
        }

        if (!force) {
            const is_within = await is_within_regions(orderinfo.coordinates).catch((err) => {
                return reject(err);
            });
            if (!is_within) {
                return reject(new Error('Order is not within any region'));
            }
        }

        const point: point = {
            type: 'Point',
            coordinates: orderinfo.coordinates,
        };

        const data = {
            ...(orderinfo.phone_number && {
                phone_number: orderinfo.phone_number,
            }),
            ...(orderinfo.email && { email: orderinfo.email }),
            stop_time: orderinfo.stop_time ? orderinfo.stop_time : 12,
            location: point,
            placed: dayjs().toDate(),
            full_address: orderinfo.full_address,
        };

        fastest_start_time(data, {
            from: orderinfo.from ? orderinfo.from : dayjs(),
        })
            .then((start_time_detailed) => {
                const start_time = dayjs(start_time_detailed.start_time);

                get_cars({ id: start_time_detailed.car_id })
                    .then((cars) => {
                        if (!cars[0]) {
                            return reject('Could not get the car for the previous order');
                        }
                        const car = cars[0];
                        time_between(
                            start_time_detailed.previous_order
                                ? start_time_detailed.previous_order.location.coordinates
                                : car.start_pos.coordinates,
                            orderinfo.coordinates,
                        )
                            .then((time_between) => {
                                const arrival_time = dayjs(start_time).add(time_between, 'second').toDate();

                                Car.findByIdAndUpdate(
                                    start_time_detailed.car_id,
                                    {
                                        $push: {
                                            orders: {
                                                ...data,
                                                ...{
                                                    arrival_time: arrival_time,
                                                    region: start_time_detailed.region_id,
                                                },
                                            },
                                        },
                                    },
                                    { new: true },
                                )
                                    .exec()
                                    .then((temp) => {
                                        const car = temp.toObject();
                                        resolve(car.orders[car.orders.length - 1]);
                                        /* const sms = new BudgetSMS();
                                        sms.from(process.env.BUDGETSMS_FROM).to('0123456789').send(); */
                                    })
                                    .catch(() => {
                                        return reject(new Error('Could not update car with order'));
                                    });
                            })
                            .catch(() => {
                                return reject(new Error('Could not get time between previous order and this order'));
                            });
                    })
                    .catch(() => {
                        return reject('Could not get the car from the database');
                    });
            })
            .catch(() => {
                return reject(new Error('Could not get fastest start time for order'));
            });
    });
};

export default create_order;
