const Application = require("./app/server");
require("dotenv").config();
new Application(5000,"mongodb://0.0.0.0:27017/easymri")