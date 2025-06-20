import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import api from '../utils/axiosConfig'
import { Form, Button, Container, Alert } from 'react-bootstrap'

const AddOfferPage = () => {
  const [formData, setFormData] = useState({
    titolo: '',
    descrizione: '',
    prezzo15: '',
    prezzo30: '',
    prezzoVendita: '',
    immagineLibro: null,
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (name === 'immagineLibro') {
      setFormData({ ...formData, immagineLibro: files[0] })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')

    const data = new FormData()
    data.append('titolo', formData.titolo)
    data.append('descrizione', formData.descrizione)
    data.append('prezzo15', formData.prezzo15)
    data.append('prezzo30', formData.prezzo30)
    data.append('prezzoVendita', formData.prezzoVendita)
    data.append('immagineLibro', formData.immagineLibro)

    try {
      await api.post('/offers', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      setSuccess(true)
      setTimeout(() => navigate('/my-offers'), 1500)
    } catch (err) {
      setError('Errore durante la creazione dell\'offerta.')
      console.error(err)
    }
  }

  return (
    <>
      <Navbar />
      <Container className="py-4">
        <h2 className="mb-4 text-center">Crea una nuova offerta</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">Offerta creata con successo!</Alert>}
        <Form onSubmit={handleSubmit} encType="multipart/form-data">
          <Form.Group className="mb-3">
            <Form.Label>Titolo</Form.Label>
            <Form.Control type="text" name="titolo" value={formData.titolo} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Descrizione</Form.Label>
            <Form.Control as="textarea" name="descrizione" value={formData.descrizione} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Prezzo noleggio 15 giorni (€)</Form.Label>
            <Form.Control type="number" step="0.01" name="prezzo15" value={formData.prezzo15} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Prezzo noleggio 30 giorni (€)</Form.Label>
            <Form.Control type="number" step="0.01" name="prezzo30" value={formData.prezzo30} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Prezzo di vendita (€)</Form.Label>
            <Form.Control type="number" step="0.01" name="prezzoVendita" value={formData.prezzoVendita} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Immagine del libro</Form.Label>
            <Form.Control type="file" name="immagineLibro" accept="image/*" onChange={handleChange} />
          </Form.Group>
          <Button type="submit" variant="primary">Crea offerta</Button>
        </Form>
      </Container>
      <Footer />
    </>
  )
}

export default AddOfferPage