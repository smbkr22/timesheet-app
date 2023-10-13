const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { Initiative, Task, MemberTask, InitiativeTask } = require('../models');
const factory = require('./handlerFactory');

exports.getAllTasks = factory.getAll(Task);

exports.getTask = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const task = await Task.findAll({ where: { taskId: id } });

    res.status(200).json({
        status: 'success',
        data: {
            task,
        },
    });
});

exports.getTasksByInitiative = catchAsync(async (req, res, next) => {
    const id = req.params.id;

    const initiativeTasks = await InitiativeTask.findAll({
        where: { initiativeId: id },
    });

    const tasks = await Promise.all(
        initiativeTasks.map(async ({ taskId }) => {
            const task = await Task.findByPk(taskId);
            return task;
        })
    );

    res.status(200).json({
        status: 'success',
        result: tasks.length,
        data: {
            tasks,
        },
    });
});

exports.createTask = catchAsync(async (req, res, next) => {
    const task = await Task.create({
        taskName: req.body.taskName,
        taskDescription: req.body.taskDescription,
        createdBy: req.user.dataValues.firstName,
    });

    res.status(201).json({
        status: 'success',
        data: {
            task,
        },
    });
});
