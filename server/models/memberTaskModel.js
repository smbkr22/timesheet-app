const { User, Task, Initiative } = require('./index');

module.exports = (sequelize, DataTypes) => {
    const MemberTask = sequelize.define(
        'MemberTask',
        {
            memberTaskId: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
                primaryKey: true,
            },
            userId: {
                type: DataTypes.UUID,
                references: {
                    model: User,
                },
            },
            taskId: {
                type: DataTypes.UUID,
                references: {
                    model: Task,
                },
            },
            // initiativeId: {
            //     type: DataTypes.UUID,
            //     references: {
            //         model: Initiative,
            //     },
            // },
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
            // workHours: {
            //     type: DataTypes.STRING,
            //     allowNull: false,
            // },
        },
        { timestamps: false }
    );

    return MemberTask;
};
