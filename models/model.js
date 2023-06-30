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
   
        if (!username) {
          return Promise.reject({ status: 400, msg: "User not defined" });
        }    
        if (!body.length) {
          return Promise.reject({ status: 400, msg: "Invalid Request" });
        }
      
        const result = await db.query(
          "INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *;",
          [article_id, username, body]
        );
        const { rows } = result;
        return rows[0];
      }


      
      function selectAllUsers (req, res){
         return db.query('SELECT * FROM users')
         .then(({rows})=>{
          return rows
         })
      }

      async function increaseVotes(article_id, incVotes) {
         async function check (article_id){
        const dbId = await db.query('SELECT * FROM articles WHERE article_id = $1', [article_id])
    
           if (dbId.rows.length === 0) {
             
             return Promise.reject({status: 404, msg: 'Not Found'})
           } else {
           
             const updatedVotes = dbId.rows[0].votes;
             return db.query('UPDATE articles SET votes = $1 WHERE article_id = $2 RETURNING *;', [updatedVotes + incVotes, article_id])
               .then(({ rows }) => {
                return rows
               })
           }
            }

            const articleExist = await check(article_id);
            return articleExist
         }

      
      
     function deleteComment(comment_id) {
       return db
       .query('DELETE FROM comments WHERE comment_id = $1', [comment_id])
       .then(({ rowCount }) => {
         if (rowCount === 0) {
           return Promise.reject({ status: 404, msg: 'Not Found' });
         } else {
      
           return { success: true };
         }
       });
    }

      module.exports = { insertCommentToArticle, selectArticleidComment, selectAllArticles,  selectArticleId,  selectAllTopics, selectAllUsers, deleteComment, increaseVotes}
