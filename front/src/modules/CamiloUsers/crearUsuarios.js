import "../../css/Usuarios.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';
import { useState } from "react";
import Axios from "axios";

function CrearUsuario() {
    const [usuario, setUsuario] = useState({
        nombre: "",
        apellido: "",
        contra: "",
        contraDos: "",
        correo: "",
        rol: ""
    });

    const manejadorCambios = (e) => {
        const { name, value } = e.target;
        setUsuario(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const limpiarCampos = () => {
        document.querySelector('.mensajeContra').style.display = 'none';
        setUsuario({
            nombre: "",
            apellido: "",
            contra: "",
            contraDos: "",
            correo: "",
            rol: ""
        });
    }

    const validarFormulario = () => {
        const { nombre, apellido, contra, contraDos, correo, rol } = usuario;
        const regexCorreo = /^(?=.{1,64}@)[A-Za-z0-9]+(?:[._-][A-Za-z0-9]+)*@[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*(?:\.[A-Za-z]{2,})+$/;
        const regexContra = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/;

        if (!nombre.trim() || !apellido.trim() || !contra.trim() || !contraDos.trim() || !correo.trim() || !rol.trim()) {
            Swal.fire("Error", "Todos los campos son obligatorios y no deben contener sólo espacios.", "error");
            return false;
        }

        if (!regexCorreo.test(correo)) {
            Swal.fire("Error", "Correo inválido", "error");
            return false;
        }

        if (!regexContra.test(contra)) {
            Swal.fire("Error", "Formato de contraseña incorrecto", "error");
            document.querySelector('.mensajeContra').style.display = 'flex';
            return false;
        }

        if (contra !== contraDos) {
            Swal.fire("Error", "Las contraseñas no coinciden", "error");
            return false;
        }

        return true;
    };

    const agregar = async (e) => {
        e.preventDefault();

        if (!validarFormulario()) return;

        try {
            await Axios.post("http://192.168.2.4:3001/empleados/crear", usuario);
            Swal.fire("Éxito", "Usuario agregado con éxito", "success");
            limpiarCampos();
        } catch (error) {
            Swal.fire("Error", error.response ? error.response.data.mensaje : "No se recibió respuesta del servidor", "error");
        }
    };

    return (
        <div className="container">
            <form onSubmit={agregar} className="container">
                {["nombre", "apellido", "correo"].map((field, index) => (
                    <div className="input-group mb-3" key={index}>
                        <span className="input-group-text">{`${field.charAt(0).toUpperCase() + field.slice(1)}:`}</span>
                        <input
                            name={field}
                            onChange={manejadorCambios}
                            type={field === "correo" ? "email" : "text"}
                            className="form-control"
                            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                            required
                            value={usuario[field]}
                        />
                    </div>
                ))}
                <div className="input-group mb-3">
                    <span className="input-group-text">Contraseña:</span>
                    <input
                        name="contra"
                        onChange={manejadorCambios}
                        type="password"
                        className="form-control"
                        placeholder="Contraseña"
                        required
                        value={usuario.contra}
                    />
                </div>
                <div
                    id="passwordHelpBlock"
                    className="mensajeContra">
                    Su contraseña debe tener entre 8 y 20 caracteres, contener letras y números, y
                    no debe contener espacios, caracteres especiales ni emojis.
                </div>
                <div className="input-group mb-3">
                    <span className="input-group-text">Repetir Contraseña:</span>
                    <input
                        name="contraDos"
                        onChange={manejadorCambios}
                        type="password"
                        className="form-control"
                        placeholder="Repite tu contraseña"
                        required
                        value={usuario.contraDos}
                    />
                </div>
                <div className="input-group mb-3">
                    <span className="input-group-text">Rol:</span>
                    <select
                        name="rol"
                        className="form-select"
                        onChange={manejadorCambios}
                        value={usuario.rol}
                        required
                    >
                        <option value="" hidden>Seleccione su rol</option>
                        <option value="1">Administrador</option>
                        <option value="2">Almacenista</option>
                    </select>
                </div>
                <button className="btn btn-success" type="submit">Registrar Usuario</button>
            </form>
        </div>
    );
};

export default CrearUsuario;