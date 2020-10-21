const db = require("../db/database.js");
//const sqlite3 = require("sqlite3").verbose();
//const db = new sqlite3.Database("./db/users.sqlite");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();


const secret = process.env.JWT_SECRET;

const auth = {
    register: (req, res) => {
        const email = req.body.email;
        const password = req.body.password;
        //console.log(req.body.email);


        if (!email || !password) {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: "/register",
                    title: "Please enter missing email or password",
                    detail: "Email pr password missing in request"
                }
            });
        }

        bcrypt.hash(password, 10, function(err, hash) {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: "/register",
                        title: "bcrypt error",
                        detail: "bcrypt error"
                    }
                });
            };

            db.run("INSERT INTO users (email, password) VALUES (?, ?)",
                email,
                hash, (err) => {
                    if (err) {
                        return res.status(500).json({
                            errors: {
                                status: 500,
                                source: "/register",
                                title: "Database error",
                                detail: err.message
                            }
                        });
                    }

                    return res.status(201).json({
                        data: {
                            message: "Användaren är nu registrerad!"
                        }
                    });
                });
        });
    },

    login: (req, res) => {
        const email = req.body.email;
        const password = req.body.password;

        console.log(req.body);

        if (!email || !password) {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: "/login",
                    title: "Please enter missing email or password",
                    detail: "Email pr password missing in request"
                }
            });
        }

        db.get("SELECT * FROM users WHERE email = ?",
            email,
            (err, rows) => {
                if (err) {
                    return res.status(500).json({
                        errors: {
                            status: 500,
                            source: "/login",
                            title: "Database error",
                            detail: err.message
                        }
                    });
                }

            if (rows === undefined) {
                return res.status(401).json({
                    errors: {
                        status: 401,
                        source: "/login",
                        title: "User not found",
                        detail: "User email not found."
                    }
                });
            }

            const user = rows;

            bcrypt.compare(password, user.password, (err, result) => {
                if (err) {
                    return res.status(500).json({
                        errors: {
                            status: 500,
                            source: "/login",
                            title: "bcrypt error",
                            detail: "bcrypt error"
                        }
                    });
                }

                if (result) {
                    const payload = { email: user.email };
                    // const secret = process.env.JWT_SECRET;
                    const jwtToken = jwt.sign(payload, secret, { expiresIn: "1h" });
                    console.log(jwtToken);


                    return res.json({
                        data: {
                            status: 200,
                            type: "success",
                            message: "User logged in",
                            user: payload,
                            token: jwtToken
                        }
                    });
                    //console.log(data.token);

                }

                return res.status(401).json({
                    errors: {
                        status: 401,
                        source: "/login",
                        title: "Wrong password",
                        detail: "Incorrect password."
                    }
                });
            });
        });
    },

    checkToken: (req, res, next) => {
        let token = req.headers["x-access-token"];
        console.log(token);
        console.log(req.path);

        if (token) {
            jwt.verify(token, secret, (err, decoded) => {
                if (err) {
                    return res.status(500).json({
                        errors: {
                            status: 500,
                            source: req.path,
                            title: "Failed authentication",
                            detail: err.message
                        }
                    });
                }

                req.user = {};
                req.user.email = decoded.email;

                next();

            });
        } else {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: req.path,
                    title: "No token",
                    detail: "No token provided in request headers."
                }
            });
        }
    }
};



module.exports = auth;
