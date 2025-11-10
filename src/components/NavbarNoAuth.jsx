// src/components/NavbarNoAuth.jsx
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../styles/navBar.css'; // Reutilizamos los estilos

function NavbarNoAuth() {
    const location = useLocation();
  return (
    <motion.nav
      className="navbar"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8 }}
    >
        <div className="logo">
          <span className="logo-text">Plataforma de Libros</span>
        </div>
        
      <ul className="nav-links">
        <li className={location.pathname === '/register' ? 'blinking-login' : ''}>
          <Link to="/register">
            <span className="nav-text">Registrar Usuario</span>
          </Link>
          
        </li>
        <li className={location.pathname === '/' ? 'blinking-login' : ''}>
          <Link to="/">
            <span className="nav-text">Iniciar Sesión</span>
          </Link>
        </li>
      </ul>
    </motion.nav>
  );
}

export default NavbarNoAuth;