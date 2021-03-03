const { body, validationResult } = require('express-validator')

module.exports = function (application) {
  application.get('/jogo', function (req, res) {
    application.app.controllers.jogo.jogo(application, req, res)
  })

  application.get('/sair', function (req, res) {
    application.app.controllers.jogo.sair(application, req, res)
  })

  application.get('/suditos', function (req, res) {
    application.app.controllers.jogo.suditos(application, req, res)
  })

  application.get('/pergaminhos', function (req, res) {
    application.app.controllers.jogo.pergaminhos(application, req, res)
  })

  application.post('/ordenar_acao_sudito', [
    body('acao').notEmpty().withMessage('ação deve ser informada'),
    body('quantidade').notEmpty().withMessage('quantidade deve ser informada')
  ], (req, res) => {
    const errors = validationResult(req)
    application.app.controllers.jogo.ordenarAcaoSudito(application, errors, req, res)
  })

  application.get('/revogar_acao', function (req, res) {
    application.app.controllers.jogo.revogarAcao(application, req, res)
  })
}
