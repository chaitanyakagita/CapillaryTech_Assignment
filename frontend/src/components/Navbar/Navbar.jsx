import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from '../../assets/capilary-logo.jpeg'

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="Capillary Logo" className="logo-image" />
          <span className="logo-text">CapillaryTechBot</span>
        </Link>
        <div className="navbar-links">
          <Link to="/" className="navbar-link">
            <i className="fas fa-home"></i> Home
          </Link>
          <Link to="/chat" className="navbar-link">
            <i className="fas fa-comment-dots"></i> Chat
          </Link>
        </div>
      </div>
    </nav>
  );
}