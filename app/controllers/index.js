module.exports.index = function (application, req, res) {
  res.render('index', { validacao: {} })
}

module.exports.autenticar = function (application, errors, req, res) {
  const dadosForm = req.body

  if (!errors.isEmpty()) {
    res.render('index', { validacao: errors.errors, dadosForm })
    return
  }

  // auteticar usuarios
  const usuariosDAO = new application.app.models.UsuariosDAO()
  usuariosDAO.autenticar(dadosForm, req, res)
}
