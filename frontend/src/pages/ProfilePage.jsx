import { useState, useEffect } from 'react'
import axios from '../utils/axiosConfig'
import { useNavigate } from 'react-router-dom'
import { Link, useLocation } from 'react-router-dom'
import 'bootstrap-icons/font/bootstrap-icons.css';

function ProfilePage() {

  const navigate = useNavigate()

  const handleMyOffersClick = () => {
    navigate('/my-offers')
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
      if (!token) {
        navigate('/login')
      }
  }, [navigate])

  const [form, setForm] = useState({
    nome: '',
    cognome: '',
    username: '',
    email: '',
    residenza: '',
    password: '',
    immagineProfilo: ''
  })
  const [anteprima, setAnteprima] = useState('')
  const [file, setFile] = useState(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await axios.get('/users/me')
        setForm({ ...res.data })
        setAnteprima(res.data.immagineProfilo)
      } catch (err) {
        alert('Errore nel recupero dati utente')
      }
    }
    fetchUserData()
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0]
    setFile(selectedFile)
    setAnteprima(URL.createObjectURL(selectedFile))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      let imageUrl = form.immagineProfilo
      if (file) {
        const data = new FormData()
        data.append('file', file)
        data.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET)
        data.append('folder', 'profiliLibriUsati')

        const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, {
          method: 'POST',
          body: data
        })
        const cloudinaryData = await res.json()
        imageUrl = cloudinaryData.secure_url
      }

      await axios.put('/users/update', { ...form, immagineProfilo: imageUrl })
      alert('Profilo aggiornato con successo!')
    } catch (err) {
      alert('Errore nell\'aggiornamento del profilo')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
        <Link to="/" className="navbar-brand fw-bold text-white">
          BOOKS4EVERYONE
        </Link>

        <div className="expand-left">
          <button className="btn btn-outline-light" onClick={handleMyOffersClick}>Le mie offerte</button>
        </div>
      </nav>
      <div className="container mt-5">
        <div className="row">
          <div className="col-12 col-md-4 text-center mb-4">
            {anteprima && <img src={anteprima} alt="Anteprima" className="img-fluid rounded-circle border shadow" style={{ maxWidth: '200px' }} />}
          </div>
          <div className="col-12 col-md-8">
            <h2>Il mio profilo</h2>
            <form onSubmit={handleSubmit}>
              <input name="nome" className="form-control mb-2" placeholder="Nome" value={form.nome} onChange={handleChange} required />
              <input name="cognome" className="form-control mb-2" placeholder="Cognome" value={form.cognome} onChange={handleChange} required />
              <input name="username" className="form-control mb-2" placeholder="Username" value={form.username} onChange={handleChange} required />
              <input type="email" name="email" className="form-control mb-2" placeholder="Email" value={form.email} onChange={handleChange} required />
              <input name="residenza" className="form-control mb-2" placeholder="Residenza" value={form.residenza} onChange={handleChange} required />
              <input type="password" name="password" className="form-control mb-2" placeholder="Password" value={form.password} onChange={handleChange} required />
              <input type="file" className="form-control mb-2" onChange={handleImageChange} />
              <button className="btn btn-primary mt-5 mb-3" type="submit">Aggiorna Profilo</button>
            </form>
            <button className="btn btn-danger mt-3 mb-5" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right me-1"></i> Logout
            </button>
          </div>
        </div>
      </div>
      <footer className="bg-dark text-light text-center py-3 mt-5 bm-0">
        <div>BOOKS4EVERYONE &copy; {new Date().getFullYear()}</div>
        <div>Contattaci: info@books4everyone.it</div>
      </footer>
    </>
  )
}

export default ProfilePage