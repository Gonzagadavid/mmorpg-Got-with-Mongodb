module.exports.cadastro = function (application, req, res) {
  res.render('cadastro', { validacao: {}, dadosForm: {} })
}
module.exports.cadastrar = function (application, errors, req, res) {
  const dadosForm = req.body

  if (!errors.isEmpty()) {
    res.render('cadastro', { validacao: errors.errors, dadosForm })
    return
  }

  // const connection = application.config.dbConnection
  const UsuariosDAO = new application.app.models.UsuariosDAO()
  const JogoDAO = new application.app.models.JogoDAO()

  // cadastro do usuario
  UsuariosDAO.inserirUsuario(dadosForm)

  // gereação dos parametros
  JogoDAO.gerarParametros(dadosForm.usuario, res)
}
module.exports.sucess = function (application, req, res) {
  res.render('sucess')
}
