import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../styles/navBar.css';

function NavbarAuth({ handleLogout }) {
  const location = useLocation();

  // Lista de enlaces para la navegación
  const navItems = [
    { path: '/BuscarLibro', label: 'Buscar Libro', icon: '📚' },
    { path: '/perfil', label: 'Mi Perfil', icon: '👤' },
    { path: '/RegisterLibro', label: 'Registrar Libro', icon: '+' },
    { path: '/', label: 'Cerrar Sesión', icon: '🔗', isLogout: true } 
  ];

  // Función para manejar el clic en el enlace de Cerrar Sesión
  const handleLogoutClick = (e) => {
    e.preventDefault(); // Previene la navegación predeterminada del Link
    handleLogout();     // Llama a la función de cerrar sesión
  };

  return (
    <motion.nav
      className="navbar"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <Link to="/inicio" className="logo-link">
        <div className="logo">
          <span className="logo-text">Plataforma de Libros</span>
        </div>
      </Link>

      <ul className="nav-links">
        {navItems.map((item) => (
          <li
            key={item.path}
            className={location.pathname === item.path ? 'blinking-login' : ''}
          >
            {item.isLogout ? ( // Si es el enlace de cerrar sesión
              <Link to={item.path} onClick={handleLogoutClick}> {/* Le pasamos el onClick */}
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.label}</span>
              </Link>
            ) : ( // Si es un enlace normal
              <Link to={item.path}>
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.label}</span>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </motion.nav>
  );
}

export default NavbarAuth;