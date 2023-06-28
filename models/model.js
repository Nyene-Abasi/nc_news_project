const db = require('../db/connection')
const format = require('pg-format')


exports.selectAllTopics = (req, res)=>{
   return db.query('SELECT * FROM topics')
   .then(({rows})=>{
    return rows
   })
}

exports.selectArticleId = (article_id) =>{
   return db.query('SELECT * FROM articles WHERE article_id = $1', [article_id])
   .then(({ rows })=>{
      
      if(rows.length !== 0){
         return rows[0]
     }
     else{
         return Promise.reject({status: 404, msg: "Not Found"})
     }
   })
}

exports.selectArticleidComment = (article_id) =>{
   return db.query('SELECT comments.comment_id, articles.body, articles.votes, articles.author, articles.created_at, articles.article_id FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id ORDER BY comments.created_at DESC WHERE articles.article_id = $1;', [article_id])

   .then(({ rows })=>{
      
      if(rows.length !== 0){
         return rows[0]
     }
     else{
         return Promise.reject({status: 404, msg: "Not Found"})
     }
   })
      }




