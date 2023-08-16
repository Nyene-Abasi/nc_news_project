const db = require('../db/connection')
const format = require('pg-format')


function selectAllTopics (){
   return db.query('SELECT * FROM topics')
   .then(({rows})=>{
    return rows
   })
}

function selectArticleId (article_id) {
   return db.query('SELECT * FROM articles WHERE article_id = $1', [article_id])
   .then(( { rows } )=>{
      if(rows.length !== 0){
         return rows[0]
     }
     else{
         return Promise.reject({status: 404, msg: "Not Found"})
     }
   })
}

function selectAllArticles(topic, sort_by = "created_at", order = "desc") {
   const orderValues = ["desc", "asc"];
   const sortByValues = [
     "created_at",
     "topic",
     "article_id",
     "votes",
     "article_img_url",
     "comment_count",
     "author",
     "title",
   ];
   const queryArray = [];
   let query =
     "SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, COUNT(comment_id) AS comment_count FROM articles JOIN comments ON articles.article_id = comments.article_id ";
 
   if (topic) {
     queryArray.push(topic);
     query += `WHERE topic LIKE $1 `;
   }
   if (!sortByValues.includes(sort_by.toLowerCase())) {
     return Promise.reject({ status: 400, msg: "Bad Request: Invalid sort_by value" });
   }
   if (!orderValues.includes(order.toLowerCase())) {
     return Promise.reject({ status: 400, msg: "Bad Request: Invalid order value" });
   }
   query += `GROUP BY articles.article_id ORDER BY ${sort_by} ${order};`;
   return db.query(query, queryArray).then(({ rows }) => {
    
     return rows.map((row) => {
       row.votes = +row.votes;
       row.comment_count = +row.comment_count;
       return row;
     });
   });
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
      
      function insertCommentToArticle(article_id, msg) {
        let { username, body } = msg;
    
        if (!username) {
            return Promise.reject({ status: 400, msg: "User not defined" });
        }
        if (!body.length) {
            return Promise.reject({ status: 400, msg: "Invalid Request" });
        }
    
        return db.query(
            "INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *;",
            [article_id, username, body]
        )
        .then(result => {
          
            const { rows } = result;
            return rows[0];
        });
    }
    

      
      function selectAllUsers (){
         return db.query('SELECT * FROM users')
         .then(({rows})=>{
          return rows
         })
      }

      function increaseVotes(article_id, incVotes) {
        function check(article_id) {
          return db.query('SELECT * FROM articles WHERE article_id = $1', [article_id])
            .then((dbId) => {
              if (dbId.rows.length === 0) {
                return Promise.reject({ status: 404, msg: 'Not Found' });
              } else {
                const updatedVotes = dbId.rows[0].votes;
                return db.query('UPDATE articles SET votes = $1 WHERE article_id = $2 RETURNING *;', [updatedVotes + incVotes, article_id])
                  .then(({ rows }) => {
                    return rows;
                  });
              }
            });
        }
      
        return check(article_id);
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
