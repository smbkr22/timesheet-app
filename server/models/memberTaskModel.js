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

    return MemberTask;
};
