import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../utils/axiosConfig'

function LoginPage() {
  // Stato per email e password
  const [form, setForm] = useState({ email: '', password: '' })

  const navigate = useNavigate()

  // Gestione del cambiamento dei campi input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // Funzione chiamata al submit del form
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // Chiamata POST al backend con i dati del form
      const res = await axios.post('/users/login', form)

      // Salvo il token nel localStorage
      localStorage.setItem('token', res.data.token)

      alert('Login effettuato con successo!')
      navigate('/') // reindirizza alla homepage

    } catch (err) {
      alert('Credenziali non valide!')
    }
  }

  return (
    <div className="container mt-5" >
      <div className='center' style={{ maxWidth: '400px' }}>
        <h2 className="mb-4 text-center">Login</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            className="form-control mb-3"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            className="form-control mb-3"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button type="submit" className="btn btn-primary w-100">
            Accedi
          </button>
        </form>
        <div className="mt-3 text-center">
          <p>Non sei ancora registrato?</p>
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate('/register')}
          >
            Registrati
          </button>
        </div>
      </div>
    </div>
  )
}

export default LoginPage