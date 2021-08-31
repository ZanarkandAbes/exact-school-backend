// C - CONTROLLER

const Topic = require('../models/topics')
const userTypesEnum = require('../common/enums/userTypes')

const NotFoundError = require('../common/errors/NotFound')
const UnanthorizedError = require('../common/errors/Unanthorized')

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

exports.createTopicAnswers = async function (req, res, next) {

  let topic = await Topic.findById(req.params.id)

  if (!topic) {
    const error = new NotFoundError()
    error.httpStatusCode = 404
    res.status(error.httpStatusCode).json({ success: false, res: 'Tópico não encontrado', status: error.httpStatusCode })
    return next(error)
  }

  let answer = { 
    topicAnswerId: topic.topicAnswers.length + 1, 
    userId: req.authUser.id,
    answer: req.body.answer, 
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  topic.topicAnswers.push(answer)

  let body = topic

  const topicResponse = await Topic.findByIdAndUpdate(req.params.id, { $set: body })
  
  if (topicResponse) res.send({ success: true, res: 'Resposta do tópico criada com sucesso!', status: 200 })
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

  let body = req.body

  body.updatedAt = new Date().toISOString()

  if (!(req.authUser.userType === userTypesEnum.ADMIN || req.authUser.id === req.params.id)){
    const error = new UnanthorizedError()
    error.httpStatusCode = 401
    res.status(401).send({ sucess: false, res: 'Sem permissão', status: error.httpStatusCode })
    return next(error)
  }

  const topic = await Topic.findByIdAndUpdate(req.params.id, { $set: body })

  if (!topic) {
    const error = new NotFoundError()
    error.httpStatusCode = 404
    res.status(error.httpStatusCode).json({ success: false, res: 'Tópico não encontrado', status: error.httpStatusCode })
    return next(error)
  }

  if (topic) res.send({ success: true, res: 'Tópico atualizado com sucesso!', status: 200 })
}

exports.updateTopicAnswers = async function (req, res, next) {

  let body = req.body

  body.updatedAt = new Date().toISOString()

  body.topicAnswers.map(topicAnswer => {
    if ((topicAnswer.topicAnswerId === req.body.answerId) && (topicAnswer.userId === req.authUser.id)){
      topicAnswer.answer = req.body.answer
      topicAnswer.updatedAt = new Date().toISOString()
    }
  })

  let topic = await Topic.findById(req.params.id)

  topic.topicAnswers.splice(topic.topicAnswers.indexOf({ topicAnswerId: req.body.answerId }), 1)

  topic.topicAnswers = [...topic.topicAnswers, ...body.topicAnswers]

  body.topicAnswers = topic.topicAnswers

  const topicResponse = await Topic.findByIdAndUpdate(req.params.id, { $set: body })

  if (!topicResponse) {
    const error = new NotFoundError()
    error.httpStatusCode = 404
    res.status(error.httpStatusCode).json({ success: false, res: 'Tópico não encontrado', status: error.httpStatusCode })
    return next(error)
  }

  if (topicResponse) res.send({ success: true, res: 'Resposta do tópico atualizada com sucesso!', status: 200 })
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

