// C - CONTROLLER

// as operações de manipulação estão dentro do Badge (pois ele é um modelo do mongoose que está no outro arquivo)
// para validar senha bcrypt.compareSync(passwordToCompare, passwordOfDatabase) quando for logar e fazer autenticação

const Badge = require('../models/badges')

const NotFoundError = require('../common/errors/NotFound')

exports.create = async function (req, res, next) {

  let badge = new Badge({
    name: req.body.name,
    price: req.body.price,
    badgeType: req.body.badgeType,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })

  const badgeCreated = await badge.save()

  if (badgeCreated) res.send({ success: true, res: 'Medalha cadastrada com sucesso!', status: 200 })
}

exports.getAll = async function (req, res, next) {

  let filters = {}, badgeTypeToFilter, nameToFilter

  if (!!req.query.badgeType) {
    badgeTypeToFilter = req.query.badgeType ? req.query.badgeType : ''
    filters.badgeType = {
      $regex: '.*' + badgeTypeToFilter + '.*'
    }
  }

  if (!!req.query.name) {
    nameToFilter = req.query.name ? req.query.name : ''
    filters.name = {
      $regex: '.*' + nameToFilter + '.*'
    }
  }

  const badges = await Badge.find(filters).limit(req.query.limit).skip(req.query.skip)
  
  res.send(badges || [])
}

exports.getById = async function (req, res, next) {

  const badge = await Badge.findById(req.params.id)

  if (!badge) {
    const error = new NotFoundError()
    error.httpStatusCode = 404
    res.status(error.httpStatusCode).json({ success: false, res: 'Medalha não encontrada', status: error.httpStatusCode })
    return next(error)
  }

  if (badge) res.send(badge)
}


exports.update = async function (req, res, next) {

  let body = req.body

  body.updatedAt = new Date().toISOString()

  const badge = await Badge.findByIdAndUpdate(req.params.id, { $set: body })
  
  if (!badge) {
    const error = new NotFoundError()
    error.httpStatusCode = 404
    res.status(error.httpStatusCode).json({ success: false, res: 'Medalha não encontrada', status: error.httpStatusCode })
    return next(error)
  }

  if (badge) res.send({ success: true, res: 'Medalha atualizada com sucesso!', status: 200 })
}

exports.delete = async function (req, res, next) {

  const badge = await Badge.findByIdAndRemove(req.params.id)

  if (!badge) {
    const error = new NotFoundError()
    error.httpStatusCode = 404
    res.status(error.httpStatusCode).json({ success: false, res: 'Medalha não encontrada', status: error.httpStatusCode })
    return next(error)
  }

  if (badge) res.send({ success: true, res: 'Medalha excluída com sucesso!', status: 200 })
}

exports.count = async function (req, res, next) {

  const value = await Badge.count({})

  if (!value) res.json({ success: false, res: 'Não existem medalhas para serem contabilizadas', status: 404 })
  
  if (value) res.json({ value })
}

