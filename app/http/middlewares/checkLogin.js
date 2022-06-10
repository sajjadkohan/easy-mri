const { userModel } = require("../../models/users");
const { verifyJwtToken } = require("../../modules/functions");

async function checkLogin (req,res,next){
    try {
        const authorization = req.headers?.authorization;
    if(!authorization) throw {status : 401 , message : "توکن وارد نشده"};

    const token = authorization.split(" ")?.[1];
    if(!token) throw {status : 401 , message : "token مشکل داره"};
    // console.log("توکنی که در هدر وارد شده",token);

    const resultToken = verifyJwtToken(token);
    // console.log("RESULT TOKEN",resultToken);
    if(!resultToken) {
        console.log("توکن منقضی شد");
      throw {status : 401 , message : "توکن منقضی شده 2"};  
    }

    const {nationalCode} = resultToken;
    const user = await userModel.findOne({nationalCode} , {password : 0});
    if(!user) throw{status : 401 , message : "لطفا دوباره وارد حساب خود شوید"}
    req.user = user;

    next()

    } catch (error) {
        next(error)
    }
}

module.exports = {
    checkLogin
}