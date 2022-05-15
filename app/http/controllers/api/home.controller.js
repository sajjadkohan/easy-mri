const Controller = require("../controller");

module.exports = new class HomeController extends Controller {
    indexPage (req,res,next) {
        return res.status(200).json({
            message : "index Page Easy Mri"
        })
    }
}