const { MemberTask, Initiative, Task, InitiativeTask } = require('../models');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllMemberTasks = catchAsync(async (req, res, next) => {
    const memberTasks = await MemberTask.findAll();

    const initiativeTasks = await Promise.all(
        memberTasks.map(async ({ initiativeTaskId }) => {
            const initiativeTask = await InitiativeTask.findByPk(
                initiativeTaskId
            );
            return initiativeTask;
        })
    );

    const initiatives = await Promise.all(
        initiativeTasks.map(async ({ initiativeId }) => {
            const initiative = await Initiative.findByPk(initiativeId, {
                attributes: ['initiativeId'],
            });
            return initiative;
        })
    );

    const tasks = await Promise.all(
        initiativeTasks.map(async ({ taskId }) => {
            const task = await Task.findByPk(taskId, {
                attributes: ['taskId'],
            });
            return task;
        })
    );

    const mergedData = memberTasks.map((memberTask, index) => ({
        ...memberTask.dataValues,
        initiativeId: initiatives[index].dataValues.initiativeId,
        taskId: tasks[index].dataValues.taskId,
    }));

    res.status(200).json({
        status: 'success',
        results: memberTasks.length,
        data: { memberTasks: mergedData },
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
        attributes: ['initiativeTaskId'],
    });

    const initiativeTasks = await Promise.all(
        memberTasks.map(async ({ initiativeTaskId }) => {
            const initiativeTask = await InitiativeTask.findByPk(
                initiativeTaskId
            );
            return initiativeTask;
        })
    );

    const initiatives = await Promise.all(
        initiativeTasks.map(async ({ initiativeId }) => {
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
        attributes: ['initiativeTaskId'],
    });

    const initiativeTasks = await Promise.all(
        memberTasks.map(async ({ initiativeTaskId }) => {
            const initiativeTask = await InitiativeTask.findByPk(
                initiativeTaskId
            );
            return initiativeTask;
        })
    );

    const tasks = await Promise.all(
        initiativeTasks.map(async ({ taskId }) => {
            const task = await Task.findByPk(taskId);
            return task;
        })
    );

    const uniqueTasks = tasks.filter((task, index, self) => {
        const firstOccurrenceIndex = self.findIndex(
            (item) => item.taskId === task.taskId
        );

        return index === firstOccurrenceIndex;
    });

    res.status(200).json({
        status: 'success',
        results: uniqueTasks.length,
        data: {
            tasks: uniqueTasks,
        },
    });
});

exports.createMemberTask = catchAsync(async (req, res, next) => {
    const initiativeTasks = await InitiativeTask.findAll({
        where: { initiativeId: req.body.initiativeId },
    });

    const newMemberTasks = await Promise.all(
        initiativeTasks.map(async ({ initiativeTaskId }) => {
            const newMemberTask = await MemberTask.create({
                initiativeTaskId: initiativeTaskId,
                userId: req.body.userId,
            });

            return newMemberTask;
        })
    );

    res.status(201).json({
        status: 'success',
        results: newMemberTasks.length,
        data: {
            memberTasks: newMemberTasks,
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
