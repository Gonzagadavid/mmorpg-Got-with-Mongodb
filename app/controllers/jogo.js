module.exports.jogo = (application, req, res) => {
  if (!req.session.autorizado) {
    res.send('O usuário precisa fazer login')
    return
  }
  let msg = ''

  if (req.query.msg !== '') msg = req.query.msg

  const campos = req.session.campos
  const usuario = req.session.usuario
  const casa = req.session.casa
  const JogoDAO = new application.app.models.JogoDAO()

  // recuperar parametros do jogo do usuario
  JogoDAO.iniciaJogo(usuario, req, res, casa, msg, campos)
}

module.exports.sair = (application, req, res) => {
  req.session.destroy(err => {
    if (err) throw err
    res.render('index', { validacao: {} })
  })
}

module.exports.suditos = (application, req, res) => {
  if (!req.session.autorizado) {
    res.send('O usuário precisa fazer login')
    return
  }
  const usuario = req.session.usuario
  const JogoDAO = new application.app.models.JogoDAO()
  JogoDAO.getDisponiveis(usuario, res)
}

module.exports.pergaminhos = (application, req, res) => {
  if (!req.session.autorizado) {
    res.send('O usuário precisa fazer login')
    return
  }

  // recuperar as ações inseridas no banco de dados
  const JogoDAO = new application.app.models.JogoDAO()
  const usuario = req.session.usuario

  JogoDAO.getAcoes(res, usuario)
}

module.exports.ordenarAcaoSudito = (application, errors, req, res) => {
  if (!req.session.autorizado) {
    res.send('O usuário precisa fazer login')
    return
  }

  const dadosForm = req.body

  if (!errors.isEmpty()) {
    req.session.campos = errors.errors
    res.redirect('/jogo?msg=A')
    return
  }

  dadosForm.usuario = req.session.usuario

  const JogoDAO = new application.app.models.JogoDAO()
  JogoDAO.acao(dadosForm, res)
}

module.exports.revogarAcao = (application, req, res) => {
  const urlQuery = req.query
  const _id = urlQuery.id_acao
  const JogoDAO = new application.app.models.JogoDAO()
  JogoDAO.revogar(res, _id)
}
