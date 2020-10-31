import getApp from './app';

const app = getApp();

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('Server started at port ' + port);
});
