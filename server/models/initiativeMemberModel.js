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

    InitiativeMember.checkAndAssignNewInitiative = async (
        userId,
        initiativeId,
        startDate
    ) => {
        try {
            const previousInitiative = await InitiativeMember.findOne({
                where: {
                    userId: userId,
                },
                order: [['startDate', 'DESC']],
            });

            if (previousInitiative) {
                previousInitiative.endDate = startDate;
                await previousInitiative.save();
            }

            const newInitiative = await InitiativeMember.create({
                userId: userId,
                initiativeId: initiativeId,
                startDate: startDate,
            });

            return newInitiative;
        } catch (error) {
            console.error('Error in checkAndAssignNewInitiative:', error);
            throw error;
        }
    };

    return InitiativeMember;
};
