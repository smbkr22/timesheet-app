const { User, Role } = require('../models');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getUser = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const user = await User.findByPk(id);

    if (!user) {
        return next(new AppError('No user in this ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            user,
        },
    });
});

// exports.getAllUsers = factory.getAll(User);

// exports.getAllUsers = catchAsync(async (req, res, next) => {
//     const docs = await User.findAll({
//         include: {
//             model: Role,
//             through: {
//                 attributes: [],
//             },
//         },
//     });

//     res.status(200).json({
//         status: 'success',
//         results: docs.length,
//         data: {
//             users: docs,
//         },
//     });
// });

exports.getAllUsers = async (req, res) => {
    try {
        const { name, role } = req.query;
        const filter = {};

        if (name) {
            filter.firstName = {
                [Op.like]: `%${name}%`,
            };
        }

        if (role) {
            filter['$Roles.roleName$'] = role;
        }

        const users = await User.findAll({
            where: filter,
            include: [{ model: Role, as: 'Roles' }],
        });

        res.status(200).json({
            status: 'success',
            results: users.length,
            data: {
                users: users.map((user) => {
                    return {
                        userId: user.userId,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        contactNumber: user.contactNumber,
                        startDate: user.startDate,
                        endDate: user.endDate,
                        Roles: user.Roles,
                    };
                }),
            },
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.deleteUser = factory.deleteOne(User);
