const express = require('express');
require('dotenv').config();
const cors = require('cors');
const studentsRouter = require('./routes/students');

const app = express();

app.use(express.json());
app.use(cors('*'));
app.use('/api/students', studentsRouter);

app.listen(process.env.PORT, '0.0.0.0', ()=>{
    console.log('Server started at port '+process.env.PORT+'....');
});