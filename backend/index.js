const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const requestIp = require('request-ip')
require('dotenv').config({ path: '../.env' });
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const port = process.env.port || 3000;

//--- USER FUNCTIONS ---//
const userRouter = require('./routes/userRoutes');
app.use('/api', userRouter);

//--- STUDENT FUNCTIONS ---//
const studentRouter = require('./routes/studentRoutes');
app.use('/api', studentRouter);

//--- SCHEDULE FUNCTIONS ---//
const scheduleRouter = require('./routes/scheduleRoutes');
app.use('/api', scheduleRouter);

//--- LEGEND FUNCTIONS ---//
const legendRouter = require('./routes/legendRoutes');
app.use('/api', legendRouter);

//--- CURRICULUM FUNCTIONS ---//
const curriculumRouter = require('./routes/curriculumRoutes');
app.use('/api', curriculumRouter);

//--- CURRICULUM CONTENT FUNCTIONS ---//
const currContentRouter = require('./routes/currContentRoutes');
app.use('/api', currContentRouter);

//--- SHIFTEE FUNCTIONS ---//
const shifteeRouter = require('./routes/shifteeRoutes');
app.use('/api', shifteeRouter);

const studEnrollRouter = require('./routes/studEnrollRoutes');
app.use('/api', studEnrollRouter);

const divOfFeesRouter = require('./routes/divOfFeesRoutes');
app.use('/api', divOfFeesRouter);

const subjEnrollRouter = require('./routes/subjEnrollRoutes')
app.use('/api', subjEnrollRouter)

const subjectsRouter = require('./routes/subjectsRoutes')
app.use('/api', subjectsRouter)

const scholarshipRouter = require('./routes/scholarshipRoutes')
app.use('/api', scholarshipRouter)

const gradesRouter = require('./routes/gradesRoutes')
app.use('/api', gradesRouter)

const assessListRouter = require('./routes/assessListRoutes')
app.use('/api', assessListRouter)

const gradeLogRouter = require('./routes/gradeLogsRoutes')
app.use('/api', gradeLogRouter)

const processLogsRouter = require('./routes/processLogsRoutes')
app.use('/api', processLogsRouter)

const feesRouter = require('./routes/feesRoutes')
app.use('/api', feesRouter)

const loaRouter = require('./routes/loaRoutes')
app.use('/api', loaRouter)

app.use(requestIp.mw())
app.get('/api/get/ip', (req, res) => {
    const clientIp = req.socket.remoteAddress;
    res.send({ clientIp: clientIp });
});

//---DB CONNECTION---//
// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'cvsudatabase123qwe',
//     port: 3306
// })

//---DB CONNECTION CHECK---//
// db.connect(err => {
//     if(err) { console.log(err); }
//     console.log('Database Connected.');
// })

//---GET ALL ACCOUNTS---//
// app.get('/account/list', (req, res) => {
//     let query = 'SELECT * FROM enrolluserstbl';

//     db.query(query, (err, result) => {
//         if(err) {
//             console.log(err, 'errs');
//         }

//         if(result.length > 0) {
//             res.send({
//                 message: 'All Accounts retrieved',
//                 data: result
//             });
//         }
//     });
// });

//---GET SINGLE ACCOUNT---//
// app.get('/account/:collegeID', (req, res) => {

//     let collegeID = req.params.collegeID;

//     let query = `SELECT * FROM enrolluserstbl WHERE collegeID = '${collegeID}'`;

//     db.query(query, (err, result) => {
//         if(err) { console.log(err); }

//         if(result.length > 0) {
//             res.send({
//                 message: 'Account retrieved.',
//                 data: result
//             });
//         }
//         else{
//             res.send({
//                 message: 'No Account retrieved.'
//             });
//         }
//     });
// });

//---CREATE ACCOUNT---//
// app.post('/account/add', (req, res) => {
//     console.log(req.body, 'Create Account');

//     let collegeID = req.body.collegeID;
//     let username = req.body.username;
//     let password = req.body.password;
//     let isAdmin = req.body.isAdmin;

//     let query = `INSERT INTO enrolluserstbl(collegeID, username, password, isAdmin) VALUES('${collegeID}', '${username}', '${password}', '${isAdmin}')`;

//     db.query(query, (err, result) => {
//         if(err) { console.log(err); }

//         console.log(result, 'result');
//         res.send({
//             message: 'Account Created.'
//         })
//     });
// });

//---UPDATE AN ACCOUNT---// 
// app.put('/account/edit/:collegeID', (req, res) => {
//     console.log(req.body, 'Update Account');

//     let collegeID = req.params.collegeID;
//     let username = req.body.username;
//     let password = req.body.password;

//     let query = `UPDATE enrolluserstbl SET username = '${username}', password = '${password}' WHERE collegeID = '${collegeID}'`;

//     db.query(query, (err, result) => {
//         if(err) { console.log(err); }

//         res.send({ message: 'Account updated.' })
//     })
// });

//---DELETE AN ACCOUNT---//
// app.delete('/account/delete/:collegeID', (req, res) => {
//     let collegeID = req.params.collegeID;
    
//     let query = `DELETE FROM enrolluserstbl WHERE collegeID = '${collegeID}'`;

//     db.query(query, (err, result) => {
//         if(err) { console.log(err); }

//         res.send({ message: 'Account deleted.' })
//     })
// })

app.listen(port, () => {
    console.log('Server is running on port', port);
})