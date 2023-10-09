const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const cookieParser = require('cookie-parser');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');
const taskRouter = require('./routes/taskRoutes');
const initiativeRouter = require('./routes/initiativeRoutes');
const clientRouter = require('./routes/clientRoutes');
const roleRouter = require('./routes/roleRoutes');
const initiativeMemberRouter = require('./routes/initiativeMemberRoutes');
const memberTaskRouter = require('./routes/memberTaskRoutes');

const options = {
    apis: ['./routes/*.js'],
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'TimeSheet API',
            version: '1.0.0',
            description: 'Trying Swagger API',
        },
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        servers: [
            {
                url: 'http://localhost:8080/api/v1',
            },
        ],
    },
};

const specs = swaggerJsDoc(options);

const app = express();
app.use(
    '/api-docs',
    swaggerUI.serve,
    swaggerUI.setup(specs, {
        swaggerOptions: {
            docExpansion: 'none',
        },
        customSiteTitle: 'TimeSheet API docs',
    })
);
app.use(cors(corsOptions));

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    console.log(req.cookies);

    next();
});

app.get('/api/v1/refresh', require('./controllers/authController').isLoggedIn);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/tasks', taskRouter);
app.use('/api/v1/initiatives', initiativeRouter);
app.use('/api/v1/clients', clientRouter);
app.use('/api/v1/roles', roleRouter);
app.use('/api/v1/initiativeMembers', initiativeMemberRouter);
app.use('/api/v1/memberTasks', memberTaskRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
