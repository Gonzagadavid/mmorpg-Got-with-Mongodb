const MongoClient = require('mongodb').MongoClient
const url = 'mongodb://localhost:27017/'
const crypto = require('crypto')

class UsuariosDAO {
  inserirUsuario (usuario) {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
      if (err) throw err
      const dbo = db.db('got')
      const senhaCrypto = crypto.createHash('md5').update(usuario.senha).digest('hex')
      usuario.senha = senhaCrypto

      dbo.collection('usuarios').findOne({ usuario: { $eq: usuario.usuario } }, (err, resp) => {
        if (err) throw err
        if (resp) return

        dbo.collection('usuarios').insertOne(usuario, function (err, res) {
          if (err) throw err
          console.log('1 document inserted')
          db.close()
        })
      })
    })
  }

  autenticar (usuario, req, res) {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
      if (err) throw err
      const dbo = db.db('got')
      const senhaCrypto = crypto.createHash('md5').update(usuario.senha).digest('hex')
      usuario.senha = senhaCrypto
      dbo.collection('usuarios').find(usuario).toArray(function (err, resp) {
        if (err) throw err
        if (resp[0] !== undefined) {
          req.session.autorizado = true

          req.session.usuario = resp[0].usuario
          req.session.casa = resp[0].casa
        }
        req.session.autorizado ? res.redirect('jogo') : res.render('index', { validacao: [{ msg: 'usuário e/ou senha inválidos' }] })
        db.close()
      })
    })
  }
}

module.exports = _ => UsuariosDAO
