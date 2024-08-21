import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../css/Registro.css';
import { Accordion, Button, ListGroup, ListGroupItem, Table, Modal, Form } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const InformeSalidas = () => {
    const [salidas, setSalidas] = useState([]);
    const [camposSeleccionados, setCamposSeleccionados] = useState({
        fecha: true,
        numero: true,
        cliente: true,
        empleado: true,
        producto: true,
        descripcion: true,
        unidades: true
    });
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        obtenerSalidas();
    }, []);

    const obtenerSalidas = async () => {
        try {
            const response = await axios.get('http://localhost:3001/salidas/registro');

            // Ordena los datos por salidas_id en orden descendente
            const datosOrdenados = response.data.datos.sort((a, b) => b.salidas_id - a.salidas_id);

            const datosFormateados = datosOrdenados.map(salida => {
                if (typeof salida.productos === 'string' && typeof salida.descripciones === 'string' && typeof salida.Unidades === 'string') {
                    const productosArray = salida.productos.split(', ');
                    const descripcionesArray = salida.descripciones.split('; ');
                    const unidadesArray = salida.Unidades.split('; ');

                    const productosDetalle = productosArray.map((producto, index) => ({
                        nombre: producto,
                        descripcion: descripcionesArray[index] || '',
                        unidades: unidadesArray[index] || ''
                    }));

                    return { ...salida, productos: productosDetalle };
                }
                return salida;
            });

            setSalidas(datosFormateados);
        } catch (error) {
            console.error('Hubo un error al obtener las salidas:', error);
        }
    };

    const toggleModal = () => setShowModal(!showModal);

    const handleChangeCampo = (campo) => {
        setCamposSeleccionados(prevState => ({
            ...prevState,
            [campo]: !prevState[campo]
        }));
    };

    const descargarRegistros = () => {
        const registrosParaExcel = salidas.map(salida => {
            return salida.productos.map(producto => {
                let registro = {};
                if (camposSeleccionados.fecha) registro.Fecha = new Date(salida.fecha_salida).toLocaleDateString();
                if (camposSeleccionados.numero) registro.Numero = salida.salidas_id;
                if (camposSeleccionados.cliente) registro.Cliente = salida.nombre_cliente;
                if (camposSeleccionados.empleado) registro.Empleado = salida.nombre_empleado;
                if (camposSeleccionados.producto) registro.Producto = producto.nombre;
                if (camposSeleccionados.descripcion) registro.Descripcion = producto.descripcion;
                if (camposSeleccionados.unidades) registro.Unidades = producto.unidades;
                return registro;
            });
        }).flat();

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(registrosParaExcel);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Registros');
        XLSX.writeFile(workbook, 'registros_salidas.xlsx');
    };

    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.5%' }}>
            <div className="scrollTabla" id='padreRegistro' style={{ overflowY: 'auto', height: '95%', width: '100%' }}>
                {salidas.map((salida, key) => (
                    <div className='contenedorRegistro mb-2' key={key}>
                        <div className='cabezaregis mb-2'>
                            <ListGroup>
                                <ListGroupItem>Fecha: {new Date(salida.fecha_salida).toLocaleDateString()}</ListGroupItem>
                            </ListGroup>
                            <ListGroup>
                                <ListGroupItem>N°: {salida.salidas_id}</ListGroupItem>
                            </ListGroup>
                        </div>
                        <div className='cabezaregis'>
                            <ListGroup>
                                <ListGroupItem>Cliente: {salida.nombre_cliente}</ListGroupItem>
                            </ListGroup>
                            <ListGroup>
                                <ListGroupItem>Empleado: {salida.nombre_empleado}</ListGroupItem>
                            </ListGroup>
                        </div>
                        <div className='mt-4'>
                            <Accordion defaultActiveKey="1">
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header>Productos:</Accordion.Header>
                                    <Accordion.Body>
                                        <div className='contenedorProductosregistro'>
                                            <Table>
                                                <thead>
                                                    <tr>
                                                        <th>Nombre</th>
                                                        <th>Descripcion</th>
                                                        <th>Unidades</th>
                                                    </tr>
                                                </thead>
                                            </Table>
                                            <div className="scrollTabla" style={{ overflowY: 'auto', height: '120px' }}>
                                                <Table striped bordered hover>
                                                    <tbody>
                                                        {Array.isArray(salida.productos) && salida.productos.map((producto, indice) => (
                                                            <tr key={indice}>
                                                                <td>{producto.nombre}</td>
                                                                <td>{producto.descripcion}</td>
                                                                <td>{producto.unidades}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </Table>
                                            </div>
                                        </div>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>
                        </div>
                    </div>
                ))}
            </div>
            <div style={{ display: 'flex', width: '100%' }}>
                <Button variant='success' style={{ flex: 1 }} onClick={obtenerSalidas}>Actualizar Registros 🔃</Button>
                <Button variant='primary' style={{ flex: 1 }} onClick={toggleModal}>Elegir Campos y Exportar 📑</Button>
            </div>

            {/* Modal para seleccionar los campos */}
            <Modal show={showModal} onHide={toggleModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Selecciona los campos para descargar</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Check 
                            type="checkbox" 
                            label="Fecha" 
                            checked={camposSeleccionados.fecha}
                            onChange={() => handleChangeCampo('fecha')} 
                        />
                        <Form.Check 
                            type="checkbox" 
                            label="Número" 
                            checked={camposSeleccionados.numero}
                            onChange={() => handleChangeCampo('numero')} 
                        />
                        <Form.Check 
                            type="checkbox" 
                            label="Cliente" 
                            checked={camposSeleccionados.cliente}
                            onChange={() => handleChangeCampo('cliente')} 
                        />
                        <Form.Check 
                            type="checkbox" 
                            label="Empleado" 
                            checked={camposSeleccionados.empleado}
                            onChange={() => handleChangeCampo('empleado')} 
                        />
                        <Form.Check 
                            type="checkbox" 
                            label="Producto" 
                            checked={camposSeleccionados.producto}
                            onChange={() => handleChangeCampo('producto')} 
                        />
                        <Form.Check 
                            type="checkbox" 
                            label="Descripción" 
                            checked={camposSeleccionados.descripcion}
                            onChange={() => handleChangeCampo('descripcion')} 
                        />
                        <Form.Check 
                            type="checkbox" 
                            label="Unidades" 
                            checked={camposSeleccionados.unidades}
                            onChange={() => handleChangeCampo('unidades')} 
                        />
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => { descargarRegistros(); toggleModal(); }}>
                        Descargar
                    </Button>
                    <Button variant="secondary" onClick={toggleModal}>
                        Cancelar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default InformeSalidas;
