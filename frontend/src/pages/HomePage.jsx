import { useEffect, useState } from 'react'
import axios from '../utils/axiosConfig'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useNavigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'

function HomePage() {
  const [offers, setOffers] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await axios.get('/offers')
        setOffers(res.data)
      } catch (err) {
        console.error('Errore nel recupero delle offerte:', err)
      }
    }
    fetchOffers()
  }, [])

  const calcolaMediaVoto = (commenti) => {
    if (!commenti || commenti.length === 0) return 0
    const somma = commenti.reduce((acc, curr) => acc + curr.voto, 0)
    return Math.round(somma / commenti.length)
  }

  const renderStars = (media) => {
    return [...Array(5)].map((_, i) => (
      <span key={i} className={i < media ? 'text-warning' : 'text-secondary'}>★</span>
    ))
  }

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="row">
          {/* Sidebar */}
          <div className="col-md-3 bg-light d-none d-md-block p-3 sidebar">
            <h5>Menu</h5>
            <button className="btn btn-outline-primary w-100 my-4" onClick={() => navigate('/cart')}>Carrello</button>
            <button className="btn btn-outline-success w-100" onClick={() => navigate('/new-offer')}>Nuova Offerta</button>
          </div>

          {/* Main content */}
          <div className="col-md-9 col-12 p-3">
            <div className="row">
              {offers.map((offer) => (
                <div key={offer._id} className="col-sm-12 col-md-6 col-lg-4 mb-4 g-2">
                  <div
                    className="card offer-card h-100 position-relative overflow-hidden custom-card"
                    style={{ transition: 'all 0.3s ease' }}
                  >
                    {offer.immagineLibro && (
                      <img
                        src={offer.immagineLibro}
                        className="card-img-top custom-card-img"
                        alt={offer.titolo}
                      />
                    )}
                    <div className="card-body">
                      <h5 className="card-title fw-bold">{offer.titolo}</h5>
                      <div>{renderStars(calcolaMediaVoto(offer.commenti))}</div>
                      {offer.commenti?.[0] && (
                        <p className="card-text mt-2">{offer.commenti[0].testo}</p>
                      )}
                      <p className="card-text text-muted mt-2">
                        Pubblicato da: {offer.user?.username || 'Utente sconosciuto'}
                      </p>
                    </div>
                    <div className="details-button-container">
                      <button
                        className="btn btn-primary"
                        onClick={() => navigate(`/offerta/${offer._id}`)}
                      >
                        Vedi Dettagli
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default HomePage