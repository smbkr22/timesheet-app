const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { User, Password, Role, UserRole } = require('../models');

const signToken = (id) => {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

const createSendToken = async (user, statusCode, res) => {
    const token = signToken(user.userId);
    const cookieOptions = {
        expires: new Date(
            Date.now() +
                process.env.JWT_COOKIES_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: true,
    };

    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
    res.cookie('jwt', token, cookieOptions);

    const userRole = await UserRole.findAll({
        where: { userId: user.userId },
    });

    const role = await Role.findByPk(userRole[0].dataValues.roleId);

    res.status(statusCode).json({
        status: 'success',
        token,
        user: { ...user.dataValues, role: role.dataValues.roleName },
    });
};

exports.signUp = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        contactNumber: req.body.contactNumber,
    });

    // const defaultRole = 'admin';

    const [role, created] = await Role.findOrCreate({
        where: { roleName: req.body.role },
    });

    await newUser.addRoles([role]);

    await Password.create({
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        userId: newUser.userId,
    });

    res.status(201).json({
        status: 'success',
        message: 'new user is created',
    });
    // createSendToken(newUser, 201, res);
});

exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400));
    }

    const user = await User.findOne({
        where: { email },
    });

    const userPassword = await Password.findOne({
        where: { userId: user.userId },
    });

    if (
        !user ||
        !(await userPassword.correctPassword(
            password,
            userPassword.toJSON().password
        ))
    ) {
        return next(new AppError('Invalid email or password', 401));
    }

    createSendToken(user, 200, res);
};

exports.protect = catchAsync(async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    if (!token) {
        return next(new AppError('You are not logged in', 401));
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const currentUser = await User.findByPk(decoded.id);

    if (!currentUser) {
        return next(
            new AppError(
                'The user belonging to this token does no longer exist.',
                401
            )
        );
    }

    const userPassword = await Password.findOne({
        where: { userId: currentUser.userId },
    });

    const userRole = await UserRole.findOne({
        where: { userId: currentUser.userId },
    });

    const role = await Role.findOne({
        where: { roleId: userRole.roleId },
    });

    if (!userPassword || userPassword.changedPasswordAfter(decoded.iat)) {
        return next(
            new AppError(
                'User recently changed password! Please log in again.',
                401
            )
        );
    }

    req.user = { ...currentUser, role: role.roleName };

    next();
});

exports.isLoggedIn = catchAsync(async (req, res, next) => {
    if (!req.cookies.jwt) return res.sendStatus(401);

    const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
    );

    const currentUser = await User.findByPk(decoded.id);

    if (!currentUser) {
        return res.sendStatus(403);
    }

    const userPassword = await Password.findOne({
        where: { userId: currentUser.userId },
    });

    const userRole = await UserRole.findOne({
        where: { userId: currentUser.userId },
    });

    const role = await Role.findOne({
        where: { roleId: userRole.roleId },
    });

    if (!userPassword || userPassword.changedPasswordAfter(decoded.iat)) {
        return res.sendStatus(404);
    }

    // res.locals.user = { ...currentUser, role: role.roleName };

    createSendToken(currentUser, 200, res);
});

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError(
                    'You do not have permission to perform this action',
                    401
                )
            );
        }

        next();
    };
};
