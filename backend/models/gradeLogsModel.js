"use strict"

module.exports = (sequelize, DataTypes) => {
    let gradeLogs = sequelize.define('enrollgradelogs', {
        id: {
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            type: DataTypes.INTEGER(20)
        },
        schedcode: {
            type: DataTypes.STRING(10),
            defaultValue: 'N/A'
        },
        subjectcode: {
            type: DataTypes.STRING(50),
            defaultValue: 'N/A'
        },
        studentnumber: {
            type: DataTypes.STRING(15),
            defaultValue: 'N/A'
        },
        myprocess: {
            type: DataTypes.STRING(50),
            defaultValue: 'N/A'
        },
        mydate: {
            type: DataTypes.DATEONLY
        },
        mytime: {
            type: DataTypes.TIME
        },
        ipaddress: {
            type: DataTypes.STRING(20),
            defaultValue: 'N/A'
        },
        pcname: {
            type: DataTypes.STRING(200),
            defaultValue: 'N/A'
        },
        username: {
            type: DataTypes.STRING(50),
            defaultValue: 'N/A'
        },
        semester: {
            type: DataTypes.STRING(10),
            defaultValue: 'N/A'
        },
        schoolyear: {
            type: DataTypes.STRING(15),
            defaultValue: 'N/A'
        },
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
            }
        ]
    })

    return gradeLogs
}