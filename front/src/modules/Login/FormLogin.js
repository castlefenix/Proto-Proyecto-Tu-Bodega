import React, { useState } from "react";
import Axios from "axios";
import Swal from 'sweetalert2';
import { useAuth } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import "../../css/Plantilla.css";
import "../../css/Login.css";

function FormLogin() {
    // Inicializa los estados y el hook de navegación
    const [rol, setRol] = useState('');
    const [correo, setCorreo] = useState('');
    const [contra, setContra] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate(); // Inicializa useNavigate para redireccionar al usuario

    const logear = (evento) => {
        let interfazUser = '/Admi';
        if (rol === '2') {
            interfazUser = '/Almacenista'
        }
        evento.preventDefault();
        Axios.post("http://192.168.2.4:3001/login/validar", {
            rol: rol,
            correo: correo,
            contra: contra
        }).then(response => {
            // Asegúrate de que la respuesta del servidor incluya tanto el nombre del usuario como el correo
            if (response.data.nombre && response.data.correo && response.data.idUser ) {
                // Llama a login con ambos, el nombre del usuario y el correo electrónico
                login(response.data.nombre, response.data.correo, response.data.idUser );
                navigate(`${interfazUser}`); // Redirecciona al usuario a la ruta de administrador
            } else {
                // Si no, muestra un mensaje de error indicando que faltan datos
                Swal.fire({
                    title: 'Error',
                    text: 'Faltan datos en la respuesta del servidor.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        }).catch(error => {
            // Manejo de errores
            let mensajeError = "Error al realizar la solicitud.";
            if (error.response) {
                mensajeError = error.response.data.error;
                console.log('Usuario, correo o contraseña incorrectos.');
            } else if (error.request) {
                mensajeError = "No se recibió respuesta del servidor.";
            }
            Swal.fire({
                title: 'Error',
                text: mensajeError,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        });
    };

    return (
        <main>
            <form onSubmit={logear} className="containerForm">
                <h2>Login</h2>
                {/* bloque tipo se usuario */}
                <section className="block">
                    <select className="input select" value={rol} required
                        onChange={(event) => { setRol(event.target.value); }}>
                        <option value="" hidden>Seleccione su rol</option>
                        <option value="1">Administrador</option>
                        <option value="2">Almacenista</option>
                    </select>
                    <i className="bx bxs-user-account" />
                </section>
                {/* bloque correo usuario */}
                <section className="block">
                    <label>
                        <input onChange={(event) => { setCorreo(event.target.value) }}
                            className="input" type="email" placeholder="correo" value={correo} required></input>
                        <i className="bx bxs-user" />
                    </label>
                </section>
                {/* bloque contraseña usuario */}
                <section className="block">
                    <label>
                        <input onChange={(event) => { setContra(event.target.value) }}
                            className="input" type="password" placeholder="contraseña" value={contra} required></input>
                        <i className="bx bxs-lock-alt" />
                    </label>
                </section>
                {/* boton ingresar o */}
                <button className="btnLogear" type="submit">Login</button>
            </form>
        </main>
    );
}

export default FormLogin;
