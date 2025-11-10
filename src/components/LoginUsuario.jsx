// LoginPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/LoginUsuario.css';
import hotelRoomImage from '../assets/libro.jpg'; // Asegúrate de tener esta imagen

const LoginPage = ({ onSubmit, onChange, formData, errorMessage }) => { // Recibe errorMessage como prop
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmitLocal = (e) => {
    e.preventDefault();
    localStorage.setItem('rememberMe', rememberMe);
    onSubmit(e);
  };

  return (
    <div className="container-general">
      <div className="login-container">
        <div className="login-card">
          <div className="hotel-image">
            <img src={hotelRoomImage} alt="Habitación de hotel" />
          </div>
          <div className="login-form-container">
            <h1 className="login-title">Iniciar sesión</h1>

            <form onSubmit={handleSubmitLocal} className="login-form">
              <div className="form-group">
                <div className="input-icon-wrapper">
                  <i className="icon user-icon">👤</i>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={onChange}
                    placeholder="Email"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="input-icon-wrapper">
                  <i className="icon lock-icon">🔒</i>
                  <input
                    type="password"
                    id="password"
                    name="password_hash"
                    value={formData.password_hash}
                    onChange={onChange}
                    placeholder="Contraseña"
                    required
                  />
                </div>
              </div>

              <div className="form-options">
                <div className="remember-me">
                  <input
                    type="checkbox"
                    id="remember"
                    name="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label htmlFor="remember">Recordar</label>
                </div>
                <Link to="/register" className="new-account">Crear cuenta</Link>
              </div>

              {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Muestra el mensaje de error */}

              <button type="submit" className="login-button">INGRESAR</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;