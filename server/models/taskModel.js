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
            unique: true,
        },
        taskDescription: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        createdBy: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });

    Task.associate = (models) => {
        Task.belongsToMany(models.Initiative, {
            through: 'InitiativeTask',
            foreignKey: 'taskId',
            onDelete: 'CASCADE',
        });
        // Task.belongsToMany(models.User, {
        //     through: 'MemberTask',
        //     foreignKey: 'taskId',
        // });
    };

    return Task;
};
