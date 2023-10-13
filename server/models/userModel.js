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

// const bcrypt = require('bcrypt');

// module.exports = (sequelize, DataTypes) => {
//     const User = sequelize.define('User', {
//         id: {
//             type: DataTypes.UUID,
//             defaultValue: DataTypes.UUIDV4,
//             allowNull: false,
//             primaryKey: true,
//         },
//         username: {
//             type: DataTypes.STRING,
//             allowNull: false,
//         },
//         email: {
//             type: DataTypes.STRING,
//             allowNull: false,
//             unique: true,
//             validate: {
//                 isEmail: {
//                     msg: 'Please enter a valid email address',
//                 },
//             },
//         },
//         role: {
//             type: DataTypes.ENUM('user', 'admin'),
//             allowNull: false,
//             defaultValue: 'user',
//             validate: {
//                 isIn: {
//                     args: [['user', 'admin']],
//                     msg: 'Invalid role value',
//                 },
//             },
//         },
//         password: {
//             type: DataTypes.STRING,
//             allowNull: false,
//             validate: {
//                 len: {
//                     args: [6],
//                     msg: 'Password must be at least 6 characters long',
//                 },
//             },
//         },
//         passwordConfirm: {
//             type: DataTypes.VIRTUAL,
//             allowNull: false,
//             validate: {
//                 isPasswordMatch(value) {
//                     if (value !== this.password) {
//                         throw new Error('Password must match');
//                     }
//                 },
//             },
//         },
//         passwordChangedAt: {
//             type: DataTypes.DATE,
//             defaultValue: DataTypes.NOW,
//         },
//     });

//     User.addScope('defaultScope', {
//         attributes: {
//             exclude: ['password', 'passwordChangedAt'],
//         },
//     });

//     User.beforeCreate(async (user, options) => {
//         if (user.changed('password')) {
//             const hashedPassword = await bcrypt.hash(user.password, 12);
//             user.password = hashedPassword;
//             user.passwordConfirm = undefined;
//         }
//     });

//     User.beforeSave(async (user, options) => {
//         if (user.changed('password') && !user.isNewRecord) {
//             user.passwordChangedAt = new Date() - 1000;
//         }
//     });

//     User.prototype.correctPassword = async function (
//         candidatePassword,
//         userPassword
//     ) {
//         return await bcrypt.compare(candidatePassword, userPassword);
//     };

//     User.prototype.changedPasswordAfter = function (JWTTimestamp) {
//         if (this.passwordChangedAt) {
//             const changedTimestamp = Math.floor(
//                 this.passwordChangedAt.getTime() / 1000
//             );

//             return JWTTimestamp < changedTimestamp;
//         }

//         return false;
//     };

//     return User;
// };
