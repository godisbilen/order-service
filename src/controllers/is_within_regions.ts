import { LatLngArray } from '@googlemaps/google-maps-services-js';
import { Document } from 'mongoose';
import Region from '../models/region';

/**
 * Check if a point is within any region.
 * @param {Object} arg - The point we are validating
 *
 * @returns {Promise<Boolean>} Promise boolean representing if the point is within any region.
 */
const is_within_regions = (point: LatLngArray): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        Region.findOne({ active: true })
            .where('bounds')
            .intersects({ type: 'Point', coordinates: point })
            .exec()
            .then((region: Document) => {
                resolve(region !== null);
            })
            .catch(() => {
                reject(
                    new Error(
                        'Error while querring database to see if point is within regions.',
                    ),
                );
            });
    });
};

export default is_within_regions;
