const { User, Initiative } = require('./index');

module.exports = (sequelize, DataTypes) => {
    const InitiativeMember = sequelize.define(
        'InitiativeMember',
        {
            initiativeMemberId: {
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
            initiativeId: {
                type: DataTypes.UUID,
                references: {
                    model: Initiative,
                },
            },
            startDate: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            endDate: {
                type: DataTypes.DATE,
            },
        },
        {
            timestamps: false,
        }
    );

    InitiativeMember.associate = (models) => {
        InitiativeMember.belongsTo(models.User, {
            foreignKey: 'userId',
        });
        InitiativeMember.belongsTo(models.Initiative, {
            foreignKey: 'initiativeId',
        });
    };

    // InitiativeMember.beforeCreate(async (initiativeMember) => {
    //     try {
    //         const now = new Date();
    //         const sixMonthsLater = new Date(now);
    //         sixMonthsLater.setMonth(now.getMonth() + 6);

    //         initiativeMember.startDate = now;
    //         initiativeMember.endDate = sixMonthsLater;
    //     } catch (error) {
    //         console.error('Error in beforeCreate hook:', error);
    //     }
    // });

    return InitiativeMember;
};
