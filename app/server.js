const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const { AllRoutes } = require("./router/router");
const createErrors = require("http-errors");
const swaggerUiExpress = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

module.exports = class Application {
    #app = express();
    #DB_URI;
    #PORT;

    constructor(PORT,DB_URI){
        this.#PORT = PORT;
        this.#DB_URI = DB_URI;

        this.configApplication();
        this.connectToMongoDB();
        this.createServer();
        this.createRoutes();
        this.errorHandling();

    }

    configApplication(){
        this.#app.use(express.json());
        this.#app.use(express.urlencoded({extended : true}));
        this.#app.use(express.static(path.join(__dirname , ".." , "public")));
        this.#app.use("/doc-api",swaggerUiExpress.serve , swaggerUiExpress.setup(swaggerJsDoc({
            swaggerDefinition : {
                info : {
                    title : "EASY MRI",
                    version : "1.0.0",
                    description : "backend EASY MRI and create API for EASY MRI"
                },
                servers : [
                    {
                        url : "http://localhost:5000"
                    }
                ]
            },
            apis : ["./app/router/**/*.js"]
        })))
    }

    createServer(){
        const http = require("http");
        http.createServer(this.#app).listen(this.#PORT , ()=> {
            console.log("http://localhost:" + this.#PORT);
        })
    }

    connectToMongoDB(){
        mongoose.connect(this.#DB_URI , (error) => {
            if(!error) return console.log("success connect to MONGODB");
            return console.log("failed connect to MONGODB");
        })

        mongoose.connection.on("connected" , ()=> {
            console.log("mongoose connected to DATA BASE");
        })

        mongoose.connection.on("dissconnected" , ()=> {
            console.log("mongoose DISSconnected to DATA BASE");
        })

        process.on("SIGINT" , async()=> {
            await mongoose.connection.close();
            process.exit(0)
        })
    }

    createRoutes(){

        

        this.#app.use(AllRoutes)
    }

    errorHandling(){
        this.#app.use((req, res , next)=> {
            next(createErrors.NotFound(".صفحه مورد نظر وجود ندارد."));
            
        })

        this.#app.use((error , req , res , next)=> {
            const internalServerError = createErrors.InternalServerError()
            const statusCode = error.status || internalServerError.status
            const message = error.message || internalServerError.message
            res.status(statusCode).json({
                errors : {
                    statusCode,
                    message
                }
            })
        })

    }
    

}