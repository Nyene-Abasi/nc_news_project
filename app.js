const express = require('express')
const { getTopics, getAllApi } = require('./controllers/controller')


const app = express()
app.use(express())
app.get('/api/topics', getTopics)

app.get('/api', getAllApi)



module.exports = app