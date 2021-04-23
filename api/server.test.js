const request = require('supertest');
const db = require("../data/dbConfig.js");
const server = require('./server.js')

const weston = {
  name: "weston",
  password: "password"
}

const westonBad = {
  name: "weston",
  password: "wrongpassword"
}

beforeAll(async ()=>{
  await db.migrate.rollback()
  await db.migrate.latest()
})

beforeEach(async ()=>{
  await db("users").truncate()
})

afterAll(async ()=>{
  await db.destroy()
})

it('sanity', () => {
  expect(true).toBe(true)
})

describe("server tests", ()=>{
  describe("[GET] /jokes", ()=>{
    
    it("responds with a 200 ok", async ()=>{
      const res = await request(server).get("/jokes")
      expect(res.status).toBe(200)
    })
    
    it("returns correct number of jokes", async ()=>{
      const res = await request(server).get("/jokes")
      expect(res.body).toHaveLength(3)
    })
  })

  describe("[POST] /auth/register", ()=>{
    it('responds with a 201 ok', async ()=>{
      let res
      res = await request(server).post('/auth/register').send(weston)
      expect(res.status).toBe(201)
    })
    it('responds with newly created resource', async ()=>{
      let res
      res = await request(server).post('/auth/register').send(weston)
      expect(res.body).toMatchObject({id:1, ...weston})
    })
  })
  
  describe("[POST] /auth/login", ()=>{
    it('responds with a 200 ok', async ()=>{
      let res
      await request(server).post('/auth/register').send(weston)
      res = await request(server).post('/auth/login').send(weston)
      expect(res.status).toBe(200)
    })
    it('will not accept invalid credentials', async ()=>{
      let res
      await request(server).post('/auth/register').send(weston)
      res = await request(server).post('/auth/login').send(westonBad)
      expect(res.body).toMatchObject({message: `Invalid Credentials`})
    })
  })
})