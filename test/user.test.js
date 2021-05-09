const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/users')
const {userOneId, user1, setupDataBase} = require('./fixtures/db')

beforeEach(setupDataBase)

// afterEach(()=>{
//     console.log('after each')
// }) we also have before all

test('Sign up new user/ should pass', async () => {
    const response = await request(app).post('/users').send({
        name: "Abhinaba Das",
        email: "abhinaba006@gmail.com.com",
        password: "12345678"
    }).expect(201)

    // Assert that the database is changed correctly

    // console.log(response.body.result)

    const user = await User.findById(response.body.result._id)
    expect(user).not.toBeNull()

    // expect(response.body.result.name).toBe('Abhinaba Das')

    expect(response.body).toMatchObject({
        result: {
            name: "Abhinaba Das",
            email: "abhinaba006@gmail.com.com",
        },
        token: user.tokens[0].token
    })
})

test('update user', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', 'Bearer ' + user1.tokens[0].token)
        .send({
            "name": 'a'
        })
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user.name).toBe('a')
})



test('Should noy login non exsistent user', async () => {
    const response = await request(app).post('/users/login').send({
        email: "fuck@kdk.com",
        password: "asas"
    }).expect(400)

    const user = await User.findById(userOneId)
    expect(response.body.token).not.toBe(user.tokens[0].token)


})

test('Should noy login wrong password', async () => {
    await request(app).post('/users/login').send({
        email: user1.email,
        password: "asas"
    }).expect(400)
})

test('Login old user / pass ', async () => {
    await request(app).post('/users/login').send({
        email: user1.email,
        password: user1.password
    }).expect(200)
})

test('should get user profile authenticated', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', 'Bearer ' + user1.tokens[0].token)
        .send()
        .expect(200)
})

test('should not get user profile unauthenticated', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('should delete user profile authenticated', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', 'Bearer ' + user1.tokens[0].token)
        .send()
        .expect(200)
})

test('should not delete user profile unauthenticated', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('sholud upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', 'Bearer ' + user1.tokens[0].token)
        .attach('upload', 'test/fixtures/profile-pic.jpg')
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})
test('should not invalid update user', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', 'Bearer ' + user1.tokens[0].token)
        .send({
            "nasdsdme": 'a'
        })
        .expect(400)
})