const express = require('express');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

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
                url: 'http://localhost:8000',
            },
        ],
    },
};

const specs = swaggerJsDoc(options);

function swaggerDocs(app, port) {
    app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));

    app.get('/docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });
}

export default swaggerDocs;
