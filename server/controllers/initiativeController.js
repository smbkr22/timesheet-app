const { Initiative, Role, InitiativeMember } = require('../models');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

exports.getAllInitiatives = factory.getAll(Initiative);

exports.getInitiativesByRole = catchAsync(async (req, res, next) => {
    const roleId = req.params.id;

    const initiatives = await Initiative.findAll({ where: { roleId: roleId } });

    res.status(200).json({
        status: 'success',
        results: initiatives.length,
        data: {
            initiatives,
        },
    });
});

exports.getInitiativesByUser = catchAsync(async (req, res, next) => {
    const userId = req.params.id;

    const initiativeMember = await InitiativeMember.findAll({
        where: { userId: userId },
    });

    const initiatives = await Promise.all(
        initiativeMember.map(async (member) => {
            const initiatives = await Initiative.findAll({
                where: { initiativeId: member.initiativeId },
            });
            return initiatives[0];
        })
    );

    res.status(200).json({
        status: 'success',
        results: initiatives.length,
        data: {
            initiatives,
        },
    });
});

exports.createInitiative = catchAsync(async (req, res, next) => {
    const role = await Role.findOrCreate({ where: { roleName: 'manager' } });

    const initiative = await Initiative.create({
        initiativeName: req.body.initiativeName,
        initiativeDescription: req.body.initiativeDescription,
        createdBy: req.user.dataValues.firstName,
        roleId: role[0].dataValues.roleId,
    });

    await InitiativeMember.create({
        initiativeId: initiative.initiativeId,
        userId: req.body.userId,
    });

    res.status(201).json({
        status: 'success',
        data: {
            initiative,
        },
    });
});
