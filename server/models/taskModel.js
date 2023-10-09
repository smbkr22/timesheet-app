module.exports = (sequelize, DataTypes) => {
    const Task = sequelize.define('Task', {
        taskId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        taskName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        taskDescription: {
            type: DataTypes.STRING,
        },
        createdBy: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });

    Task.associate = (models) => {
        Task.belongsTo(models.Initiative, {
            foreignKey: 'initiativeId',
        });
        Task.belongsToMany(models.User, {
            through: 'MemberTask',
            foreignKey: 'taskId',
        });
    };

    return Task;
};
