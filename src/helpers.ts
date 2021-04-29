import { LatLngArray } from '@googlemaps/google-maps-services-js';

const removeUndefined = (obj: Record<string, unknown>): void =>
    Object.keys(obj).forEach((key) =>
        obj[key] === undefined ? delete obj[key] : {},
    );

const removeKeys = (obj: Record<string, unknown>, keys: Array<string>): void =>
    keys.forEach((key) => (obj.hasOwnProperty(key) ? delete obj[key] : {}));

const removeKeysExcept = (
    obj: Record<string, unknown>,
    whitelist: Array<string>,
): void =>
    Object.keys(obj).forEach((key) =>
        whitelist.indexOf(key) < 0 ? delete obj[key] : {},
    );

const renameKey = (
    obj: Record<string, unknown>,
    old: string,
    _new: string,
): void => {
    if (obj.hasOwnProperty(old)) {
        const temp = obj[old];
        delete obj[old];
        obj[_new] = temp;
    }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const arrayEquals = (arr1: Array<any>, arr2: Array<any>): boolean => {
    return JSON.stringify(arr1) === JSON.stringify(arr2);
};

const isLngLat = (arr: LatLngArray): boolean => {
    return (
        isFinite(arr[0]) &&
        Math.abs(arr[0]) <= 180 &&
        isFinite(arr[1]) &&
        Math.abs(arr[1]) <= 90
    );
};

export {
    removeUndefined,
    removeKeys,
    removeKeysExcept,
    renameKey,
    arrayEquals,
    isLngLat,
};
