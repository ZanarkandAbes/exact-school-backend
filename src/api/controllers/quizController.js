// C - CONTROLLER

// as operações de manipulação estão dentro do Quiz (pois ele é um modelo do mongoose que está no outro arquivo)
// para validar senha bcrypt.compareSync(passwordToCompare, passwordOfDatabase) quando for logar e fazer autenticação

const Quiz = require('../models/quizzes')

const NotFoundError = require('../common/errors/NotFound')

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

  const quiz = await Quiz.findByIdAndRemove(req.params.id)

  if (!quiz) {
    const error = new NotFoundError()
    error.httpStatusCode = 404
    res.status(error.httpStatusCode).json({ success: false, res: 'Pergunta não encontrada', status: error.httpStatusCode })
    return next(error)
  }

  if (quiz) res.send({ success: true, res: 'Pergunta excluída com sucesso!', status: 200 })
}

exports.count = async function (req, res, next) {

  const value = await Quiz.count({})

  if (!value) res.json({ success: false, res: 'Não existem perguntas para serem contabilizadas', status: 404 })
  
  if (value) res.json({ value })
}

