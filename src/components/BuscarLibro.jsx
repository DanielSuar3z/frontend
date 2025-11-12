// src/components/BuscarLibro.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/InicioPag.css';
import BusquedaLibros from './BusquedaLibros';
import imagenLibro from '../assets/libro.jpg';
import ReservaLibro from './Reserva';

const API_BASE_URL = 'http://localhost:3000/api/ontologia';

function BuscarLibro() {
    const [allLibros, setAllLibros] = useState([]);
    const [librosMostrados, setLibrosMostrados] = useState([]);
    const [busquedaRealizada, setBusquedaRealizada] = useState(false);
    const [isLoadingAllLibros, setIsLoadingAllLibros] = useState(true);
    
    // Estados para el modal de reserva
    const [libroSeleccionado, setLibroSeleccionado] = useState(null);
    const [mostrarModalReserva, setMostrarModalReserva] = useState(false);

    // Efecto para cargar todos los libros al inicio
    useEffect(() => {
        const fetchAllLibros = async () => {
            try {
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

                const response = await axios.post(`${API_BASE_URL}/query`, {
                    query: sparqlQuery
                });

                if (response.data && response.data.success) {
                    const mappedLibros = response.data.data.map((item, index) => ({
                        id: item.obra?.value || `libro-${index}`,
                        titulo: item.titulo?.value || 'Sin título',
                        autor: item.autorNombre?.value || 'Autor desconocido',
                        año: item.anoCreacion?.value || 'N/A',
                        genero: item.genero?.value || 'N/A',
                        materia: item.materia?.value || 'N/A',
                        tipo: 'Libro',
                        disponibilidad: 'Disponible'
                    }));
                    setAllLibros(mappedLibros);
                    setLibrosMostrados(mappedLibros);
                    console.log("Todos los libros cargados:", mappedLibros);
                } else {
                    console.error("Error al cargar todos los libros:", response.data);
                    setAllLibros([]);
                    setLibrosMostrados([]);
                }
            } catch (error) {
                console.error('Error al obtener todos los libros:', error);
                setAllLibros([]);
                setLibrosMostrados([]);
            } finally {
                setIsLoadingAllLibros(false);
            }
        };

        fetchAllLibros();
    }, []);

    // Función que se pasa a BusquedaLibros para actualizar los resultados de búsqueda
    const handleSearchResults = (results) => {
        setLibrosMostrados(results);
    };

    // Función para saber si se realizó una búsqueda
    const handleSearchPerformed = (performed) => {
        setBusquedaRealizada(performed);
    };

    // Funciones para manejar la reserva de libros
    const handleReservarClick = (libro) => {
        setLibroSeleccionado(libro);
        setMostrarModalReserva(true);
    };

    const handleCloseModal = () => {
        setMostrarModalReserva(false);
        setLibroSeleccionado(null);
    };

    const handleReservaExitosa = (datosReserva) => {
        console.log('Reserva exitosa:', datosReserva);
        // Aquí puedes actualizar el estado de los libros si es necesario
        // Por ejemplo, marcar el libro como no disponible
    };

    // Determina qué título mostrar
    const getResultsTitle = () => {
        if (busquedaRealizada) {
            return `Resultados de Búsqueda (${librosMostrados.length} libros encontrados)`;
        }
        return `Todos los Libros Disponibles (${librosMostrados.length})`;
    };

    return (
        <div className="inicio-pag">
            {/* Componente de búsqueda de libros */}
            <BusquedaLibros
                onSearchResults={handleSearchResults}
                onSearchPerformed={handleSearchPerformed}
                allLibros={allLibros}
            />

            <h3>{getResultsTitle()}</h3>
            <div className="contenedor-libros">
                {isLoadingAllLibros ? (
                    <p>Cargando catálogo de libros...</p>
                ) : (
                    librosMostrados.length > 0 ? (
                        librosMostrados.map((libro) => (
                            <div key={libro.id} className="libro-container">
                                <div className="libro-image-container">
                                    <img
                                        src={imagenLibro}
                                        alt={`Portada de ${libro.titulo}`}
                                        className="libro-image"
                                    />
                                </div>
                                <div className="libro-info">
                                    <h3 className="libro-titulo">{libro.titulo}</h3>
                                    <p className="libro-autor">
                                        <strong>Autor:</strong> {libro.autor}
                                    </p>
                                    <div className="libro-detalles">
                                        <span className="libro-año">
                                            <i className="año-icon">📅</i> {libro.año}
                                        </span>
                                        <span className="libro-genero">
                                            <i className="genero-icon">📚</i> {libro.genero}
                                        </span>
                                        <span className="libro-materia">
                                            <i className="materia-icon">🏷️</i> {libro.materia}
                                        </span>
                                        <span className={`libro-disponibilidad ${libro.disponibilidad?.toLowerCase()}`}>
                                            <i className="disponibilidad-icon">📖</i> {libro.disponibilidad}
                                        </span>
                                    </div>
                                    <div className="libro-acciones">
                                        <button 
                                            className="btn-reservar"
                                            onClick={() => handleReservarClick(libro)}
                                        >
                                            Reservar Libro
                                        </button>
                                        <button className="btn-detalles">
                                            Ver Detalles
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-libros-message">
                            {busquedaRealizada
                                ? "No se encontraron libros con los criterios especificados."
                                : "No hay libros disponibles en el catálogo en este momento."}
                        </div>
                    )
                )}
            </div>

            {/* Modal de reserva */}
            {mostrarModalReserva && (
                <ReservaLibro
                    libro={libroSeleccionado}
                    onClose={handleCloseModal}
                    onReservaExitosa={handleReservaExitosa}
                />
            )}
        </div>
    );
}

export default BuscarLibro;