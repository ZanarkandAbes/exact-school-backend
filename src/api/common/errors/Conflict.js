class Conflict extends Error {
  constructor (message) {
    super(message)
    this.name = 'Conflict'
  }
}

module.exports = Conflict
