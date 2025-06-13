import { useState } from 'react'
import axios from '../utils/axiosConfig'
import { useNavigate } from 'react-router-dom'

function RegisterPage() {
  // Stato per i campi del form
  const [form, setForm] = useState({
    nome: '',
    cognome: '',
    username: '',
    email: '',
    residenza: '',
    password: '',
    immagineProfilo: ''  
  })

  const [uploading, setUploading] = useState(false) // Stato per mostrare feedback durante l’upload

  const navigate = useNavigate()

  // Gestione cambiamento campi testuali
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // Gestione upload immagine
  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET)

    try {
      setUploading(true)
      const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData
      })
      const data = await res.json()
      console.log('URL ottenuto da Cloudinary:', data.secure_url) // debug
      setForm(prev => ({ ...prev, immagineProfilo: data.secure_url }))
    } catch (err) {
      alert('Errore nel caricamento immagine')
    } finally {
      setUploading(false)
    }
  }

  // Gestione invio form
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/users/register', form)
      console.log('Dati inviati al backend:', form) // debug
      alert('Registrazione completata!')
      navigate('/login')
    } catch (err) {
      alert('Errore durante la registrazione')
    }
  }

  return (
    <div className="container mt-5">
      <h2>Registrazione</h2>
      <form onSubmit={handleSubmit}>
        <input name="nome" className="form-control mb-2" placeholder="Nome" onChange={handleChange} required />
        <input name="cognome" className="form-control mb-2" placeholder="Cognome" onChange={handleChange} required />
        <input name="username" className="form-control mb-2" placeholder="Username" onChange={handleChange} required />
        <input type="email" name="email" className="form-control mb-2" placeholder="Email" onChange={handleChange} required />
        <input name="residenza" className="form-control mb-2" placeholder="Residenza" onChange={handleChange} required />
        <input type="password" name="password" className="form-control mb-2" placeholder="Password" onChange={handleChange} required />

        <input type="file" className="form-control mb-2" accept="image/*" onChange={handleImageUpload} />
        {uploading && <p>Caricamento immagine in corso...</p>}
        {form.immagineProfilo && (
          <div className="mb-2">
            <p>Anteprima immagine:</p>
            <img src={form.immagineProfilo} alt="Anteprima" style={{ height: '100px' }} />
          </div>
        )}

        <button className="btn btn-primary" type="submit">Registrati</button>
      </form>
    </div>
  )
}

export default RegisterPage