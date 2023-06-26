const request = require('supertest')
const app = require('../app')
const db =require('../db/connection')
const data = require('../db/data/test-data')
const seed = require('../db/seeds/seed')

beforeEach(()=>{
   return seed(data) 
})

afterAll(()=>{
    if(db.end)db.end()
})


describe('GET /api/topics', ()=>{
    test('200: responds withan array of all topics object', ()=>{
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({body})=>{
            const { topics } = body
            expect(topics).toHaveLength(3)
            topics.forEach((topic)=>{
                expect(topic).toHaveProperty('description', expect.any(String))
                expect(topic).toHaveProperty('slug', expect.any(String))
            })
        })
    })
   test('404: responds with Not Found if passes a wrong path', ()=>{
    return request(app)
    .get('/api/banana')
    .expect(404)
    
   })
})
