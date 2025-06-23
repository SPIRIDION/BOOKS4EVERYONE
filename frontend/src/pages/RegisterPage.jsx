import { useState } from 'react'
import axios from '../utils/axiosConfig'
import { useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'

function RegisterPage() {
  // Stato per i campi del form
  const [form, setForm] = useState({
    nome: '',
    cognome: '',
    username: '',
    email: '',
    residenza: '',
    password: '',
    immagineProfilo: null
  })

  const [anteprima, setAnteprima] = useState(null)
  const [uploading, setUploading] = useState(false)

  const navigate = useNavigate()

  // Gestione cambiamento campi testuali
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // Gestione selezione immagine
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setForm(prev => ({ ...prev, immagineProfilo: file }))
      setAnteprima(URL.createObjectURL(file))
    }
  }

  // Gestione invio form
  const handleSubmit = async (e) => {
    e.preventDefault()
    setUploading(true)

    const data = new FormData()
    data.append('nome', form.nome)
    data.append('cognome', form.cognome)
    data.append('username', form.username)
    data.append('email', form.email)
    data.append('residenza', form.residenza)
    data.append('password', form.password)
    if (form.immagineProfilo) {
      data.append('immagineProfilo', form.immagineProfilo)
    }

    try {
      await axios.post('/users/register', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      alert('Registrazione completata!')
      navigate('/login')
    } catch (err) {
      alert('Errore durante la registrazione')
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <Navbar />
      <div className="container mt-5 main-content">
        <h2>Registrazione</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <input
            name="nome"
            className="form-control mb-2"
            placeholder="Nome"
            onChange={handleChange}
            required
          />
          <input
            name="cognome"
            className="form-control mb-2"
            placeholder="Cognome"
            onChange={handleChange}
            required
          />
          <input
            name="username"
            className="form-control mb-2"
            placeholder="Username"
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            className="form-control mb-2"
            placeholder="Email"
            onChange={handleChange}
            required
          />
          <input
            name="residenza"
            className="form-control mb-2"
            placeholder="Residenza"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            className="form-control mb-2"
            placeholder="Password"
            onChange={handleChange}
            required
          />

          <input
            type="file"
            className="form-control mb-2"
            accept="image/*"
            onChange={handleImageChange}
          />

          {uploading && <p>Caricamento in corso...</p>}

          {anteprima && (
            <div className="mb-2">
              <p>Anteprima immagine:</p>
              <img
                src={anteprima}
                alt="Anteprima"
                style={{ height: '100px', borderRadius: '8px' }}
              />
            </div>
          )}

          <button className="btn btn-primary" type="submit">
            Registrati
          </button>
        </form>
      </div>
    </div>
  )
}

export default RegisterPage