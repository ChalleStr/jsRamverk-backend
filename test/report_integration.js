process.env.NODE_ENV = "test";

const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app.js");

chai.should();

const db = require("../db/database.js");

chai.use(chaiHttp);

let token = "";

describe("Reports", () => {
    before(() => {
        return new Promise((resolve) => {
            db.run("DELETE FROM kmom", (err) => {
                if (err) {
                    console.log("Could not empty test DB", err.message);
                }

                resolve();
            });
        });
    });

    describe("POST /reports/add", () => {
        it("should get 201 HAPPY PATH registering new user (for test)", (done) => {
            let user = {
                email: "test@report.com",
                password: "testingreports"
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

        it("should get 200 HAPPY PATH loggin in (with created user)", (done) => {
            let user = {
                email: "test@report.com",
                password: "testingreports"
            };

            chai.request(server)
                .post("/login")
                .set("x-access-token", token)
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.should.have.property("data");
                    res.body.data.should.have.property("type");
                    res.body.data.type.should.equal("success");
                    res.body.data.should.have.property("token");

                    token = res.body.data.token;

                    done();
                });
        });

        it("should get 201 HAPPY PATH creating report", (done) => {
            let report = {
                week_nr: 1,
                kmom_text: "Testreport 1"
            };

            chai.request(server)
                .post("/reports/add")
                .set("x-access-token", token)
                .send(report)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.an("object");
                    res.body.should.have.property("data");
                    res.body.data.should.have.property("message");
                    res.body.data.message.should.equal("Report added.");

                    done();
                });
            });

        it("should get 200 HAPPY PATH getting report just created", (done) => {
            let kmom = 1;
            chai.request(server)
                .get("/reports/week/" + kmom)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");

                    done();
                });
        });

        it("should get 500 as not providing weekNr", (done) => {
            let report = {
                kmom_text: "Testreport 2"
            };

            chai.request(server)
                .post("/reports/add")
                .set("x-access-token", token)
                .send(report)
                .end((err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.an("object");
                    res.body.should.have.property("errors");
                    res.body.errors.should.have.property("status");
                    res.body.errors.status.should.be.equal(500);
                    res.body.errors.should.have.property("detail");

                    done();
                });
        });

        it("should get 409 as weekNr already exists", (done) => {
            let report = {
                week_nr: 1,
                kmom_text: "New testreport 1"
            };

            chai.request(server)
                .post("/reports/add")
                .set("x-access-token", token)
                .send(report)
                .end((err, res) => {
                    res.should.have.status(409);
                    res.body.should.be.an("object");
                    res.body.should.have.property("errors");
                    res.body.errors.should.have.property("title");
                    res.body.errors.status.should.be.equal(409);
                    res.body.errors.title.should.be.equal("WeekNr already exists.");

                    done();
                });
        });


    });

    describe("PUT /reports/update", () => {
        it("should get 200 HAPPY PATH changing kmomText", (done) => {
            let report = {
                week_nr: 1,
                kmom_text: "Updated testreport 1"
            };

            chai.request(server)
                .put("/reports/update")
                .set("x-access-token", token)
                .send(report)
                .end((err, res) => {
                    res.should.have.status(200);

                done();
                });

        });
    });

});
