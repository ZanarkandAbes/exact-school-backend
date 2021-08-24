// M - MODEL

const mongoose = require('mongoose')
const topicTypesEnum = require('../common/enums/topicTypes')

const topicsSchema = new mongoose.Schema({
  userId: { type: String, required: [true, 'Informe o usuário!'] },
  title: { type: String, min: 1, max: 100, required: [true, 'Informe o título!'] },
  description: { type: String, min: 1, max: 500, required: [true, 'Informe a descrição!'] },
  tags: { type: Array, default: [], required: false }, // name 
  topicAnswers: { type: Array, default: [], required: false }, // { userId, answer, createdAt, updatedAt }
  topicType: { type: String, uppercase: true, enum: [topicTypesEnum.DOUBT, topicTypesEnum.SUGGESTION], required: [true, 'Informe o tipo de tópico!'] },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true }
}, { collection: 'topics' })

module.exports = mongoose.model('Topics', topicsSchema)