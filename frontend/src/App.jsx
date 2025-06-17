// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar'
import Footer from './components/Footer'

import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'
import OfferDetailsPage from "./pages/OfferDetailsPage";
import MyOffersPage from './pages/MyOffersPage'

function App() {
  return (
    <BrowserRouter>
      <div className="d-flex flex-column min-vh-100">
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/offerta/:offerId" element={<OfferDetailsPage />} />
            <Route path="/my-offers" element={<MyOffersPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App