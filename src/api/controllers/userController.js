// C - CONTROLLER

const User = require('../models/users')
const Badge = require('../models/badges')
const userTypesEnum = require('../common/enums/userTypes')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const NotFoundError = require('../common/errors/NotFound')
const UnanthorizedError = require('../common/errors/Unanthorized')
const InvalidOperationError = require('../common/errors/InvalidOperation')
const ConflictError = require('../common/errors/Conflict')

exports.login = async function (req, res, next) {

  const user = await User.findOne({ email: req.body.email })

  if (!user) {
    const error = new UnanthorizedError()
    error.httpStatusCode = 401
    res.status(error.httpStatusCode).json({ success: false, res: 'Falha na autenticação', status: error.httpStatusCode })
    return next(error)
  }

  const comparePasswords = await bcrypt.compare(req.body.password, user.password)

  if (comparePasswords) {
    const token = jwt.sign({
      id: user._id,
      email: user.email,
      name: user.name,
      birthDay: user.birthDay,
      userType: user.userType,
      badges: user.badges,
      totalCoins: user.totalCoins
    },
      process.env.JWT_SECRET,
      {
        expiresIn: '8h'
      }
    )

    res.send({ token: token, success: true, res: 'Autenticado com sucesso!', status: 200 })
  } else {
    const error = new UnanthorizedError()
    error.httpStatusCode = 401
    res.status(error.httpStatusCode).json({ success: false, res: 'Falha na autenticação', status: error.httpStatusCode })
  }
}

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

exports.createUserBadges = async function (req, res, next) {

  const user = await User.findById(req.params.id)

  if (!user) {
    const error = new NotFoundError()
    error.httpStatusCode = 404
    res.status(error.httpStatusCode).json({ success: false, res: 'Usuário não encontrado', status: error.httpStatusCode })
    return next(error)
  }

  const badge = await Badge.findById(req.body.badgeId)

  if (!badge) {
    const error = new NotFoundError()
    error.httpStatusCode = 404
    res.status(error.httpStatusCode).json({ success: false, res: 'Medalha não encontrada', status: error.httpStatusCode })
    return next(error)
  }

  if (!(user.totalCoins >= badge.price)) {
    const error = new InvalidOperationError()
    error.httpStatusCode = 400
    res.status(error.httpStatusCode).json({ success: false, res: 'Dinheiro insuficiente para comprar a medalha', status: error.httpStatusCode })
    return next(error)
  }

  if (!!user.badges.find(badge => badge._id.toString() === req.body.badgeId)) {
    const error = new ConflictError()
    error.httpStatusCode = 409
    res.status(error.httpStatusCode).json({ success: false, res: 'Essa medalha já pertence a esse usuário', status: error.httpStatusCode })
    return next(error)
  }

  user.badges.push(badge)

  user.totalCoins = user.totalCoins - badge.price

  let body = user

  const userResponse = await User.findByIdAndUpdate(req.params.id, { $set: body })
  
  if (userResponse) res.send({ success: true, res: 'Medalha do usuário comprada com sucesso!', status: 200 })
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

  if (!(req.authUser.userType === userTypesEnum.ADMIN || req.authUser.id === req.params.id)){
    const error = new UnanthorizedError()
    error.httpStatusCode = 401
    res.status(401).send({ sucess: false, res: 'Sem permissão', status: error.httpStatusCode })
    return next(error)
  }

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

