// C - CONTROLLER

// as operações de manipulação estão dentro do User (pois ele é um modelo do mongoose que está no outro arquivo)
// para validar senha bcrypt.compareSync(passwordToCompare, passwordOfDatabase) quando for logar e fazer autenticação

const User = require('../models/users')

const bcrypt = require('bcrypt')

const NotFoundError = require('../common/errors/NotFound')

exports.create = function (req, res, next) {

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

  user.save(function (err, userCreated) {
    if (err) {
      res.status(500).send({ errors: [err] })
      next(err)
    }
    res.send({ success: true, res: 'Usuário cadastrado com sucesso!', status: 200 })
  })
}


exports.getAll = function (req, res, next) {

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

  User.find(filters, function (err, users) {
    if (err) {
      res.status(500).json({ errors: [err] })
      next(err)
    }
    res.send(users)
  }).limit(req.query.limit).skip(req.query.skip)
}

exports.getById = function (req, res, next) {

  User.findById(req.params.id, function (err, user) {
    if (err) {
      res.status(500).json({ errors: [err] })
      next(err)
    }
    if (!user) {
      const error = new NotFoundError()
      error.httpStatusCode = 404
      res.status(error.httpStatusCode).json({ success: false, res: 'Usuário não encontrado', status: error.httpStatusCode })
      return next(error)
    }

    res.send(user)
  })
}


exports.update = function (req, res, next) {

  User.findByIdAndUpdate(req.params.id, { $set: req.body }, function (err, user) {
    if (err) {
      res.status(500).json({ errors: [err] })
      next(err)
    }
    if (!user) {
      const error = new NotFoundError()
      error.httpStatusCode = 404
      res.status(error.httpStatusCode).json({ success: false, res: 'Usuário não encontrado', status: error.httpStatusCode })
      return next(error)
    }
    res.send({ success: true, res: 'Usuário atualizado com sucesso!', status: 200 })
  })
}

exports.delete = function (req, res, next) {

  User.findByIdAndRemove(req.params.id, function (err, user) {
    if (err) {
      res.status(500).json({ errors: [err] })
      next(err)
    }
    if (!user) {
      const error = new NotFoundError()
      error.httpStatusCode = 404
      res.status(error.httpStatusCode).json({ success: false, res: 'Usuário não encontrado', status: error.httpStatusCode })
      return next(error)
    }
    res.send({ success: true, res: 'Usuário excluído com sucesso!', status: 200 })
  })
}

exports.count = function (req, res, next) {

  User.count({}, function (err, value) {
    if (err) {
      res.status(500).json({ errors: [err] })
      next(err)
    }
    if (!value) res.json({ success: false, res: 'Não existem usuários para serem contabilizados', status: 404 })
    res.json({ value })
  })
}

