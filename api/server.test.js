const request = require("supertest")
const server = require('./server')
const db = require('../data/dbConfig')
// const bcrypt = require('bcryptjs')
const jwtDecode = require('jwt-decode')

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})

// I don't know why, but this for some reason breaks the code
// for some reason it makes a file/directory called scandir... I can find it anywhere...
// beforeEach(async () => {
//   await db.seed.run()
// })

afterAll(async () => {
  await db.destroy()
})

// Write your tests here
test('sanity', () => {
  expect(true).not.toBe(false)
})


describe('[POST] /api/auth/register', () => {
  test('responds with correct status', async () => {
    const res = await request(server).post('/api/auth/register').send({username: "heavy", password: "456123"})
    expect(res.status).toBe(201)
    expect(res.body.username).toBe('heavy')
  }, 750)
  test('responds with correct error and message if user already exists', async () => {
    await request(server)
    .post('/api/auth/register')
    .send({username: "boris", password: "1234"})
    const res = await request(server)
    .post('/api/auth/register')
    .send({username: "boris", password: "1234"})
    expect(res.status).toBe(400)
    expect(res.body.message).toBe("username taken")
  }, 750)
})
describe('[POST] /api/auth/login', () => {
  it('responds with corrcet message on valid user', async () => {
    const res = await request(server)
      .post('/api/auth/login')
      .send({ username: 'boris', password: '1234' })
    expect(res.body.message).toMatch(/welcome, boris/i)
    expect(res.status)
  }, 750)
  it('reponds with correct message on invalid cred', async () => {
    const res = await request(server)
      .post('/api/auth/login')
      .send({ username: 'boris', password: '1' })
    expect(res.body.message).toMatch(/Invaild Credentials/i)
    expect(res.status).toBe(401)
  }, 750)
  it("responds with a token with correct info", async () => {
    const res = await request(server)
    .post('/api/auth/login')
    .send({ username: 'boris', password: '1234' })
    const decoded = jwtDecode(res.body.token)
    expect(decoded).toHaveProperty('iat')
    expect(decoded).toHaveProperty('exp')
    expect(decoded).toMatchObject({
      subject: 2,
      username: 'boris',
    })
  })
})
describe('[GET] /api/jokes', () => {
  it("reponds with correct error and message", async () => {
    const res = await request(server)
      .get('/api/jokes')
    expect(res.body.message).toMatch(/token required/i)
  }, 750)
  it("request with a valid token obtain a list of jokes", async () => {
    let res = await request(server)
      .post('/api/auth/login')
      .send({ username: 'boris', password: '1234' })
    res = await request(server).get('/api/jokes').set('Authorization', res.body.token)
    expect(res.body).toMatchObject([
      {
          "id": "0189hNRf2g",
          "joke": "I'm tired of following my dreams. I'm just going to ask them where they are going and meet up with them later."
      },
      {
          "id": "08EQZ8EQukb",
          "joke": "Did you hear about the guy whose whole left side was cut off? He's all right now."
      },
      {
          "id": "08xHQCdx5Ed",
          "joke": "Why didn’t the skeleton cross the road? Because he had no guts."
      }
  ])
  }, 750)
})