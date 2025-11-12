// src/components/InicioPag.jsx
import React, { useState } from 'react';
import '../styles/InicioPag.css';
import imagenLibro from '../assets/libro.jpg';
import ReservaLibro from './Reserva';

function InicioPag({ libros }) {
  // Estados para el modal de reserva
  const [libroSeleccionado, setLibroSeleccionado] = useState(null);
  const [mostrarModalReserva, setMostrarModalReserva] = useState(false);

  // Función para manejar el clic en Reservar Libro
  // Función para manejar el clic en Reservar Libro
const handleReservarClick = (libro) => {
  console.log("🖱️ Click en reservar libro:", libro);
  console.log("📊 Código de barras disponible:", libro.codigoBarras);
  console.log("📊 Disponibilidad:", libro.disponibilidad);
  
  // VALIDACIÓN CRÍTICA: Verificar que tenemos código de barras
  if (!libro.codigoBarras || libro.codigoBarras === 'N/A') {
    console.error("❌ ERROR: Libro sin código de barras:", libro);
    alert('Error: Este libro no tiene código de barras asociado. No se puede reservar.');
    return;
  }
  
  setLibroSeleccionado(libro);
  setMostrarModalReserva(true);
};

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setMostrarModalReserva(false);
    setLibroSeleccionado(null);
  };

  // Función cuando la reserva es exitosa
  const handleReservaExitosa = (datosReserva) => {
    console.log('Reserva exitosa:', datosReserva);
    // Aquí puedes actualizar el estado de los libros si es necesario
    // Por ejemplo, marcar el libro como no disponible localmente
  };
  console.log("📚 Todos los libros recibidos:", libros);
  return (
    <div className="inicio-pag">
      <div className="titulo-bienvenida-container">
        <h1 className="titulo-bienvenida">¡Bienvenido a la Biblioteca Digital!</h1>
      </div>
      <div className="contenedor-libros">
        {libros && libros.length > 0 ? (
          libros.map((libro, index) => (
            <div key={libro.id || index} className="libro-container">
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
                  <strong>Autor:</strong> {libro.autor || 'Autor desconocido'}
                </p>
                <div className="libro-detalles">
                  <span className="libro-año">
                    <i className="año-icon">📅</i> {libro.año || 'N/A'}
                  </span>
                  <span className="libro-genero">
                    <i className="genero-icon">📚</i> {libro.genero || 'N/A'}
                  </span>
                  <span className="libro-materia">
                    <i className="materia-icon">🏷️</i> {libro.materia || 'N/A'}
                  </span>
                  <span className={`libro-disponibilidad ${(libro.disponibilidad?.toLowerCase() || 'disponible')}`}>
                    <i className="disponibilidad-icon">📖</i> {libro.disponibilidad || 'Disponible'}
                  </span>
                  {/* Temporal: mostrar código de barras para debug */}
                  {libro.codigoBarras && libro.codigoBarras !== 'N/A' && (
                    <span className="libro-codigo-barras" style={{fontSize: '12px', color: '#666'}}>
                      Código: {libro.codigoBarras}
                    </span>
                  )}
                </div>
                <div className="libro-acciones">
                  <button 
                    className="btn-reservar"
                    onClick={() => handleReservarClick(libro)}
                    disabled={!libro.codigoBarras || libro.codigoBarras === 'N/A' || libro.disponibilidad !== 'disponible'}
                  >
                    {!libro.codigoBarras || libro.codigoBarras === 'N/A' 
                      ? 'Sin código' 
                      : libro.disponibilidad === 'disponible' 
                        ? 'Reservar Libro' 
                        : 'No Disponible'
                    }
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
            <i className="empty-icon">📚</i>
            <p>No se encontraron libros disponibles en el catálogo.</p>
          </div>
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

export default InicioPag;