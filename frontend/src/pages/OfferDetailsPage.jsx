import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaStar } from "react-icons/fa";
import { Button, Spinner } from "react-bootstrap";

const OfferDetailsPage = () => {
  const { offerId } = useParams();
  const [offer, setOffer] = useState(null);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [loading, setLoading] = useState(true);

  const API_URL = "http://localhost:3001";

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const res = await axios.get(`${API_URL}/offers/${offerId}`);
        setOffer(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Errore nel recupero dell'offerta:", error);
        setLoading(false);
      }
    };

    fetchOffer();
  }, [offerId]);

  const fetchComments = async () => {
    try {
      const res = await axios.get(`${API_URL}/comments/${offerId}`);
      setComments(res.data);
      setShowComments(true);
    } catch (error) {
      console.error("Errore nel recupero dei commenti:", error);
    }
  };

  const renderStars = (averageRating) => {
    const fullStars = Math.round(averageRating);
    return [...Array(5)].map((_, i) => (
      <FaStar key={i} color={i < fullStars ? "gold" : "lightgray"} />
    ));
  };

  const calculateAverageRating = () => {
    if (!comments.length) return 0;
    const sum = comments.reduce((acc, curr) => acc + curr.voto, 0);
    return sum / comments.length;
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container my-5">
        {offer && (
          <div className="text-center">
            <img
              src={offer.immagineLibro}
              alt={offer.titolo}
              className="img-fluid mb-3"
              style={{ maxHeight: "400px", objectFit: "cover" }}
            />
            <h2 className="fw-bold">{offer.titolo}</h2>
            <div className="my-2">{renderStars(calculateAverageRating())}</div>
            <p className="lead">{offer.descrizione}</p>
            <p>
              <strong>Venditore:</strong> {offer.userId?.username || "Anonimo"}
            </p>
            <div className="d-flex justify-content-center gap-3 my-3">
              <Button variant="outline-primary">Noleggio 15 giorni</Button>
              <Button variant="outline-primary">Noleggio 30 giorni</Button>
              <Button variant="primary">Acquista</Button>
            </div>
            <div>
              <Button variant="secondary" onClick={fetchComments}>
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
                <div key={comment._id} className="border rounded p-3 mb-2">
                  <div>{renderStars(comment.voto)}</div>
                  <p className="mb-1">{comment.testo}</p>
                  <small>
                    — {comment.userId?.username || "Utente anonimo"}
                  </small>
                </div>
              ))
            ) : (
              <p>Nessun commento disponibile.</p>
            )}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default OfferDetailsPage;