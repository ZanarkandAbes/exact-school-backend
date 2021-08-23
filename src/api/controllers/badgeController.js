// C - CONTROLLER

// as operações de manipulação estão dentro do Badge (pois ele é um modelo do mongoose que está no outro arquivo)
// para validar senha bcrypt.compareSync(passwordToCompare, passwordOfDatabase) quando for logar e fazer autenticação

const Badge = require('../models/badges')

const NotFoundError = require('../common/errors/NotFound')

exports.create = function (req, res, next) {

  let badge = new Badge({
    name: req.body.name,
    price: req.body.price,
    badgeType: req.body.badgeType,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })

  badge.save(function (err, badgeCreated) {
    if (err) {
      res.status(500).send({ errors: [err] })
      next()
    }
    res.send({ success: true, res: 'Medalha cadastrada com sucesso!', status: 200 })
  })
}


exports.getAll = function (req, res, next) {

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

  Badge.find(filters, function (err, badges) {
    if (err) {
      res.status(500).json({ errors: [err] })
      next()
    }
    res.send(badges)
  }).limit(req.query.limit).skip(req.query.skip)
}

exports.getById = function (req, res, next) {

  Badge.findById(req.params.id, function (err, badge) {
    if (err) {
      res.status(500).json({ errors: [err] })
      next()
    }
    if (!badge) {
      const error = new NotFoundError()
      error.httpStatusCode = 404
      res.status(error.httpStatusCode).json({ success: false, res: 'Medalha não encontrada', status: error.httpStatusCode })
      return next(error)
    }

    res.send(badge)
  })
}


exports.update = function (req, res, next) {

  Badge.findByIdAndUpdate(req.params.id, { $set: req.body }, function (err, badge) {
    if (err) {
      res.status(500).json({ errors: [err] })
      next()
    }
    if (!badge) {
      const error = new NotFoundError()
      error.httpStatusCode = 404
      res.status(error.httpStatusCode).json({ success: false, res: 'Medalha não encontrada', status: error.httpStatusCode })
      return next(error)
    }
    res.send({ success: true, res: 'Medalha atualizada com sucesso!', status: 200 })
  })
}

exports.delete = function (req, res, next) {

  Badge.findByIdAndRemove(req.params.id, function (err, badge) {
    if (err) {
      res.status(500).json({ errors: [err] })
      next()
    }
    if (!badge) {
      const error = new NotFoundError()
      error.httpStatusCode = 404
      res.status(error.httpStatusCode).json({ success: false, res: 'Medalha não encontrada', status: error.httpStatusCode })
      return next(error)
    }
    res.send({ success: true, res: 'Medalha excluída com sucesso!', status: 200 })
  })
}

exports.count = function (req, res, next) {

  Badge.count({}, function (err, value) {
    if (err) {
      res.status(500).json({ errors: [err] })
      next()
    }
    if (!value) res.json({ success: false, res: 'Não existem medalhas para serem contabilizadas', status: 404 })
    res.json({ value })
  })
}

