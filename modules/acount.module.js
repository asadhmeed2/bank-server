const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
    passportId:{
        type:String,
        required:true
    } ,
    
    cash:{
        type:Number,
        required:true
    },
    credit:{
        type:Number,
        required:true,
        min:[0,"credit most not be negative number"]
    },
});


const UserModule = mongoose.model('users', ItemSchema);


module.exports = {
    UserModule
}