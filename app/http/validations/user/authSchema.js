const joi = require("@hapi/joi");

const authSchema = joi.object({
    first_name : joi.string().uppercase().min(3).trim().error(new Error("تعداد کاراکتر کافی نمیباشد")),
    last_name : joi.string().uppercase().min(3).trim().error(new Error("تعداد کاراکتر کافی نمیباشد.")),
    phoneNumber : joi.string().length(11).pattern(/^09[0-9]{9}$/).error(new Error("شماره موبایل وارد شد صحیح نیست")),
    nationalCode : joi.string().min(3).error(new Error("مقدار کد ملی باید بیش از 3 عدد باشد"))
})

module.exports = {
    authSchema
}


//در حال حاضر از این فایل استفاده نمیشود