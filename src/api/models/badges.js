// M - MODEL

const mongoose = require('mongoose')
const badgeTypesEnum = require('../common/enums/badgeTypes')

const badgesSchema = new mongoose.Schema({
  name: { type: String, min: 1, max: 100, required: [true, 'Informe o nome!'] },
  price: { type: Number, min: 1, required: [true, 'Informe o preço!'], default: 0 },
  badgeType: { type: String, uppercase: true, enum: [badgeTypesEnum.ACHIEVEMENT], required: [true, 'Informe o tipo de medalha!'] },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true }
}, { collection: 'badges' })

module.exports = mongoose.model('Badges', badgesSchema)