// file contenente la logica delle operazioni (creazione utente, modifica utente ecc.)
const user = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// rotta di test
exports.test = async (req, res) => {
  try {
    res.status(200).json({message: 'Le rotte funzionano'})
  } catch(err) {
    res.status(200).json()
  }
}

// registrazione utente con bcrypt
exports.registerUser = async (req, res) => {
  try {
    const { nome, cognome, username, email, residenza, password } = req.body
    const immagineProfilo = req.file?.path || ''

    // verifica se l'email è già registrata
    const existUser = await user.findOne({email})
    if (existUser) {
      return res.status(400).json({message: 'Email già registrata'})
    }

    // criptiamo la password con bcrypt
    const hashPassword = await bcrypt.hash(password, 10)

    // procediamo con la creazione di un nuovo user
    const newUser = new user({
      nome,
      cognome,
      username,
      email,
      residenza,
      password: hashPassword,
      immagineProfilo
    })

    await newUser.save()

    res.status(201).json({message: 'Nuovo user registrato con successo!', user: newUser})
  } catch (err) {
    res.status(500).json({message: `Errore durante la registrazione: ${err}`})
  }
}

// login utente (base)
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await user.findOne({ email })
    if (!user) return res.status(404).json({message: 'User non trovato!'})

    const checkPassword = await bcrypt.compare(password, user.password)
    if (!checkPassword) return res.status(401).json({message: 'Password errata'})  

    // creiamo il token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    })

    res.status(200).json({message: 'Login effettuato', token, user})
  } catch(err) {
    res.status(500).json({message: `Errore durante il login: ${err}`})
  }
}

// ottenimento profilo user tramite id
exports.getUserById = async (req, res) => {
  try {
    const user = await user.findById(req.params.id).select('-password')// esclude la password
    if (!user) return res.status(404).json({message: 'User non trovato'})

    res.status(200).json(user)
  } catch(err) {
    res.status(500).json({message: `Errore nel recupero user: ${err}`})
  }
}

// modifica di un user 
exports.updateUser = async (req, res) => {
  try {
    const { nome, cognome, username, email, residenza, immagineProfilo, password } = req.body

    const user = await user.findById(req.params.id)
    if (!user) return res.status(404).json({message: `User non trovato `})

    // aggiorna i campi solo se presenti
    if (nome) user.nome = nome
    if (cognome) user.cognome = cognome
    if (username) user.username = username
    if (email) user.email = email
    if (residenza) user.residenza = residenza
    if (immagineProfilo) user.immagineProfilo = immagineProfilo
    if (password) {
      const hashPassword = await bcrypt.hash(password, 10)
      user.password = hashPassword
    }

    await user.save()
    res.status(200).json({message: 'User aggiornato con successo', user})
  } catch(err) {
    res.status(500).json({message: 'Errore durante l\'aggiornamento del profilo'})
  }
}

// eliminazione di un user
exports.deleteUser = async (req, res) => {
  try {
    const user = await user.findByIdAndDelete(req.params.id)
    if (!user) return req.status(404).json({message: 'User non trovato'})

    res.status(200).json({message: 'User eliminato con successo'})
  } catch(err) {
    res.status(500).json({message: 'Errore durante l\'eliminazione dello user'})
  }
}