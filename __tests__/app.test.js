
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

  describe("GET /api/articles/:article_id", () => {
    test("200: should get an article by its id", () => {
      return request(app)
        .get("/api/articles/5")
        .expect(200)
        .then(({body})=>{
          const {article} = body
            expect(article).toHaveProperty("article_id", 5);
            expect(article).toHaveProperty("title", expect.any(String));
            expect(article).toHaveProperty("topic", expect.any(String));
            expect(article).toHaveProperty("author", expect.any(String));
            expect(article).toHaveProperty("body", expect.any(String));
            expect(article).toHaveProperty("created_at", expect.any(String));
            expect(article).toHaveProperty("votes", expect.any(Number));
            expect(article).toHaveProperty("article_img_url", expect.any(String));
        })
  
    });
    test("should return error with msg Not Found for request not in database", () => {
      return request(app)
        .get("/api/articles/99999999")
        .expect(404)
        .then(({body})=>{
          const {msg}= body
          expect(msg).toBe("Not Found")
        })
  
    });
    test("should return error with msg Invalid Input for wrong user input", () => {
      return request(app)
        .get("/api/articles/hello")
        .expect(400)
        .then(({body})=>{
          const {msg}= body
          expect(msg).toBe("Bad request")
        })
  
    });
  });

  describe('GET /api/articles', ()=>{
    test("should get an article by its id", () => {
      return request(app)
        .get("/api/articles/5")
        .expect(200)
        .then(({ body }) => {
          const { article } = body;
          expect(article).toHaveProperty("article_id", 5);
          expect(article).toHaveProperty("title", expect.any(String));
          expect(article).toHaveProperty("topic", expect.any(String));
          expect(article).toHaveProperty("author", expect.any(String));
          expect(article).toHaveProperty("body", expect.any(String));
          expect(article).toHaveProperty("created_at", expect.any(String));
          expect(article).toHaveProperty("votes", expect.any(Number));
          expect(article).toHaveProperty("article_img_url", expect.any(String));
        });
    })
    test('article should be ordered by dates in descending order',()=>{
      return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body})=>{ 
          const {articles} = body
          expect(articles).toBeSortedBy('created_at', { descending: true });
    })
  })

  })


  describe("GET /api/articles/:article_id/comments", () => {
    test("200: should get a comment by its id", () => {
      return request(app)
        .get("/api/articles/5/comments")
        .expect(200)
        .then(({body})=>{

          const {comments} = body

          comments.forEach((comment)=>{
            expect(comment).toHaveProperty("comment_id", expect.any(Number));
            expect(comment).toHaveProperty("body", expect.any(String));
            expect(comment).toHaveProperty("votes", expect.any(Number));
            expect(comment).toHaveProperty("author", expect.any(String));
            expect(comment).toHaveProperty("created_at", expect.any(String))
            expect(comment).toHaveProperty("article_id", expect.any(Number));
          })
        })
  
    });
    test("200: should return 200 for an empty array for request with no comments", () => {
      return request(app)
        .get("/api/articles/100/comments")
        .expect(200)
        .then(({body})=>{
          const {comments}= body
          expect(comments).toEqual([])
        })
  
    });
    test("should return error with msg Bad request when wrong id is passed", () => {
      return request(app)
        .get("/api/articles/wrong/comments")
        .expect(400)
        .then(({body})=>{
          const {msg}= body
          expect(msg).toBe("Bad request")
        })
  
    });
  });



  describe("POST: /api/articles/:article_id/comments", () => {
    test("201: should return the posted comment", () => {
      return request(app)
        .post("/api/articles/5/comments")
        .send({
          username: "rogersop",
          body: "I love NorthCoders",
        })
        .expect(201)
        .then(({ body }) => {
          const { comment } = body;
          expect(comment.body).toBe("I love NorthCoders");
        });
    });
    test("404: should return an error if user does not exist", () => {
      return request(app)
        .post("/api/articles/5/comments")
        .send({
          username: "Nyene",
          body: "Hello I am new Here",
        })
        .expect(404)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Not Found");
        });
    });
    test("404: should return an error if article does not exist", () => {
      return request(app)
        .post("/api/articles/9999/comments")
        .send({
          username: "rogersop",
          body: "I love NorthCoders",
        })
        .expect(404)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Not Found");
        });
    });

    test("400: should return an error if there is no username", () => {
      return request(app)
        .post("/api/articles/5/comments")
        .send({
          body: "I love NorthCoders",
        })
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("User not defined");
        });
    });
    
    test("201: should ignore additional properties to the post body", () => {
      return request(app)
        .post("/api/articles/5/comments")
        .send({
          username: "rogersop",
          body: "I love NorthCoders",
          likes: 5,
        })
        .expect(201)
        .then(({ body }) => {
          const { comment } = body;
          expect(comment.body).toBe("I love NorthCoders");
        });
    });
    test("should return an error if article_id is invalid", () => {
      return request(app)
        .post("/api/articles/noavalidid/comments")
        .send({
          username: "rogersop",
          body: "I love NorthCoders",
        })
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Bad request");
        });
    });
    
    test("should return an error with an empty body", () => {
      return request(app)
        .post("/api/articles/5/comments")
        .send({
          username: "Nyene",
          body: "",
        })
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Invalid Request");
        });
      })

    });
    
    describe('GET /api/users', ()=>{
      test('200: responds withan array of all users object', ()=>{
          return request(app)
          .get('/api/users')
          .expect(200)
          .then(({body})=>{
              const { users } = body
              expect(users).toHaveLength(4)
              users.forEach((user)=>{
                  expect(user).toHaveProperty('username', expect.any(String))
                  expect(user).toHaveProperty('name', expect.any(String))
                  expect(user).toHaveProperty('avatar_url', expect.any(String))
              })
          })
      })
    })

    describe('PATCH: /api/articles/4', ()=>{
      test('200: should increase vote count', ()=>{
        return request(app)
        .patch("/api/articles/4")
        .send({incVotes: 3})
        .expect(200)
        .then(({body})=>{
          const {article} = body
          expect(article.votes).toBe(3)
        })
      })
      test('400: should return Bad request for non integer type', ()=>{
        return request(app)
        .patch("/api/articles/banana")
        .send({incVotes: 3})
        .expect(400)
        .then(({body})=>{
          const {msg} = body
          expect(msg).toBe('Bad request')
        })
      })
      test('400: should return error if property to be added is wronng', ()=>{
        return request(app)
        .patch("/api/articles/12")
        .send({snacks: 3})
        .expect(400)
        .then(({body})=>{
          const {msg} = body
          expect(msg).toBe('Bad request')
        })
      })
      test('404: should return not found if article does not exist', ()=>{
        return request(app)
        .patch("/api/articles/5555")
        .send({incVotes: -3})
        .expect(404)
        .then(({body})=>{
          const {msg} = body
          expect(msg).toBe('Not Found')
        })
      })

      test('400: should return error if property is not a number', ()=>{
        return request(app)
        .patch("/api/articles/12")
        .send({snacks: 'three votes'})
        .expect(400)
        .then(({body})=>{
          const {msg} = body
          expect(msg).toBe('Bad request')
        })
      })
      test('200: should return the new patched article', ()=>{
        return request(app)
        .patch("/api/articles/4")
        .send({incVotes: 3})
        .expect(200)
        .then(({body})=>{
          
          const {article} = body
          expect(article).toHaveProperty("article_id", 4);
          expect(article).toHaveProperty("title", expect.any(String));
          expect(article).toHaveProperty("topic", expect.any(String));
          expect(article).toHaveProperty("author", expect.any(String));
          expect(article).toHaveProperty("created_at", expect.any(String));
          expect(article).toHaveProperty("votes", 3);
          expect(article).toHaveProperty("article_img_url", expect.any(String));
        })
      })

      test('200: should decrease the votes by decremented amount', ()=>{
        return request(app)
        .patch("/api/articles/1")
        .send({incVotes: -5})
        .expect(200)
        .then(({body})=>{
          const { article } = body
          expect(article.votes).toBe(95)
         
        })
      })
    
    })
    describe('204: DELETE /api/comments/:comment_id should delete comment', ()=>{
      test('204: should delete the given comment by comment_id', () => {
        return request(app)
          .delete('/api/comments/2')
          .expect(204)
          .then((res) => {
            expect(res.statusCode).toBe(204);
            expect(res.body).toEqual({});
          });
      });

          test('400: should return error if comment_id is NaN ', () =>{
            return request(app)
              .delete('/api/comments/banana')
              .expect(400)
              .then((res)=>{
               expect(res.statusCode).toBe(400);
              expect(res.body.msg).toBe('Bad request');  
              })
        })

        test('404: should return error if comment_id does not exist ', () =>{
          return request(app)
            .delete('/api/comments/9999')
            .expect(404)
            .then((res)=>{
            
              expect(res.statusCode).toBe(404);
              expect(res.body.msg).toBe('Not Found');
            })
      })

      })


      describe("200: /api/articles?Queries", () => {
        test("should order articles by default descending", () => {
          return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body }) => {
              const { articles } = body;
              expect(articles).toBeSorted({
                key: "created_at",
                descending: true,
              });
            });
        });
        test("should order articles by descending when specified", () => {
          return request(app)
            .get("/api/articles?order=DESC")
            .expect(200)
            .then(({ body }) => {
              const { articles } = body;
              expect(articles).toBeSorted({
                key: "created_at",
                descending: true,
              });
            });
        });
        test("should order articles by ascending", () => {
          return request(app)
            .get("/api/articles?order=ASC")
            .expect(200)
            .then(({ body }) => {
              const { articles } = body;
              expect(articles).toBeSorted({
                key: "created_at",
                ascending: true,
              });
            });
        });
        describe("suite of test for sort_by", () => {
          test("should allow user sort by topic", () => {
            return request(app)
              .get("/api/articles?sort_by=topic")
              .expect(200)
              .then(({ body }) => {
                const { articles } = body;
                expect(articles).toBeSorted({
                  key: "topic",
                  descending: true,
                });
              });
          });
          test("should allow user sort by article_id", () => {
            return request(app)
              .get("/api/articles?sort_by=article_id")
              .expect(200)
              .then(({ body }) => {
                const { articles } = body;
                articles;
                expect(articles).toBeSorted({
                  key: "article_id",
                  descending: true,
                });
              });
          });
          test("should allow user sort by votes", () => {
            return request(app)
              .get("/api/articles?sort_by=votes")
              .expect(200)
              .then(({ body }) => {
                const { articles } = body;
                expect(articles).toBeSorted({
                  key: "votes",
                  descending: true,
                });
              });
          });
          test("should allow user sort by article_img_url", () => {
            return request(app)
              .get("/api/articles?sort_by=article_img_url")
              .expect(200)
              .then(({ body }) => {
                const { articles } = body;
                expect(articles).toBeSorted({
                  key: "article_img_url",
                  descending: true,
                });
              });
          });
          test("should allow user sort by comment_count", () => {
            return request(app)
              .get("/api/articles?sort_by=comment_count")
              .expect(200)
              .then(({ body }) => {
                const { articles } = body;
                expect(articles).toBeSorted({
                  key: "comment_count",
                  descending: true,
                });
              });
          });
          test("should allow user sort by author", () => {
            return request(app)
              .get("/api/articles?sort_by=author")
              .expect(200)
              .then(({ body }) => {
                const { articles } = body;
                expect(articles).toBeSorted({
                  key: "author",
                  descending: true,
                });
              });
          });
          test("should allow user sort by title", () => {
            return request(app)
              .get("/api/articles?sort_by=title")
              .expect(200)
              .then(({ body }) => {
                const { articles } = body;
                expect(articles).toBeSorted({
                  key: "title",
                  descending: true,
                });
              });
          });
        });
        test('should get articles by topic "cats"', () => {
          return request(app)
            .get("/api/articles?topic=cats")
            .expect(200)
            .then(({ body }) => {
              const { articles } = body;
              articles.forEach((article) => {
                expect(article.topic).toBe("cats");
              });
            });
        });
        test("400 should return error for invalid sort query", () => {
          return request(app).get("/api/articles?sort_by=Bats").expect(400);
        });
        test("400 should return error for invalid order query", () => {
          return request(app).get("/api/articles?order=Banana").expect(400);
        });
        
      })



    
   
