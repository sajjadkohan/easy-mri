const createError = require("http-errors");
const { userModel } = require("../../../models/users");
const { hashedString, createJwt } = require("../../../modules/functions");
const bcrypt = require("bcrypt");
const { $_match } = require("@hapi/joi/lib/base");

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

        let token = createJwt({nationalCode})
        user.token = token;
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
            newUser
        })

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

}

module.exports = {
    UserController : new UserController
}