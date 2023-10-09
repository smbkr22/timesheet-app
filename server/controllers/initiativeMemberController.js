const { InitiativeMember, User } = require('../models');
const catchAsync = require('../utils/catchAsync');

exports.getAllInitiativeMembers = catchAsync(async (req, res, next) => {
    const initiativeMembers = await InitiativeMember.findAll();

    res.status(200).json({
        status: 'success',
        results: initiativeMembers.length,
        data: { initiativeMembers },
    });
});

exports.getInitiativeMemberByUser = catchAsync(async (req, res, next) => {
    const id = req.params.id;

    const initiativeMember = await InitiativeMember.findAll({
        where: { userId: id },
    });

    res.status(200).json({
        status: 'success',
        results: initiatives.length,
        data: {
            initiativeMember,
        },
    });
});

exports.getInitiativeMemberByInitiative = catchAsync(async (req, res, next) => {
    const id = req.params.id;

    const initiativeMember = await InitiativeMember.findAll({
        where: { initiativeId: id },
    });

    const user = await User.findAll({
        where: { userId: initiativeMember[0].userId },
    });

    res.status(200).json({
        status: 'success',
        data: {
            user: user[0],
        },
    });
});

exports.createInitiativeMember = catchAsync(async (req, res, next) => {
    const initiativeMember = await InitiativeMember.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            initiativeMember,
        },
    });
});
