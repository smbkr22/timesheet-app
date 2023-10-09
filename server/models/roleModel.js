module.exports = (sequelize, DataTypes) => {
    const Role = sequelize.define(
        'Role',
        {
            roleId: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
                primaryKey: true,
            },
            roleName: {
                type: DataTypes.ENUM('user', 'admin', 'manager'),
                allowNull: false,
                defaultValue: 'user',
                validate: {
                    isIn: {
                        args: [['user', 'admin', 'manager']],
                        msg: 'Invalid role value',
                    },
                },
            },
        },
        {
            timestamps: false,
        }
    );

    Role.associate = (models) => {
        Role.belongsToMany(models.User, {
            through: 'UserRole',
            foreignKey: 'roleId',
        });
        Role.hasMany(models.Initiative, {
            foreignKey: 'roleId',
        });
    };

    return Role;
};
