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

exports.selectAllArticles = () =>{
   return db.query('SELECT articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id ORDER BY created_at DESC;')
   .then(({rows})=>{
      return rows.map((rows)=>{
         rows.comment_count = +rows.comment_count
         return rows
      })
   })
}

exports.selectArticleidComment = (article_id) =>{
   if(article_id === NaN){
      return Promise.reject({ status: 400, msg: 'Bad request'})
   }

   return db.query('SELECT * FROM comments WHERE article_id = $1', [article_id])
   .then(({rows})=>{
      return rows
   })


}
