const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectID
const url = 'mongodb://localhost:27017/'

class JogoDAO {
  gerarParametros (usuario, res) {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
      if (err) throw err
      const dbo = db.db('got')

      dbo.collection('usuarios').findOne({ usuario }, (err, resp) => {
        if (err) throw err
        if (resp) return res.render('cadastro', { validacao: [{ msg: 'Esse user name já esta sendo usado, escolha outro' }], dadosForm: {} })

        dbo.collection('jogo').insertOne({
          usuario: usuario,
          moeda: 15,
          suditos: 10,
          temor: Math.floor(Math.random() * 1000),
          sabedoria: Math.floor(Math.random() * 1000),
          comercio: Math.floor(Math.random() * 1000),
          magia: Math.floor(Math.random() * 1000)
        }, function (err, response) {
          if (err) throw err
          console.log('1 document inserted')
          res.render('sucess')
          db.close()
        })
      })
    })
  }

  iniciaJogo (usuario, req, res, casa, msg, campos) {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
      if (err) throw err
      const dbo = db.db('got')
      dbo.collection('jogo').find({ usuario }).toArray(function (err, resp) {
        if (err) throw err
        res.render('jogo', { imgCasa: casa, jogo: resp[0], msg, campos })
        db.close()
      })
    })
  }

  acao (acao, res) {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
      if (err) throw err
      const dbo = db.db('got')
      dbo.collection('jogo').findOne({ usuario: acao.usuario }, (err, resp) => {
        if (err) throw err

        const date = new Date()
        let tempo = null

        switch (parseInt(acao.acao)) {
          case 1: tempo = 1 * 60 * 60000; break
          case 2: tempo = 2 * 60 * 60000; break
          case 3: tempo = 5 * 60 * 60000; break
          case 4: tempo = 5 * 60 * 60000; break
        }

        acao.acao_termina_em = date.getTime() + tempo

        let moedas = null
        switch (parseInt(acao.acao)) {
          case 1: moedas = -2 * acao.quantidade; break
          case 2: moedas = -3 * acao.quantidade; break
          case 3: moedas = -1 * acao.quantidade; break
          case 4: moedas = -1 * acao.quantidade; break
        }

        if (resp.moeda < (moedas * (-1))) {
          db.close()
          return res.redirect('/jogo?msg=E')
        }

        if (resp.suditos < acao.quantidade) {
          db.close()
          return res.redirect('/jogo?msg=F')
        }

        dbo.collection('acao').insertOne(acao, (err, res) => {
          if (err) throw err
          console.log('1 action inserted')
        })

        dbo.collection('jogo').updateOne(
          { usuario: { $eq: acao.usuario } },
          { $inc: { moeda: moedas } },
          function (err, res) {
            if (err) throw err
            console.log('moedas changed')
          }
        )

        const sudito = parseInt(acao.quantidade) * (-1)
        dbo.collection('jogo').updateOne(
          { usuario: { $eq: acao.usuario } },
          { $inc: { suditos: sudito } },
          function (err, res) {
            if (err) throw err
            console.log('suditos changed')
            db.close()
          })
        res.redirect('/jogo?msg=B')
      })
    })
  }

  getAcoes (res, usuario) {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
      if (err) throw err
      const dbo = db.db('got')
      const momentoAtual = new Date().getTime()
      dbo.collection('acao').find({ usuario, acao_termina_em: { $gt: momentoAtual } }).toArray(async (err, resp) => {
        if (err) throw err
        await this.atualizaParametros(usuario, momentoAtual, res)
        res.render('pergaminhos', { lista: resp })
        db.close()
      })
    })
  }

  revogar (res, _id) {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
      if (err) throw err
      const dbo = db.db('got')
      dbo.collection('acao').deleteOne({ _id: ObjectId(_id) }, function (err, resp) {
        if (err) throw err
        console.log('1 document deleted')
        res.redirect('/jogo?msg=D')
        db.close()
      })
    })
  }

  getDisponiveis (usuario, res) {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
      if (err) throw err
      const dbo = db.db('got')
      dbo.collection('jogo').findOne({ usuario: usuario }, (err, resp) => {
        if (err) throw err
        dbo.collection('acao').find({ usuario: usuario }).toArray((err, acao) => {
          if (err) throw err
          console.log(acao)
          let ocupados = 0
          if (acao.length > 0) ocupados = acao.map(el => parseInt(el.quantidade)).reduce((acc, crr) => acc + crr)
          res.render('aldeoes', { disponiveis: resp.suditos, ocupados })
          db.close()
        })
      })
    })
  }

  atualizaParametros (usuario, momentoAtual, res) {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
      if (err) throw err
      const dbo = db.db('got')
      dbo.collection('jogo').findOne({ usuario }, (err, user) => {
        if (err) throw err

        dbo.collection('acao').find({ usuario, acao_termina_em: { $lte: momentoAtual } }).toArray((err, resp) => {
          if (err) throw err
          if (resp.length === 0) {
            db.close()
            return
          }

          const limit = resp.length
          for (let i = 0; i < limit; i++) {
            if (resp[i].acao === '1') {
              const juros = Math.floor(parseInt(resp[i].quantidade) * parseInt(user.comercio) * 0.01)
              dbo.collection('jogo').updateMany(
                { usuario: { $eq: resp[i].usuario } },
                { $inc: { moeda: juros, suditos: 1 } },
                function (err, res) {
                  if (err) throw err
                  console.log('params changed 1')
                }
              )
            } else if (resp[i].acao === '2') {
              dbo.collection('jogo').updateMany(
                { usuario: { $eq: resp[i].usuario } },
                { $inc: { temor: 100, suditos: -1, moeda: 5 } },
                function (err, res) {
                  if (err) throw err
                  console.log('params changed 2')
                }
              )
            } else if (resp[i].acao === '3') {
              dbo.collection('jogo').updateMany(
                { usuario: { $eq: resp[i].usuario } },
                { $inc: { sabedoria: 200, comercio: 50, suditos: 1 } },
                function (err, res) {
                  if (err) throw err
                  console.log('params changed 3')
                }
              )
            } else if (resp[i].acao === '4') {
              dbo.collection('jogo').updateMany(
                { usuario: { $eq: resp[i].usuario } },
                { $inc: { magia: (100 * resp[i].quantidade), suditos: 2, moeda: 5 } },
                function (err, res) {
                  if (err) throw err
                  console.log('params changed 4')
                }
              )
            }
            const quantidade = parseInt(resp[i].quantidade)
            dbo.collection('jogo').updateMany(
              { usuario: { $eq: resp[i].usuario } },
              { $inc: { suditos: quantidade } },
              function (err, res) {
                if (err) throw err
                console.log('params suditos changed ')
              }
            )
            dbo.collection('acao').deleteOne({ _id: ObjectId(resp[i]._id) }, (err, resp) => {
              if (err) throw err
              console.log('1 acao completed')
              if (i === limit - 1) {
                console.log('db closed')
                db.close()
              }
            })
          }
        })
      })
    })
  }
}

module.exports = _ => JogoDAO
