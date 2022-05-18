const { UserController } = require("../../http/controllers/user/userConroller");
const { registerValidator, loginValidator } = require("../../http/validations/user/userValidator");
const { expressValidatorMapper } = require("../../http/middlewares/checkErrors");
const { checkLogin } = require("../../http/middlewares/checkLogin");


const router = require("express").Router();

router.use("/register" , registerValidator(), expressValidatorMapper ,UserController.register)
router.get("/list" ,UserController.getAllUsers)

// این روت برای تست است
router.delete("/delete/:first_name" ,UserController.deleteUserByFirstName)

router.use("/login", checkLogin , loginValidator() , expressValidatorMapper ,UserController.login)


module.exports = {
    authRouter : router
}