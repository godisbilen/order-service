import { Application } from 'express';

// Import all router files
import car from './car';
import driver from './driver';
import order from './order';
import region from './region';

export default (app: Application): void => {
    app.use(car);
    app.use(driver);
    app.use(order);
    app.use(region);
};
