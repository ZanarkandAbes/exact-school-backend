// C - CONTROLLER

// as operações de manipulação estão dentro do User (pois ele é um modelo do mongoose que está no outro arquivo)
// para validar senha bcrypt.compareSync(passwordToCompare, passwordOfDatabase) quando for logar e fazer autenticação

const User = require('../models/users')

const bcrypt = require('bcrypt')

const NotFoundError = require('../common/errors/NotFound')

exports.create = async function (req, res, next) {

  const salt = bcrypt.genSaltSync(10)
  const encryptedHashPassword = bcrypt.hashSync(req.body.password, salt)

  let user = new User({
    email: req.body.email,
    password: encryptedHashPassword,
    name: req.body.name,
    birthDay: req.body.birthDay,
    userType: req.body.userType,
    badges: req.body.badges,
    totalCoins: req.body.totalCoins,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })

  const userCreated = await user.save()

  if (userCreated) res.send({ success: true, res: 'Usuário cadastrado com sucesso!', status: 200 })
}

exports.getAll = async function (req, res, next) {

  let filters = {}, emailToFilter, nameToFilter

  if (!!req.query.email) {
    emailToFilter = req.query.email ? req.query.email : ''
    filters.email = {
      $regex: '.*' + emailToFilter + '.*'
    }
  }

  if (!!req.query.name) {
    nameToFilter = req.query.name ? req.query.name : ''
    filters.name = {
      $regex: '.*' + nameToFilter + '.*'
    }
  }

  const users = await User.find(filters).limit(req.query.limit).skip(req.query.skip)

  res.send(users || [])
}

exports.getById = async function (req, res, next) {

  const user = await User.findById(req.params.id)

  if (!user) {
    const error = new NotFoundError()
    error.httpStatusCode = 404
    res.status(error.httpStatusCode).json({ success: false, res: 'Usuário não encontrado', status: error.httpStatusCode })
    return next(error)
  }

  if (user) res.send(user)
}


exports.update = async function (req, res, next) {

  let body = req.body

  body.updatedAt = new Date().toISOString()

  const user = await User.findByIdAndUpdate(req.params.id, { $set: body })

  if (!user) {
    const error = new NotFoundError()
    error.httpStatusCode = 404
    res.status(error.httpStatusCode).json({ success: false, res: 'Usuário não encontrado', status: error.httpStatusCode })
    return next(error)
  }

  if (user) res.send({ success: true, res: 'Usuário atualizado com sucesso!', status: 200 })
}

exports.delete = async function (req, res, next) {

  const user = await User.findByIdAndRemove(req.params.id)

  if (!user) {
    const error = new NotFoundError()
    error.httpStatusCode = 404
    res.status(error.httpStatusCode).json({ success: false, res: 'Usuário não encontrado', status: error.httpStatusCode })
    return next(error)
  }

  if (user) res.send({ success: true, res: 'Usuário excluído com sucesso!', status: 200 })
}

exports.count = async function (req, res, next) {

  const value = await User.count({})

  if (!value) res.json({ success: false, res: 'Não existem usuários para serem contabilizados', status: 404 })

  if (value) res.json({ value })
}

