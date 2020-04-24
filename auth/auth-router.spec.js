const request = require("supertest");
const server = require("../api/server");
const db = require("../database/dbConfig");

describe("auth test suite", () => {
    beforeAll(async () => {
        await db("users").truncate();
    });

    it("Register should return a 201 ok if username is available", () => {
        // We cleared the users table first to start with a clean slate
        return request(server).post("/api/auth/register").send({ "username": "whew", "password": "meh" })
        // First registration, should be ok
        .then(res => expect(res.status).toBe(201));
    })

    it("Register should return a 500 error if username is taken", () => {
        return request(server).post("/api/auth/register").send({ "username": "whew", "password": "meh" })
        // Trying to register again with the same username, should fail
        .then(res => expect(res.status).toBe(500));
    })

    it("Login should return a 200 ok if password is correct", () => {
        return request(server).post("/api/auth/login").send({ "username": "whew", "password": "meh" })
        // Trying to login with the correct password 'meh', should be ok
        .then(res => expect(res.status).toBe(200));
    })

    it("Login should return a 401 error if password is incorrect", () => {
        return request(server).post("/api/auth/login").send({ "username": "whew", "password": "mah" })
        // Trying to login with the wrong password 'mah', should fail
        .then(res => expect(res.status).toBe(401));
    })
});