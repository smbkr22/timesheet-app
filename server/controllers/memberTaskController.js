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
    const memberTasks = await MemberTask.findAll({
        where: { userId: req.user.dataValues.userId },
    });

    res.status(200).json({
        status: 'success',
        result: memberTasks.length,
        data: { memberTasks },
    });
});

exports.getInitiativesByMemberTasks = catchAsync(async (req, res, next) => {
    const memberTasks = await MemberTask.findAll({
        where: { userId: req.user.dataValues.userId },
    });

    const initiativeIds = memberTasks.map((task) => task.initiativeId);

    const initiatives = await Promise.all(
        initiativeIds.map(async (initiativeId) => {
            const initiative = await Initiative.findByPk(initiativeId);
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
    const memberTasks = await MemberTask.findAll({
        where: { userId: req.user.dataValues.userId },
    });

    const taskIds = memberTasks.map((task) => task.taskId);

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

exports.deleteMemberTask = catchAsync(async (req, res, next) => {
    const id = req.params.id;

    const memberTask = await MemberTask.destroy({
        where: { memberTaskId: id },
    });

    res.status(204).json({
        status: 'success',
        msg: 'Member Task has been deleted',
    });
});
