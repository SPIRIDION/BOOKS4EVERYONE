import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useNavigate } from 'react-router-dom'
import { Card, Button, Spinner } from 'react-bootstrap'
import axios from 'axios'

const MyOffersPage = () => {
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const fetchMyOffers = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get('/offers/mine', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const offersWithRatings = await Promise.all(
        res.data.map(async (offer) => {
          try {
            const commentsRes = await axios.get(`/comments/${offer._id}`)
            const comments = commentsRes.data
            const averageRate =
              comments.length > 0
                ? (comments.reduce((acc, comment) => acc + comment.rate, 0) / comments.length).toFixed(1)
                : 'N/A'
            return { ...offer, averageRate }
          } catch (err) {
            return { ...offer, averageRate: 'N/A' }
          }
        })
      )

      setOffers(offersWithRatings)
    } catch (err) {
      console.error('Errore nel recupero delle offerte personali:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (offerId) => {
    const confirmed = window.confirm('Sei sicuro di voler eliminare questa offerta?')
    if (!confirmed) return

    try {
      const token = localStorage.getItem('token')
      await axios.delete(`/offers/${offerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setOffers(offers.filter((offer) => offer._id !== offerId))
    } catch (err) {
      console.error('Errore durante l\'eliminazione:', err)
    }
  }

  useEffect(() => {
    fetchMyOffers()
  }, [])

  return (
    <>
      <Navbar />
      <div className="container py-4">
        <h2 className="mb-4 text-center">Le mie offerte</h2>
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" />
          </div>
        ) : offers.length === 0 ? (
          <p className="text-center">Non hai ancora pubblicato nessuna offerta.</p>
        ) : (
          offers.map((offer) => (
            <Card className="mb-4 d-flex flex-row align-items-center" key={offer._id}>
              <Card.Img
                variant="left"
                src={offer.immagineUrl}
                style={{ width: '200px', height: 'auto', objectFit: 'cover' }}
              />
              <Card.Body className="d-flex justify-content-between align-items-center w-100">
                <div>
                  <Card.Title>{offer.titolo}</Card.Title>
                  <Card.Text><strong>Voto medio:</strong> {offer.averageRate}</Card.Text>
                  <Card.Text>{offer.descrizione}</Card.Text>
                </div>
                <div className="d-flex flex-column gap-2">
                  <Button variant="warning" onClick={() => navigate(`/modifica-offerta/${offer._id}`)}>
                    Modifica
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(offer._id)}>
                    Elimina
                  </Button>
                </div>
              </Card.Body>
            </Card>
          ))
        )}
      </div>
      <Footer />
    </>
  )
}

export default MyOffersPage