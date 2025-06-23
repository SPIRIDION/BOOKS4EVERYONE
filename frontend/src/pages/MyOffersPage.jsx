import { useEffect, useState } from 'react'
import Footer from '../components/Footer'
import { useNavigate, Link } from 'react-router-dom'
import { Card, Button, Spinner } from 'react-bootstrap'
import api from '../utils/axiosConfig'
import './MyOffersPage.css'

const MyOffersPage = () => {
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [visibleComments, setVisibleComments] = useState(null)
  const [commentsByOffer, setCommentsByOffer] = useState({})
  const navigate = useNavigate()

  const fetchMyOffers = async () => {
    try {
      const res = await api.get('/offers/mine')

      const offersWithRatings = await Promise.all(
        res.data.map(async (offer) => {
          try {
            const commentsRes = await api.get(`/comments/${offer._id}`)
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
      await api.delete(`/offers/${offerId}`)
      setOffers(offers.filter((offer) => offer._id !== offerId))
    } catch (err) {
      console.error("Errore durante l'eliminazione:", err)
    }
  }

  const toggleComments = async (offerId) => {
    if (visibleComments === offerId) {
      setVisibleComments(null)
      return
    }

    try {
      const res = await api.get(`/comments/${offerId}`)
      setCommentsByOffer((prev) => ({ ...prev, [offerId]: res.data }))
      setVisibleComments(offerId)
    } catch (err) {
      console.error('Errore nel recupero dei commenti:', err)
      setCommentsByOffer((prev) => ({ ...prev, [offerId]: [] }))
      setVisibleComments(offerId)
    }
  }

  useEffect(() => {
    fetchMyOffers()
  }, [])

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
        <Link to="/" className="navbar-brand fw-bold text-white">
          BOOKS4EVERYONE
        </Link>
        <Button className='btn btn-outline-light ms-auto' onClick={() => navigate('/profile')}>
          Torna al profilo
        </Button>
        <Button className='btn btn-outline-light ms-auto' onClick={() => navigate('/add-offer')}>
          Nuova offerta
        </Button>
      </nav>
      <div className="container py-4 main-content">
        <h2 className="mb-4 text-center">Le mie offerte</h2>
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" />
          </div>
        ) : offers.length === 0 ? (
          <p className="text-center">Non hai ancora pubblicato nessuna offerta.</p>
        ) : (
          offers.map((offer) => (
            <div
              key={offer._id}
              className="offer-card card mb-4 overflow-hidden shadow position-relative"
              onMouseLeave={() => setVisibleComments(null)}
            >
              <div className="d-flex flex-row align-items-center">
                <Card.Img
                  variant="left"
                  src={offer.immagineLibro}
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
                    <Button
                      variant="info"
                      className="comment-button"
                      onClick={() => toggleComments(offer._id)}
                    >
                      Commenti
                    </Button>
                  </div>
                </Card.Body>
              </div>
              {visibleComments === offer._id && (
                <div className="bg-light p-3 border-top">
                  {commentsByOffer[offer._id]?.length > 0 ? (
                    commentsByOffer[offer._id].map((comment, idx) => (
                      <p key={idx}><strong>{comment.utente?.username || 'Utente'}:</strong> {comment.titolo}</p>
                    ))
                  ) : (
                    <p>Ancora nessun commento...</p>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
      <Footer />
    </>
  )
}

export default MyOffersPage