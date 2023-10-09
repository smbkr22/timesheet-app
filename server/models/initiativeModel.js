module.exports = (sequelize, DataTypes) => {
    const Initiative = sequelize.define('Initiative', {
        initiativeId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        initiativeName: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        initiativeDescription: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        createdBy: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });

    Initiative.associate = (models) => {
        Initiative.belongsTo(models.Role, {
            foreignKey: 'roleId',
        });
        Initiative.hasMany(models.Task, {
            onDelete: 'cascade',
            foreignKey: 'initiativeId',
        });
        Initiative.belongsToMany(models.User, {
            through: 'InitiativeMember',
            foreignKey: 'initiativeId',
        });
        // Initiative.belongsToMany(models.User, {
        //     through: 'MemberTask',
        //     foreignKey: 'initiativeId',
        // });
    };

    return Initiative;
};
