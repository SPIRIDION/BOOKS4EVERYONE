import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../utils/axiosConfig'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { FaStar } from 'react-icons/fa'
import { Button, Spinner, Form } from 'react-bootstrap'

const OfferDetailsPage = () => {
  const { offerId } = useParams()
  const [offer, setOffer] = useState(null)
  const [comments, setComments] = useState([])
  const [showComments, setShowComments] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [newComment, setNewComment] = useState({ titolo: '', testo: '', rate: 1 })

  const fetchOffer = async () => {
    try {
      const res = await api.get(`/offers/${offerId}`)
      setOffer(res.data)
    } catch (error) {
      console.error('Errore nel recupero dell\'offerta:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchComments = async () => {
    try {
      const res = await api.get(`/comments/${offerId}`)
      setComments(res.data)
      setShowComments(true)
    } catch (error) {
      console.error('Errore nel recupero dei commenti:', error)
    }
  }

  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post(`/comments/${offerId}`, newComment)
      setComments((prev) => [...prev, res.data])
      setNewComment({ titolo: '', testo: '', rate: 1 })
      setShowForm(false)
    } catch (err) {
      console.error('Errore nell\'aggiunta del commento:', err)
    }
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
  }, [offerId])

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    )
  }

  return (
    <>
      <Navbar />
      <div className="container my-5 main-content">
        {offer && (
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

            <div className="d-flex justify-content-center gap-3 my-3">
              <Button variant="outline-primary">Noleggio 15 giorni</Button>
              <Button variant="outline-primary">Noleggio 30 giorni</Button>
              <Button variant="primary">Acquista</Button>
            </div>

            <div>
              <Button
                style={{ backgroundColor: '#0d6efd', borderColor: '#0d6efd' }}
                onClick={fetchComments}
              >
                Mostra Commenti
              </Button>
            </div>
          </div>
        )}

        {showComments && (
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

            {/* Button per mostrare il form */}
            {localStorage.getItem('token') && !showForm && (
              <Button className="mt-3" onClick={() => setShowForm(true)}>
                Aggiungi un commento
              </Button>
            )}

            {/* Form per aggiunta commento */}
            {showForm && (
              <Form onSubmit={handleCommentSubmit} className="mt-4">
                <Form.Group className="mb-2">
                  <Form.Label>Titolo</Form.Label>
                  <Form.Control
                    type="text"
                    value={newComment.titolo}
                    onChange={(e) => setNewComment({ ...newComment, titolo: e.target.value })}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label>Testo</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={newComment.testo}
                    onChange={(e) => setNewComment({ ...newComment, testo: e.target.value })}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label>Valutazione (1-5)</Form.Label>
                  <Form.Control
                    type="number"
                    min={1}
                    max={5}
                    value={newComment.rate}
                    onChange={(e) => setNewComment({ ...newComment, rate: parseInt(e.target.value) })}
                    required
                  />
                </Form.Group>

                <Button type="submit" variant="success">
                  Invia Commento
                </Button>
              </Form>
            )}
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}

export default OfferDetailsPage