module.exports = (sequelize, DataTypes) => {
    const Client = sequelize.define(
        'Client',
        {
            clientId: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
                primaryKey: true,
            },
            clientName: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
        },
        {
            timestamps: false,
        }
    );

    // Client.associate = (models) => {
    //     Client.hasMany(models.Initiative, {
    //         onDelete: 'cascade',
    //     });
    // };

    return Client;
};
