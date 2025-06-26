// src/pages/OrderSummaryPage.jsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function OrderSummaryPage() {
  const [order, setOrder] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const storedOrder = localStorage.getItem('ultimoOrdine')
    if (storedOrder) {
      setOrder(JSON.parse(storedOrder))
    }
  }, [])

  const isSingular = order.length === 1

  return (
    <>
      <Navbar />

      <div className="container py-5">
        <div className="text-center">
          <h2 className="mb-4">Resoconto ordine</h2>
          <p className="lead">
            {isSingular ? 'Richiesta inviata' : 'Richieste inviate'} al {isSingular ? 'venditore' : 'venditori'}.
          </p>
          <p className="text-muted">
            Puoi visualizzare i dettagli delle tue richieste nella <strong>pagina del carrello</strong>.
          </p>

          <div className="d-flex justify-content-center gap-3 mt-4 flex-wrap">
            <button className="btn btn-primary" onClick={() => navigate('/')}>Torna alla Home</button>
            <button className="btn btn-outline-secondary" onClick={() => navigate('/cart')}>Vai al Carrello</button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default OrderSummaryPage