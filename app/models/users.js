const mongoose = require("mongoose");

const mri = new mongoose.Schema({
    fileMri : {type : String , default : ""},
    reportMri : {type : String , default : ""},
    dateSave : {type : String , default : "" , required : true},

})

const Schema = new mongoose.Schema({
    first_name : {type : String , required : true , uppercase : true},
    last_name : {type : String , required : true , uppercase : true },
    father_name : {type : String},
    password : {type : String , required : true},
    age : {type : Number },
    nationalCode : {type : String ,  required : true },
    phoneNumber : {type : String , required : true },
    dateOfBirth : {type : String },
    roles : {type : [String] , default : ["USER"]},
    email : {type : String},
    password : {type : String},
    mri : {type : [mri] , default : []},
    address : {type : String},
    token : {type : String , default : ""}
} , {
    timestamps : true
})

module.exports = {
    userModel : mongoose.model("user",Schema)
}