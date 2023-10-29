module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        'User',
        {
            userId: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
                primaryKey: true,
            },
            firstName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            lastName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: {
                        msg: 'Please enter a valid email address',
                    },
                },
            },
            contactNumber: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    isValidPhoneNumber(value) {
                        if (!/^\d{10}$/.test(value)) {
                            throw new Error(
                                'Invalid phone number format. Phone number must contain exactly 10 digits.'
                            );
                        }
                    },
                },
            },
            startDate: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            endDate: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            timestamps: false,
        }
    );

    User.beforeCreate(async (user) => {
        try {
            const now = new Date();
            const sixMonthsLater = new Date(now);
            sixMonthsLater.setMonth(now.getMonth() + 6);

            user.startDate = now;
            user.endDate = sixMonthsLater;
        } catch (error) {
            console.error('Error in beforeCreate hook:', error);
        }
    });

    User.associate = (models) => {
        User.hasOne(models.Password, {
            onDelete: 'cascade',
            foreignKey: 'userId',
        });
        User.belongsToMany(models.Role, {
            through: 'UserRole',
            foreignKey: 'userId',
        });
        User.belongsToMany(models.Initiative, {
            through: 'InitiativeMember',
            foreignKey: 'userId',
            onDelete: 'CASCADE',
        });
        // User.belongsToMany(models.Initiative, {
        //     through: 'MemberTask',
        //     foreignKey: 'userId',
        // });
        // User.belongsToMany(models.Task, {
        //     through: 'MemberTask',
        //     foreignKey: 'userId',
        // });
    };

    return User;
};
