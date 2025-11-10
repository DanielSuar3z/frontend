import React, { useState, useEffect } from 'react';
import RegisterUsuario from '../components/RegisterUsuario';
import axios from 'axios';
import '../styles/RegisterUsuario.css';

import { urlBackend } from '../config/envs';

function Register() {
    const [roles, setRoles] = useState([]);
    const [registrationError, setRegistrationError] = useState(null);
    const [registrationSuccess, setRegistrationSuccess] = useState(false);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await axios.get(`${urlBackend}/api/auth/roles-usuario-cliente`);
                console.log('Respuesta de roles:', response.data);

                // VERIFICA LA ESTRUCTURA REAL DE LA RESPUESTA
                console.log('Estructura completa de roles:', response.data);

                // OPCIÓN 1: Si response.data es directamente el objeto de roles
                if (response.data && typeof response.data === 'object') {
                    const rolesData = response.data.data;
                    // Si la respuesta es { "Usuario": 1, "Cliente": 2, ... }
                    const rolesArray = Object.entries(rolesData).map(([nombre_rol, id_rol]) => ({
                        id_rol,
                        nombre_rol
                    }));
                    setRoles(rolesArray);
                }
                // OPCIÓN 2: Si response.data tiene propiedad 'data'
                else if (response.data && response.data.data) {
                    const rolesData = response.data.data;
                    const rolesArray = Object.entries(rolesData).map(([nombre_rol, id_rol]) => ({
                        id_rol,
                        nombre_rol
                    }));
                    setRoles(rolesArray);
                }
                // OPCIÓN 3: Si response.data tiene propiedad 'success'
                else if (response.data && response.data.success && response.data.data) {
                    const rolesData = response.data.data;
                    const rolesArray = Object.entries(rolesData).map(([nombre_rol, id_rol]) => ({
                        id_rol,
                        nombre_rol
                    }));
                    setRoles(rolesArray);
                } else {
                    console.error('Estructura de roles no reconocida:', response.data);
                    setRegistrationError('Error al cargar los roles. Por favor, intenta de nuevo.');
                }
            } catch (error) {
                console.error('Error al obtener roles:', error);
                setRegistrationError('Error al cargar los roles. Por favor, intenta de nuevo.');
            }
        };

        fetchRoles();
    }, []);

    const handleSubmit = async (formData) => {
        try {
            // ELIMINAR LA VALIDACIÓN DE CONTRASEÑAS AQUÍ
            // La validación ya se hace en RegisterUsuario.jsx
            // NO hacer: if (formData.password_hash !== formData.confirmar_contrasena)

            console.log('Recibiendo datos del formulario:', formData);

            // Preparar datos para el backend según lo que espera
            const datosParaBackend = {
                apellidos: formData.apellidos,
                codigo_estudiante: formData.codigo_estudiante,
                direccion: formData.direccion,
                email_usuario: formData.email,
                rol_id: formData.id_rol,
                nombres: formData.nombres,
                contrasena_usuario: formData.password_hash,
                telefono: formData.Telefono
            };

            console.log('Enviando al backend:', datosParaBackend);

            const response = await axios.post(`${urlBackend}/api/auth/registrar`, datosParaBackend);
            console.log('Registro exitoso:', response.data);

            setRegistrationError(null);
            setRegistrationSuccess(true);
            return true;
        } catch (error) {
            console.error('Error en registro:', error);

            let errorMessage = 'Error al registrar el usuario. ';

            if (error.response) {
                errorMessage += error.response.data?.error || error.response.data?.message || 'Intenta de nuevo.';
            } else if (error.request) {
                errorMessage += 'No se pudo conectar al servidor.';
            } else {
                errorMessage += 'Error inesperado.';
            }

            setRegistrationError(errorMessage);
            return false;
        }
    };

    return (
        <div className="container-general">
            <div className="register-page">
                {registrationError && (
                    <div className="error-message">
                        {registrationError}
                    </div>
                )}
                {registrationSuccess ? (
                    <div className="success-message">
                        <h3>¡Registro exitoso!</h3>
                        <p>Tu cuenta ha sido creada correctamente. Ahora puedes iniciar sesión.</p>
                        <a href="/" className="login-link-button">
                            Ir a Iniciar Sesión
                        </a>
                    </div>
                ) : (
                    <RegisterUsuario
                        roles={roles}
                        onSubmit={handleSubmit}
                    />
                )}
            </div>
        </div>
    );
}

export default Register;