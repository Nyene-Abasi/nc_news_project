const db = require('../db/connection')
const format = require('pg-format')


exports.selectAllTopics = (req, res)=>{
   return db.query('SELECT * FROM topics')
   .then(({rows})=>{
    return rows
   })
}

exports.selectAllArticles = (req, res) =>{
   return db.query('SELECT * FROM articles')
   .then(({rows})=>{
    return rows
   })
}