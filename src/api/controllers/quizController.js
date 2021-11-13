// C - CONTROLLER

const Quiz = require('../models/quizzes')
const Class = require('../models/classes')
const userTypesEnum = require('../common/enums/userTypes')

const NotFoundError = require('../common/errors/NotFound')
const UnanthorizedError = require('../common/errors/Unanthorized')
const InvalidOperationError = require('../common/errors/InvalidOperation')

exports.create = async function (req, res, next) {

  let quiz = new Quiz({
    description: req.body.description,
    questionType: req.body.questionType,
    answer: req.body.answer,
    coins: req.body.coins,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })

  const quizCreated = await quiz.save()

  if (quizCreated) res.send({ success: true, res: 'Pergunta cadastrada com sucesso!', status: 200 })
}

exports.getAll = async function (req, res, next) {

  let filters = {}, quizTypeToFilter, descriptionToFilter

  if (!!req.query.quizType) {
    quizTypeToFilter = req.query.quizType ? req.query.quizType : ''
    filters.questionType = {
      $regex: '.*' + quizTypeToFilter + '.*'
    }
  }

  if (!!req.query.description) {
    descriptionToFilter = req.query.description ? req.query.description : ''
    filters.description = {
      $regex: '.*' + descriptionToFilter + '.*'
    }
  }

  const quizzes = await Quiz.find(filters).limit(req.query.limit).skip(req.query.skip)
  
  res.send(quizzes || [])
}

exports.getById = async function (req, res, next) {

  const quiz = await Quiz.findById(req.params.id)

  if (!quiz) {
    const error = new NotFoundError()
    error.httpStatusCode = 404
    res.status(error.httpStatusCode).json({ success: false, res: 'Pergunta não encontrada', status: error.httpStatusCode })
    return next(error)
  }

  if (quiz) res.send(quiz)
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

  const quiz = await Quiz.findByIdAndUpdate(req.params.id, { $set: body })
  
  if (!quiz) {
    const error = new NotFoundError()
    error.httpStatusCode = 404
    res.status(error.httpStatusCode).json({ success: false, res: 'Pergunta não encontrada', status: error.httpStatusCode })
    return next(error)
  }

  if (quiz) res.send({ success: true, res: 'Pergunta atualizada com sucesso!', status: 200 })
}

exports.delete = async function (req, res, next) {

  // A verificação tem que ser feita com TODAS as aulas

  // const classToGet = await Class.findById(req.body.classId)

  // if (!classToGet) {
  //   const error = new NotFoundError()
  //   error.httpStatusCode = 404
  //   res.status(error.httpStatusCode).json({ success: false, res: 'Aula não encontrada', status: error.httpStatusCode })
  //   return next(error)
  // }

  // const quiz = await Quiz.findById(req.params.id)

  // if (!!(classToGet.quizzes.find(quiz => quiz._id.toString() === req.params.id)) && !!quiz) {
  //   const error = new InvalidOperationError()
  //   error.httpStatusCode = 400
  //   res.status(error.httpStatusCode).json({ success: false, res: 'Essa pergunta pertence a uma aula', status: error.httpStatusCode })
  //   return next(error)
  // }

  const quizDeleted = await Quiz.findByIdAndRemove(req.params.id)

  if (!quizDeleted) {
    const error = new NotFoundError()
    error.httpStatusCode = 404
    res.status(error.httpStatusCode).json({ success: false, res: 'Pergunta não encontrada', status: error.httpStatusCode })
    return next(error)
  }

  if (quizDeleted) res.send({ success: true, res: 'Pergunta excluída com sucesso!', status: 200 })
}

exports.count = async function (req, res, next) {

  const value = await Quiz.count({})

  if (!value) res.json({ success: false, res: 'Não existem perguntas para serem contabilizadas', status: 404 })
  
  if (value) res.json({ value })
}

