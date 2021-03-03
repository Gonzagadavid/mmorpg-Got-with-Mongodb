/* importar as configurações do servidor */
const app = require('./config/server')

/* parametrizar a porta de escuta */
app.listen(80, function () {
  console.log('Servidor online')
})
