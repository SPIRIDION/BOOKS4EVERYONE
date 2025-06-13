import { Link, useLocation } from 'react-router-dom'
import 'bootstrap-icons/font/bootstrap-icons.css';

function Navbar() {
  const location = useLocation()

  const isHome = location.pathname === '/'

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      {/* Logo del sito */}
      <Link to="/" className="navbar-brand fw-bold text-white">
        BOOKS4EVERYONE
      </Link>

      {/* Pulsante centrale placeholder */}
      <div className="mx-auto">
        <button className="btn btn-outline-light">Menù</button>
      </div>

      {/* Icona profilo utente SOLO in homepage */}
      {isHome && (
        <Link to="/profile" className="btn btn-outline-light ms-auto">
          <i className="bi bi-person-circle fs-4"></i> {}
        </Link>
      )}
    </nav>
  )
}

export default Navbar