
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const { connection} = require("./config/config.js")
const PORT = process.env.PORT || 8080

const app = express()



// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.listen(PORT, async() => {
    await connection
    console.log(`Server is running at the Port: http://localhost:${PORT}`)
})

