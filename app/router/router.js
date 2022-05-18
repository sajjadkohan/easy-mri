const { homeRoutes } = require("./api");
const { authRouter } = require("./user/user");

const router = require("express").Router();

router.use("/" , homeRoutes);
router.use("/user" , authRouter);


module.exports = {
    AllRoutes : router
}