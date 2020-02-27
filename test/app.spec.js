const { expect } = require('chai')
const supertest = require('supertest')
const app = require('../src/app')
const knex = require('knex')

const testPost = {
  title: 'test post',
  content: 'test content',
  date_posted: '2020-01-15T01:11:43.234Z'
}

const testPatch = {
  content: 'test patching content'
}

const testComment = {
  content: 'test comment content',
  date_posted: '2020-01-15T01:11:43.234Z',
  post_id: 1
}

// tests for all endpoint functionality coded in routers for comments, posts, and topics
describe('App', () => {
  let db 
  before(() => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('clean the table', () => db.raw('TRUNCATE posts, comments, topics RESTART IDENTITY CASCADE'))

  afterEach('cleanup', () => db.raw('TRUNCATE posts, comments, topics RESTART IDENTITY CASCADE'))
  
  
  it('GET / responds with 200 containing "Hello, world!"', () => {
    return supertest(app)
      .get('/')
      .expect(200, 'Hello, world!')
  })

  it('GET /api/posts responds with 200', () => {
    return supertest(app)
      .get('/api/posts')
      .expect(200)
  })

  it('POST /api/posts/ responds with 201', () => {
    return supertest(app)
      .post('/api/posts')
      .send(testPost)
      .set('Accept', 'application/json')
      .expect('Content-type', /json/)
      .expect(201)
  })

context('test deleting and patching posts', () => {
  beforeEach('insert post', () => {
    return db.into('posts').insert(testPost)
  })

  it('PATCH /api/posts/:post_id responds with 204', () => {
    return supertest(app)
      .patch(`/api/posts/1`)
      .set('Content-type', 'application/json')
      .send(testPatch)
      .expect(204)
  })

  it('DELETE /api/posts/:post_id responds with 200', () => {
    return supertest(app)
      .delete(`/api/posts/1`)
      .expect(204)
  })

  it('POST /api/comments responds with 201', () => {
    return supertest(app)
      .post('/api/comments')
      .send(testComment)
      .set('Accept', 'application/json')
      .expect('Content-type', /json/)
      .expect(201)
  })
})

  it('GET /api/comments responds with 200', () => {
    return supertest(app)
      .get('/api/comments')
      .expect(200)
  })

context('testing delete and patch for comments', () => {
  beforeEach('insert post', () => {
    return db.into('posts').insert(testPost)
  })
  beforeEach('insert comment', () => {
    return db.into('comments').insert(testComment)
  })
  
  it('DELETE /api/comments/:comment_id responds with 204', () => {
    return supertest(app)
      .delete(`/api/comments/1`)
      .expect(204)
  })

  it('PATCH /api/comments/:comment_id responds with 204', () => {
    return supertest(app)
      .patch(`/api/comments/1`)
      .send(testPatch)
      .expect(204)
  })
})

  it('GET /api/topics responds with 200', () => {
    return supertest(app)
      .get('/api/topics')
      .expect(200)
  })
})