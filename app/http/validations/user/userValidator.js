const {body} = require("express-validator");
const { userModel } = require("../../../models/users");

function registerValidator () {
    return [
        body("first_name").notEmpty().withMessage("نام نمیتواند خالی باشد")
        .custom((value , ctx) => {
            if(value) {
                // const first_nameRegex = /(^[a-z]{2,})([\s]{1})?[a-z]{1,}$/gim;
                const first_nameRegex = /^[a-z]{3,}$/gim;
                if(!first_nameRegex.test(value)){
                    throw "نام خود را صحیح وارد نکرده اید"
                }
            }
            return true
        }),

        body("last_name").notEmpty().withMessage("نام خانوادگی نمیتواند خالی باشد")
        .custom((value , ctx) => {
            if(value) {
                const last_nameRegex = /^[a-z]{3,}$/gim;
                if(!last_nameRegex.test(value)){
                    throw "نام خانوادگی خود را صحیح وارد نکرده اید"
                }
            }
            return true
        }),

        body("password").custom((value , ctx) => {
            if(value) {
                const passwordRegex = /[a-z0-9]{6,}$/gim;
                if(!passwordRegex.test(value)){
                    throw "رمز عبور باید حداقل شامل 6 نویسه باشد و متشکل از حروف لاتین و اعداد باشد"
                }
            }
            
            if(value !== ctx?.req?.body?.confirm_password) throw "رمز عبور با تکرار ان مطابقت ندارد"
            return true

        }),

        body("nationalCode").notEmpty().withMessage("کد ملی نمیتواند خالی باشد")
        .custom(async(value , ctx) => {
            if(value) {
                const nationalCodeRegex = /^[0-9]{10}$/gim;
                if(!nationalCodeRegex.test(value)){
                    throw "کد ملی باید متشکل از 10 عدد لاتین باشد"
                }
            }

            let nationalCode = ctx?.req?.body?.nationalCode;

            const user = await userModel.findOne({nationalCode})
            if(user) throw "این کد ملی قبلا ثبت شده است"

            return true
        }),

        body("phoneNumber").notEmpty().withMessage("لطفا شماره موبایل را وارد کنید").custom(phone=> {
            if(phone){
                const phoneNumberRegex = /^[0]{1}[9]{1}[0-9]{9}$/gim;
                if(!phoneNumberRegex.test(phone)){
                    throw "شماره موبایل وارد شده صحیح نیست"
                }
            }

            return true

        }),

    ]
}

function loginValidator () {
    return [
        body("nationalCode").notEmpty().withMessage("لطفا کد ملی را وارد کنید")
        .custom(async(code , ctx) => {

                const nationalCodeRegex = /^[0-9]{10}$/gim;
                if(!nationalCodeRegex.test(code)){
                    throw "کد ملی یا رمز عبور صحیح نمیباشد"
                }

                let nationalCode = ctx?.req?.body?.nationalCode;

                const user = await userModel.findOne({nationalCode})
                if(!user) throw "کد ملی یا رمز عبور صحیح نمیباشد."

                return true
            }),
        body("password").isLength({min : 6})
        .withMessage("کد ملی یا رمز عبور صحیح نمیباشد")
    ]
}

function updateUserValidator () {

    return [
        body("father_name").notEmpty().withMessage("فیلد نمیتواند خالی باشد").custom((value)=> {
            const valueRegex = /^[a-z]{3,}$/gim;
            if(!valueRegex.test(value)) throw "مقدار وارد شده صحیح نیست"

            return true
        }),
        body("dateOfBirth").notEmpty().withMessage("فیلد نمیتواند خالی باشد").custom((value)=> {
            const valueRegex = /^([0-9]{2})([\.\/]{1})?([0-9]{2})([\.\/]{1})?([0-9]{4})$/;
            if(!valueRegex.test(value)) throw "مقدار وارد شده صحیح نیست"

            return true
        }),
        body("age").notEmpty().withMessage("فیلد نمیتواند خالی باشد").custom((value)=> {
            const valueRegex = /^[0-9]{1,3}$/;
            if(!valueRegex.test(value)) throw "مقدار وارد شده صحیح نیست"

            return true
        }),
        body("email").notEmpty().isEmail().withMessage("ایمیل وارد شده صحیح نیست"),
        body("address").notEmpty().withMessage("لطفا ادرس را وارد کنید")
    ]

}

module.exports = {
    registerValidator,
    loginValidator,
    updateUserValidator
}