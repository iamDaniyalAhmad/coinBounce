const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const {Schema} = mongoose;


const userSchema = new Schema ({
    name : {type :String ,required : true},
    username : {type :String ,required : true},
    email : {type :String ,required : true},
    password : {type :String ,required : true}
},
    {timestamps:true}
)

// userSchema.pre('save', async function(next){
//     if(this.isModified('password')){
//         this.password = await bcrypt.hash('password',10);
//     }
//     next();
// })

module.exports = mongoose.model('user',userSchema, 'users');