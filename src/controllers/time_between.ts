import {
    Client,
    LatLngArray,
    Status,
    TravelMode,
} from '@googlemaps/google-maps-services-js';
const client = new Client({});

/**
 * Get time between two coordinates
 * @param {Array<Number>|Object.<string, string|Array<Number>>} origin - Start coordinate
 * @param {Array<Number>|Object.<string, string|Array<Number>>} destination - Destination coodinate
 *
 * @returns {Promise<Number>} Return time between the two coordinates in seconds
 */
const time_between = (
    origin: LatLngArray,
    destination: LatLngArray,
): Promise<number> => {
    return new Promise((resolve, reject) => {
        // Send request to google maps service
        client
            .distancematrix({
                params: {
                    origins: [origin],
                    destinations: [destination],
                    mode: TravelMode.driving,
                    language: 'sv',
                    key: process.env.GOOGLE_MAPS_API_KEY,
                },
            })
            // When promise resolve
            .then((response) => {
                if (
                    response.data &&
                    response.data.status === Status.OK &&
                    response.data.rows[0].elements[0].status !==
                        Status.ZERO_RESULTS
                ) {
                    resolve(response.data.rows[0].elements[0].duration.value);
                }
                reject(
                    new Error(
                        'Could not get travel time from google maps service!',
                    ),
                );
            })
            // When promise reject
            .catch((err) => {
                // Check if there is an error message
                if (err.response && err.response.data.error_message) {
                    reject(new Error(err.response.data.error_message));
                }
                // No error message was defined, this is often because we could not connect to service
                reject(new Error('Could not connect to google maps service!'));
            });
    });
};

export default time_between;
