"use strict"

module.exports = (sequelize, DataTypes) => {
    let fees = sequelize.define('enrollfeestbl', {
        id: {
            primaryKey: true,
            type: DataTypes.INTEGER(15),
            autoIncrement: true,
            allowNull: false,
        },
        semester: {
            type: DataTypes.STRING(50)
        },
        schoolyear: {
            type: DataTypes.STRING(50)
        },
        labAnSci: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        labBioSci: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        labCEMDS: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        labCropSci: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        labHRM: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        labEng: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        labPhySci: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        labVetMed: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        labSpeech: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        labEnglish: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        labNursing: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        ccl: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        internet: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        NSTP: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        ojt: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        thesis: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        studentTeaching: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        lateReg: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        residency: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        foreignStudent: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        addedSubj: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        petitionSubj: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        tuition: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        identification: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        sfdf: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        srf: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        athletic: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        scuaa: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        deposit: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        other: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        miscLibrary: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        miscMedical: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        miscPublication: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        miscRegistration: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        miscGuidance: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        course: {
            type: DataTypes.STRING
        },
        rle: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        yearadmitted: {
            type: DataTypes.STRING(50)
        },
        semesteradmitted: {
            type: DataTypes.STRING(50)
        },
        labcspear: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        mwRLE: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        edfs: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        psyc: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        rletwo: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        rlethree: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        mwrletwo: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        mwrlethree: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        trm: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        fishery: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
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
                name: 'SemAndSY',
                fields: ['semester', 'schoolyear']
            },
        ]
    })
}