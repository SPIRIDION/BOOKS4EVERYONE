import { useEffect, useState } from 'react'
import axios from '../utils/axiosConfig'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useNavigate } from 'react-router-dom'
import { Spinner } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

function HomePage() {
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchOffersWithRatings = async () => {
      try {
        const res = await axios.get('/offers')
        const offers = res.data

        const offersWithRatings = await Promise.all(
          offers.map(async (offer) => {
            try {
              const commentRes = await axios.get(`/comments/${offer._id}`)
              const commenti = commentRes.data
              const media =
                commenti.length > 0
                  ? Math.round(commenti.reduce((acc, c) => acc + c.rate, 0) / commenti.length)
                  : 0
              return { ...offer, commenti, mediaVoto: media }
            } catch {
              return { ...offer, commenti: [], mediaVoto: 0 }
            }
          })
        )

        setOffers(offersWithRatings)
      } catch (err) {
        console.error('Errore nel recupero delle offerte:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchOffersWithRatings()
  }, [])

  const renderStars = (media) => {
    return [...Array(5)].map((_, i) => (
      <span key={i} className={i < media ? 'text-warning' : 'text-secondary'}>★</span>
    ))
  }

  return (
    <div>
      <Navbar />
      <div className="container main-content py-4">
        <div className="row">
          
          {/* Sidebar tablet e desktop */}
          <div className="col-md-3 d-none d-md-block bg-light p-3 sidebar shadow-sm">
            <h5><i className="bi bi-cart-fill me-2"></i>Menu</h5>
            <button className="btn btn-outline-primary w-100 my-4" onClick={() => navigate('/cart')}>
              <i className="bi bi-cart3 me-2"></i>Carrello
            </button>
          </div>

          {/* Sidebar mobile come menu a tendina */}
          <div className="col-12 d-md-none mb-4">
            <details className="border rounded p-3 bg-light shadow-sm mobile-sidebar" style={{ transition: 'all 0.3s ease' }}>
              <summary className="fw-bold d-flex align-items-center">
                <i className="bi bi-cart-fill me-2"></i> Menu
              </summary>
              <button className="btn btn-outline-primary w-100 mt-3" onClick={() => navigate('/cart')}>
                <i className="bi bi-cart3 me-2"></i>Carrello
              </button>
            </details>
          </div>

          {/* Main Content */}
          <div className="col-md-9 col-12">
            {loading ? (
              <div className="text-center my-5">
                <Spinner animation="border" />
              </div>
            ) : (
              <div className="row">
                {offers.map((offer) => (
                  <div key={offer._id} className="col-12 col-sm-6 col-lg-4 mb-4">
                    <div className="card h-100 shadow-sm">
                      {offer.immagineLibro && (
                        <img
                          src={offer.immagineLibro}
                          alt={offer.titolo}
                          className="card-img-top"
                          style={{ height: '200px', objectFit: 'cover' }}
                        />
                      )}
                      <div className="card-body d-flex flex-column">
                        <h5 className="card-title">{offer.titolo}</h5>
                        <div className="mb-2">{renderStars(offer.mediaVoto)}</div>
                        <p className="text-muted mt-auto">
                          Pubblicato da: <strong>{offer.user?.username || 'Utente sconosciuto'}</strong>
                        </p>
                        <button
                          className="btn btn-primary mt-2"
                          onClick={() => navigate(`/offerta/${offer._id}`)}
                        >
                          Vedi Dettagli
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default HomePage