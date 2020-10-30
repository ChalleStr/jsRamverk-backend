/* global it describe */

process.env.NODE_ENV = "test";

const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app.js");

chai.should();

const db = require("../db/database.js");

chai.use(chaiHttp);

describe("app", () => {
    describe("GET /", () => {
        it("200 HAPPY PATH getting base", (done) => {
            chai.request(server)
                .get("/")
                .end((err, res) => {
                    res.should.have.status(200);

                    done();
                });
        });
    });
});
