const { User, Role } = require('./index');

module.exports = (sequelize, DataTypes) => {
    const UserRole = sequelize.define(
        'UserRole',
        {
            userRoleId: {
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
            roleId: {
                type: DataTypes.UUID,
                references: {
                    model: Role,
                },
            },
        },
        {
            timestamps: false,
        }
    );

    return UserRole;
};
