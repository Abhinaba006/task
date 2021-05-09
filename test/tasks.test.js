const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/tasks')
const { userOneId, user1, setupDataBase } = require('./fixtures/db')

beforeEach(setupDataBase)

test('Should create task for user', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', 'Bearer ' + user1.tokens[0].token)
        .send({
            description: "from my test"
        })
        .expect(200)

    // console.log(response.body[0]._id)
    const task = await Task.findById(response.body[0]._id)

    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)
})

test('should fetch the tasks', async() => {
    const response = await request(app)
    .get('/tasks')
    .set('Authorization', 'Bearer ' + user1.tokens[0].token)
    .send()
    .expect(200)

    expect(response.body.length).toEqual(2)
})

test('Should not delete other user data', async () => {
    await request(app)
    .delete('/tasks/${taskOneId}')
    .set('Authorization', 'Bearer ' + user1.tokens[0].token)
    .send()
    .expect(404)
})