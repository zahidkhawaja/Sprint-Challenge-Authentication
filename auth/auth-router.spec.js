const request = require("supertest");
const server = require("../api/server");
const db = require("../database/dbConfig");

describe("auth test suite", () => {
    beforeAll(async () => {
        await db("users").truncate();
    });
    it("Register should return a 201 status if username is available", () => {
        // We cleared the users table first. Therefore, this registration should be successful
        return request(server).post("/api/auth/register").send({ "username": "whew", "password": "meh" })
        .then(res => expect(res.status).toBe(201));
    })
    it("Register should return a 500 status if username is taken", () => {
        return request(server).post("/api/auth/register").send({ "username": "whew", "password": "meh" })
        .then(res => expect(res.status).toBe(500));
    })});