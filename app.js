const express = require('express')
const { getTopics, getAllApi, getAllArticles } = require('./controllers/controller')


const app = express()

app.use(express())

app.get('/api/topics', getTopics)

app.get('/api', getAllApi)

app.get('/api/articles', getAllArticles)


module.exports = app