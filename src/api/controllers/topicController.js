// C - CONTROLLER

// as operações de manipulação estão dentro do Topic (pois ele é um modelo do mongoose que está no outro arquivo)
// para validar senha bcrypt.compareSync(passwordToCompare, passwordOfDatabase) quando for logar e fazer autenticação

const Topic = require('../models/topics')

const NotFoundError = require('../common/errors/NotFound')

exports.create = function (req, res, next) {

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

  topic.save(function (err, topicCreated) {
    if (err) {
      res.status(500).send({ errors: [err] })
      next()
    }
    res.send({ success: true, res: 'Tópico cadastrado com sucesso!', status: 200 })
  })
}

exports.getAll = function (req, res, next) {

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

  Topic.find(filters, function (err, topics) {
    if (err) {
      res.status(500).json({ errors: [err] })
      next()
    }
    res.send(topics)
  }).limit(req.query.limit).skip(req.query.skip)
}

exports.getById = function (req, res, next) {

  Topic.findById(req.params.id, function (err, topic) {
    if (err) {
      res.status(500).json({ errors: [err] })
      next()
    }
    if (!topic) {
      const error = new NotFoundError()
      error.httpStatusCode = 404
      res.status(error.httpStatusCode).json({ success: false, res: 'Tópico não encontrado', status: error.httpStatusCode })
      return next(error)
    }

    res.send(topic)
  })
}


exports.update = function (req, res, next) {

  Topic.findByIdAndUpdate(req.params.id, { $set: req.body }, function (err, topic) {
    if (err) {
      res.status(500).json({ errors: [err] })
      next()
    }
    if (!topic) {
      const error = new NotFoundError()
      error.httpStatusCode = 404
      res.status(error.httpStatusCode).json({ success: false, res: 'Tópico não encontrado', status: error.httpStatusCode })
      return next(error)
    }
    res.send({ success: true, res: 'Tópico atualizado com sucesso!', status: 200 })
  })
}

exports.delete = function (req, res, next) {

  Topic.findByIdAndRemove(req.params.id, function (err, topic) {
    if (err) {
      res.status(500).json({ errors: [err] })
      next()
    }
    if (!topic) {
      const error = new NotFoundError()
      error.httpStatusCode = 404
      res.status(error.httpStatusCode).json({ success: false, res: 'Tópico não encontrado', status: error.httpStatusCode })
      return next(error)
    }
    res.send({ success: true, res: 'Tópico excluído com sucesso!', status: 200 })
  })
}

exports.count = function (req, res, next) {

  Topic.count({}, function (err, value) {
    if (err) {
      res.status(500).json({ errors: [err] })
      next()
    }
    if (!value) res.json({ success: false, res: 'Não existem tópicos para serem contabilizados', status: 404 })
    res.json({ value })
  })
}

