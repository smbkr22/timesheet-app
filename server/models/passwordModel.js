const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
    const Password = sequelize.define(
        'Password',
        {
            passwordId: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
                primaryKey: true,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: {
                        args: [6],
                        msg: 'Password must be at least 6 characters long',
                    },
                },
            },
            passwordConfirm: {
                type: DataTypes.VIRTUAL,
                allowNull: false,
                validate: {
                    isPasswordMatch(value) {
                        if (value !== this.password) {
                            throw new Error('Password must match');
                        }
                    },
                },
            },

            startDate: DataTypes.DATE,
            endDate: DataTypes.DATE,
            passwordChangedAt: DataTypes.DATE,
        },
        {
            timestamps: false,
        }
    );

    // Password.addScope('defaultScope', {
    //     attributes: {
    //         exclude: ['password'],
    //     },
    // });

    Password.beforeCreate(async (password, options) => {
        if (password.changed('password')) {
            const hashedPassword = await bcrypt.hash(password.password, 12);
            password.password = hashedPassword;
            password.passwordConfirm = undefined;
        }
    });

    Password.beforeSave((password) => {
        const now = new Date();
        const sixMonthsLater = new Date(now);
        sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);

        password.startDate = now;
        password.endDate = sixMonthsLater;
    });

    Password.beforeSave((password, options) => {
        if (password.changed('password') && !password.isNewRecord) {
            password.passwordChangedAt = new Date() - 1000;
        }
    });

    Password.prototype.correctPassword = async function (
        candidatePassword,
        userPassword
    ) {
        return await bcrypt.compare(candidatePassword, userPassword);
    };

    Password.prototype.changedPasswordAfter = function (JWTTimestamp) {
        if (this.passwordChangedAt) {
            const changedTimestamp = Math.floor(
                this.passwordChangedAt.getTime() / 1000
            );

            console.log(JWTTimestamp < changedTimestamp);

            return JWTTimestamp < changedTimestamp;
        }

        return false;
    };

    Password.associate = (models) => {
        Password.belongsTo(models.User, {
            foreignKey: 'userId',
        });
    };

    return Password;
};
