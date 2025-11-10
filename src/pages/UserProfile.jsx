// src/components/UserProfile.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/UserProfile.css';
// Asegúrate de que cualquier otro import que necesites esté aquí
// Por ejemplo, si tienes un componente de navegación u otros estilos.

import { urlBackend } from '../config/envs';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      console.log('Frontend - Token obtenido de localStorage:', token);

      if (!token) {
        setError("No hay token de autenticación. Por favor, inicia sesión.");
        setLoading(false);
        return; // Detiene la ejecución si no hay token
      }

      try {
        const response = await axios.get(`${urlBackend}/api/auth/perfil`, {
          headers: {
            Authorization: `Bearer ${token}` // Envía el token en el encabezado
          }
        });
        // Aquí accedes a la propiedad 'data' que contiene los datos del usuario
        setUser(response.data.data);
      } catch (err) {
        console.error("Error al cargar el perfil del usuario:", err);
        if (err.response) {
          if (err.response.status === 401 || err.response.status === 403) {
            setError("Tu sesión ha expirado o es inválida. Por favor, inicia sesión de nuevo.");
          } else if (err.response.status === 404) {
            setError("Ruta del perfil no encontrada. Verifica la URL.");
          } else {
            setError(err.response.data?.message || 'Error al cargar el perfil. Intenta de nuevo más tarde.');
          }
        } else {
          setError('No se pudo conectar con el servidor. Intenta de nuevo más tarde.');
        }
      } finally {
        setLoading(false); // Finaliza la carga
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <div className="pag-fondo">
      <div className="profile-container">
        {loading && <p className="loading-message">Cargando perfil del usuario...</p>}

        {error && <p className="error-message">Error: {error}</p>}

        {user ? (
          <div className="profile-content">
            <h2 className="profile-title">Mi Perfil</h2>

            <div className="profile-section">
              <div className="profile-header">
                <div className="profile-avatar">
                  {user.nombres &&
                    `${user.nombres.charAt(0)}${user.apellidos.charAt(0)}`
                  }
                </div>
                <div className="profile-name">
                  <h3>{user.nombres} {user.nombre2_usuario} {user.apellidos} </h3>
                  <p className="profile-id">ID: {user.id_usuario}</p>
                </div>
              </div>
            </div>

            <div className="profile-section">
              <h4 className="section-title">Información de contacto</h4>
              <div className="profile-field">
                <span className="field-label">Email:</span>
                <span className="field-value">{user.email}</span>
              </div>
              <div className="profile-field">
                <span className="field-label">Teléfono:</span>
                <span className="field-value">{user.Telefono}</span>
              </div>
            </div>

            <div className="profile-section">
              <h4 className="section-title">Información personal</h4>
              <div className="profile-field">
                <span className="field-label">Dirección :</span>
                <span className="field-value">{user.direccion}</span>
              </div>
              <div className="profile-field">
                <span className="field-label">Código de Estudiante: </span>
                <span className="field-value">{user.codigo_estudiante}</span>
              </div>
            </div>
          </div>
        ) : (
          !loading && !error &&
          <div className="no-profile">
            <p>No se encontraron datos del perfil.</p>
            <p>Por favor, inicia sesión o intenta de nuevo.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;