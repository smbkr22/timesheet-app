const catchAsync = require('../utils/catchAsync');
const { Initiative, Task, InitiativeTask } = require('../models');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

exports.getAllInitiativeTasks = factory.getAll(InitiativeTask);

exports.getInitiativeTasksByInitiative = catchAsync(async (req, res, next) => {
    const id = req.params.id;

    const initiativeTasks = await InitiativeTask.findAll({
        where: { initiativeId: id },
    });

    res.status(200).json({ status: 'success', data: { initiativeTasks } });
});

exports.createInitiativeTask = catchAsync(async (req, res, next) => {
    const initiative = await Initiative.findByPk(req.body.initiativeId);
    if (!initiative) {
        return next(new AppError('Initiative not found', 404));
    }
    const { initiativeId } = initiative;

    const taskIds = req.body.taskId;

    const tasks = await Promise.all(
        taskIds.map(async (id) => {
            const task = await Task.findByPk(id);
            if (!task) {
                return next(new AppError('Task not found', 404));
            }

            return task;
        })
    );

    const initiativeTasks = await Promise.all(
        tasks.map(async ({ taskId }) => {
            const initiativeTask = await InitiativeTask.create({
                initiativeId,
                taskId,
            });

            return initiativeTask;
        })
    );

    // req.initiativeTask = initiativeTask;

    // next();

    res.status(201).json({
        status: 'success',
        data: { initiativeTasks },
    });
});
