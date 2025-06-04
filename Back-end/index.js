const express = require('express')// importiamo express(framework per gestire il server)
const mongoose = require('mongoose')// importiamo mongoose per interagire con il database
const cors = require('cors')// importiamo i cors(per gestire le chiamate AJAX)
const helmet = require('helmet')
require('dotenv').config()

const app = express()
const port = 3001// utilizziamo la porta 3001 perchè la 3000 potrebbe creare interferenze con React
const dbName = 'BOOKS4EVERYONE'

// middleware vari
app.use(cors())// per la gestione dei cors
app.use(express.json())// per la gestione del formato JSON

// importiamo le rotte per users, offerte e commenti
app.use('/users', require('./routes/userRoutes'))
app.use('/offers', require('./routes/offerRoutes'))
app.use('/comments', require('./routes/commentRoutes'))

// connessione al server e avvio 
mongoose.connect(process.env.MONGODB_URL + dbName)
  .then(resp => app.listen(port, () => console.log(`Server attivo sulla porta: ${port}`)))
  .catch(err => console.error(err))
