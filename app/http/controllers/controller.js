

module.exports = class Controller {
    constructor(){
        
    }

    test(){
        return "test"
    }

    register(req, res, next){
        try {
            
        } catch (error) {
            next(error)
        }
    }
}
