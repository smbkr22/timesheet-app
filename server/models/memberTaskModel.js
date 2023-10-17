const { User, InitiativeTask } = require('./index');

module.exports = (sequelize, DataTypes) => {
    const MemberTask = sequelize.define('MemberTask', {
        memberTaskId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: User,
                key: 'userId',
            },
        },
        initiativeTaskId: {
            type: DataTypes.UUID,
            references: InitiativeTask,
        },

        taskStatus: {
            type: DataTypes.ENUM('Todo', 'Completed', 'WorkInProgress'),
            defaultValue: 'Todo',
        },
        startDate: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
        },
        endDate: {
            type: DataTypes.DATE,
        },
        workHours: {
            type: DataTypes.STRING,
        },
    });

    MemberTask.associate = (models) => {
        MemberTask.belongsTo(models.User, {
            foreignKey: 'userId',
        });
    };

    MemberTask.checkAndAssignNewMemberTask = async (
        userId,
        initiativeTaskId,
        startDate
    ) => {
        try {
            const previousInitiative = await MemberTask.findOne({
                where: {
                    userId: userId,
                },
                order: [['startDate', 'DESC']],
            });

            if (previousInitiative) {
                previousInitiative.endDate = startDate;
                await previousInitiative.save();
            }

            const newInitiative = await MemberTask.create({
                userId: userId,
                initiativeTaskId: initiativeTaskId,
                startDate: startDate,
            });

            return newInitiative;
        } catch (error) {
            console.error('Error in checkAndAssignNewInitiative:', error);
            throw error;
        }
    };

    return MemberTask;
};
