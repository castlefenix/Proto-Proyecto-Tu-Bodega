import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from 'react-bootstrap/Modal';
import Swal from 'sweetalert2'
import Axios from "axios";
import "../../css/Productos.css";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


function ListaProductos() {
    //formulario actualizacion
    const [id, setId] = useState('');
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [precioCompra, setPrecioCompra] = useState('');
    const [precioVenta, setPrecioVenta] = useState('');
    const [unidades, setUnidades] = useState('');
    const [fecha, setFecha] = useState('');
    const [unidadMedida, setUnidadMedida] = useState('');
    const [proveedor, setProveedor] = useState('');

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
        leerProductos();
    };
    const handleShowDos = () => setShowDos(true);


    //lista
    const [listaProductos, setListaProductos] = useState([]);
    useEffect(() => {
        leerProductos();
    }, []);

    //eliminar productos
    const eliminarProductos = (dato) => {
        handleShowDos();
        setId(dato.id)
    }

    function formatearFecha(fecha) {
        const date = new Date(fecha);
        const anio = date.getFullYear();
        const mes = (date.getMonth() + 1).toString().padStart(2, "0");
        const dia = date.getDate().toString().padStart(2, '0');
        return `${anio}-${mes}-${dia}`
    };

    //editar productos
    const editarProduct = (dato) => {
        handleShow();
        setNombre(dato.nombre_producto);
        setDescripcion(dato.descripcion_producto);
        setPrecioCompra(dato.precio_compra_producto);
        setPrecioVenta(dato.precio_venta_producto);
        setUnidades(dato.unidades_producto);
        setFecha(formatearFecha(dato.fecha_producto));
        setUnidadMedida(dato.unidades_medida_id);
        setProveedor(dato.proveedores_id);
        setId(dato.id);
    };

    //limpiar campos
    const limpiarCampos = () => {
        setNombre("");
        setDescripcion("");
        setPrecioCompra("");
        setPrecioVenta("");
        setUnidades("");
        setFecha("");
        setUnidadMedida("");
        setProveedor("");
        setId("");
    };

    const leerProductos = () => {
        Axios.get("http://localhost:3001/productos/leer")
            .then((response) => {
                setListaProductos(response.data);
                limpiarCampos();
            })
            .catch((error) => {
                Swal.fire("Error", error.response ? error.response.data.mensaje : "No se recibió respuesta del servidor", "error");
            });
    };

    const actualizar = async (e) => {
        e.preventDefault();
        try {
            const response = await Axios.put("http://localhost:3001/productos/actualizar", {
                id: id, //del producto a actualizar
                nombre: nombre, //del producto a actualizar
                descripcion: descripcion, //del producto a actualizar
                precioCompra: precioCompra, //del producto a actualizar
                precioVenta: precioVenta, //del producto a actualizar
                unidades: unidades, //del producto a actualizar
                fecha: fecha, //del producto a actualizar
                unidadMedida: unidadMedida, //del producto a actualizar
                proveedor: proveedor //del producto a actualizar
            });
            Swal.fire("Éxito", "producto actualizado con éxito", "success");
            leerProductos();
            handleClose();
        } catch (error) {
            Swal.fire("Error", error.response ? error.response.data.mensaje : "No se recibió respuesta del servidor", "error");
        }
    };

    const eliminarProducto = (id) => {
        Axios.delete(`http://localhost:3001/productos/eliminar/${id}`).then(() => {
            Swal.fire("Éxito", "producto eliminado con éxito", "success");
            handleCloseDos();
        }).catch((error) => {
            Swal.fire("Error", error.response ? error.response.data.mensaje : "No se recibió respuesta del servidor", "error");
            handleCloseDos();
        });
    };


    const descargarRegistros = () => {
        // Mapeo de los productos para el formato de Excel
        const registrosParaExcel = listaProductos.map((producto) => ({
            ID: producto.id,
            Nombre: producto.nombre_producto,
            Descripción: producto.descripcion_producto,
            'Precio de Compra': producto.precio_compra_producto,
            'Precio de Venta': producto.precio_venta_producto,
            Unidades: producto.unidades_producto,
            Fecha: new Date(producto.fecha_producto).toLocaleDateString('es'),
            'Unidad de Medida': producto.nombre_unidaded_medida,
            Proveedor: producto.nombre_proveedor
        }));

        // Crear el libro de trabajo y la hoja de trabajo
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(registrosParaExcel);

        // Agregar la hoja al libro
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Productos');

        // Generar el archivo Excel y descargarlo
        XLSX.writeFile(workbook, 'Lista_Productos.xlsx');
    };


    return (
        <div className="container">
            <div className="container lista" id="lista">
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th className="columnaUnoP">#</th>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th>Precio de Compra</th>
                            <th>Precio de Venta</th>
                            <th>Unidades</th>
                            <th>Fecha</th>
                            <th>Medida</th>
                            <th>Proveedor</th>
                            <th className="columnaFinal">opciones</th>
                        </tr>
                    </thead>
                </table>
                <div className="scrollTabla" style={{ overflowY: 'auto' }}>
                    <table className="table table-striped table-hover contenido" >
                        <tbody>
                            {
                                listaProductos.map((dato, key) => {
                                    return (
                                        <tr key={key}>
                                            <td className="columnaUnoP">{dato.id}</td>
                                            <td>{dato.nombre_producto}</td>
                                            <td>{dato.descripcion_producto}</td>
                                            <td>{dato.precio_compra_producto}</td>
                                            <td>{dato.precio_venta_producto}</td>
                                            <td>{dato.unidades_producto}</td>
                                            <td>{new Date(dato.fecha_producto).toLocaleDateString('es')}</td>
                                            <td>{dato.nombre_unidaded_medida}</td>
                                            <td>{dato.nombre_proveedor}</td>
                                            <td className="columnaFinal">
                                                <div className="filaFinal">
                                                    <button className="botones btnEdit" variant="primary"
                                                        onClick={() => { editarProduct(dato); }}>
                                                        <i className='bx bx-edit-alt'></i>
                                                    </button>
                                                    <button
                                                        onClick={() => { eliminarProductos(dato); }}
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
                <div className="d-flex w-100 mt-3">
                    <button className="btonLista btn btn-success me-2 flex-grow-1" onClick={leerProductos}>Actualizar Lista 🔃</button>
                    <button className="btonLista btn btn-primary flex-grow-1" onClick={descargarRegistros}>Descargar Registros 📑</button>
                </div>
            </div>
            <div className="container actualizar" id="formActu">
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Actualizar producto</Modal.Title>
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
                                <span className="input-group-text">descripcion:</span>
                                <input value={descripcion} id="descripcionInput" onChange={(event) => { setDescripcion(event.target.value) }} type="text"
                                    className="form-control" placeholder="descripcion" required>
                                </input>
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text">Precio de compra:</span>
                                <input value={precioCompra} id="precioCompraInput" onChange={(event) => { setPrecioCompra(event.target.value) }} type="number"
                                    className="form-control" placeholder="precioCompra" required>
                                </input>
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text">Precio de venta:</span>
                                <input value={precioVenta} id="precioVentaInput" onChange={(event) => { setPrecioVenta(event.target.value) }} type="number"
                                    className="form-control" placeholder="precioVenta" required>
                                </input>
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text">unidades:</span>
                                <input value={unidades} id="unidadesInput" onChange={(event) => { setUnidades(event.target.value) }} type="number"
                                    className="form-control" placeholder="unidades" required>
                                </input>
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text">fecha:</span>
                                <input value={fecha} id="fechaInput" onChange={(event) => { setFecha(event.target.value) }} type="Date"
                                    className="form-control" placeholder="fecha" required>
                                </input>
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text">medida:</span>
                                <input value={unidadMedida} id="unidadMedidaInput" onChange={(event) => { setUnidadMedida(event.target.value) }} type="text"
                                    className="form-control" placeholder="unidadMedida" required>
                                </input>
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text">proveedor:</span>
                                <input value={proveedor} id="proveedorInput" onChange={(event) => { setProveedor(event.target.value) }} type="text"
                                    className="form-control" placeholder="proveedor" required>
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
                        <Modal.Title>Eliminar producto</Modal.Title>
                    </Modal.Header>
                    <Modal.Footer>
                        <div className="btnActu">
                            <button onClick={() => { eliminarProducto(id) }} type="button" className="btn btn-primary">Eliminar</button>
                            <button onClick={handleCloseDos} type="button" className="btn btn-danger">Cancelar</button>
                        </div>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>)
};
export default ListaProductos;