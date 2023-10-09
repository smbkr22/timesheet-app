const catchAsync = require('../utils/catchAsync');
const { Role } = require('../models');
const factory = require('./handlerFactory');

exports.getAllRoles = factory.getAll(Role);
