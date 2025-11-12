// src/components/BusquedaLibros.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { urlBackend } from '../config/envs';

const API_BASE_URL = `${urlBackend}/api/ontologia`;

function BusquedaLibros({ onSearchResults, onSearchPerformed, allLibros }) {
    const [criteriosBusqueda, setCriteriosBusqueda] = useState({
        titulo: '',
        autor: '',
        genero: '',
        materia: '',
        año: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCriteriosBusqueda(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const buscarLibros = async (e) => {
        e.preventDefault();
        onSearchPerformed(true);

        try {
            // Construir consulta SPARQL basada en los criterios
            let filtros = [];
            
            if (criteriosBusqueda.titulo) {
                filtros.push(`regex(?titulo, "${criteriosBusqueda.titulo}", "i")`);
            }
            if (criteriosBusqueda.autor) {
                filtros.push(`regex(?autor, "${criteriosBusqueda.autor}", "i")`);
            }
            if (criteriosBusqueda.genero) {
                filtros.push(`regex(?genero, "${criteriosBusqueda.genero}", "i")`);
            }
            if (criteriosBusqueda.materia) {
                filtros.push(`regex(?materia, "${criteriosBusqueda.materia}", "i")`);
            }
            if (criteriosBusqueda.año) {
                filtros.push(`?año = "${criteriosBusqueda.año}"`);
            }

            const whereClause = filtros.length > 0 ? `FILTER(${filtros.join(' && ')})` : '';

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
                  
                  # Información del autor (CORREGIDO)
                  OPTIONAL { 
                    ?obra :tieneAutor ?autorObj . 
                    ?autorObj :nombre ?nombreAutor ;
                              :apellidos ?apellidosAutor .
                    BIND(CONCAT(?nombreAutor, " ", ?apellidosAutor) AS ?autor)
                  }
                  
                  # Año de creación (CORREGIDO)
                  OPTIONAL { ?obra :anoCreacion ?año . }
                  
                  # Género (CORREGIDO)
                  OPTIONAL { 
                    ?obra :perteneceAGenero ?generoObj . 
                    ?generoObj :nombreGenero ?genero . 
                  }
                  
                  # Materia (CORREGIDO)
                  OPTIONAL { 
                    ?obra :trataSobre ?materiaObj . 
                    ?materiaObj :terminoMateria ?materia . 
                  }
                  ${whereClause}
                }
                LIMIT 100
            `;

            const response = await axios.post(`${API_BASE_URL}/query`, {
                query: sparqlQuery
            });

            if (response.data && response.data.success) {
                const resultados = response.data.data.map((item, index) => ({
                    id: item.obra?.value || `libro-${index}`,
                    titulo: item.titulo?.value || 'Sin título',
                    autor: item.autor?.value || 'Autor desconocido',
                    año: item.año?.value || 'N/A',
                    genero: item.genero?.value || 'N/A',
                    materia: item.materia?.value || 'N/A',
                    codigoBarras: item.codigoBarras?.value || 'N/A', // NUEVO CAMPO
                    disponibilidad: item.disponibilidad?.value || 'N/A', // NUEVO CAMPO
                    tipo: 'Libro'
                }));
                onSearchResults(resultados);
            } else {
                onSearchResults([]);
            }
        } catch (error) {
            console.error('Error en búsqueda:', error);
            onSearchResults([]);
        }
    };

    const limpiarBusqueda = () => {
        setCriteriosBusqueda({
            titulo: '',
            autor: '',
            genero: '',
            materia: '',
            año: ''
        });
        onSearchResults(allLibros);
        onSearchPerformed(false);
    };

    return (
        <div className="busqueda-libros">
            <h3>🔍 Buscar en el Catálogo</h3>
            <form onSubmit={buscarLibros} className="form-busqueda">
                <div className="fila-busqueda">
                    <div className="campo-busqueda">
                        <label>Título:</label>
                        <input
                            type="text"
                            name="titulo"
                            value={criteriosBusqueda.titulo}
                            onChange={handleInputChange}
                            placeholder="Ej: Don Quijote"
                        />
                    </div>
                    <div className="campo-busqueda">
                        <label>Autor:</label>
                        <input
                            type="text"
                            name="autor"
                            value={criteriosBusqueda.autor}
                            onChange={handleInputChange}
                            placeholder="Ej: Gabriel García Márquez"
                        />
                    </div>
                </div>
                <div className="fila-busqueda">
                    <div className="campo-busqueda">
                        <label>Género:</label>
                        <input
                            type="text"
                            name="genero"
                            value={criteriosBusqueda.genero}
                            onChange={handleInputChange}
                            placeholder="Ej: Novela, Poesía"
                        />
                    </div>
                    <div className="campo-busqueda">
                        <label>Materia/Tema:</label>
                        <input
                            type="text"
                            name="materia"
                            value={criteriosBusqueda.materia}
                            onChange={handleInputChange}
                            placeholder="Ej: Literatura colombiana"
                        />
                    </div>
                    <div className="campo-busqueda">
                        <label>Año:</label>
                        <input
                            type="text"
                            name="año"
                            value={criteriosBusqueda.año}
                            onChange={handleInputChange}
                            placeholder="Ej: 1985"
                        />
                    </div>
                </div>
                <div className="acciones-busqueda">
                    <button type="submit" className="btn-buscar">
                        Buscar Libros
                    </button>
                    <button type="button" onClick={limpiarBusqueda} className="btn-limpiar">
                        Mostrar Todos
                    </button>
                </div>
            </form>
        </div>
    );
}

export default BusquedaLibros;