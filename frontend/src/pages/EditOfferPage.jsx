import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../utils/axiosConfig'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Form, Button, Container, Alert, Spinner } from 'react-bootstrap'

const EditOfferPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    titolo: '',
    descrizione: '',
    prezzo15: '',
    prezzo30: '',
    prezzoVendita: '',
    immagineLibro: null,
  })

  const [anteprima, setAnteprima] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Fetch dell’offerta esistente
  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const res = await api.get(`/offers/${id}`)
        const { titolo, descrizione, prezzo15, prezzo30, prezzoVendita, immagineLibro } = res.data
        setFormData({ titolo, descrizione, prezzo15, prezzo30, prezzoVendita, immagineLibro: null })
        setAnteprima(immagineLibro)
      } catch (err) {
        setError('Errore nel recupero dell\'offerta')
      } finally {
        setLoading(false)
      }
    }

    fetchOffer()
  }, [id])

  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (name === 'immagineLibro') {
      const file = files[0]
      setFormData(prev => ({ ...prev, immagineLibro: file }))
      setAnteprima(URL.createObjectURL(file))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  // Invio dati aggiornati
  const handleSubmit = async (e) => {
    e.preventDefault()

    const data = new FormData()
    data.append('titolo', formData.titolo)
    data.append('descrizione', formData.descrizione)
    data.append('prezzo15', formData.prezzo15)
    data.append('prezzo30', formData.prezzo30)
    data.append('prezzoVendita', formData.prezzoVendita)
    if (formData.immagineLibro) {
      data.append('immagineLibro', formData.immagineLibro)
    }

    try {
      await api.put(`/offers/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      setSuccess(true)
      setTimeout(() => navigate('/my-offers'), 1500)
    } catch (err) {
      setError('Errore durante la modifica dell\'offerta')
      console.error(err)
    }
  }

  return (
    <>
      <Navbar />
      <Container className="py-4 main-content">
        <h2 className="mb-4 text-center">Modifica Offerta</h2>

        {loading ? (
          <div className="text-center"><Spinner animation="border" /></div>
        ) : (
          <Form onSubmit={handleSubmit} encType="multipart/form-data">
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">Offerta modificata con successo!</Alert>}

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
              <Form.Label>Immagine del libro (opzionale)</Form.Label>
              <Form.Control type="file" name="immagineLibro" accept="image/*" onChange={handleChange} />
              {anteprima && (
                <div className="mt-2">
                  <p>Anteprima immagine:</p>
                  <img src={anteprima} alt="Anteprima libro" style={{ height: '150px', borderRadius: '8px' }} />
                </div>
              )}
            </Form.Group>
            <Button type="submit" variant="primary">Salva modifiche</Button>
          </Form>
        )}
      </Container>
      <Footer />
    </>
  )
}

export default EditOfferPage