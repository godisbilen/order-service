import dayjs from 'dayjs';
import get_orders from './get_orders';
import fits_between from './fits_between';
import get_cars from './get_cars';
import { order, barebone_order, car } from '../types';

interface detailedResult {
    start_time: Date;
    car_id: string | null;
    region_id: string | null;
    previous_order: order | null;
    next_order: order | null;
}

const fastest_start_time_car = (
    order: barebone_order,
    car: car,
    from: Date | dayjs.Dayjs = dayjs(),
): Promise<detailedResult> => {
    return new Promise((resolve, reject) => {
        // Get orders from database (sorted)
        get_orders(
            {
                arrival_time: [from, undefined],
                car_id: car._id,
                completed: false,
            },
            { 'orders.arrival_time': 1 },
        )
            .then(async (orders) => {
                // If there is no active orders assigned to the car, we can start driving torwards the order right away.
                if (orders.length < 1) {
                    return resolve({
                        start_time: dayjs().add(car.start_time, 'minute').toDate(),
                        car_id: car._id,
                        region_id: car.region,
                        previous_order: null,
                        next_order: null,
                    });
                }

                // Loop through every order
                for (let i = 0; i < orders.length; i++) {
                    // This is the order we are checking if it fits after
                    const prev = orders[i - 1] || null;
                    // This is the order we are checking if it fits before
                    const next = orders[i] || null;

                    // Check if order fits between the two orders
                    const fits = await fits_between(prev, order, next, car).catch((err) => {
                        // If an error occurred, reject it
                        return reject(err);
                    });

                    // If the order fits between the two
                    if (fits) {
                        // Calculate time when we could start driving torwards the order
                        const start_time = dayjs(prev ? prev.arrival_time : Date.now()).add(
                            prev ? prev.stop_time : car.start_time,
                            'minute',
                        );

                        // Resolve the result
                        return resolve({
                            start_time: start_time.toDate(),
                            car_id: car._id,
                            region_id: car.region,
                            previous_order: prev,
                            next_order: next,
                        });
                    }
                }
                return reject(new Error('Could not get fastest start time for order'));
            })
            .catch(() => {
                return reject(new Error('Error while getting uncompleted orders'));
            });
    });
};

const fastest_start_time = (
    order: barebone_order | order,
    filter: {
        cars?: car[];
        from?: Date | dayjs.Dayjs;
    } = {},
): Promise<detailedResult> => {
    return new Promise(async (resolve, reject) => {
        // If no cars was specified, we will get cars that covers the location of the order
        if (!filter.cars) {
            const cars = await get_cars({ intersects: order.location.coordinates }).catch((err) => {
                return reject(err);
            });
            if (!cars || cars.length < 1) return reject(new Error('No cars found for the order'));
            filter.cars = cars as car[];
        }

        // Now we have an array of cars in filter.cars

        // This variable will hold the current fastest arrival time, with some other information
        let fastest: detailedResult | null = null;

        // Loop every car and resolve the fastest time
        for (let i = 0; i < filter.cars.length; i++) {
            const car = filter.cars[i];
            try {
                // Get information when we could start driving torwards the order (with this car)
                const time_details = await fastest_start_time_car(order, car, filter.from ? filter.from : dayjs());

                // Check if we could arrive erlier than previos cars
                if (fastest === null || dayjs(time_details.start_time).isBefore(fastest.start_time)) {
                    // Update fastest with time_details from current car
                    fastest = time_details;
                }
            } catch (_err) {
                continue;
            }
        }
        // If fastest is still a empty object we could not find a fastest start time, therefor reject.
        if (!fastest || (Object.keys(fastest).length === 0 && fastest.constructor === Object)) {
            return reject(new Error('Could not get fastest start time for order'));
        }

        // Resolve the result
        return resolve(fastest);
    });
};

export default fastest_start_time;
