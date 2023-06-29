const db = require('../db/connection')
const format = require('pg-format')


function selectAllTopics (req, res){
   return db.query('SELECT * FROM topics')
   .then(({rows})=>{
    return rows
   })
}

function selectArticleId (article_id) {
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

function selectAllArticles  () {
   return db.query('SELECT articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id ORDER BY created_at DESC;')
   .then(({rows})=>{
      return rows.map((rows)=>{
         rows.comment_count = +rows.comment_count
         return rows
      })
   })
}


     function selectArticleidComment (article_id){
         if(article_id === NaN){
            return Promise.reject({ status: 400, msg: 'Bad request'})
         }
      
         return db.query('SELECT * FROM comments WHERE article_id = $1', [article_id])
         .then(({rows})=>{
            return rows
         })
      
      
      }
     

      async function insertCommentToArticle(article_id, msg) {
        let { username, body } = msg;
        if (isNaN(article_id)) {
          return Promise.reject({ status: 400, msg: "Invalid Id" });
        }
        if (!username) {
          return Promise.reject({ status: 400, msg: "User not defined" });
        }
        username = username.toLowerCase();
   
        async function checkArticleIdAndUsernameExists(article_id, username) {
          const queryArticle_id = await db.query(
            "SELECT article_id FROM articles WHERE article_id = $1",
            [article_id]
          );
          const queryUsername = await db.query(
            "SELECT username FROM users WHERE username = $1",
            [username]
          );
          if (queryArticle_id.rows.length === 0) {
            return Promise.reject({ status: 404, msg: "Article not found" });
          }
          if (queryUsername.rows.length === 0) {
            return Promise.reject({ status: 404, msg: "User not found" });
          }
        }
      
        if (!body.length) {
          return Promise.reject({ status: 400, msg: "Invalid Request" });
        }
        const ifArticle_idAndUsernameExist = await checkArticleIdAndUsernameExists(
          article_id,
          username
        );
        if (ifArticle_idAndUsernameExist) {
          return ifArticle_idAndUsernameExist;
        }
      
        const result = await db.query(
          "INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING body;",
          [article_id, username, body]
        );
        const { rows } = result;
        return rows[0];
      }

      module.exports = { insertCommentToArticle, selectArticleidComment, selectAllArticles,  selectArticleId,  selectAllTopics}