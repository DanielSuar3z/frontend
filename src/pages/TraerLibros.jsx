import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { urlBackend } from '../config/envs';

function TraerLibros() {
  const [materiales, setMateriales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMateriales = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${urlBackend}/api/ontologia/query`);

        // VERIFICA LA ESTRUCTURA REAL DE LA RESPUESTA
        console.log('Respuesta completa del backend:', response);
        console.log('Datos recibidos:', response.data);

        // Dependiendo de la estructura de tu backend modificado:

        // OPCIÓN 1: Si response.data es directamente el array
        setMateriales(response.data.data);

        // OPCIÓN 2: Si response.data tiene propiedad 'data'
        // setMateriales(response.data.data);

        // OPCIÓN 3: Si response.data tiene propiedad 'materiales'  
        // setMateriales(response.data.materiales);

      } catch (err) {
        console.error('Error detallado:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMateriales();
  }, []);

  if (loading) {
    return <div>Cargando materiales de biblioteca...</div>;
  }

  if (error) {
    return <div>Error al cargar los materiales: {error.message}</div>;
  }

  return (
    <div>
      <h2>Lista de Materiales de la Biblioteca</h2>

      {loading && <div>Cargando materiales...</div>}
      {error && <div>Error al cargar los materiales: {error.message}</div>}

      {!loading && !error && materiales.length === 0 && (
        <div>No se encontraron materiales</div>
      )}

      {Array.isArray(materiales) && materiales.map((material, index) => (
        <div key={index} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
          <h3>{material.titulo}</h3>
          <p><strong>Autor:</strong> {material.autor}</p>
        </div>
      ))}
    </div>
  );

}

export default TraerLibros;