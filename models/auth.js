const db = require("../db/database.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");



const secret = process.env.JWT_SECRET;
//const saltRounds = 10;
//const myPlaintextPassword = "longandhardP4$w0rD";



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
};


module.exports = auth;
