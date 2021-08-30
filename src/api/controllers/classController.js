// C - CONTROLLER

const Class = require('../models/classes')
const userTypesEnum = require ('../common/enums/userTypes')

const NotFoundError = require('../common/errors/NotFound')
const UnanthorizedError = require('../common/errors/Unanthorized')

exports.create = async function (req, res, next) {

  let classToCreate = new Class({
    topicId: req.body.topicId,
    userId: req.body.userId,
    title: req.body.title,
    videoUrl: req.body.videoUrl,
    classType: req.body.classType,
    quiz: req.body.quiz,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })

  const classCreated = await classToCreate.save()

  if (classCreated) res.send({ success: true, res: 'Aula cadastrada com sucesso!', status: 200 })
}

exports.getAll = async function (req, res, next) {

  let filters = {}, classTypeToFilter, titleToFilter

  if (!!req.query.classType) {
    classTypeToFilter = req.query.classType ? req.query.classType : ''
    filters.classType = {
      $regex: '.*' + classTypeToFilter + '.*'
    }
  }

  if (!!req.query.title) {
    titleToFilter = req.query.title ? req.query.title : ''
    filters.title = {
      $regex: '.*' + titleToFilter + '.*'
    }
  }

  const classes = await Class.find(filters).limit(req.query.limit).skip(req.query.skip)
  
  res.send(classes || [])
}

exports.getById = async function (req, res, next) {

  const classToGet = await Class.findById(req.params.id)

  if (!classToGet) {
    const error = new NotFoundError()
    error.httpStatusCode = 404
    res.status(error.httpStatusCode).json({ success: false, res: 'Aula não encontrada', status: error.httpStatusCode })
    return next(error)
  }

  if (classToGet) res.send(classToGet)
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

  const classToUpdate = await Class.findByIdAndUpdate(req.params.id, { $set: body })
  
  if (!classToUpdate) {
    const error = new NotFoundError()
    error.httpStatusCode = 404
    res.status(error.httpStatusCode).json({ success: false, res: 'Aula não encontrada', status: error.httpStatusCode })
    return next(error)
  }

  if (classToUpdate) res.send({ success: true, res: 'Aula atualizada com sucesso!', status: 200 })
}

exports.delete = async function (req, res, next) {

  if (!(req.authUser.userType === userTypesEnum.ADMIN || req.authUser.id === req.params.id)){
    const error = new UnanthorizedError()
    error.httpStatusCode = 401
    res.status(401).send({ sucess: false, res: 'Sem permissão', status: error.httpStatusCode })
    return next(error)
  }

  const classToDelete = await Class.findByIdAndRemove(req.params.id)

  if (!classToDelete) {
    const error = new NotFoundError()
    error.httpStatusCode = 404
    res.status(error.httpStatusCode).json({ success: false, res: 'Aula não encontrada', status: error.httpStatusCode })
    return next(error)
  }

  if (classToDelete) res.send({ success: true, res: 'Aula excluída com sucesso!', status: 200 })
}

exports.count = async function (req, res, next) {

  const value = await Class.count({})

  if (!value) res.json({ success: false, res: 'Não existem aulas para serem contabilizadas', status: 404 })
  
  if (value) res.json({ value })
}

