import React, { useState } from 'react';
import '../styles/RegisterUsuario.css';
import { Link } from 'react-router-dom';

const RegisterUsuario = ({ roles, onSubmit }) => { 
    const [formData, setFormData] = useState({
        codigo_estudiante: '',
        apellidos: '', 
        email: '',
        password_hash: '',
        confirmar_contrasena: '',
        telefono: '', 
        direccion: '', 
        id_rol: ''
    });
    const [passwordMatchError, setPasswordMatchError] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Verificar que las contraseñas coincidan
        const passwordsMatch = formData.password_hash === formData.confirmar_contrasena;
        setPasswordMatchError(!passwordsMatch);

        if (!passwordsMatch) {
            return;
        }

        // Preparar datos para enviar (sin confirmar_contrasena)
        const { confirmar_contrasena, ...userData } = formData;
        onSubmit(userData);
    };

    return (
        <div className="register-card">
            <div className="register-form-container">
                <h1 className="register-title">Registro de Usuario - Biblioteca</h1> {/* Título actualizado */}
                <form onSubmit={handleSubmit} className="register-form">
                    <div className="form-columns">
                        <div className="form-column">
                            <div className="form-group">
                                <div className="input-icon-wrapper">
                                    <i className="icon id-icon">🎫</i> {/* Nuevo icono */}
                                    <input
                                        type="text"
                                        id="codigo_estudiante"
                                        name="codigo_estudiante"
                                        value={formData.codigo_estudiante}
                                        onChange={handleChange}
                                        placeholder="Código de Estudiante/Identificación"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="input-icon-wrapper">
                                    <i className="icon person-icon">👤</i>
                                    <input
                                        type="text"
                                        id="nombres"
                                        name="nombres"
                                        value={formData.nombres}
                                        onChange={handleChange}
                                        placeholder="Nombres Completos"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="input-icon-wrapper">
                                    <i className="icon person-icon">👥</i>
                                    <input
                                        type="text"
                                        id="apellidos"
                                        name="apellidos"
                                        value={formData.apellidos}
                                        onChange={handleChange}
                                        placeholder="Apellidos Completos"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="input-icon-wrapper">
                                    <i className="icon phone-icon">📞</i> {/* Nuevo campo */}
                                    <input
                                        type="tel"
                                        id="telefono"
                                        name="telefono"
                                        value={formData.telefono}
                                        onChange={handleChange}
                                        placeholder="Teléfono de Contacto"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="form-column">
                            <div className="form-group">
                                <div className="input-icon-wrapper">
                                    <i className="icon email-icon">📧</i> {/* Cambiado icono */}
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Correo Electrónico"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="input-icon-wrapper">
                                    <i className="icon lock-icon">🔒</i>
                                    <input
                                        type="password"
                                        id="password_hash"
                                        name="password_hash"
                                        value={formData.password_hash}
                                        onChange={handleChange}
                                        placeholder="Contraseña"
                                        required
                                        minLength="6"
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="input-icon-wrapper">
                                    <i className="icon lock-icon">🔒</i>
                                    <input
                                        type="password"
                                        id="confirmar_contrasena"
                                        name="confirmar_contrasena"
                                        value={formData.confirmar_contrasena}
                                        onChange={handleChange}
                                        placeholder="Confirmar Contraseña"
                                        required
                                    />
                                </div>
                                {passwordMatchError && (
                                    <p className="error-message">Las contraseñas no coinciden</p>
                                )}
                            </div>
                            <div className="form-group">
                                <div className="input-icon-wrapper">
                                    <i className="icon location-icon">📍</i> {/* Nuevo campo */}
                                    <input
                                        type="text"
                                        id="direccion"
                                        name="direccion"
                                        value={formData.direccion}
                                        onChange={handleChange}
                                        placeholder="Dirección"
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="input-icon-wrapper">
                                    <i className="icon role-icon">👨‍💼</i> {/* Cambiado icono */}
                                    <select
                                        id="id_rol"
                                        name="id_rol"
                                        value={formData.id_rol}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Seleccionar Tipo de Usuario</option>
                                        {roles && roles.map(rol => (
                                            <option key={rol.id_rol} value={rol.id_rol}>
                                                {rol.nombre_rol}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="register-button">
                            REGISTRAR USUARIO
                        </button>
                        <p className="login-link">
                            ¿Ya tienes una cuenta? <Link to="/">Inicia sesión</Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterUsuario; // Cambiado el export