const multer = require('multer')
const storage = require('../utils/storage')

const upload = multer({ storage })

module.exports = upload