// M - MODEL

const mongoose = require('mongoose')
const classTypesEnum = require('../common/enums/classTypes')

const classesSchema = new mongoose.Schema({
  topicId: { type: String, required: false }, // Transformar no futuro em um array de tópicos (por enquanto será apenas um)
  userId: { type: String, required: [true, 'Informe o usuário!'] },
  title: { type: String, min: 1, max: 100, required: [true, 'Informe o título!'] },
  videoUrl: { type: String, min: 1, required: [true, 'Informe o link do vídeo!'] },
  classType: { type: String, uppercase: true, enum: [classTypesEnum.VIDEO], required: [true, 'Informe o tipo de aula!'] },
  quizzes: { type: Array, default: [], required: false }, // quizId
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true }
}, { collection: 'classes' })

module.exports = mongoose.model('Classes', classesSchema)