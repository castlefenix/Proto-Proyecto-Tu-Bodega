import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../css/Registro.css'
import { Accordion, AccordionHeader, AccordionItem, Button, ListGroup, ListGroupItem, Row, Table } from 'react-bootstrap';

const InformeSalidas = () => {
    const [salidas, setSalidas] = useState([]);

    useEffect(() => {
        obtenerSalidas();
    }, []);

    const obtenerSalidas = async () => {
        try {
            const response = await axios.get('http://192.168.2.4:3001/salidas/registro');
    
            // Ordena los datos por salidas_id en orden descendente
            const datosOrdenados = response.data.datos.sort((a, b) => b.salidas_id - a.salidas_id);
            
            const datosFormateados = datosOrdenados.map(salida => {
                // Verifica que los campos productos, descripciones y Unidades existan y sean strings.
                if (typeof salida.productos === 'string' && typeof salida.descripciones === 'string' && typeof salida.Unidades === 'string') {
                    const productosArray = salida.productos.split(', ');
                    const descripcionesArray = salida.descripciones.split('; ');
                    const unidadesArray = salida.Unidades.split('; ');
    
                    // Crea un array de objetos para los productos con su descripción y unidades correspondientes.
                    const productosDetalle = productosArray.map((producto, index) => ({
                        nombre: producto,
                        descripcion: descripcionesArray[index] || '',
                        unidades: unidadesArray[index] || ''
                    }));
    
                    // Agrega este array al objeto de salida.
                    return { ...salida, productos: productosDetalle };
                }
    
                // Si no son strings o alguno no existe, devuelve el objeto de salida sin modificar.
                return salida;
            });
    
            setSalidas(datosFormateados);
        } catch (error) {
            console.error('Hubo un error al obtener las salidas:', error);
        }
    };
            

    return (
        <div style={{width:'100%',display:'flex',flexDirection:'column',justifyContent:'space-between',padding: '1.5%'}}>
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
                                        <div className='contenedorProductosregistro' >
                                            <Table>
                                                <thead>
                                                    <tr>
                                                        <th>Nombre</th>
                                                        <th>Descripcion</th>
                                                        <th>Unidades</th>
                                                    </tr>
                                                </thead >
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
                <Button variant='success' className='mb-2' onClick={obtenerSalidas}>Actualizar Registros 🔃</Button>
        </div>
    );
};

export default InformeSalidas;

