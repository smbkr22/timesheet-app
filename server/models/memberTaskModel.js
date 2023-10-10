const { User, Initiative, Task } = require('./index');

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
        taskId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: Task,
                key: 'taskId',
            },
        },
        initiativeId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: Initiative,
                key: 'initiativeId',
            },
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
        MemberTask.belongsTo(models.Task, {
            foreignKey: 'taskId',
        });
        MemberTask.belongsTo(models.Initiative, {
            foreignKey: 'initiativeId',
        });
    };

    return MemberTask;
};
