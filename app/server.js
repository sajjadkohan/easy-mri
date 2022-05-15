const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const { AllRoutes } = require("./router/router");
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
    }

    createRoutes(){

        

        this.#app.use(AllRoutes)
    }

    errorHandling(){
        this.#app.use((req, res , next)=> {
            return res.status(404).json({
                statusCode : 404,
                message : "صفحه مورد نظر وجود ندارد"
            })
        })

        this.#app.use((error , req , res , next)=> {
            const statusCode = error.status || 500;
            const message = error.message || "internal server";
            res.status(statusCode).json({
                statusCode,
                message
            })
        })

    }
    

}