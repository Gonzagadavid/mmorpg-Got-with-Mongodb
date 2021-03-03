const { body, validationResult } = require('express-validator')

module.exports = function (application) {
  application.get('/', function (req, res) {
    application.app.controllers.index.index(application, req, res)
  })

  application.post('/autenticar', [
    body('usuario').notEmpty().withMessage('Usuário não pode ser vazio'),
    body('senha').notEmpty().withMessage('Senha não pode ser vazio')
  ], (req, res) => {
    const errors = validationResult(req)
    application.app.controllers.index.autenticar(application, errors, req, res)
  })
}
