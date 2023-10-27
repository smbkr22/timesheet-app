const {
    MemberTask,
    Initiative,
    Task,
    InitiativeTask,
    User,
} = require('../models');
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

exports.getAllMemberTasksInfo = catchAsync(async (req, res, next) => {
    const memberTasks = await MemberTask.findAll({
        attributes: ['userId', 'startDate', 'endDate'],
        include: [
            {
                model: InitiativeTask,
                attributes: ['initiativeId'],
                include: [
                    {
                        model: Initiative,
                        attributes: ['initiativeName', 'initiativeId'],
                    },
                ],
            },
            {
                model: User,
                attributes: ['firstName', 'lastName', 'userId'],
            },
        ],
    });

    const formattedMemberTasks = memberTasks.map((task) => ({
        userId: task.userId,
        userName: `${task.User.firstName} ${task.User.lastName}`,
        initiativeId: task.InitiativeTask.Initiative.initiativeId,
        initiativeName: task.InitiativeTask.Initiative.initiativeName,
        startDate: task.startDate,
        endDate: task.endDate,
    }));

    const uniqueFormattedMemberTasks = formattedMemberTasks.filter(
        (task, index, self) =>
            index ===
            self.findIndex((t) => t.initiativeName === task.initiativeName)
    );

    res.status(200).json({
        status: 'success',
        data: {
            memberTaskInfos: uniqueFormattedMemberTasks,
        },
    });
});

exports.createMemberTask = catchAsync(async (req, res, next) => {
    const initiativeTasks = await InitiativeTask.findAll({
        where: { initiativeId: req.body.initiativeId },
    });

    if (!initiativeTasks) {
        return next(
            'No Task has been assigned for this initiative. Please assign a task',
            401
        );
    }

    const newMemberTasks = await Promise.all(
        initiativeTasks.map(async ({ initiativeTaskId }) => {
            const newMemberTask = await MemberTask.create({
                userId: req.body.userId,
                initiativeTaskId: initiativeTaskId,
                startDate: req.body.startDate,
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

exports.createMemberTaskByUser = catchAsync(async (req, res, next) => {
    const { userId, initiativeId, taskId, workHours, createdAt } = req.body;

    if (!workHours) {
        return next('Please provide work hour', 401);
    }

    const initiativeTask = await InitiativeTask.findOne({
        where: { initiativeId, taskId },
    });

    const user = await User.findByPk(userId);
    if (!user) {
        return next('No user in this id', 404);
    }

    const memberTask = await MemberTask.create({
        userId: userId,
        initiativeTaskId: initiativeTask.initiativeTaskId,
        workHours: workHours,
        createdAt: createdAt,
    });

    res.status(201).json({
        status: 'success',
        data: {
            memberTask,
        },
    });
});

exports.updateMemberTask = catchAsync(async (req, res, next) => {
    const { userId, initiativeId, endDate } = req.body;

    const initiativeTasks = await InitiativeTask.findAll({
        where: { initiativeId },
    });

    if (!initiativeTasks.length) {
        return next(
            new AppError(
                'InitiativeTask not found for the provided initiativeId.',
                404
            )
        );
    }

    const updateResults = await Promise.all(
        initiativeTasks.map(async (initiativeTask) => {
            const updateResult = await MemberTask.update(
                { endDate },
                {
                    where: {
                        userId,
                        initiativeTaskId: initiativeTask.initiativeTaskId,
                    },
                }
            );

            return updateResult;
        })
    );

    const updated = updateResults.some((result) => result[0] > 0);

    if (updated) {
        return res.status(200).json({
            status: 'success',
            message: 'Member tasks updated successfully.',
        });
    } else {
        return res.status(404).json({
            status: 'error',
            message: 'No matching member tasks found for the update.',
        });
    }
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
