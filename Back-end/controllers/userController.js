// file contenente la logica delle operazioni (creazione utente, modifica utente ecc.)
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cloudinary = require('cloudinary')

// registrazione utente con bcrypt
exports.registerUser = async (req, res) => {
  try {
    const { nome, cognome, username, email, residenza, password } = req.body

    // verifica se l'email è già registrata
    const existUser = await User.findOne({email})
    if (existUser) {
      return res.status(400).json({message: 'Email già registrata'})
    }

    // carica immagine su Cloudinary (se presente)
    let immagineProfilo = ''
    if (req.file) {
      console.log('Percorso file:', req.file.path)
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: 'profiliLibriUsati'
      })
      immagineProfilo = result.secure_url
    }

    // criptiamo la password con bcrypt
    const hashPassword = await bcrypt.hash(password, 10)

    // procediamo con la creazione di un nuovo user
    const newUser = new User({
      nome,
      cognome,
      username,
      email,
      residenza,
      password: hashPassword,
      immagineProfilo
    })

    await newUser.save()

    // procediamo con la generazione del token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    })

    res.status(201).json({message: 'Nuovo user registrato con successo!', user: newUser, token})
  } catch (err) {
    res.status(500).json({message: `Errore durante la registrazione: ${err}`})
  }
}

// login utente (base)
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
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
    const user = await User.findById(req.params.id).select('-password')// esclude la password
    if (!user) return res.status(404).json({message: 'User non trovato'})

    res.status(200).json(user)
  } catch(err) {
    res.status(500).json({message: `Errore nel recupero user: ${err}`})
  }
}

// modifica di un user 
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({message: 'User non trovato'})

    if (req.user.id !== user._id.toString())
      return res.status(403).json({message: 'Non autorizzato'})

    const { nome, cognome, username, email, residenza, password } = req.body
    if (nome) user.nome = nome
    if (cognome) user.cognome = cognome
    if (username) user.username = username
    if (email) user.email = email
    if (residenza) user.residenza = residenza
    if (req.file) {
      if (user.immagineProfilo) {
        const publicId = user.immagineProfilo.split('/').pop().split('.')[0]
        await cloudinary.uploader.destroy(publicId)
      }
      user.immagineProfilo = req.file.path
    }
    if (password) user.password = await bcrypt.hash(password, 10)

    await user.save()
    res.status(200).json({message: 'User aggiornato', user})
  } catch (err) {
    res.status(500).json({message: `Errore aggiornamento: ${err}`})
  }
}

// eliminazione di un user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({message: 'User non trovato'})

    if (user.immagineProfilo) {// se l'immagine esiste su Cloudinary la eliminiamo
      const publicId = user.immagineProfilo.split('/').pop().split('.')[0]
      await cloudinary.uploader.destroy(publicId)
    }

    await User.findByIdAndDelete(req.params.id)

    res.status(200).json({message: 'User eliminato con successo'})
  } catch(err) {
    res.status(500).json({message: 'Errore durante l\'eliminazione dello user'})
  }
}

// restituisce i dati dell'utente autenticato (via token)
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' })
    }

    res.status(200).json(user)
  } catch (err) {
    res.status(500).json({ message: `Errore nel recupero del profilo: ${err}` })
  }
}