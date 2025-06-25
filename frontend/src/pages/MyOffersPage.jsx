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
          } catch {
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
        <Button className="btn-custom-navbar ms-auto" onClick={() => navigate('/profile')}>
          Torna al profilo
        </Button>
        <Button className="btn-custom-navbar ms-2" onClick={() => navigate('/add-offer')}>
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
            <div key={offer._id} className="mb-4">
              <div className="card offer-card d-flex flex-md-row flex-column align-items-center shadow-sm">
                <img
                  src={offer.immagineLibro}
                  className="offer-image"
                  alt={offer.titolo}
                />
                <div className="card-body d-flex flex-column justify-content-between w-100">
                  <div>
                    <h5 className="card-title fw-bold">{offer.titolo}</h5>
                    <p><strong>Voto medio:</strong> {offer.averageRate}</p>
                    <p>{offer.descrizione}</p>
                  </div>
                  <div className="offer-buttons mt-3">
                    <Button
                      variant="warning"
                      size="sm"
                      className="me-2 mb-2"
                      onClick={() => navigate(`/modifica-offerta/${offer._id}`)}
                    >
                      Modifica
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      className="me-2 mb-2"
                      onClick={() => handleDelete(offer._id)}
                    >
                      Elimina
                    </Button>
                    <Button
                      variant="info"
                      size="sm"
                      className="mb-2"
                      onClick={() => toggleComments(offer._id)}
                    >
                      Commenti
                    </Button>
                  </div>
                </div>
              </div>

              {visibleComments === offer._id && (
                <div className="comment-section bg-light p-3 mt-2 rounded shadow-sm">
                  {commentsByOffer[offer._id]?.length > 0 ? (
                    commentsByOffer[offer._id].map((comment) => (
                      <div
                        key={comment._id}
                        className="d-flex align-items-start border-bottom py-2"
                      >
                        <img
                          src={comment.user.immagineProfilo || 'https://placehold.co/50x50'}
                          alt="Profilo"
                          className="rounded-circle me-3"
                          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                        />
                        <div>
                          <h6 className="fw-bold mb-1">{comment.titolo}</h6>
                          <p className="mb-1">{comment.testo}</p>
                          <small className="text-muted">— {comment.user.username}</small>
                        </div>
                      </div>
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