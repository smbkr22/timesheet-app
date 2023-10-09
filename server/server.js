const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');
const port = process.env.PORT || 8080;

const db = require('./models');
db.sequelize
    .sync()
    .then(() => {
        app.listen(port, () => {
            console.log(`App is listening on ${port}`);
        });
    })
    .catch((err) => console.log(err));

process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
