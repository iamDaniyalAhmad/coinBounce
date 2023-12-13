const mongoose = require('mongoose');


const {DATABASE} = require('../config/index')

const db = async ()=>{
    try {
        
        const con = await mongoose.connect(DATABASE,{
            useNewUrlParser:true,
            useUnifiedTopology:true
        });
        console.log("Connection is Successfull");
        
    } catch (error) {
        console.log("Connection is not Successfull");
        console.log(error)
        
    }

   
}

module.exports = db;