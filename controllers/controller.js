const { selectAllTopics, selectArticleId, selectArticleidComment } = require('../models/model')
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

exports.getArticleId =(req, res, next) =>{
    const { article_id } = req.params
    selectArticleId(article_id)
    .then((result)=>{
        res.status(200).send({article: result})
    }).catch((err)=>{
        next(err)
    })
}

exports.getArticleidComment = (req, res, next) =>{
    const { article_id } = req.params
    selectArticleidComment(article_id).then((result)=>{
        res.status(200).send({article: result})
    }).catch((err)=>{
        next(err)
    })
}
