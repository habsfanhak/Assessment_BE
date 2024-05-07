const express = require('express');
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const userOps = require("./userOps.js")

const HTTP_PORT = process.env.PORT || 8080;

userOps.connect()
.then(() => {
    app.listen(HTTP_PORT, () => { console.log("API listening on: " + HTTP_PORT) });
})
.catch((err) => {
    console.log("Unable to start the server: " + err);
    process.exit();
})