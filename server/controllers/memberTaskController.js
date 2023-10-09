const { MemberTask, Initiative, Task } = require('../models');
const catchAsync = require('../utils/catchAsync');

exports.getAllMemberTasks = catchAsync(async (req, res, next) => {
    const memberTasks = await MemberTask.findAll();

    res.status(200).json({
        status: 'success',
        results: memberTasks.length,
        data: { memberTasks },
    });
});

exports.getMemberTasksByUser = catchAsync(async (req, res, next) => {
    const tasks = await MemberTask.findAll({
        where: { userId: req.user.dataValues.userId },
    });

    // res.status(200).json({
    //     status: 'success',
    //     result: tasks.length,
    //     data: { tasks },
    // });

    req.tasks = tasks;

    next();
});

exports.getInitiativesByMemberTasks = catchAsync(async (req, res, next) => {
    const taskIds = req.tasks.map((task) => task.taskId);

    const initiativesIds = await Promise.all(
        taskIds.map(async (taskId) => {
            const initiativesId = await Task.findByPk(taskId, {
                attributes: ['initiativeId'],
            });
            return initiativesId;
        })
    );

    const initiatives = await Promise.all(
        initiativesIds.map(async (initiativeId) => {
            const initiative = await Initiative.findByPk(
                initiativeId.dataValues.initiativeId
            );
            return initiative;
        })
    );

    const uniqueInitiatives = initiatives.filter((initiative, index, self) => {
        const firstOccurrenceIndex = self.findIndex(
            (item) => item.initiativeId === initiative.initiativeId
        );

        return index === firstOccurrenceIndex;
    });

    res.status(200).json({
        status: 'success',
        results: uniqueInitiatives.length,
        data: {
            initiatives: uniqueInitiatives,
        },
    });
});

exports.getTasksByMemberTasks = catchAsync(async (req, res, next) => {
    const taskIds = req.tasks.map((task) => task.taskId);

    const tasks = await Promise.all(
        taskIds.map(async (taskId) => {
            const task = await Task.findByPk(taskId);
            return task;
        })
    );

    res.status(200).json({
        status: 'success',
        results: tasks.length,
        data: {
            tasks,
        },
    });
});

exports.createMemberTask = catchAsync(async (req, res, next) => {
    const memberTask = await MemberTask.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            memberTask,
        },
    });
});
