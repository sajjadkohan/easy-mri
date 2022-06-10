const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
    fileMri : {type : String , default : "" , required : true},
    reportMri : {type : String , default : ""},
    dateSave : {type : Date , default : ""},
    personInfo :{type : mongoose.Types.ObjectId}
})

module.exports = {
    mriModel : mongoose.model("mri",Schema)
}
