"use strict"

module.exports = (sequelize, DataTypes) => {
    let divOfFees = sequelize.define('enrolldividionoffeestbl', {
        myid: {
            primaryKey: true,
            type: DataTypes.INTEGER(25),
            autoIncrement: true,
            allowNull: false,
        },
        studentnumber: {
            type: DataTypes.STRING(15)
        },
        semester: {
            type: DataTypes.STRING(25)
        },
        schoolyear: {
            type: DataTypes.STRING(25)
        },
        ansci: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        pansci: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        biosci: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        pbiosci: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        cemds: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        pcemds: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        hrm: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        phrm: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        cropsci: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        pcropsci: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        engineering: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        pengineering: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        physci: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        pphysci: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        vetmed: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        pvetmed: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        speech: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        pspeech: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        english: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        penglish: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        nursing: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        pnursing: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        ccl: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        pccl: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        rle: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        prle: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        internet: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        pinternet: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        nstp: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        pnstp: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        ojt: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        pojt: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        thesis: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        pthesis: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        student: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        pstudent: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        late: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        plate: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        residency: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        presidency: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        foreignstudent: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        pforeignstudent: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        addedsubj: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        paddedsubj: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        petition: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        ppetition: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        tuition: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        ptuition: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        library: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        plibrary: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        medical: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        pmedical: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        publication: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        ppublication: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        registration: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        pregistration: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        guidance: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        pguidance: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        id: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        pid: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        sfdf: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        psfdf: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        srf: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        psrf: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        athletic: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        pathletic: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        scuaa: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        pscuaa: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        deposit: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        pdeposit: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        cspear: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        pcspear: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        edfs: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        pedfs: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        psyc: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        ppsyc: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        trm: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        ptrm: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        fishery: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.00
        },
        pfishery: {
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
                fields: ['myid']
            },
            {
                name: 'STUDENT_RECORD',
                fields: ['studentnumber', 'schoolyear', 'semester']
            },
        ]
    });

    return divOfFees;
}