// App.jsx
import InicioSesion from './pages/inicioSesion';
import Inicio from './pages/inicio';
//import Inicio from './components/TraerLibros';
import Register from './pages/Register';
import TraerLibros from './pages/TraerLibros';
import BuscarMaterialPage from './pages/BuscarMaterialPage';
import UserProfile from './pages/UserProfile';

import { urlBackend } from './config/envs';

import NavbarNoAuth from './components/NavbarNoAuth';
import NavbarAuth from './components/navBar';
import RegisterLibro from './components/RegisterLibro';


import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState, createContext } from 'react';

// Crear un contexto de autenticación para compartir en toda la aplicación
export const AuthContext = createContext();

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Verificar conexión con la API (ontología)
  useEffect(() => {
    axios.get(`${urlBackend}/api/ontologia/query`)
      .then(response => {
        console.log('Respuesta del backend (ontología):', response.data);
      })
      .catch(error => {
        console.error('Error al conectar con la API (ontología):', error);
      });
  }, []);

  // Función para cerrar sesión que podemos pasar al NavbarAuth
  const handleLogout = () => {
    // Eliminar tokens
    localStorage.removeItem('token');
    localStorage.removeItem('usuarioId');
    sessionStorage.removeItem('token');

    // Actualizar el estado de autenticación
    setIsAuthenticated(false);

    // Redirigir al login
    navigate('/', { state: { logoutSuccess: true } });
    console.log('Sesión cerrada desde App.js');
  };

  // Verificar autenticación al cargar y cuando cambia la ruta
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      console.log('Verificando token:', token, 'Ruta:', location.pathname);

      if (token) {
        setIsAuthenticated(true);
        console.log('Autenticado.');

        // Si estamos en la página de login y hay token, redirigir a inicio
        if (location.pathname === '/') {
          navigate('/inicio');
        }
      } else {
        setIsAuthenticated(false);
        console.log('No autenticado');

        // Rutas protegidas que requieren autenticación
        const protectedRoutes = ['/inicio', '/buscar', '/perfil', '/RegisterLibro', '/BusquedaLibros'];

        if (protectedRoutes.includes(location.pathname)) {
          console.log('Intentando acceder a ruta protegida, redirigiendo a login');
          navigate('/');
        }
      }
    };

    checkAuth();
  }, [navigate, location.pathname, isAuthenticated]); // Añadida isAuthenticated como dependencia

  // Interceptores de Axios
  useEffect(() => {
    // Interceptor de solicitudes para agregar token
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Interceptor de respuestas para manejar errores de autenticación
    const responseInterceptor = axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response && error.response.status === 401) {
          // Si recibimos un 401 (No autorizado), limpiar el token y redirigir al inicio de sesión
          localStorage.removeItem('token');
          localStorage.removeItem('usuarioId');
          sessionStorage.removeItem('token');
          setIsAuthenticated(false);
          navigate('/');
        }
        return Promise.reject(error);
      }
    );

    // Limpiar interceptores al desmontar el componente
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [navigate, setIsAuthenticated]); // Añadida setIsAuthenticated como dependencia

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, handleLogout }}>
      {isAuthenticated ? <NavbarAuth handleLogout={handleLogout} /> : <NavbarNoAuth />}
      <div className="App">
        <Routes>
          <Route path="/" element={<InicioSesion setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/inicio" element={<Inicio />} />
          <Route path="/register" element={<Register />} />
          <Route path="/buscar" element={<TraerLibros />} />
          <Route path="/RegisterLibro" element={<RegisterLibro />} />
          <Route path="/BuscarMaterial" element={<BuscarMaterialPage />} />
          <Route path="/perfil" element={<UserProfile />} />
          <Route path="/BuscarLibro" element={<TraerLibros />} />
          {/* Puedes añadir más rutas aquí */}
        </Routes>
      </div>
    </AuthContext.Provider>
  );
}

export default App;