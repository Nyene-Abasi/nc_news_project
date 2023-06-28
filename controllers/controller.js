const { selectAllTopics, selectAllArticles } = require('../models/model')
const endPoints = require('../endpoints.json')



exports.getTopics = (req, res, next) => {
    selectAllTopics().then((topics)=>{
        res.status(200).send({topics})
    }) .catch((err)=>{
        next(err)
    })
}


exports.getAllApi = (req, res) => {
    res.status(200).send({api: endPoints})
}

exports.getAllArticles = (req, res, next)=>{
    selectAllArticles()
    .then((articles)=>{
        res.status(200).send({articles})
    }).catch((err)=>{
        next(err)
    })
}
