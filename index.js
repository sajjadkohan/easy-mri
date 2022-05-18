const Application = require("./app/server");
require("dotenv").config();
new Application(5000,"mongodb://localhost:27017/easymri")