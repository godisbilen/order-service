import { AddressType, Client, Language, LatLngArray, Status } from '@googlemaps/google-maps-services-js';

const client = new Client({});

/**
 * Get formatted address for a point
 * @param {Array<Number>|Object.<string, string|Array<Number>>} point - The point
 *
 * @returns {Promise<String>} Return formatted address for the point
 */
const reverse_geocode = (point: LatLngArray): Promise<string> => {
    return new Promise((resolve, reject) => {
        // Send request to google maps service
        client
            .reverseGeocode({
                params: {
                    latlng: [point[1], point[0]],
                    result_type: [AddressType.street_address],
                    language: Language.sv,
                    key: process.env.GOOGLE_MAPS_API_KEY,
                },
            })
            // When promise resolve
            .then((response) => {
                // Check so response is OK and contains formatted address
                if (
                    response.data &&
                    response.data.status === Status.OK &&
                    response.data.results &&
                    response.data.results[0] &&
                    response.data.results[0].formatted_address
                ) {
                    // Resolve the formatted address
                    resolve(response.data.results[0].formatted_address);
                }
                // Reject because status was not OK or there was no formatted address
                reject(new Error('Could not get address from coordinates'));
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

export default reverse_geocode;
