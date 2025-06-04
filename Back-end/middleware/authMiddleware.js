const jwt = require('jsonwebtoken')

exports.protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]// formato: Bearer token

  if (!token) return res.status(401).json({message: 'Accesso non autorizzato'})

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch(err) {
    res.status(401).json({message: `Token non valido o scaduto: ${err}`})
  }
}