const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { Initiative, Task, MemberTask } = require('../models');
const factory = require('./handlerFactory');

exports.getAllTasks = factory.getAll(Task);

exports.getTaskByInitiative = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const tasks = await Task.findAll({ where: { initiativeId: id } });

    res.status(200).json({
        status: 'success',
        result: tasks.length,
        data: {
            tasks,
        },
    });
});

exports.createTask = catchAsync(async (req, res, next) => {
    const initiative = await Initiative.findByPk(req.body.initiativeId);
    if (!initiative) {
        return next(new AppError('Initiative not found', 404));
    }

    const task = await Task.create({
        taskName: req.body.taskName,
        taskDescription: req.body.taskDescription,
        initiativeId: initiative.initiativeId,
        createdBy: req.user.dataValues.firstName,
    });

    await MemberTask.create({
        taskId: task.taskId,
        userId: req.body.userId,
    });

    res.status(201).json({
        status: 'success',
        data: {
            task,
        },
    });
});
