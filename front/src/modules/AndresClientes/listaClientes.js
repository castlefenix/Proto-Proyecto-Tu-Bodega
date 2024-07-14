import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from 'react-bootstrap/Modal';
import Swal from 'sweetalert2';
import Axios from "axios";
import "../../css/Clientes.css";

function ListaClientes() {
    //formulario actualizacion
    const [id, setId] = useState('');
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [documento, setDocumento] = useState('');
    const [correo, setCorreo] = useState('');
    const [telefono, setTelefono] = useState('');
    const [direccion, setDireccion] = useState('');

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
        leerClientes();
    };
    const handleShowDos = () => setShowDos(true);

    //lista Clientes
    const [listaClientes, setListaClientes] = useState([]);


    useEffect(() => {
        leerClientes();
    }, []);

    //eliminar Clientes
    const eliminarClientes = (dato) => {
        handleShowDos();
        setId(dato.id)
    };

    //editar Clientes
    const editarCliente = (dato) => {
        handleShow();
        setNombre(dato.nombre_cliente);
        setApellido(dato.apellido_cliente);
        setDocumento(dato.documento_cliente);
        setCorreo(dato.correo_cliente);
        setTelefono(dato.telefono_cliente);
        setDireccion(dato.direccion_cliente);
        setId(dato.id); 
    };

    //limpiar campos
    const limpiarCampos = () => {
        setNombre("");
        setApellido("");
        setDocumento("");
        setCorreo("");
        setTelefono("");
        setDireccion("");
        setId("");
    };

    //avance martes
    const leerClientes = async () => {
        try {
            const clientesList = await Axios.get("http://192.168.2.4:3001/clientes/leer");
            setListaClientes(clientesList.data.respuesta);
            limpiarCampos();
        } catch (error) {
            Swal.fire("Error", error.response ? error.response.data.mensaje : "No se recibió respuesta del servidor", "error");
        }
    }

    const actualizar = async (e) => {
        e.preventDefault();
        try {
            const response = await Axios.put("http://192.168.2.4:3001/clientes/actualizar", {
                id: id, //del cliente a actualizar
                nombre: nombre, //del cliente a actualizar
                apellido: apellido, //del cliente a actualizar
                documento: documento, //del cliente a actualizar
                correo: correo, //del cliente a actualizar
                telefono: telefono, //del cliente a actualizar
                direccion: direccion, //del cliente a actualizar
            });
            Swal.fire("Éxito", "cliente actualizado con éxito", "success");
            leerClientes();
            handleClose();
        } catch (error) {
            Swal.fire("Error", error.response ? error.response.data.mensaje : "No se recibió respuesta del servidor", "error");
        }
    };

    const eliminarCliente = (id) => {
        Axios.delete(`http://192.168.2.4:3001/clientes/eliminar/${id}`).then(() => {
            Swal.fire("Éxito", "cliente eliminado con éxito", "success");
            handleCloseDos();
        }).catch((error)=>{
            Swal.fire("Advertencia", "Este cliente esta vinculado con una salida, no deberia ser eliminado", "warning");
            handleCloseDos();
        });
    };

    return (
        <div className="container">
            <div className="containerlista" id="lista">
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>Documento</th>
                            <th>Correo</th>
                            <th>Telefono</th>
                            <th>Direccion</th>
                            <th className="columnaFinal">Opciones</th>
                        </tr>
                    </thead>
                </table>
                <div className="scrollTabla" style={{ overflowY: 'auto' }}>
                    <table className="table table-striped table-hover contenido" >
                        <tbody>
                            {
                                listaClientes.map((dato, key) => {
                                    return (
                                        <tr key={key}>
                                            <td>{dato.nombre_cliente}</td>
                                            <td>{dato.apellido_cliente}</td>
                                            <td>{dato.documento_cliente}</td>
                                            <td>{dato.correo_cliente}</td>
                                            <td>{dato.telefono_cliente}</td>
                                            <td>{dato.direccion_cliente}</td>
                                            <td className="columnaFinal">
                                                <div className="filaFinal">
                                                    <button className="botones btnEdit" variant="primary"
                                                        onClick={() => { editarCliente(dato); }}>
                                                        <i className='bx bx-edit-alt'></i>
                                                    </button>
                                                    <button
                                                        onClick={() => { eliminarClientes(dato); }}
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
                <button className="btonLista btn btn-success" onClick={leerClientes}>Actualizar Lista 🔃</button>
            </div>
            <div className="container actualizar" id="formActu">
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Actualizar Cliente</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="container formularioActu">
                        <form>
                            <div className="input-group mb-3">
                                <span className="input-group-text">Nombre:</span>
                                <input value={nombre} id="nombreInput" onChange={(event) => { setNombre(event.target.value) }} type="text"
                                    className="form-control" placeholder="Nombre" aria-label="Username" required>
                                </input>
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text">apellido:</span>
                                <input value={apellido} id="apellidoInput" onChange={(event) => { setApellido(event.target.value) }} type="text"
                                    className="form-control" placeholder="apellido" required>
                                </input>
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text">documento:</span>
                                <input value={documento} id="documentoInput" onChange={(event) => { setDocumento(event.target.value) }} type="number"
                                    className="form-control" placeholder="documento" required>
                                </input>
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text">correo:</span>
                                <input value={correo} id="correoInput" onChange={(event) => { setCorreo(event.target.value) }} type="text"
                                    className="form-control" placeholder="correo" required>
                                </input>
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text">telefono:</span>
                                <input value={telefono} id="telefonoInput" onChange={(event) => { setTelefono(event.target.value) }} type="text"
                                    className="form-control" placeholder="telefono" required>
                                </input>
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text">fecha:</span>
                                <input value={direccion} id="direccionInput" onChange={(event) => { setDireccion(event.target.value) }} type="text"
                                    className="form-control" placeholder="direccion" required>
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
                        <Modal.Title>Eliminar Cliente</Modal.Title>
                    </Modal.Header>
                    <Modal.Footer>
                        <div className="btnActu">
                            <button onClick={()=>{ eliminarCliente(id) }} type="button" className="btn btn-primary">eliminarCliente</button>
                            <button onClick={handleCloseDos} type="button" className="btn btn-danger">Cancelar</button>
                        </div>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
}

export default ListaClientes;
