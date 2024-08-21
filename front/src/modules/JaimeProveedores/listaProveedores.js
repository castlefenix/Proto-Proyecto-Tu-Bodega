import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from 'react-bootstrap/Modal';
import Swal from 'sweetalert2'
import Axios from "axios";
import "../../css/Productos.css";

function ListaProveedores() {
    //formulario actualizacion
    const [id, setId] = useState('');
    const [nit, setNit] = useState('');
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [direccion, setDireccion] = useState('');
    const [telefono, setTelefono] = useState('');


    //modal actualizar
    const [show, setShow] = useState(false);
    const handleClose = () => {
        setShow(false)
        limpiarCampos();
    };
    const handleShow = () => setShow(true);

    //modal eliminar
    const [showDos, setShowDos] = useState(false);
    const handleCloseDos = () => {
        setShowDos(false)
        leerProveedores();
    };
    const handleShowDos = () => setShowDos(true);


    //lista
    const [listaProveedores, setListaProveedores] = useState([]);
    useEffect(() => {
        leerProveedores();
    }, []);

    //eliminar productos
    const eliminarProvee = (dato) => {
        handleShowDos();
        setId(dato.id)
    }


    //editar productos
    const editarProveedores = (dato) => {
        handleShow();
        setNit(dato.nit_proveedor);
        setNombre(dato.nombre_proveedor);
        setCorreo(dato.correo_proveedor);
        setDireccion(dato.direccion_proveedor);
        setTelefono(dato.telefono_proveedor);
        setId(dato.id);
    };

    //limpiar campos
    const limpiarCampos = () => {
        setNit("");
        setNombre("");
        setCorreo("");
        setDireccion("");
        setTelefono("");
    };

    const leerProveedores = () => {
        Axios.get("http://localhost:3001/proveedores/leer")
            .then((response) => {
                setListaProveedores(response.data);
                limpiarCampos();
            })
            .catch((error) => {
                Swal.fire("Error", error.response ? error.response.data.mensaje : "No se recibió respuesta del servidor", "error");
            });
    };

    const actualizar = async (e) => {
        e.preventDefault();
        try {
            const response = await Axios.put("http://localhost:3001/proveedores/actualizar", {
                id: id, //del proveedor a actualizar
                nit: nit, //del proveedor a actualizar
                nombre: nombre, //del proveedor a actualizar
                correo: correo, //del proveedor a actualizar
                direccion: direccion, //del proveedor a actualizar
                telefono: telefono,//del proveedor a actualizar
            });
            Swal.fire("Éxito", "proveedor actualizado con éxito", "success");
            leerProveedores();
            handleClose();
        } catch (error) {
            Swal.fire("Error", error.response ? error.response.data.mensaje : "No se recibió respuesta del servidor", "error");
        }
    };

    const eliminarProveedores = (id) => {
        Axios.delete(`http://localhost:3001/proveedores/eliminar/${id}`).then(() => {
            Swal.fire("Éxito", "proveedor eliminado con éxito", "success");
            handleCloseDos();
        }).catch((error)=>{
            Swal.fire("Error", error.response ? error.response.data.mensaje : "No se recibió respuesta del servidor", "error");
            handleCloseDos();
        });
    };

    return (
        <div className="container">
            <div className="container lista" id="lista">
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>Nit</th>
                            <th>Nombre</th>
                            <th>Correo</th>
                            <th>Direccion</th>
                            <th>Telefono</th>
                            <th className="columnaFinal">opciones</th>
                        </tr>
                    </thead>
                </table>
                <div className="scrollTabla" style={{ overflowY: 'auto' }}>
                    <table className="table table-striped table-hover contenido" >
                        <tbody>
                            {
                                listaProveedores.map((dato, key) => {
                                    return (
                                        <tr key={key}>
                                            <td>{dato.nit_proveedor}</td>
                                            <td>{dato.nombre_proveedor}</td>
                                            <td>{dato.correo_proveedor}</td>
                                            <td>{dato.direccion_proveedor}</td>
                                            <td>{dato.telefono_proveedor}</td>
                                            <td className="columnaFinal">
                                                <div className="filaFinal">
                                                    <button className="botones btnEdit" variant="primary"
                                                        onClick={() => { editarProveedores(dato); }}>
                                                        <i className='bx bx-edit-alt'></i>
                                                    </button>
                                                    <button
                                                        onClick={() => { eliminarProvee(dato); }}
                                                        className="botones btnDele">
                                                        <i className='bx bx-trash'></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
                <button className="btonLista btn btn-success" onClick={leerProveedores}>Actualizar Lista 🔃</button>
            </div>
            <div className="container actualizar" id="formActu">
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Actualizar proveedor</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="container formularioActu">
                        <form>
                            <div className="input-group mb-3">
                                <span className="input-group-text">Nit:</span>
                                <input value={nit} id="nitInput" onChange={(event) => { setNit(event.target.value) }} type="text"
                                    className="form-control" placeholder="Nit" aria-label="Username" required>
                                </input>
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text">Nombre:</span>
                                <input value={nombre} id="nombreInput" onChange={(event) => { setNombre(event.target.value) }} type="text"
                                    className="form-control" placeholder="nombre" required>
                                </input>
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text">Correo:</span>
                                <input value={correo} id="correoInput" onChange={(event) => { setCorreo(event.target.value) }} type="text"
                                    className="form-control" placeholder="correo" required>
                                </input>
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text">Direccion:</span>
                                <input value={direccion} id="direccionInput" onChange={(event) => { setDireccion(event.target.value) }} type="text"
                                    className="form-control" placeholder="direccion" required>
                                </input>
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text">Telefono:</span>
                                <input value={telefono} id="telefonoInput" onChange={(event) => { setTelefono(event.target.value) }} type="text"
                                    className="form-control" placeholder="telefono" required>
                                </input>
                            </div>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <div className="btnActu">
                            <button onClick={actualizar} type="button" className="btn btn-primary">Actualizar</button>
                            <button onClick={handleClose} type="button" className="btn btn-danger">Cancelar</button>
                        </div>
                    </Modal.Footer>
                </Modal>
            </div>
            <div className="container eliminar">
                <Modal show={showDos} onHide={handleCloseDos}>
                    <Modal.Header closeButton>
                        <Modal.Title>Eliminar proveedor</Modal.Title>
                    </Modal.Header>
                    <Modal.Footer>
                        <div className="btnActu">
                            <button onClick={()=>{ eliminarProveedores(id) }} type="button" className="btn btn-primary">Eliminar</button>
                            <button onClick={handleCloseDos} type="button" className="btn btn-danger">Cancelar</button>
                        </div>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>)
};
export default ListaProveedores;
