/* global it describe before */

process.env.NODE_ENV = "test";

const chai = require("chai");
const chaiHttp = require("chai-http");
//const HTMLParser = require("node-html-parser");

const server = require("../app.js");

chai.should();

const db = require("../db/database.js");

chai.use(chaiHttp);

describe("auth", () => {
    before(() => {
        return new Promise((resolve) => {
            db.run("DELETE FROM users", (err) => {
                if (err) {
                    console.error("Could not insert into test DB table users",
                    err.message);
                }

                resolve();
            });
        });
    });

    describe("POST /register", () => {
        it("should get 401 as we do not provide email", (done) => {
            let user = {
                password: "123test",
            };

            chai.request(server)
                .post("/register")
                .send(user)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.an("object");
                    res.body.errors.status.should.be.equal(401);
                    done();
                });
        });

        it("Should get 401 as we do not provide password", (done) => {
            let user = {
                 email: "test@test.com"
            };

            chai.request(server)
                .post("/register")
                .send(user)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.an("object");
                    res.body.errors.status.should.be.equal(401);
                    done();
                });
        });



        it("should get 201 HAPPY PATH", (done) => {
            let user = {
                email: "test@test.com",
                password: "test123"
            };

            chai.request(server)
                .post("/register")
                .send(user)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.an("object");
                    res.body.should.have.property("data");
                    res.body.data.should.have.property("message");
                    res.body.data.message.should.equal("Användaren är nu registrerad!")
                    done();
                });
        });

        it("should get 500 as email already exists (UNIQUE constraint)", (done) => {
            let user = {
                email: "test@test.com",
                password: "anotherpwd123"
            };

            chai.request(server)
                .post("/register")
                .send(user)
                .end((err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.an("object");
                    res.body.should.have.property("errors");
                    res.body.errors.should.have.property("title");
                    res.body.errors.title.should.equal("Database error");
                    done();
                });
        });
    });

    describe("POST /login", () => {
        it("should get 401 as we do not provide valid email", (done) => {
            let user = {
                password: "test123"
            };

            chai.request(server)
                .post("/login")
                .send(user)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.an("object");
                    res.body.errors.status.should.be.equal(401);
                    done();
                });
        });

        it("should get 401 as we do not provide valid password", (done) => {
            let user = {
                email: "test@test.com"
            };

            chai.request(server)
                .post("/login")
                .send(user)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.an("object");
                    res.body.errors.status.should.be.equal(401);
                    done();
                });
        });

        it("should get 401 as user not found", (done) => {
            let user = {
                email: "notauser@test.com",
                password: "test123"
            };

            chai.request(server)
                .post("/login")
                .send(user)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.an("object");
                    res.body.errors.status.should.be.equal(401);
                    done();
                });
        });

        it("should get 401 incorrect password", (done) => {
            let user = {
                email: "test@test.com",
                password: "incorrectpwd123"
            };

            chai.request(server)
                .post("/login")
                .send(user)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.an("object");
                    res.body.errors.status.should.be.equal(401);
                    done();
                });
        });



        it("should get 200 HAPPY PATH", (done) => {
            let user = {
                email: "test@test.com",
                password: "test123"
            };

            chai.request(server)
                .post("/login")
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.should.have.property("data");
                    res.body.data.should.have.property("type");
                    //res.body.data.should.have.property("token");
                    res.body.data.type.should.equal("success");

                    done();
                });
        })
    })
})
