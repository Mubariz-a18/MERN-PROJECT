const mongoose = require('mongoose')
const dotenv = require('dotenv')


const connectDatabase  = ()=>{

    mongoose.connect(process.env.database,{useNewUrlParser:true,useUnifiedTopology:true})
    .then((data)=>{console.log('mongo db is connected ',data.connection.host)})
}




module.exports = connectDatabase