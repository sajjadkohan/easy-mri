const { UserController } = require("../../http/controllers/user/userConroller");
const { registerValidator, loginValidator, updateUserValidator, mriFileValidator } = require("../../http/validations/user/userValidator");
const { expressValidatorMapper } = require("../../http/middlewares/checkErrors");
const { checkLogin } = require("../../http/middlewares/checkLogin");
const { fileUploader } = require("../../modules/multer");


const router = require("express").Router();

router.use("/register" , registerValidator(), expressValidatorMapper ,UserController.register)

/**
 * @swagger
 * tag:
 *  name: authUser
 *  description: register user
 */

/**
 * @swagger
 *  /user/register:
 *      post:
 *          summary: register user with full name and ...
 *          tags: [authUser]
 *          description: enter name and age , ...
 *          parameters:
 *          -   name: first_name
 *              description: whats your first name
 *              in: formData
 *              required: true
 *              type: string
 *          -   name: last_name
 *              description: whats your last name
 *              in: formData
 *              required: true
 *              type: string
 *          -   name: password
 *              description: choose your password
 *              in: formData
 *              required: true
 *              type: string
 *          -   name: confirm_password
 *              description: confirm your password
 *              in: formData
 *              required: false
 *              type: string
 *          -   name: nationalCode
 *              description: whats your national code
 *              in: formData
 *              required: true
 *              type: string
 *          -   name: phoneNumber
 *              description: whats your phone number
 *              in: formData
 *              required: true
 *              type: string
 *          responses:
 *              201:
 *                  description: Success
 *              400:
 *                  description: Bad request
 */

router.get("/list" ,UserController.getAllUsers)

/**
 * @swagger
 * tag:
 *  name: getAllUser
 *  description: get all user
 */

/**
 * @swagger
 *  /user/list:
 *      get:
 *          summary: get all users . . .
 *          tags: [getAllUser]
 *          description: get all users and informations ...
 *          responses:
 *              201:
 *                  description: Success
 *              500:
 *                  description: internal server
 */

// این روت برای تست است
router.delete("/delete/:first_name" ,UserController.deleteUserByFirstName)



router.use("/login", loginValidator() , expressValidatorMapper ,UserController.login)


/**
 * @swagger
 *  /user/login:
 *      post:
 *          summary: login user
 *          tags: [authUser]
 *          description: login and get token
 *          parameters:
 *          -   name: nationalCode
 *              description: enter your nationalCode
 *              in: formData
 *              required: true
 *              type: string
 *          -   name: password
 *              description: enter your password
 *              in: formData
 *              required: true
 *              type: string
 *          responses:
 *              201:
 *                  description: Success
 *              400:
 *                  description: Bad request
 */

router.post("/update", checkLogin , updateUserValidator() , expressValidatorMapper ,UserController.updateUser)
router.post("/uploadmri",
checkLogin,
mriFileValidator(),
fileUploader.single("filee"),
 UserController.uploadMriFile)
 router.get("/allmri", checkLogin ,UserController.getAllMri)
 router.post("/refresh-token" , UserController.refreshToken)

 /**
 * @swagger
 * tag:
 *  name: refreshToken
 *  description: request for new refresh token
 */

 /**
 * @swagger
 *  /user/refresh-token:
 *      post:
 *          summary: refreshToken
 *          tags: [refreshToken]
 *          description: request for new refresh token
 *          parameters:
 *          -   name: refreshToken
 *              description: enter token
 *              in: formData
 *              required: true
 *              type: string
 *          responses:
 *              201:
 *                  description: Success
 *              400:
 *                  description: Bad request
 */

module.exports = {
    authRouter : router
}