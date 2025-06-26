import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../utils/axiosConfig'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { FaStar } from 'react-icons/fa'
import { Button, Spinner, Form } from 'react-bootstrap'

const OfferDetailsPage = () => {
  const { offerId } = useParams()
  const navigate = useNavigate()
  const [offer, setOffer] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)

  const [newComment, setNewComment] = useState({
    titolo: '',
    rate: 0,
    testo: ''
  })

  const fetchOffer = async () => {
    try {
      const res = await api.get(`/offers/${offerId}`)
      setOffer(res.data)
    } catch (error) {
      console.error("Errore nel recupero dell'offerta:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchComments = async () => {
    try {
      const res = await api.get(`/comments/${offerId}`)
      setComments(res.data)
    } catch (error) {
      console.error("Errore nel recupero dei commenti:", error)
    }
  }

  const handleCommentChange = (e) => {
    const { name, value } = e.target
    setNewComment({ ...newComment, [name]: value })
  }

  const submitComment = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const res = await api.post(`/comments/${offerId}`, newComment, {
        headers: { Authorization: `Bearer ${token}` }
      })

      const user = JSON.parse(localStorage.getItem('user'))
      const commentWithUser = {
        ...res.data,
        user: {
          username: user.username,
          immagineProfilo: user.immagineProfilo || 'https://placehold.co/50x50'
        }
      }

      setComments([...comments, commentWithUser])
      setNewComment({ titolo: '', rate: 0, testo: '' })
    } catch (error) {
      console.error("Errore durante l'invio del commento:", error)
    }
  }

  const addToCart = (opzione) => {
    const cart = JSON.parse(localStorage.getItem('carrello')) || []
    const alreadyInCart = cart.find((item) => item._id === offer._id)

    if (!alreadyInCart) {
      const newItem = { ...offer, opzione }
      localStorage.setItem('carrello', JSON.stringify([...cart, newItem]))
    }

    navigate('/')
  }

  const renderStars = (averageRating) => {
    const fullStars = Math.round(averageRating)
    return [...Array(5)].map((_, i) => (
      <FaStar key={i} color={i < fullStars ? 'gold' : 'lightgray'} />
    ))
  }

  const calculateAverageRating = () => {
    if (!comments.length) return 0
    const sum = comments.reduce((acc, curr) => acc + curr.rate, 0)
    return sum / comments.length
  }

  useEffect(() => {
    fetchOffer()
    fetchComments()
  }, [offerId])

  if (loading || !offer) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    )
  }

  return (
    <>
      <Navbar />
      <div className="container my-5">
        <div className="text-center">
          <img
            src={offer.immagineLibro}
            alt={offer.titolo}
            className="img-fluid mb-3"
            style={{ maxHeight: '400px', objectFit: 'cover' }}
          />
          <h2 className="fw-bold">{offer.titolo}</h2>
          <div className="my-2">{renderStars(calculateAverageRating())}</div>
          <p className="lead">{offer.descrizione}</p>
          <p><strong>Venditore:</strong> {offer.user?.username || 'Anonimo'}</p>

          <div className="d-flex justify-content-center gap-3 my-4 flex-wrap">
            <Button variant="outline-primary" onClick={() => addToCart('noleggio_15')}>
              Noleggio 15 giorni: {offer.prezzo15}€
            </Button>
            <Button variant="outline-primary" onClick={() => addToCart('noleggio_30')}>
              Noleggio 30 giorni: {offer.prezzo30}€
            </Button>
            <Button variant="primary" onClick={() => addToCart('acquisto')}>
              Acquista: {offer.prezzoVendita}€
            </Button>
          </div>
        </div>

        {/* Commenti */}
        <div className="mt-5">
          <h4>Commenti:</h4>
          {comments.length ? (
            comments.map((comment) => (
              <div
                key={comment._id}
                className="d-flex align-items-start border rounded p-3 mb-3 shadow-sm"
              >
                <img
                  src={comment.user.immagineProfilo || 'https://placehold.co/50x50'}
                  alt="Profilo"
                  className="rounded-circle me-3"
                  style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                />
                <div className="flex-grow-1">
                  <h5 className="fw-bold">{comment.titolo}</h5>
                  <div>{renderStars(comment.rate)}</div>
                  <p className="mb-1">{comment.testo}</p>
                  <small className="text-muted">— {comment.user.username}</small>
                </div>
              </div>
            ))
          ) : (
            <p>Ancora nessun commento...</p>
          )}
        </div>

        {/* Aggiunta commento */}
        <div className="mt-5">
          <h4>Aggiungi un commento</h4>
          <Form onSubmit={submitComment}>
            <Form.Group className="mb-3">
              <Form.Label>Titolo</Form.Label>
              <Form.Control
                type="text"
                name="titolo"
                value={newComment.titolo}
                onChange={handleCommentChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Valutazione</Form.Label>
              <Form.Select
                name="rate"
                value={newComment.rate}
                onChange={handleCommentChange}
                required
              >
                <option value="">Scegli una valutazione</option>
                {[1, 2, 3, 4, 5].map((val) => (
                  <option key={val} value={val}>{val} stelle</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Commento</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="testo"
                value={newComment.testo}
                onChange={handleCommentChange}
                required
              />
            </Form.Group>

            <Button type="submit" variant="success">Invia commento</Button>
          </Form>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default OfferDetailsPage