const express = require("express");

const morgan = require("morgan");
const cors = require("cors");

const app = express();


const port = 1337;
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

const index = require("./routes/index");
const reports = require("./routes/reports");
const register = require("./routes/register");
const login = require("./routes/login");

//const authModel = require("./models/auth.js");


app.use(cors());
//app.options('*', cors());

// Middleware
app.use((req, res, next) => {
    console.log(req.method);
    console.log(req.path);
    next();
});

if (process.env.NODE_ENV !== "test") {
    app.use(morgan("combined"));
}



//app.use("/login", login);
app.use("/register", register);
app.use("/reports", reports);
app.use("/", index);

app.use((req, res, next) => {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});

app.use((req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    res.status(err.status || 500).json({
        "errors": [
            {
                "status": err.status,
                "title": err.message,
                "detail": err.message
            }
        ]
    });
});

// Start up server
app.listen(port, () => console.log(`Example API listening on port ${port}!`));

//
