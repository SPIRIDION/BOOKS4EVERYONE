const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('./cloudinary')

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'profiliLibriUsati',
    allowed_formats: ['jpg','png','jpeg'],
    transformation: [{ width: 500, height: 700, crop: 'limit'}]
  },
})

module.exports = storage