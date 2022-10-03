"use strict"

module.exports = (sequelize, DataTypes) => {
    let legend = sequelize.define('legend', {
        semester: {
            type: DataTypes.STRING(25)
        },
        schoolyear: {
            type: DataTypes.STRING(25),
        },
        hrmohead: {
            type: DataTypes.STRING(50)
        },
        hrmodesignation: {
            type: DataTypes.STRING
        },
        id: {
            primaryKey: true,
            autoIncrement: true,
            allowNull: false, 
            type: DataTypes.SMALLINT(1),
        },
        registrar: {
            type: DataTypes.STRING(100)
        },
        registrar_designation: {
            type: DataTypes.STRING(100)
        },
        lastupdate: {
            type: DataTypes.STRING(5),
            defaultValue: '2022'
        },
        ksemester: {
            type: DataTypes.STRING(10),
            defaultValue: 'N/A'
        },
        kschoolyear: {
            type: DataTypes.STRING(10),
            defaultValue: 'N/A'
        },
        mycampus: {
            type: DataTypes.STRING(100),
            defaultValue: 'N/A'
        },
        myversion: {
            type: DataTypes.STRING(15),
            defaultValue: '2.0.0'
        },
        limitunits: {
            type: DataTypes.INTEGER(2),
            defaultValue: 18
        },
        internetpayment: {
            type: DataTypes.INTEGER(1),
            defaultValue: 1
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
            }
        ]
    });
    return legend;
}