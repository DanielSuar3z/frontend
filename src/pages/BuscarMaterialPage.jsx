import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BuscarLibroComponent from '../components/BuscarLibro'; // Cambiado el import
import '../styles/InicioPag.css';
// En la parte superior de BuscarMaterialPage.jsx, agrega:
import { urlBackend } from '../config/envs'; // Ajusta la ruta según tu estructura
const API_BASE_URL = `${urlBackend}/api/ontologia`;

//import { urlBackend } from '../config/envs';

function BuscarLibroPage() { // Cambiado el nombre de la función
    const [librosBusqueda, setLibrosBusqueda] = useState([]); // Cambiado el estado
    const [loadingBusqueda, setLoadingBusqueda] = useState(true);
    const [errorBusqueda, setErrorBusqueda] = useState(null);

    useEffect(() => {
        // En el componente que hace la consulta SPARQL (ej: BuscarLibro.jsx o similar)
const fetchLibros = async () => {
  try {
    const sparqlQuery = `
      PREFIX : <http://www.biblioteca.edu.co/ontologia#>

      SELECT ?obra ?titulo ?autor ?año ?genero ?materia ?codigoBarras ?disponibilidad
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

    const response = await axios.post(`${API_BASE_URL}/query`, {
      query: sparqlQuery
    });

    console.log("🔍 Respuesta COMPLETA de SPARQL:", response.data.data);

    if (response.data && response.data.success) {
      const mappedLibros = response.data.data.map((item, index) => {
        // Debug: ver la estructura de cada item
        console.log(`📖 Item ${index} completo:`, item);
        
        return {
          id: item.obra?.value || `libro-${index}`,
          titulo: item.titulo?.value || 'Sin título',
          autor: item.autor?.value || 'Autor desconocido',
          año: item.año?.value || 'N/A',
          genero: item.genero?.value || 'N/A',
          materia: item.materia?.value || 'N/A',
          codigoBarras: item.codigoBarras?.value, // ← ESTO ES CRÍTICO
          disponibilidad: item.disponibilidad?.value, // ← ESTO ES CRÍTICO
          tipo: 'Libro'
        };
      });

      console.log("🎯 Libros mapeados FINALES:", mappedLibros);
      return mappedLibros;
    }
  } catch (error) {
    console.error('Error al obtener libros:', error);
    return [];
  }
};

        fetchLibros();
    }, []);

    if (loadingBusqueda) {
        return (
            <div className="loading-message">
                <div className="loading-spinner"></div>
                <p>Cargando catálogo de libros...</p>
            </div>
        );
    }

    if (errorBusqueda) {
        return (
            <div className="error-message">
                <h3>❌ Error</h3>
                <p>{errorBusqueda}</p>
                <button onClick={() => window.location.reload()} className="btn-reintentar">
                    Reintentar
                </button>
            </div>
        );
    }

    return (
        <div className="buscar-libro-page-container"> {/* Cambiado el className */}
            {/* Pasamos los libros cargados a tu componente de presentación */}
            <BuscarLibroComponent librosIniciales={librosBusqueda} />
        </div>
    );
}

export default BuscarLibroPage; // Cambiado el export