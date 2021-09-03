require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
//const helmet = require("helmet");
const morgan = require("morgan");
const mongoose = require('mongoose');
const mongosanitize = require("express-mongo-sanitize");
//const path = require("path");



// API Security
//app.use(helmet());

// Handle CORS Error
app.use(cors());

// MongoDB Connection 
mongoose.connect(process.env.MONGO_URI, () => {
    console.log('Connected MongoDB');
});

//Logger
    app.use(morgan("tiny"));

// Set 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// prevent nosql injection
app.use(mongosanitize({
    onSanitize: ({req, key})=>{
        console.warn(`This request[${key}] is sanitized`);
    }
}))


// load routers
app.use(express.static(__dirname + '/'));
const userRouter = require("./routes/user.routes")

// User Routers
app.use("/user", userRouter);


// Error Handler
const handleError = require("./utils/errorHandler")

app.use((req, res, next)=>{
    const error = new Error("Resources not found!");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    handleError(error, res);
});

const host = '0.0.0.0';
const port = process.env.PORT || 5000;

app.listen(port, host, ()=>{
    console.log(`Server ready on port ${port}`)
});