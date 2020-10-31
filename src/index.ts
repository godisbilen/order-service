import getApp from './app';

const app = getApp();

if (!process.env.DB_URL) {
    throw Error('Envirement variable "DB_URL" is required');
}
if (!process.env.GOOGLE_MAPS_API_KEY) {
    throw Error('Envirement variable "GOOGLE_MAPS_API_KEY" is required');
}
if (!process.env.BUDGETSMS_USERID) {
    throw Error('Envirement variable "BUDGETSMS_USERID" is required');
}
if (!process.env.BUDGETSMS_USERNAME) {
    throw Error('Envirement variable "BUDGETSMS_USERNAME" is required');
}
if (!process.env.BUDGETSMS_HANDLE) {
    throw Error('Envirement variable "BUDGETSMS_HANDLE" is required');
}
if (!process.env.BUDGETSMS_FROM) {
    throw Error('Envirement variable "BUDGETSMS_FROM" is required');
}

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('Server started at port ' + port);
});
