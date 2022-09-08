import { Student } from "./app/shared/models/Student";
import { User } from "./app/shared/models/User";

export const sample_students: Student[] = [
  {
    studID: '1',
    studNum: 201710113,
    lrn: 0,
    fname: 'Earl Julian',
    mname: 'Cosino',
    lname: 'Saturay',
    degProg: 'BSIT',
    yrLvl: '4th Year',
    gender: 'Male',
    email: 'earljulian.saturay@cvsu.edu.ph',
    contactNum: 639166259121,
    ftStatus: true,
    enrolledStatus: true,
    studClass: 'Irregular',
    isShiftee: false,
    isOnLeave: false,
    collegeID: 'CEIT'
  },

  {
    studID: '2',
    studNum: 201710114,
    lrn: 11122233344,
    fname: 'John',
    mname: '',
    lname: 'Smith',
    degProg: 'BSA',
    yrLvl: '4th Year',
    gender: 'Male',
    email: 'john.smith@cvsu.edu.ph',
    contactNum: 639111234567,
    ftStatus: true,
      enrolledStatus: false,
    studClass: 'Regular',
    isShiftee: false,
    isOnLeave: true,
    collegeID: 'CAS'
  },

  {
    studID: '3',
    studNum: 201710115,
    lrn: 55566677788,
    fname: 'Jane',
    mname: '',
    lname: 'Doe',
    degProg: 'BSEd',
    yrLvl: '4th Year',
    gender: 'Female',
    email: 'jane.doe@cvsu.edu.ph',
    contactNum: 639114447889,
    ftStatus: true,
    enrolledStatus: true,
    studClass: 'Irregular',
    isShiftee: true,
    isOnLeave: false,
    collegeID: 'CED'
  }
]

export const sample_users: User[] = [
  {
    id: 1,
    collegeID: 'CEIT',
    username: 'test',
    password: 'test',
    email: 'test@gmail.com',
    isAdmin: 0
  },
  {
    id: 2,
    collegeID: 'UNIV',
    username: 'admin',
    password: 'admin',
    email: 'admin@gmail.com',
    isAdmin: 1
  },
  {
    id: 3,
    collegeID: 'CAS',
    username: 'user',
    password: 'pass',
    email: 'user@gmail.com',
    isAdmin: 0
  }
]
