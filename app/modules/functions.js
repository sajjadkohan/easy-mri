const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function hashedString (data) {

    const salt = bcrypt.genSaltSync(13);
    const hashed = bcrypt.hashSync(data , salt);
    return hashed;

}

const EXPIRE_IN = (10 * 60 * 24 * 300);

//توکن یک ساله
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYXRpb25hbENvZGUiOiI1MTQwMDY2MzA4IiwiaWF0IjoxNjUyNzg0OTE1LCJleHAiOjE2Nzg3MDQ5MTV9.KH-syN-ktrfjU-aarBNjZet5w_PBsroojOznyp1yTEc

const SECRET_KEY = "6623263017C3AA6146F97F96F562BC30";

function createJwt (payload) {
    
    const token = jwt.sign(payload , SECRET_KEY,{expiresIn :EXPIRE_IN});

    return token
}

function verifyJwtToken (token) {
    const result = jwt.verify(token , SECRET_KEY);

    if(!result.nationalCode) throw "توکن منقضی شده";
    return result
}

module.exports = {
    hashedString,
    createJwt,
    verifyJwtToken
}