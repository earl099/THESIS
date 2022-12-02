"use strict"

module.exports = (sequelize, DataTypes) => {
    let processLogs = sequelize.define('enrollprocesslogs', {
        id: {
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            type: DataTypes.INTEGER(10)
        },
        username: {
            type: DataTypes.STRING(50),
            defaultValue: 'N/A'
        },
        ipaddress: {
            type: DataTypes.STRING(15),
            defaultValue: '0.0.0.0'
        },
        pcname: {
            type: DataTypes.STRING(50),
            defaultValue: 'cvsupc'
        },
        studentnumber: {
            type: DataTypes.STRING(25),
            defaultValue: 'N/A'
        },
        type: {
            type: DataTypes.STRING(200),
            defaultValue: 'N/A'
        },
        description: {
            type: DataTypes.TEXT
        },
        dateandtime: {
            type: 'TIMESTAMP',
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
            allowNull: false
        }
    },
    {
        freezeTableName: true,
        timestamps: false,
        createdAt: false,
        updatedAt: false,
        indexes: [
            {
                name: 'PRIMARY',
                fields: ['id']
            },
            {
                name: 'StudNumber',
                fields: ['studentnumber']
            }
        ]
    })

    return processLogs
}