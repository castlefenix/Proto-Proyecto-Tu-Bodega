import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from 'react-bootstrap/Modal';
import Swal from 'sweetalert2'
import Axios from "axios";
import "../../css/Usuarios.css";
import { useAuth } from "../../auth/AuthContext.js";

function ListarUsuarios() {
    const { correoU } = useAuth();

    const [id, setId] = useState('');
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [correo, setCorreo] = useState('');
    const [contraNueva, setContraNueva] = useState('');
    const [rol, setRol] = useState('');
    const [contraAdmi, setContraAdmi] = useState('');

    const [show, setShow] = useState(false);
    const handleClose = () => {
        setShow(false);
        limpiarCampos();
    };
    const handleShow = () => setShow(true);

    const [showDos, setShowDos] = useState(false);
    const handleCloseDos = () => {
        setShowDos(false);
        leerUsuarios();
    };
    const handleShowDos = () => setShowDos(true);

    const [listaUsuarios, setListaUsuarios] = useState([]);
    useEffect(() => {
        leerUsuarios();
    }, []);

    const eliminarUsuario = (dato) => {
        handleShowDos();
        setId(dato.id);
    };

    const editarUser = (dato) => {
        handleShow();
        setNombre(dato.nombre_empleado);
        setApellido(dato.apellido_empleado);
        setCorreo(dato.correo_empleado);
        setRol(dato.rol_empleados_id);
        setId(dato.id);
    };

    const limpiarCampos = () => {
        setNombre("");
        setApellido("");
        setCorreo("");
        setRol("");
        setId("");
        setContraAdmi("");
        setContraNueva("");
    };

    const validarFormulario = () => {
        const regexCorreo = /^(?=.{1,64}@)[A-Za-z0-9]+(?:[._-][A-Za-z0-9]+)*@[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*(?:\.[A-Za-z]{2,})+$/;
        if (!nombre.trim() || !apellido.trim() || !correo.trim() || !contraAdmi.trim()) {
            Swal.fire("Error", "Todos los campos son obligatorios y no deben contener sólo espacios.", "error");
            return false;
        }
        if (!regexCorreo.test(correo)) {
            Swal.fire("Error", "Correo inválido", "error");
            return false;
        }
        return true;
    };

    const leerUsuarios = () => {
        Axios.get("http://localhost:3001/empleados/leer")
            .then((response) => {
                setListaUsuarios(response.data);
                limpiarCampos();
            })
            .catch((error) => {
                Swal.fire("Error", error.response ? error.response.data.mensaje : "No se recibió respuesta del servidor", "error");
            });
    };

    const actualizar = async (e) => {
        e.preventDefault();
        if (!validarFormulario()) return;
        try {
            const response = await Axios.put("http://localhost:3001/empleados/actualizar", {
                id: id,
                nombre: nombre,
                apellido: apellido,
                correo: correo,
                contra: contraNueva,
                rol: rol,
                correoU: correoU,
                contraAdmi: contraAdmi,
            });
            Swal.fire("Éxito", "Usuario actualizado con éxito", "success");
            leerUsuarios();
            handleClose();
        } catch (error) {
            Swal.fire("Error", error.response ? error.response.data.mensaje : "No se recibió respuesta del servidor", "error");
        }
    };

    const eliminar = () => {
        Axios.delete(`http://localhost:3001/empleados/eliminar/${id}?correo=${encodeURIComponent(correoU)}&password=${encodeURIComponent(contraAdmi)}`)
            .then(() => {
                Swal.fire("Éxito", "Usuario eliminado con éxito", "success");
                handleCloseDos();
            })
            .catch((error) => {
                Swal.fire("Error", error.response ? error.response.data.mensaje : "No se recibió respuesta del servidor", "error");
            });
    };

    return (
        <div className="container">
            <div className="container lista" id="lista">
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>Correo</th>
                            <th>Cargo</th>
                            <th className="columnaFinal">Opciones</th>
                        </tr>
                    </thead>
                </table>
                <div className="scrollTabla" style={{ overflowY: 'auto' }}>
                    <table className="table table-striped table-hover contenido">
                        <tbody>
                            {listaUsuarios.map((dato, key) => {
                                return (
                                    <tr key={key}>
                                        <td>{dato.nombre_empleado}</td>
                                        <td>{dato.apellido_empleado}</td>
                                        <td>{dato.correo_empleado}</td>
                                        <td>
                                            {dato.rol_empleados_id === 1 ? (
                                                <span>Administrador</span>
                                            ) : (
                                                <span>Almacenista</span>
                                            )}
                                        </td>
                                        <td className="columnaFinal">
                                            <div className="filaFinal">
                                                <button
                                                    className="botones btnEdit"
                                                    onClick={() => editarUser(dato)}
                                                >
                                                    <i className='bx bx-edit-alt'></i>
                                                </button>
                                                {dato.id === 1 ? (
                                                    <button hidden onClick={() => eliminarUsuario(dato)} className="botones btnDele">
                                                        <i className='bx bx-trash'></i>
                                                    </button>
                                                ) : (
                                                    <button onClick={() => eliminarUsuario(dato)} className="botones btnDele">
                                                        <i className='bx bx-trash'></i>
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <button className="btonLista btn btn-success" onClick={leerUsuarios}>
                    Actualizar Lista 🔃
                </button>
            </div>
            <div className="container actualizar" id="formActu">
                <Modal show={show} onHide={handleClose} aria-labelledby="modal-actualizar-usuario" aria-hidden={!show}>
                    <Modal.Header closeButton>
                        <Modal.Title>Actualizar usuario</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="container formularioActu">
                        <form>
                            <div className="input-group mb-3">
                                <span className="input-group-text">Nombre:</span>
                                <input
                                    value={nombre}
                                    id="nombreInput"
                                    onChange={(event) => setNombre(event.target.value)}
                                    type="text"
                                    className="form-control"
                                    placeholder="Nombre"
                                    aria-label="Nombre"
                                    required
                                />
                            </div>

                            <div className="input-group mb-3">
                                <span className="input-group-text">Apellido:</span>
                                <input
                                    value={apellido}
                                    id="apellidoInput"
                                    onChange={(event) => setApellido(event.target.value)}
                                    type="text"
                                    className="form-control"
                                    placeholder="Apellido"
                                    required
                                />
                            </div>

                            <div className="input-group mb-3">
                                <span className="input-group-text">Correo:</span>
                                <input
                                    value={correo}
                                    id="correoInput"
                                    onChange={(event) => setCorreo(event.target.value)}
                                    type="email"
                                    className="form-control"
                                    placeholder="Correo"
                                    required
                                />
                            </div>

                            <div className="input-group mb-3">
                                <span className="input-group-text">Contraseña nueva:</span>
                                <input
                                    value={contraNueva}
                                    id="repetirContrasenaInput"
                                    onChange={(event) => setContraNueva(event.target.value)}
                                    type="password"
                                    className="form-control"
                                    placeholder="Ejemplo de contraseña: Contra123"
                                />
                            </div>
                            <div id="passwordHelpBlock" className="mensajeContra2">
                                La contraseña debe tener 8-20 caracteres con letras y números, sin espacios, caracteres especiales ni emojis.
                            </div>

                            <div className="input-group mb-3">
                                <span className="input-group-text">Rol:</span>
                                {id === 1 ? (
                                    <input type="text" className="form-control" placeholder="Administrador" disabled />
                                ) : (
                                    <select
                                        value={rol}
                                        name="rol"
                                        className="form-select"
                                        onChange={(event) => setRol(event.target.value)}
                                        required
                                    >
                                        <option value="" hidden>
                                            Seleccione su rol
                                        </option>
                                        <option value="1">Administrador</option>
                                        <option value="2">Almacenista</option>
                                    </select>
                                )}
                            </div>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <div className="input-group mb-3">
                            <span className="input-group-text">Contraseña:</span>
                            <input
                                id="contrasenaInput"
                                onChange={(event) => setContraAdmi(event.target.value)}
                                type="password"
                                className="form-control"
                                placeholder="contraseña de perfil Administrador"
                                required
                            />
                        </div>
                        <span className="mensajeactu">
                            Para poder efectuar un cambio se debe ingresar la contraseña del perfil administrador
                        </span>
                        <div className="btnActu">
                            <button onClick={actualizar} type="button" className="btn btn-primary">
                                Actualizar
                            </button>
                            <button onClick={handleClose} type="button" className="btn btn-danger">
                                Cancelar
                            </button>
                        </div>
                    </Modal.Footer>
                </Modal>
            </div>
            <div className="container eliminar">
                <Modal show={showDos} onHide={handleCloseDos} aria-labelledby="modal-eliminar-usuario" aria-hidden={!showDos}>
                    <Modal.Header closeButton>
                        <Modal.Title>Eliminar Usuario</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="input-group mb-3">
                            <span className="input-group-text">Contraseña:</span>
                            <input
                                id="contrasenaInput"
                                onChange={(event) => setContraAdmi(event.target.value)}
                                type="password"
                                className="form-control"
                                placeholder="contraseña de perfil Administrador"
                                required
                            />
                        </div>
                        <span className="mensajeactu">
                            Para poder efectuar un cambio se debe ingresar la contraseña del perfil administrador
                        </span>
                    </Modal.Body>
                    <Modal.Footer>
                        <div className="btnActu">
                            <button onClick={eliminar} type="button" className="btn btn-primary">
                                Eliminar
                            </button>
                            <button onClick={handleCloseDos} type="button" className="btn btn-danger">
                                Cancelar
                            </button>
                        </div>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
}

export default ListarUsuarios;
