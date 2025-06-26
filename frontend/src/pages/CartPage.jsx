import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './CartPage.css'

function CartPage() {
  const [cartItems, setCartItems] = useState([])
  const [lastOrder, setLastOrder] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('carrello')) || []
    const savedOrder = JSON.parse(localStorage.getItem('ultimoOrdine')) || null
    setCartItems(savedCart)
    setLastOrder(savedOrder)
  }, [])

  const removeFromCart = (id) => {
    const updatedCart = cartItems.filter((item) => item._id !== id)
    setCartItems(updatedCart)
    localStorage.setItem('carrello', JSON.stringify(updatedCart))
  }

  const handleSubmit = () => {
    localStorage.removeItem('carrello')
    localStorage.setItem('ultimoOrdine', JSON.stringify(cartItems))
    setCartItems([])
    navigate('/order-summary')
  }

  return (
    <div>
      <Navbar />
      <div className="container-fluid py-4">
        <div className="row">
          {/* Sidebar Ordini passati (Tablet e Desktop) */}
          <div className="col-md-3 d-none d-md-block">
            <div className="bg-light p-3 rounded shadow-sm">
              <h5>I miei ordini</h5>
              {lastOrder && lastOrder.length > 0 ? (
                lastOrder.map((order) => (
                  <div key={order._id} className="order-card border-bottom pb-2 mb-2">
                    <p className="mb-1 fw-bold">{order.titolo}</p>
                    <small className="text-muted">Opzione: {order.opzione}</small>
                  </div>
                ))
              ) : (
                <p className="text-muted">Nessun ordine effettuato</p>
              )}
            </div>
          </div>

          {/* Contenuto principale */}
          <div className="col-md-9">
            <h2 className="mb-4 text-center">Carrello</h2>

            {/* Sidebar Ordini passati (Mobile) */}
            <div className="d-md-none mb-4">
              <details>
                <summary className="fw-bold">Visualizza ordini passati</summary>
                <div className="mt-2">
                  {lastOrder && lastOrder.length > 0 ? (
                    lastOrder.map((order) => (
                      <div key={order._id} className="order-card border-bottom pb-2 mb-2">
                        <p className="mb-1 fw-bold">{order.titolo}</p>
                        <small className="text-muted">Opzione: {order.opzione}</small>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted">Nessun ordine effettuato</p>
                  )}
                </div>
              </details>
            </div>

            {cartItems.length === 0 ? (
              <p className="text-center">Il tuo carrello è vuoto.</p>
            ) : (
              cartItems.map((item) => (
                <div key={item._id} className="card mb-4 cart-card d-flex flex-md-row flex-column align-items-center shadow-sm">
                  <img
                    src={item.immagineLibro}
                    alt={item.titolo}
                    className="cart-image"
                  />
                  <div className="card-body w-100">
                    <h5 className="fw-bold">{item.titolo}</h5>
                    <p className="mb-1"><strong>Venditore:</strong> {item.user?.username}</p>
                    <p className="mb-3"><strong>Opzione selezionata:</strong> {item.opzione}</p>
                    <div className="d-flex flex-wrap gap-2">
                      <button className="btn btn-danger btn-sm" onClick={() => removeFromCart(item._id)}>Rimuovi</button>
                    </div>
                  </div>
                </div>
              ))
            )}

            {cartItems.length > 0 && (
              <div className="text-center">
                <button className="btn btn-success mt-3" onClick={handleSubmit}>Invia richiesta</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage