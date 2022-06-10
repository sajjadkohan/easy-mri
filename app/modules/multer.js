const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { createUploadPath } = require("./functions");

const storage = multer.diskStorage({

    destination : async(req, file , callback) => {
        const natinalCodeUser = await req.user.nationalCode;
        callback(null,createUploadPath(natinalCodeUser))

        // console.log(">>>>>>>>",type);

        // const formatFile = [".png",".jpg"];
        // if(type.includes(formatFile)) throw {status:401,message : "فرمت فایل قابل قبول نیست"}

    },

    filename : (req, file , callback) => {
        const type = path.extname(file.originalname)
        callback(null , String(Date.now() + type))

    }
})

const fileUploader = multer({storage})

module.exports = {
    fileUploader
}

