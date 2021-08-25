// C - CONTROLLER

// as operações de manipulação estão dentro do Topic (pois ele é um modelo do mongoose que está no outro arquivo)
// para validar senha bcrypt.compareSync(passwordToCompare, passwordOfDatabase) quando for logar e fazer autenticação

const Topic = require('../models/topics')

const NotFoundError = require('../common/errors/NotFound')

exports.create = async function (req, res, next) {

  let topic = new Topic({
    userId: req.body.userId,
    title: req.body.title,
    description: req.body.description,
    tags: req.body.tags,
    topicAnswers: req.body.topicAnswers,
    topicType: req.body.topicType,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })

  const topicCreated = await topic.save()

  if (topicCreated) res.send({ success: true, res: 'Tópico cadastrado com sucesso!', status: 200 })
}

exports.getAll = async function (req, res, next) {

  let filters = {}, topicTypeToFilter, titleToFilter

  if (!!req.query.topicType) {
    topicTypeToFilter = req.query.topicType ? req.query.topicType : ''
    filters.topicType = {
      $regex: '.*' + topicTypeToFilter + '.*'
    }
  }

  if (!!req.query.title) {
    titleToFilter = req.query.title ? req.query.title : ''
    filters.title = {
      $regex: '.*' + titleToFilter + '.*'
    }
  }

  const topics = await Topic.find(filters).limit(req.query.limit).skip(req.query.skip)

  res.send(topics || [])
}

exports.getById = async function (req, res, next) {

  const topic = await Topic.findById(req.params.id)

  if (!topic) {
    const error = new NotFoundError()
    error.httpStatusCode = 404
    res.status(error.httpStatusCode).json({ success: false, res: 'Tópico não encontrado', status: error.httpStatusCode })
    return next(error)
  }

  res.send(topic)
}


exports.update = async function (req, res, next) {

  const topic = await Topic.findByIdAndUpdate(req.params.id, { $set: req.body })

  if (!topic) {
    const error = new NotFoundError()
    error.httpStatusCode = 404
    res.status(error.httpStatusCode).json({ success: false, res: 'Tópico não encontrado', status: error.httpStatusCode })
    return next(error)
  }

  if (topic) res.send({ success: true, res: 'Tópico atualizado com sucesso!', status: 200 })
}

exports.delete = async function (req, res, next) {

  const topic = await Topic.findByIdAndRemove(req.params.id)

  if (!topic) {
    const error = new NotFoundError()
    error.httpStatusCode = 404
    res.status(error.httpStatusCode).json({ success: false, res: 'Tópico não encontrado', status: error.httpStatusCode })
    return next(error)
  }

  if (topic) res.send({ success: true, res: 'Tópico excluído com sucesso!', status: 200 })
}

exports.count = async function (req, res, next) {

  const value = await Topic.count({})

  if (!value) res.json({ success: false, res: 'Não existem tópicos para serem contabilizados', status: 404 })

  if (value) res.json({ value })
}

