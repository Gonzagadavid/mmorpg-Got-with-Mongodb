const { body, validationResult } = require('express-validator')

module.exports = function (application) {
  application.get('/cadastro', function (req, res) {
    application.app.controllers.cadastro.cadastro(application, req, res)
  })

  application.post('/cadastrar', [
    body('usuario').notEmpty().withMessage('Usuário não pode ser vazio'),
    body('nome').notEmpty().withMessage('Nome não pode ser vazio'),
    body('senha').notEmpty().withMessage('Senha não pode ser vazio'),
    body('casa').notEmpty().withMessage('Casa não pode ser vazio')
  ], (req, res) => {
    const errors = validationResult(req)
    application.app.controllers.cadastro.cadastrar(application, errors, req, res)
  })

  application.get('/sucess', (req, res) => application.app.controllers.cadastro.sucess(application, req, res))
}
