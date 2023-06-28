const express = require('express')

const { getTopics, getAllApi, getArticleId, getArticleidComment } = require('./controllers/controller')

const {forCustomErrors, forPgErrors} = require('./error');



const app = express()
app.use(express())
app.get('/api/topics', getTopics)

app.get('/api', getAllApi)

app.get('/api/articles/:article_id', getArticleId)

app.get('/api/articles/:article_id/comments', getArticleidComment)


app.use(forCustomErrors);
app.use(forPgErrors);



module.exports = app