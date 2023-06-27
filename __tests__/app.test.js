const request = require('supertest')
const app = require('../app')
const db =require('../db/connection')
const data = require('../db/data/test-data')
const seed = require('../db/seeds/seed')
const endPoints = require('../endpoints.json')



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
})

describe('GET /api/topics', ()=>{
    test('404: responds with Not Found if passes a wrong path', ()=>{
        return request(app)
        .get('/api/banana')
        .expect(404)
        
       })
})

describe('GET /api', () => {
    test("should return a key value pairs of endpoint objects", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({body})=>{
          const { api } = body
          expect(api).toEqual
          for(let key in api){
            expect(api[key]).toHaveProperty("description",  expect.any(String));
            expect(api[key]).toHaveProperty("queries", expect.any(Array));
            expect(api[key]).toHaveProperty("format",   expect.any(String));
            expect(api[key]).toHaveProperty("exampleResponse", expect.any(Object));
          }
        })
  
    });
  });

  describe('GET /api/articles', ()=>{
    test('200: responds withan array of all article object', ()=>{
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body})=>{
            const { articles } = body
            expect(articles).toHaveLength(13)
            articles.forEach((article)=>{
              expect(article).toHaveProperty("article_id", expect.any(Number));
              expect(article).toHaveProperty("title", expect.any(String));
              expect(article).toHaveProperty("topic", expect.any(String));
              expect(article).toHaveProperty("author", expect.any(String));
              expect(article).toHaveProperty("body", expect.any(String));
              expect(article).toHaveProperty("created_at", expect.any(String));
              expect(article).toHaveProperty("votes", expect.any(Number));
              expect(article).toHaveProperty("article_img_url", expect.any(String));
            })
        })
    })
})