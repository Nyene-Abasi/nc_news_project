const db = require('../db/connection')
const format = require('pg-format')


exports.selectAllTopics = (req, res)=>{
   return db.query('SELECT * FROM topics')
   .then(({rows})=>{
    return rows
   })
}

exports.selectAllArticles = (req, res) =>{
   return db.query('SELECT article_id, title, topic, author, created_at, votes, article_img_url FROM articles')
   .then(({rows})=>{
    return rows
   })
}
