const createError = require("http-errors");
const { userModel } = require("../../../models/users");
const { hashedString, createJwt, createRefreshToken, verifyRefreshToken } = require("../../../modules/functions");
const bcrypt = require("bcrypt");
const path = require("path");
const { mriModel } = require("../../../models/mris");

class UserController {
    constructor(){
        
    }

    test(){
        return "test"
    }

    async register(req, res, next){
        try {
            const {first_name,last_name,nationalCode,phoneNumber,password} = req.body;

            const hashedPassword = hashedString(password);

            const userRegister = await userModel.create(
                {first_name , last_name , nationalCode , phoneNumber , password : hashedPassword}
                )
            

            // const repeatCode = await userModel.find({nationalCode , phoneNumber});
            // if(repeatCode) throw {message : "این کد از قبل وجد دادرد"}

            if(!userRegister) throw {message : "ooops"}
            return res.json({
                message : "کاربر با موفقیت ثبت شد",
                userRegister
            })
        } catch (error) {
            next(createError.BadRequest(error.message))
        }
    }

    async login(req, res , next){
        try {
            
        const {nationalCode , password} = req.body;
        // console.log( "این هدر است"+req.headers);
        const user = await userModel.findOne({nationalCode});
        if(!user) throw {status:401 , message : "کد ملی یافت نشد"}

        const compaireData = bcrypt.compareSync(password , user.password);
        if(!compaireData) throw {status:401 , message : "رمز عبور اشتباه می باشد"}

        let token = createJwt({nationalCode});
                user.token = token;
                await user.save();

        let RefreshToken = createRefreshToken({nationalCode});
                user.RefreshToken = RefreshToken;
                
                await user.save();

        const newUser = await userModel.aggregate([
            {
                $match : {nationalCode}
            },
            {
                $project : {password : 0 ,__v : 0}
            }
        ])
        if(!newUser) throw {status:401 , message : "کد ملی یافت نشد"}

        
        return res.status(201).json({
            newUser,
            RefreshToken
        })

        } catch (error) {
            next(error)
        }
    }

    async updateUser(req, res , next){
        try {
            
        const data = {...req.body}
        const nationalCodeUser = req.user.nationalCode

        // console.log(">>>>",nationalCodeUser);
        const user = await userModel.findOne({nationalCodeUser})
        if(!user) throw {status:401,message : "کاربر با این کد ملی یافت نشد که بخواد اپدیتم بشه"}

        //aggregate یک ارابه را به ما برمیگرداند.

        const userUpdated = await userModel.updateOne({nationalCode : user.nationalCode},{$set : data})
        if(userUpdated.modifiedCount == 0 ) throw {status : 401 , message : "کاربر اپدیت نشد"}

        return res.status(200).json({
            message : "اپدیت شد"
        })

        
        // console.log( "این هدر است"+req.headers);
        

        } catch (error) {
            next(error)
        }
    }

    async getAllUsers (req, res , next) {
        try {
            
            const allUsers = await userModel.find({});

            if(!allUsers) throw {status : 500 , message : "عملیات ناموفق بود"}

            return res.status(200).json({
                status : 200,
                success : true,
                allUsers
            })

        } catch (error) {
            next(error)
        }
    }

    async uploadMriFile (req, res , next) {
    try {

        const nationalCodeUser = req.user.nationalCode;
        const userID = req.user._id;

        // console.log(natinalCodeUser);

        const mriFilePath = req.file.path;
        
        const format = [".jpg" , ".png" , ".jpeg"];
        const ext = path.extname(req.file.originalname);
        if(!format.includes(ext)) {
            throw {message : "فرمت ارسال شده صحیح نیست"}
        }

        // console.log("??????????",mriFilePath);

        // const format = [".jpg" , ".png" , ".jpeg"];
        // const ext = path.extname(req.file.originalname);
        // console.log(ext);
        // if(!format.includes(ext)) throw {status:401,message : "فرمت ارسال شده صحیح نیست"}

        
        // console.log(nationalCode , ">>>>>>" , typeof mriFilePath);

        const userr = await mriModel.create({fileMri :mriFilePath ,personInfo : userID , dateSave : Date.now()})
        
        if(!userr ) throw {message : "کاربر پیدا نشد اصن"}


        // const user = await userModel.updateOne(
        //     {"nationalCode":userr.nationalCode},
        //      {$push : {mri : mriFilePath}}
        //      )

        // if(user.modifiedCount == 0 ) throw {message : "اپلود انجام نشد"}


        return res.status(200).json({
            status : 200,
            success : true,
            message : "فایل اپلود شد"
            
        })
    } catch (error) {
        next(error)
    }
}

    async getAllMri(req,res,next) {
        try {
            const userID = req.user._id;

            const userData = await mriModel.aggregate([
                {
                    $match : {"personInfo" : userID}
                },
                {
                    $lookup : {
                        from : "users",
                        localField : "personInfo",
                        foreignField : "_id",
                        as : "ownerMri"
                    }
                },{
                    $project : {"ownerMri.first_name" : 1 ,"ownerMri.last_name" : 1 ,"ownerMri.nationalCode" : 1,"fileMri" : 1 , "dateSave" : 1 , "reportMri" : 1 }
                },{
                    $unwind : "$ownerMri"
                }
            ])

            return res.status(200).json({
                userData
                
            })

        } catch (error) {
            next(error)
        }
    }
    //این فانشکن برای تست میباشد
    async deleteUserByFirstName (req, res , next) {
        try {
            
            const {first_name} = req.params
            const delteteUsers = await userModel.deleteMany({first_name});

            if(!delteteUsers) throw {status : 500 , message : "عملیات ناموفق بود"}

            return res.status(200).json({
                status : 200,
                success : true,
                message : "کاربر با موفقیت حذف شد"
            })

        } catch (error) {
            next(error)
        }
    }


    async refreshToken (req,res,next) {
        try {
         const {refreshToken} = req.body
         const {nationalCode} = await verifyRefreshToken(refreshToken);
         
         const user = await userModel.findOne({nationalCode})
         // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYXRpb25hbENvZGUiOiI1MTQxMjM0NTYxIiwiaWF0IjoxNjU0NzcxMDA0LCJleHAiOjE2ODYzMjg2MDR9.l89WvjLwwAcjVVTJqUDcVHCViqNJZbmxQpntbXjR9fE

         const nationalCodeUser = user.nationalCode;

         const newRefreshToken = createRefreshToken({nationalCodeUser});

         return res.json({
             data : {
                 refreshToken : newRefreshToken
             }
         })

        } catch (error) {
            next(error)
        }
    }

}

module.exports = {
    UserController : new UserController
}