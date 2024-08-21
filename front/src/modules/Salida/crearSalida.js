import axios from 'axios';
import { useEffect, useState } from 'react';
import { Button, Card, ListGroup, Row, Col, Accordion, ListGroupItem } from 'react-bootstrap';
import Swal from 'sweetalert2';
import GenerarSalida from './generarSalida.js';

function CrearSalida() {
    const [listaProductos, setListaProductos] = useState([]);
    const [productosSeleccionados, setProductosSeleccionados] = useState([]);

    const [lgShow, setLgShow] = useState(false);//estado del modal

    //manejador abrir cerrar Modal
    const handleShow = () => setLgShow(true);// abrirModal
    const closeShow = () => { setLgShow(false); leerProductos() }// cerrarModal

    useEffect(() => {
        leerProductos();
    }, []);


    const incrementarContador = (index) => {
        const nuevosProductos = [...listaProductos];
        if (nuevosProductos[index].contadorActual < nuevosProductos[index].unidades_producto) {
            nuevosProductos[index].contadorActual++;
            // Actualiza la lista de productos con los nuevos contadores
            setListaProductos(nuevosProductos);
            // Actualiza el estado de productos seleccionados
            actualizarProductosSeleccionados(nuevosProductos[index]);
        }
    };

    const decrementarContador = (index) => {
        const nuevosProductos = [...listaProductos];
        if (nuevosProductos[index].contadorActual > 0) {
            nuevosProductos[index].contadorActual--;
            // Actualiza la lista de productos con los nuevos contadores
            setListaProductos(nuevosProductos);
            // Actualiza el estado de productos seleccionados
            actualizarProductosSeleccionados(nuevosProductos[index]);
        }
    };

    const actualizarProductosSeleccionados = (productoActualizado) => {
        // Verifica si el producto ya está en el arreglo de seleccionados
        const indice = productosSeleccionados.findIndex((producto) => producto.id === productoActualizado.id);
        const nuevosSeleccionados = [...productosSeleccionados];

        if (indice !== -1) {
            // Si el contador es 0, elimina el producto; si no, actualiza la cantidad
            if (productoActualizado.contadorActual === 0) {
                nuevosSeleccionados.splice(indice, 1);
            } else {
                // Actualiza solo con los campos necesarios
                nuevosSeleccionados[indice] = {
                    id: productoActualizado.id,
                    nombre_producto: productoActualizado.nombre_producto,
                    contadorActual: productoActualizado.contadorActual
                };
            }
        } else if (productoActualizado.contadorActual > 0) {
            // Si el producto no está en el arreglo y tiene un contador mayor a 0, agrégalo
            // Incluye solo los campos necesarios
            nuevosSeleccionados.push({
                id: productoActualizado.id,
                nombre_producto: productoActualizado.nombre_producto,
                contadorActual: productoActualizado.contadorActual
            });
        }

        // Actualiza el estado de productos seleccionados
        setProductosSeleccionados(nuevosSeleccionados);
    };

    const leerProductos = () => {
        setProductosSeleccionados([]);
        axios.get("http://localhost:3001/productos/leer")
            .then((response) => {
                const productosConContador = response.data.map(producto => ({
                    ...producto,
                    contadorActual: 0,
                }));
                setListaProductos(productosConContador);
            })
            .catch((error) => {
                Swal.fire("Error", error.response ? error.response.data.mensaje : "No se recibió respuesta del servidor", "error");
            });
    }

    return (
        <div className='container'>
            <div className="scrollTabla" style={{ overflowY: 'auto', height: '80%' }}>
                {listaProductos.map((producto, index) => (
                    <Card key={index} style={{ width: '18rem', marginBottom: '50px' }}>
                        <Card.Img className='mt-2' variant="top" src={`http://localhost:3001/${producto.ruta_imagen}`} style={{ width: '100px',height:'100px', margin: '0 auto' }} />
                        <Card.Body>
                            <Card.Title>{producto.nombre_producto}</Card.Title>
                            <Card.Text>{producto.descripcion_producto}</Card.Text>
                            <Card.Text>Unidades Disponibles: {producto.unidades_producto - producto.contadorActual}</Card.Text>
                        </Card.Body>
                        <ListGroup className="list-group">
                            <Accordion defaultActiveKey="0">
                                <Accordion.Item eventKey="1">
                                    <Accordion.Header>Detalles</Accordion.Header>
                                    <Accordion.Body>
                                        <ListGroup>
                                            <ListGroupItem>Proveedor: {producto.nombre_proveedor}</ListGroupItem>
                                            <ListGroupItem>Precio Compra: {producto.precio_compra_producto}</ListGroupItem>
                                            <ListGroupItem>Precio Venta: {producto.precio_venta_producto}</ListGroupItem>
                                        </ListGroup>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>
                        </ListGroup>
                        <Card.Body>
                            <Row>
                                <Col>
                                    <Button variant="danger" onClick={() => decrementarContador(index)}><i className='bx bx-minus-circle'></i></Button>
                                </Col>
                                <Col>
                                    <Button variant='light'>{producto.contadorActual}</Button> {/* Muestra el contador actual */}
                                </Col>
                                <Col>
                                    <Button variant="success" onClick={() => incrementarContador(index)}><i className='bx bx-plus-circle'></i></Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                ))}
            </div>
            <Row style={{ textAlign: 'center', color: 'white' }}>
                <Col><Button onClick={leerProductos} variant='secondary'>Refrescar</Button></Col>
                <Col><Button onClick={handleShow} variant='success'>generar salida</Button></Col>
            </Row>
            <GenerarSalida abrirModal={lgShow} cerrarModal={closeShow} productosSeleccionados={productosSeleccionados}></GenerarSalida>

        </div>
    );
}

export default CrearSalida;
