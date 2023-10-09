const catchAsync = require('../utils/catchAsync');
const { Client } = require('../models');
const factory = require('./handlerFactory');

exports.getAllClients = factory.getAll(Client);

exports.getClient = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const client = await Client.findByPk(id);

    if (!client) {
        return next(new AppError('No client in this ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            client,
        },
    });
});

exports.createClient = catchAsync(async (req, res, next) => {
    const newClient = await Client.create({ ...req.body });

    res.status(201).json({
        status: 'success',
        data: {
            client: newClient,
        },
    });
});
