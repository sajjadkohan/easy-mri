const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

function hashedString (data) {

    const salt = bcrypt.genSaltSync(13);
    const hashed = bcrypt.hashSync(data , salt);
    return hashed;

}

const EXPIRE_IN = (10 * 60 * 24 * 300);
const EXPIRE_IN_R = "1y";


//توکن یک ساله
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYXRpb25hbENvZGUiOiI1MTQwMDY2MzA4IiwiaWF0IjoxNjUyNzg0OTE1LCJleHAiOjE2Nzg3MDQ5MTV9.KH-syN-ktrfjU-aarBNjZet5w_PBsroojOznyp1yTEc

const SECRET_KEY = "6623263017C3AA6146F97F96F562BC30";
const REFRESH_TOKEN_SECRET_KEY = "2F818EC94E832A1E316DAC113DF7BCBA";

function createJwt (payload) {
    
    const token = jwt.sign(payload , SECRET_KEY,{expiresIn :EXPIRE_IN});

    return token
}

function createRefreshToken (payload) {
    
    const token = jwt.sign(payload , REFRESH_TOKEN_SECRET_KEY,{expiresIn :EXPIRE_IN_R});

    return token
}

function verifyJwtToken (token) {
    const result = jwt.verify(token , SECRET_KEY);

    if(!result.nationalCode) throw "توکن منقضی شده";
    return result
}

function verifyRefreshToken (token) {
    const result = jwt.verify(token , REFRESH_TOKEN_SECRET_KEY);

    if(!result.nationalCode) throw "توکن منقضی شده";
    return result
}

function createUploadPath (nationalCode) {


    // let dt = new Date();
    // const year = dt.getFullYear() + "";
    // const month = dt.getMonth() + "";
    // const day = dt.getDay() + "";

    const uploadPath = path.join(__dirname,"..","..","public","upload",nationalCode)
    fs.mkdirSync(uploadPath , {recursive : true})

    return uploadPath
    
}

function randomNumberGenerator() {
    return Math.floor((Math.random() * 90000) + 10000)
}

module.exports = {
    hashedString,
    createJwt,
    verifyJwtToken,
    verifyRefreshToken,
    createRefreshToken,
    createUploadPath,
    randomNumberGenerator
}