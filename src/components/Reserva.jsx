// src/components/ReservaLibro.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Reserva.css';

import { urlBackend } from '../config/envs';

const API_BASE_URL = `${urlBackend}/api`; // Ajusta según tu backend

function ReservaLibro({ libro, onClose, onReservaExitosa }) {
    console.log(libro.disponibilidad);
    console.log(libro.codigoBarras);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [fechaReserva, setFechaReserva] = useState('');
    const [fechaDevolucion, setFechaDevolucion] = useState('');

    // Calcular fecha de devolución automáticamente (15 días después)
    useEffect(() => {
        if (fechaReserva) {
            const fecha = new Date(fechaReserva);
            fecha.setDate(fecha.getDate() + 15); // 15 días de préstamo
            setFechaDevolucion(fecha.toISOString().split('T')[0]);
        }
    }, [fechaReserva]);

    // En handleReserva de Reserva.jsx
const handleReserva = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
        const usuarioId = localStorage.getItem('usuarioId');
        
        if (!usuarioId) {
            setError('Debe iniciar sesión para reservar un libro');
            setIsLoading(false);
            return;
        }

        // CAMBIO IMPORTANTE: Enviar código de barras en lugar de URI de obra
        const datosPrestamo = {
            id_usuario: parseInt(usuarioId),
            codigo_barras: libro.codigoBarras, // ← Usar código de barras del ítem
            fecha_devolucion_esperada: fechaDevolucion            
        };

        console.log('Enviando préstamo:', datosPrestamo);
        console.log(libro.codigoBarras);

        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_BASE_URL}/prestamos`, datosPrestamo, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.data && response.data.success) {
            setSuccess(true);
            if (onReservaExitosa) {
                onReservaExitosa(response.data.data);
            }
            setTimeout(() => {
                if (onClose) onClose();
            }, 2000);
        } else {
            setError(response.data?.message || 'Error al realizar el préstamo');
        }
    } catch (error) {
        console.error('Error en préstamo:', error);
        if (error.response) {
            setError(error.response.data?.error || error.response.data?.message || 'Error del servidor');
        } else {
            setError('Error de conexión con el servidor');
        }
    } finally {
        setIsLoading(false);
    }
};

    // Fecha mínima (hoy)
    const today = new Date().toISOString().split('T')[0];

    if (!libro) {
        return (
            <div className="modal-overlay">
                <div className="reserva-libro-modal">
                    <div className="error-message">No se ha seleccionado un libro</div>
                    <button onClick={onClose} className="btn-cerrar">Cerrar</button>
                </div>
            </div>
        );
    }

    return (
        <div className="modal-overlay">
            <div className="reserva-libro-modal">
                <div className="modal-header">
                    <h2>Reservar Libro</h2>
                    <button onClick={onClose} className="btn-cerrar">×</button>
                </div>

                {libro && (
                    <div className="libro-info">
                        <h3>{libro.titulo}</h3>
                        <p><strong>Autor:</strong> {libro.autor}</p>
                        <p><strong>Año:</strong> {libro.año}</p>
                        <p><strong>Género:</strong> {libro.genero}</p>
                        <p><strong>Materia:</strong> {libro.materia}</p>
                        <p><strong>Disponibilidad:</strong> {libro.disponibilidad}</p>
                        <p><strong>Código Barras:</strong> {libro.codigoBarras || 'No disponible'}</p>
                    </div>
                )}

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {success ? (
                    <div className="success-message">
                        <h3>¡Reserva Exitosa!</h3>
                        <p>El libro ha sido reservado correctamente.</p>
                        <p>Fecha de devolución: {new Date(fechaDevolucion).toLocaleDateString()}</p>
                    </div>
                ) : (
                    <form onSubmit={handleReserva} className="form-reserva">
                        <div className="form-group">
                            <label htmlFor="fechaReserva">Fecha de Reserva:</label>
                            <input
                                type="date"
                                id="fechaReserva"
                                value={fechaReserva}
                                onChange={(e) => setFechaReserva(e.target.value)}
                                min={today}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="fechaDevolucion">Fecha de Devolución:</label>
                            <input
                                type="date"
                                id="fechaDevolucion"
                                value={fechaDevolucion}
                                onChange={(e) => setFechaDevolucion(e.target.value)}
                                min={fechaReserva || today}
                                required
                            />
                        </div>

                        <div className="modal-actions">
                            <button 
                                type="button" 
                                onClick={onClose} 
                                className="btn-cancelar"
                                disabled={isLoading}
                            >
                                Cancelar
                            </button>
                            <button 
                                type="submit" 
                                className="btn-confirmar"                                
                                disabled={isLoading || libro.disponibilidad !== 'disponible'}
                            >
                                {isLoading ? 'Reservando...' : 'Confirmar Reserva'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default ReservaLibro;