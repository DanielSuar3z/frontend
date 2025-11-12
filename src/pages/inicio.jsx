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
        console.log('🔄 Iniciando carga de materiales...');

        // CONSULTA SPARQL CORRECTA que incluye código de barras y disponibilidad
        const sparqlQuery = `
          PREFIX : <http://www.biblioteca.edu.co/ontologia#>

          SELECT ?obra ?titulo ?codigoBarras ?disponibilidad ?autor ?año ?genero ?materia
          WHERE {
            ?obra a :Obra ;
                  :tituloOriginal ?titulo ;
                  :esRealizadaPor ?expresion .
                  
            ?expresion :esMaterializadaPor ?manifestacion .
            
            ?manifestacion :esEjemplificadaPor ?item .
            
            ?item a :Item ;
                  :codigoBarras ?codigoBarras ;
                  :disponibilidad ?disponibilidad .
            
            # Información del autor
            OPTIONAL { 
              ?obra :tieneAutor ?autorObj . 
              ?autorObj :nombre ?nombreAutor ;
                        :apellidos ?apellidosAutor .
              BIND(CONCAT(?nombreAutor, " ", ?apellidosAutor) AS ?autor)
            }
            
            # Año de creación
            OPTIONAL { ?obra :anoCreacion ?año . }
            
            # Género
            OPTIONAL { 
              ?obra :perteneceAGenero ?generoObj . 
              ?generoObj :nombreGenero ?genero . 
            }
            
            # Materia
            OPTIONAL { 
              ?obra :trataSobre ?materiaObj . 
              ?materiaObj :terminoMateria ?materia . 
            }
          }
          LIMIT 50
        `;

        console.log('📤 Enviando consulta SPARQL...');

        // 🔥 CAMBIO: Usar GET con parámetros en la URL
        const encodedQuery = encodeURIComponent(sparqlQuery);
        const response = await axios.get(`${urlBackend}/api/ontologia/query?query=${encodedQuery}`);

        // DEBUG: Ver la estructura real
        console.log('📥 Respuesta completa:', response);
        console.log('📊 Datos recibidos:', response.data);

        if (response.data && response.data.success) {
          console.log('✅ Consulta SPARQL exitosa');
          
          // MAPEO CORRECTO incluyendo código de barras y disponibilidad
          const materialesMapeados = response.data.data.map((item, index) => {
            console.log(`📖 Item ${index}:`, {
              obra: item.obra?.value,
              titulo: item.titulo?.value,
              codigoBarras: item.codigoBarras?.value,
              disponibilidad: item.disponibilidad?.value,
              autor: item.autor?.value
            });

            return {
              id: item.obra?.value || `obra-${index}`,
              titulo: item.titulo?.value || 'Sin título',
              autor: item.autor?.value || 'Autor desconocido',
              año: item.año?.value || 'N/A',
              genero: item.genero?.value || 'N/A',
              materia: item.materia?.value || 'N/A',
              codigoBarras: item.codigoBarras?.value || 'joputa',
              disponibilidad: item.disponibilidad?.value || 'desconocido',
              tipo: 'Libro'
            };
          });

          console.log('🎯 Materiales mapeados CON CÓDIGOS:', materialesMapeados);
          setMateriales(materialesMapeados);
        } else {
          console.error('❌ Error en la respuesta del servidor:', response.data);
          setError('Error en la estructura de datos recibida.');
        }

      } catch (err) {
        console.error('❌ Error al cargar materiales:', err);
        if (err.response) {
          console.error('📋 Detalles del error:', err.response.data);
        }
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
      <InicioPag libros={materiales} />
    </div>
  );
}

export default Inicio;