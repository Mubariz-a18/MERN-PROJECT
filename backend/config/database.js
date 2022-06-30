const mongoose = require('mongoose')
const dotenv = require('dotenv')


const connectDatabase  = ()=>{

    mongoose.connect(process.env.database)
    .then(()=>{console.log('mongo db is connected ')})
}




module.exports = connectDatabase