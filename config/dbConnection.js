const mongo = require('mongodb').MongoClient

const connMongoDb = function () {
  // console.log('Entrou na funcao de conexao')
  // const db = new mongo.Db(
  //   'got',
  //   new mongo.Server(
  //     'localhost', // string contendo o endereço do banco de dados
  //     27017, // porta de conexão
  //     {}
  //   ),
  //   {}
  // )
  const url = 'mongodb://localhost:27017'
  // const name = 'got'
  const db = mongo.connect(url, (err, client) => {
    try {
      const dbo = db.db('got')
      // client.close()
      return dbo
    } catch (e) {
      console.log(err)
    }
  })

  return db
}

module.exports = _ => connMongoDb
