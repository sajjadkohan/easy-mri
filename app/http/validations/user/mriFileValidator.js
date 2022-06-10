const { body } = require("express-validator")
const path  = require("path");

function mriFileValidatorr () {
    return [

        body("file").custom((value , {req}) => {

            // const format = [".jpg" , ".png" , ".jpeg"];
            // const ext = path.extname(req?.file?.originalname);
            // if(!format.includes(ext)) throw {message : "فرمت ارسال شده صحیح نیست"}

            console.log(">>>>>>>>>>>>>>",req.file);


            return true
        })

    ]
}

module.exports = {
    mriFileValidatorr
}