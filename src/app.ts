import express from 'express';
import mongoose from 'mongoose';
import register_routes from './routes';

const getApp = (): express.Application => {
    const app = express();
    app.use(express.json());
    register_routes(app);

    // Connect to DB
    mongoose
        .connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
        })
        .then(() => {
            console.log('Connected to database!');
        })
        .catch(() => {
            console.log('Could not connect to database, quiting process');
            process.exit();
        });

    return app;
};

export default getApp;
