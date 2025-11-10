import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BuscarLibroComponent from '../components/BuscarLibro'; // Cambiado el import
import '../styles/InicioPag.css';

import { urlBackend } from '../config/envs';

function BuscarLibroPage() { // Cambiado el nombre de la función
    const [librosBusqueda, setLibrosBusqueda] = useState([]); // Cambiado el estado
    const [loadingBusqueda, setLoadingBusqueda] = useState(true);
    const [errorBusqueda, setErrorBusqueda] = useState(null);

    useEffect(() => {
        const fetchLibros = async () => { // Cambiado el nombre de la función
            try {
                setLoadingBusqueda(true);
                
                // Consulta SPARQL para obtener libros de la ontología
                const sparqlQuery = `
                    PREFIX : <http://www.biblioteca.edu.co/ontologia#>
                    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
                    
                    SELECT ?obra ?titulo ?autorNombre ?anoCreacion ?genero ?materia
                    WHERE {
                        ?obra a :Obra .
                        ?obra :tituloOriginal ?titulo .
                        OPTIONAL { ?obra :tieneAutor ?autor . ?autor :nombre ?autorNombre } 
                        OPTIONAL { ?obra :anoCreacion ?anoCreacion }
                        OPTIONAL { ?obra :perteneceAGenero ?gen . ?gen :nombreGenero ?genero }
                        OPTIONAL { ?obra :trataSobre ?mat . ?mat :terminoMateria ?materia }
                    }
                    LIMIT 50
                `;

                const response = await axios.post(`${urlBackend}/api/ontologia/query`, {
                    query: sparqlQuery
                });

                console.log('Datos de libros para búsqueda recibidos:', response.data);

                if (response.data && response.data.success) {
                    // Mapear los datos de la ontología al formato esperado por el componente
                    const librosMapeados = response.data.data.map((item, index) => ({
                        id: item.obra?.value || `libro-${index}`,
                        titulo: item.titulo?.value || 'Sin título',
                        autor: item.autorNombre?.value || 'Autor desconocido',
                        año: item.anoCreacion?.value || 'N/A',
                        genero: item.genero?.value || 'N/A',
                        materia: item.materia?.value || 'N/A',
                        tipo: 'Libro',
                        disponibilidad: 'Disponible'
                    }));
                    
                    setLibrosBusqueda(librosMapeados);
                } else {
                    setErrorBusqueda('No se pudieron cargar los libros desde la ontología.');
                }
            } catch (err) {
                console.error('Error al cargar los libros para búsqueda:', err);
                setErrorBusqueda('Error al cargar el catálogo de libros. Intenta de nuevo más tarde.');
            } finally {
                setLoadingBusqueda(false);
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