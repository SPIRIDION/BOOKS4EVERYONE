import { useState, useEffect } from 'react'
import api from '../utils/axiosConfig'
import { useNavigate, Link } from 'react-router-dom'
import 'bootstrap-icons/font/bootstrap-icons.css';
import Footer from '../components/Footer';

function ProfilePage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ nome:'', cognome:'', username:'', email:'', residenza:'', password:'', immagineProfilo:'' })
  const [anteprima, setAnteprima] = useState('')
  const [file, setFile] = useState(null)

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token')
      if (!token) return navigate('/login')
      try {
        const res = await api.get('/users/me')
        setForm(res.data)
        setAnteprima(res.data.immagineProfilo || '')
      } catch {
        alert('Errore nel recupero dati utente')
      }
    }
    fetchUserData()
  }, [navigate])

  const handleChange = e => setForm({...form, [e.target.name]: e.target.value})
  const handleImageChange = e => {
    const f = e.target.files[0]; setFile(f)
    setAnteprima(URL.createObjectURL(f))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const data = new FormData()
      Object.entries(form).forEach(([k, v]) => v && k !== 'immagineProfilo' && data.append(k, v))
      if (file) data.append('immagineProfilo', file)

      // recupera id utente dal token o da /me
      const resMe = await api.get('/users/me')
      const myId = resMe.data._id

      await api.put(`/users/${myId}`, data, { headers: { 'Content-Type': 'multipart/form-data' } })
      alert('Profilo aggiornato con successo!')
    } catch {
      alert('Errore nell\'aggiornamento del profilo')
    }
  }

  const handleLogout = () => { localStorage.removeItem('token'); navigate('/login') }

  return (
    <>
      <nav className="navbar navbar-dark bg-dark px-3">
        <Link to="/" className="navbar-brand fw-bold text-white">BOOKS4EVERYONE</Link>
        <button className="btn btn-outline-light" onClick={() => navigate('/my-offers')}>Le mie offerte</button>
      </nav>
      <div className="container mt-5 main-content">
        <div className="row">
          <div className="col-md-4 text-center mb-4">
            {anteprima && <img src={anteprima} alt="Anteprima" className="img-fluid rounded-circle border shadow" style={{ maxWidth: '200px' }} />}
          </div>
          <div className="col-md-8">
            <h2>Il mio profilo</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              {['nome','cognome','username','email','residenza','password'].map(field=>(
                <input
                  key={field} name={field} type={field==='email'? 'email': field==='password'? 'password':'text'}
                  className="form-control mb-2" placeholder={field.charAt(0).toUpperCase()+field.slice(1)}
                  value={form[field]} onChange={handleChange} required
                />
              ))}
              <input type="file" className="form-control mb-2" onChange={handleImageChange} />
              <button className="btn btn-primary mt-3" type="submit">Aggiorna Profilo</button>
            </form>
            <button className="btn btn-danger mt-3" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right me-1" /> Logout
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProfilePage