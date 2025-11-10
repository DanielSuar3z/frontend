import React, { useState, useEffect } from 'react';
import '../styles/RegisterLibro.css';

import { urlBackend } from '../config/envs';

const API_BASE_URL = `${urlBackend}/api/ontologia`;

const RegisterLibro = () => {
    const [formData, setFormData] = useState({
        // Información de la Obra (Work)
        tituloOriginal: '',
        idiomaOriginal: '',
        anoCreacion: '',
        
        // Información del Autor (Persona)
        nombreAutor: '',
        apellidosAutor: '',
        nacionalidadAutor: '',
        fechaNacimientoAutor: '',
        
        // Información de la Expresión (Expression)
        tipoExpresion: '',
        idiomaExpresion: '',
        
        // Información de la Manifestación (Manifestation)
        editorial: '',
        anoPublicacion: '',
        isbn: '',
        formato: '',
        numeroPaginas: '',
        numeroEdicion: '',
        
        // Información del Item (Item)
        codigoBarras: '',
        signaturaTopografica: '',
        ubicacionFisica: '',
        estadoFisico: 'bueno',
        disponibilidad: 'disponible',
        
        // Información de Materia y Género
        genero: '',
        materia: '',
        clasificacionDewey: ''
    });

    const [tiposExpresion, setTiposExpresion] = useState([
        { id: 'original', name: 'Original' },
        { id: 'traduccion', name: 'Traducción' },
        { id: 'adaptacion', name: 'Adaptación' },
        { id: 'edicion_critica', name: 'Edición crítica' }
    ]);

    const [formatos, setFormatos] = useState([
        { id: 'impreso', name: 'Impreso' },
        { id: 'digital', name: 'Digital' },
        { id: 'audiolibro', name: 'Audiolibro' }
    ]);

    const [estadosFisicos, setEstadosFisicos] = useState([
        { id: 'excelente', name: 'Excelente' },
        { id: 'bueno', name: 'Bueno' },
        { id: 'regular', name: 'Regular' },
        { id: 'malo', name: 'Malo' }
    ]);

    const [disponibilidades, setDisponibilidades] = useState([
        { id: 'disponible', name: 'Disponible' },
        { id: 'prestado', name: 'Prestado' },
        { id: 'reservado', name: 'Reservado' },
        { id: 'extraviado', name: 'Extraviado' },
        { id: 'en_proceso', name: 'En proceso' }
    ]);

    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage(null);
        setErrorMessage(null);
        setLoading(true);

        try {
            // Preparar datos para enviar a la ontología
            const libroData = {
                obra: {
                    tituloOriginal: formData.tituloOriginal,
                    idiomaOriginal: formData.idiomaOriginal,
                    anoCreacion: formData.anoCreacion,
                    genero: formData.genero,
                    materia: formData.materia
                },
                autor: {
                    nombre: formData.nombreAutor,
                    apellidos: formData.apellidosAutor,
                    nacionalidad: formData.nacionalidadAutor,
                    fechaNacimiento: formData.fechaNacimientoAutor
                },
                expresion: {
                    tipoExpresion: formData.tipoExpresion,
                    idiomaExpresion: formData.idiomaExpresion
                },
                manifestacion: {
                    editorial: formData.editorial,
                    anoPublicacion: formData.anoPublicacion,
                    isbn: formData.isbn,
                    formato: formData.formato,
                    numeroPaginas: formData.numeroPaginas ? parseInt(formData.numeroPaginas) : null,
                    numeroEdicion: formData.numeroEdicion
                },
                item: {
                    codigoBarras: formData.codigoBarras,
                    signaturaTopografica: formData.signaturaTopografica,
                    ubicacionFisica: formData.ubicacionFisica,
                    estadoFisico: formData.estadoFisico,
                    disponibilidad: formData.disponibilidad,
                    clasificacionDewey: formData.clasificacionDewey
                }
            };

            const response = await fetch(`${API_BASE_URL}/libro`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(libroData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al registrar el libro.');
            }

            const result = await response.json();
            console.log('Registro exitoso:', result);
            setSuccessMessage('¡Libro registrado con éxito en la ontología!');
            
            // Limpiar el formulario
            setFormData({
                tituloOriginal: '',
                idiomaOriginal: '',
                anoCreacion: '',
                nombreAutor: '',
                apellidosAutor: '',
                nacionalidadAutor: '',
                fechaNacimientoAutor: '',
                tipoExpresion: '',
                idiomaExpresion: '',
                editorial: '',
                anoPublicacion: '',
                isbn: '',
                formato: '',
                numeroPaginas: '',
                numeroEdicion: '',
                codigoBarras: '',
                signaturaTopografica: '',
                ubicacionFisica: '',
                estadoFisico: 'bueno',
                disponibilidad: 'disponible',
                genero: '',
                materia: '',
                clasificacionDewey: ''
            });

        } catch (err) {
            console.error('Error durante el registro:', err);
            setErrorMessage(err.message || 'Hubo un problema al registrar el libro en la ontología.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pag-fondo">
            <div className="register-card">
                <div className="register-libro-container">
                    <h1 className="register-title">Registro de Libro en la Biblioteca</h1>
                    {successMessage && <div className="success-message">{successMessage}</div>}
                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                    
                    <form onSubmit={handleSubmit} className="register-form">
                        <div className="form-columns">
                            <div className="form-column">
                                <h3>📖 Información de la Obra</h3>
                                
                                <div className="form-group">
                                    <div className="input-icon-wrapper">
                                        <i className="icon book-icon">📚</i>
                                        <input type="text" id="tituloOriginal" name="tituloOriginal" 
                                               value={formData.tituloOriginal} onChange={handleChange} 
                                               placeholder="Título original de la obra" required />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <div className="input-icon-wrapper">
                                        <i className="icon language-icon">🌐</i>
                                        <input type="text" id="idiomaOriginal" name="idiomaOriginal" 
                                               value={formData.idiomaOriginal} onChange={handleChange} 
                                               placeholder="Idioma original" required />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <div className="input-icon-wrapper">
                                        <i className="icon calendar-icon">📅</i>
                                        <input type="number" id="anoCreacion" name="anoCreacion" 
                                               value={formData.anoCreacion} onChange={handleChange} 
                                               placeholder="Año de creación" min="1000" max="2099" />
                                    </div>
                                </div>

                                <h3>👤 Información del Autor</h3>

                                <div className="form-group">
                                    <div className="input-icon-wrapper">
                                        <i className="icon user-icon">👤</i>
                                        <input type="text" id="nombreAutor" name="nombreAutor" 
                                               value={formData.nombreAutor} onChange={handleChange} 
                                               placeholder="Nombre del autor" required />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <div className="input-icon-wrapper">
                                        <i className="icon user-icon">👥</i>
                                        <input type="text" id="apellidosAutor" name="apellidosAutor" 
                                               value={formData.apellidosAutor} onChange={handleChange} 
                                               placeholder="Apellidos del autor" required />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <div className="input-icon-wrapper">
                                        <i className="icon flag-icon">🏳️</i>
                                        <input type="text" id="nacionalidadAutor" name="nacionalidadAutor" 
                                               value={formData.nacionalidadAutor} onChange={handleChange} 
                                               placeholder="Nacionalidad del autor" />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <div className="input-icon-wrapper">
                                        <i className="icon birthday-icon">🎂</i>
                                        <input type="number" id="fechaNacimientoAutor" name="fechaNacimientoAutor" 
                                               value={formData.fechaNacimientoAutor} onChange={handleChange} 
                                               placeholder="Año de nacimiento del autor" min="1000" max="2099" />
                                    </div>
                                </div>
                            </div>

                            <div className="form-column">
                                <h3>📝 Información de la Expresión</h3>

                                <div className="form-group">
                                    <div className="input-icon-wrapper">
                                        <i className="icon document-icon">📄</i>
                                        <select id="tipoExpresion" name="tipoExpresion" 
                                                value={formData.tipoExpresion} onChange={handleChange} required>
                                            <option value="">Seleccionar tipo de expresión</option>
                                            {tiposExpresion.map(tipo => (
                                                <option key={tipo.id} value={tipo.id}>
                                                    {tipo.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <div className="input-icon-wrapper">
                                        <i className="icon language-icon">🗣️</i>
                                        <input type="text" id="idiomaExpresion" name="idiomaExpresion" 
                                               value={formData.idiomaExpresion} onChange={handleChange} 
                                               placeholder="Idioma de la expresión" required />
                                    </div>
                                </div>

                                <h3>🏢 Información de la Manifestación</h3>

                                <div className="form-group">
                                    <div className="input-icon-wrapper">
                                        <i className="icon building-icon">🏢</i>
                                        <input type="text" id="editorial" name="editorial" 
                                               value={formData.editorial} onChange={handleChange} 
                                               placeholder="Editorial" required />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <div className="input-icon-wrapper">
                                        <i className="icon calendar-icon">📆</i>
                                        <input type="number" id="anoPublicacion" name="anoPublicacion" 
                                               value={formData.anoPublicacion} onChange={handleChange} 
                                               placeholder="Año de publicación" min="1000" max="2099" required />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <div className="input-icon-wrapper">
                                        <i className="icon barcode-icon">📋</i>
                                        <input type="text" id="isbn" name="isbn" 
                                               value={formData.isbn} onChange={handleChange} 
                                               placeholder="ISBN" required />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <div className="input-icon-wrapper">
                                        <i className="icon format-icon">📁</i>
                                        <select id="formato" name="formato" 
                                                value={formData.formato} onChange={handleChange} required>
                                            <option value="">Seleccionar formato</option>
                                            {formatos.map(formato => (
                                                <option key={formato.id} value={formato.id}>
                                                    {formato.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <div className="input-icon-wrapper">
                                        <i className="icon pages-icon">📖</i>
                                        <input type="number" id="numeroPaginas" name="numeroPaginas" 
                                               value={formData.numeroPaginas} onChange={handleChange} 
                                               placeholder="Número de páginas" min="1" />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <div className="input-icon-wrapper">
                                        <i className="icon edition-icon">✏️</i>
                                        <input type="text" id="numeroEdicion" name="numeroEdicion" 
                                               value={formData.numeroEdicion} onChange={handleChange} 
                                               placeholder="Número de edición" />
                                    </div>
                                </div>
                            </div>

                            <div className="form-column">
                                <h3>📦 Información del Ítem Físico</h3>

                                <div className="form-group">
                                    <div className="input-icon-wrapper">
                                        <i className="icon barcode-icon">📊</i>
                                        <input type="text" id="codigoBarras" name="codigoBarras" 
                                               value={formData.codigoBarras} onChange={handleChange} 
                                               placeholder="Código de barras" required />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <div className="input-icon-wrapper">
                                        <i className="icon location-icon">📍</i>
                                        <input type="text" id="signaturaTopografica" name="signaturaTopografica" 
                                               value={formData.signaturaTopografica} onChange={handleChange} 
                                               placeholder="Signatura topográfica" required />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <div className="input-icon-wrapper">
                                        <i className="icon map-pin-icon">🏢</i>
                                        <input type="text" id="ubicacionFisica" name="ubicacionFisica" 
                                               value={formData.ubicacionFisica} onChange={handleChange} 
                                               placeholder="Ubicación física (estantería, sección)" required />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <div className="input-icon-wrapper">
                                        <i className="icon quality-icon">⭐</i>
                                        <select id="estadoFisico" name="estadoFisico" 
                                                value={formData.estadoFisico} onChange={handleChange} required>
                                            <option value="">Seleccionar estado físico</option>
                                            {estadosFisicos.map(estado => (
                                                <option key={estado.id} value={estado.id}>
                                                    {estado.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <div className="input-icon-wrapper">
                                        <i className="icon status-icon">📋</i>
                                        <select id="disponibilidad" name="disponibilidad" 
                                                value={formData.disponibilidad} onChange={handleChange} required>
                                            <option value="">Seleccionar disponibilidad</option>
                                            {disponibilidades.map(disp => (
                                                <option key={disp.id} value={disp.id}>
                                                    {disp.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <h3>🏷️ Clasificación</h3>

                                <div className="form-group">
                                    <div className="input-icon-wrapper">
                                        <i className="icon genre-icon">📚</i>
                                        <input type="text" id="genero" name="genero" 
                                               value={formData.genero} onChange={handleChange} 
                                               placeholder="Género literario" required />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <div className="input-icon-wrapper">
                                        <i className="icon subject-icon">🏷️</i>
                                        <input type="text" id="materia" name="materia" 
                                               value={formData.materia} onChange={handleChange} 
                                               placeholder="Materia o tema" required />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <div className="input-icon-wrapper">
                                        <i className="icon classification-icon">🔢</i>
                                        <input type="text" id="clasificacionDewey" name="clasificacionDewey" 
                                               value={formData.clasificacionDewey} onChange={handleChange} 
                                               placeholder="Clasificación Dewey" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="form-actions">
                            <button type="submit" className="register-button" disabled={loading}>
                                {loading ? 'REGISTRANDO...' : 'REGISTRAR LIBRO'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterLibro;