// pages/inicioSesion.jsx
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom'; // Importa useContext
import LoginPage from '../components/LoginUsuario';
import { AuthContext } from '../App'; // Importa el contexto de autenticación
import '../styles/RegisterUsuario.css';

import { urlBackend } from '../config/envs';

const InicioSesion = () => {
  const [formData, setFormData] = useState({
    email: '',
    password_hash: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { setIsAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if (location.state?.logoutSuccess) {
      setSuccessMessage('Sesión cerrada correctamente');
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      navigate('/inicio');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    console.log('Intentando iniciar sesión con:', formData);

    try {
      const response = await axios.post(`${urlBackend}/api/auth/login`, formData);
      console.log('Inicio de sesión exitoso', response.data);

      // ¡¡¡CAMBIO CLAVE AQUÍ!!! Accede a response.data.data.token
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('usuarioId', response.data.data.usuarioId);
      // localStorage.setItem('userEmail', response.data.data.email); // Opcional, si lo necesitas
      // localStorage.setItem('userRol', response.data.data.rol);     // Opcional, si lo necesitas

      console.log('Token guardado (desde login):', localStorage.getItem('token')); // Ahora debería mostrar el token real

      setIsAuthenticated(true);
      console.log('Navegando a /inicio');
      navigate('/inicio');
    } catch (error) {
      console.error('Error al iniciar sesión', error);
      const errorMsg = error.response?.data?.error || 'Error al iniciar sesión. Intente nuevamente.';
      setErrorMessage(errorMsg);
    }
  };

  return (
    <div className="ingreso-page">
      <div className="register-page">
        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}
      </div>

      <LoginPage
        onSubmit={handleSubmit}
        onChange={handleChange}
        formData={formData}
        errorMessage={errorMessage}
      />
    </div>
  );
};

export default InicioSesion;