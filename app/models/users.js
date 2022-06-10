const mongoose = require("mongoose");

const mri = new mongoose.Schema({
        
    fileMri : {type : String , default : ""},
    reportMri : {type : String , default : ""},
    dateSave : {type : String , default : ""}

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
    address : {type : String ,default: ""},
    token : {type : String , default : ""},
    otp : {type:Object,default: {
        code : 0,
        expiresIn: 0
    }}
} , {
    timestamps : true
})

module.exports = {
    userModel : mongoose.model("user",Schema)
}