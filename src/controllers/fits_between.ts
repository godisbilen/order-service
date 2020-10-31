import { LatLng } from '@googlemaps/google-maps-services-js';
import dayjs from 'dayjs';
import { barebone_order, car, order } from '../types';
import time_between from './time_between';

/**
 * Check if an order fits between two other orders
 * @param {Object} previous_order - The order we will fit after
 * @param {Object} current_order - The order we are checking if it fits or not
 * @param {Object} next_order - The order we will fit before
 *
 * @returns {Promise<boolean>} Aggregation code representating the filter of the field
 */
const fits_between = (
    previous_order: order | null,
    current_order: barebone_order,
    next_order: order | null,
    car: car,
): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        // Check if there is an next order
        if (!next_order) {
            // If there is no next order, there is no need fit between, therefor we return true
            resolve(true);
        }
        // Now we know there is an upcoming order

        // Check if we can ignore previous order
        const ignore_prev_order = !previous_order || previous_order.completed !== null;

        // Calculate when the car can start driving forwards the current order
        const start = dayjs(ignore_prev_order ? new Date() : previous_order.arrival_time);
        // Add start time if there is no previous order, otherwise add the previous order´s stop time
        start.add(ignore_prev_order ? car.start_time : previous_order.stop_time, 'minute');

        // Set starting location, either the last order´s location or the car´s starting location
        const start_loc: LatLng = ignore_prev_order
            ? [car.start_pos.coordinates[1], car.start_pos.coordinates[0]]
            : [previous_order.location.coordinates[1], previous_order.location.coordinates[0]];

        // Get time between starting location to the current order
        time_between(start_loc, [current_order.location.coordinates[1], current_order.location.coordinates[0]])
            .then((seconds) => {
                // Add the seconds between the two orders so we get the time we could arrive at current order,
                // also add the stop time for the current order
                const current_order_arrival = start.add(seconds, 'second').add(current_order.stop_time, 'minute');

                // Get time between the current order and the next order
                time_between(
                    [current_order.location.coordinates[1], current_order.location.coordinates[0]],
                    [next_order.location.coordinates[1], next_order.location.coordinates[0]],
                )
                    .then((seconds) => {
                        // Add the seconds between the two orders sp we get the time we could arrive at next order
                        const next_order_arrival = current_order_arrival.add(seconds, 'second');

                        // Return true if arrival is less than the arrival time set in the next order, otherwise false
                        return resolve(next_order_arrival.isBefore(dayjs(next_order.arrival_time)));
                    })
                    .catch(() => {
                        return reject(new Error('Could not get time between order and next order'));
                    });
            })
            .catch(() => {
                return reject(new Error('Could not get time between order and previous order'));
            });
    });
};

export default fits_between;
