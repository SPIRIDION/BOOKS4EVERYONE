import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../utils/axiosConfig'
import Footer from '../components/Footer'
import './MyOffersPage.css'

function MyOffersPage() {
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [visibleComments, setVisibleComments] = useState(null)
  const [commentsByOffer, setCommentsByOffer] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await api.get('/offers/mine')
        const offersWithRatings = await Promise.all(
          res.data.map(async (offer) => {
            try {
              const commentRes = await api.get(`/comments/${offer._id}`)
              const comments = commentRes.data
              const avg =
                comments.length > 0
                  ? (comments.reduce((acc, c) => acc + c.rate, 0) / comments.length).toFixed(1)
                  : 'N/A'
              return { ...offer, comments, averageRate: avg }
            } catch {
              return { ...offer, comments: [], averageRate: 'N/A' }
            }
          })
        )
        setOffers(offersWithRatings)
      } catch (err) {
        console.error('Errore nel caricamento offerte:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchOffers()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Sei sicuro di voler eliminare questa offerta?')) return
    try {
      await api.delete(`/offers/${id}`)
      setOffers((prev) => prev.filter((offer) => offer._id !== id))
    } catch (err) {
      console.error('Errore durante l\'eliminazione:', err)
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
    }
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
        <Link to="/" className="navbar-brand fw-bold text-white">
          BOOKS4EVERYONE
        </Link>
        <button className="btn btn-custom-navbar ms-auto" onClick={() => navigate('/profile')}>
          Torna al profilo
        </button>
        <button className="btn btn-custom-navbar ms-2" onClick={() => navigate('/add-offer')}>
          Nuova offerta
        </button>
      </nav>

      <div className="container py-4">
        <h2 className="mb-4 text-center">Le mie offerte</h2>

        {loading ? (
          <div className="text-center mt-5">
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        ) : offers.length === 0 ? (
          <p className="text-center">Non hai ancora pubblicato nessuna offerta.</p>
        ) : (
          offers.map((offer) => (
            <div key={offer._id} className="offer-wrapper mb-4">
              <div className="card offer-card">
                <div className="row g-0 flex-md-row flex-column">
                  <div className="col-md-3">
                    <img
                      src={offer.immagineLibro}
                      className="img-fluid h-100 offer-img"
                      alt={offer.titolo}
                    />
                  </div>
                  <div className="col-md-9 p-3 d-flex flex-column justify-content-between">
                    <div>
                      <h5 className="fw-bold">{offer.titolo}</h5>
                      <p><strong>Voto medio:</strong> {offer.averageRate}</p>
                      <p>{offer.descrizione}</p>
                    </div>
                    <div className="action-buttons">
                      <button className="btn btn-warning btn-sm me-2" onClick={() => navigate(`/modifica-offerta/${offer._id}`)}>
                        Modifica
                      </button>
                      <button className="btn btn-danger btn-sm me-2" onClick={() => handleDelete(offer._id)}>
                        Elimina
                      </button>
                      <button className="btn btn-info btn-sm" onClick={() => toggleComments(offer._id)}>
                        Commenti
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {visibleComments === offer._id && (
                <div className="comment-section bg-light p-3 mt-2 rounded shadow-sm">
                  {commentsByOffer[offer._id]?.length > 0 ? (
                    commentsByOffer[offer._id].map((comment) => (
                      <div key={comment._id} className="d-flex align-items-start border-bottom py-2">
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
                    <p>Nessun commento disponibile.</p>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </>
  )
}

export default MyOffersPage