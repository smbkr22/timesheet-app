const { Task, Initiative } = require('./index');

module.exports = (sequelize, DataTypes) => {
    const InitiativeTask = sequelize.define(
        'InitiativeTask',
        {
            initiativeTaskId: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
                primaryKey: true,
            },
            initiativeId: {
                type: DataTypes.UUID,
                references: {
                    model: Initiative,
                },
            },
            taskId: {
                type: DataTypes.UUID,
                references: {
                    model: Task,
                },
            },
        },
        { timestamps: false }
    );

    InitiativeTask.associate = (models) => {
        InitiativeTask.hasMany(models.MemberTask, {
            foreignKey: 'initiativeTaskId',
        });
        InitiativeTask.belongsTo(models.Initiative, {
            foreignKey: 'initiativeId',
        });
        InitiativeTask.belongsTo(models.Task, {
            foreignKey: 'taskId',
        });
    };

    return InitiativeTask;
};
