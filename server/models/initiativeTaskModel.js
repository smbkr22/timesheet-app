const { Task, Initiative } = require('./index');

module.exports = (sequelize, DataTypes) => {
    const InitiativeTask = sequelize.define('InitiativeTask', {
        initiativeTaskId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        initiativeId: {
            type: DataTypes.UUID,
            reference: {
                model: Initiative,
            },
        },
        taskId: {
            type: DataTypes.UUID,
            reference: {
                model: Task,
            },
        },
    });

    return InitiativeTask;
};
