const request = require("supertest");
const server = require("../api/server");
const db = require("../database/dbConfig");

describe("auth test suite", () => {
    // Clear the users table before testing
    beforeAll(async () => {
        await db("users").truncate();
    });

    it("Register should return a 201 ok if username is available", () => {
        return request(server).post("/api/auth/register").send({ "username": "whew", "password": "meh" })
        .then(res => expect(res.status).toBe(201));
    })

    it("Register should return a 500 error if username is taken", () => {
        return request(server).post("/api/auth/register").send({ "username": "whew", "password": "meh" })
        .then(res => expect(res.status).toBe(500));
    })

    it("Login should return a 200 ok if password is correct", () => {
        return request(server).post("/api/auth/login").send({ "username": "whew", "password": "meh" })
        .then(res => expect(res.status).toBe(200));
    })

    it("Login should return a 401 error if password is incorrect", () => {
        return request(server).post("/api/auth/login").send({ "username": "whew", "password": "mah" })
        .then(res => expect(res.status).toBe(401));
    })
});