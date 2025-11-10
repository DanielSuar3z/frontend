// src/pages/Inicio.jsx - VERSIÓN CORREGIDA
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import InicioPag from '../components/InicioPag';
import '../styles/InicioPag.css';

import { urlBackend } from '../config/envs';

function Inicio() {
  const [materiales, setMateriales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMateriales = async () => {
      try {
        const response = await axios.get(`${urlBackend}/api/ontologia/query`);

        // DEBUG: Ver la estructura real
        console.log('Respuesta completa:', response);
        console.log('Datos recibidos:', response.data);

        // OPCIÓN A: Si response.data es directamente el array
        setMateriales(response.data.data);

        // OPCIÓN B: Si response.data tiene propiedad 'data'  
        // setMateriales(response.data.data);

        // OPCIÓN C: Si response.data tiene propiedad 'materiales'
        // setMateriales(response.data.materiales);       
        console.log('Estructura real:', response.data); // ← Agrega esto
        setMateriales(response.data); // ← Prueba esto primero

      } catch (err) {
        console.error('Error al cargar materiales:', err);
        setError('Error al cargar los materiales. Intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchMateriales();
  }, []);

  if (loading) {
    return <div className="loading-message">Cargando materiales...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="inicio-container">
      {/* Pasar materiales en lugar de hoteles */}
      <InicioPag libros={materiales.data} />
    </div>
  );
}

export default Inicio;