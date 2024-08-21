import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { Button, Col, Form, Modal, ModalFooter, Row, ListGroup, ListGroupItem, InputGroup } from "react-bootstrap";
import Swal from 'sweetalert2';


function GenerarSalida({ abrirModal, cerrarModal, productosSeleccionados }) {//quisiera aca recibitr los datos de los productos que agrege unidades 
    //estados variables
    const [listaClientes, setListaClientes] = useState([]);
    const [fecha, setFecha] = useState('');
    const [idCliente, setIdCliente] = useState();
    const [listaPro, setListaPro] = useState([]); //lista de productos seleccionados
    const { usuario, idUser } = useAuth();

    //ejecutamos estas funciones
    useEffect(() => {
        setListaPro(productosSeleccionados); // Actualiza listaPro cada vez que productosSeleccionados cambia
        fechaActual();//nos trae la fecha actual
        leerClientes();//leemos todos los datos de la tabla cliente
    }, [productosSeleccionados]); // Dependencia de productosSeleccionados

    //limpia los campos
    const limpiarCampos = () => {
        fechaActual();
        setIdCliente();
        setListaPro([]);
        cerrarModal();
    }
    // traer la fecha actual
    const fechaActual = () => {
        const hoy = new Date();
        const fechaFormateada = hoy.toISOString().split('T')[0];
        setFecha(fechaFormateada);
    };
    // traer lista de clientes
    const leerClientes = async () => {
        fechaActual();
        try {
            const clientesList = await axios.get("http://localhost:3001/clientes/leer");
            setListaClientes(clientesList.data.respuesta);
        } catch (error) {
            Swal.fire("Error", error.response ? error.response.data.mensaje : "No se recibió respuesta del servidor", "error");
        }
    }

    //enviar salida
    const enviarSalida = async (e) => {
            e.preventDefault();
            if (listaPro.length === 0){
                Swal.fire("", "Por favor seleccione algun producto", "warning");
                return;
            }
        try {
            const response = await axios.post("http://localhost:3001/salidas/agregar", {
                fecha: fecha,
                idCliente: idCliente,
                idUser: idUser
            });
            const respuesta = response.data.idSalida
            enviarSalidaProducto(respuesta);
        } catch (error) {
            Swal.fire("Error", error.response ? error.response.data.mensaje : "No se recibió respuesta del servidor", "error");
        }
    };
    //enviar salida vs producto
    const enviarSalidaProducto = async (id) => {
        try {
            const response = await axios.post(`http://localhost:3001/salidas/agregar/svsp`, {
                idsalida: id,
                productos: listaPro,
            });
            console.log(response.data);
            Swal.fire("Bien", "Salida Exitosa", "success");
            limpiarCampos();
            cerrarModal();
        } catch (error) {
            // Manejo del error
            Swal.fire("Error", error.response ? error.response.data.mensaje : "No se recibió respuesta del servidor", "error");
        }
    }
    return (
        <div>
            <Modal className="mt-3" size="lg" centered show={abrirModal} onHide={cerrarModal} aria-labelledby="example-modal-sizes-title-lg">
                <Form onSubmit={enviarSalida}>
                    <Modal.Header closeButton>
                        <Modal.Title id="example-modal-sizes-title-lg">
                            Salida
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>

                            <Col>
                                <Form.Group controlId="formcliente">
                                    <Form.Select aria-label="Default select example" value={idCliente} onChange={(event) => { setIdCliente(event.target.value) }} required>
                                        <option value={''} >Sleccione el cliente</option>
                                        {listaClientes.map((dato, key) => {
                                            return (
                                                <option key={key} value={dato.id}>
                                                    {dato.nombre_cliente + ' '}{dato.apellido_cliente}
                                                </option>
                                            )
                                        })};
                                    </Form.Select>
                                </Form.Group>
                                <br />
                                <Form.Group controlId="formfecha">
                                    <InputGroup>
                                        <InputGroup.Text>Fecha</InputGroup.Text>
                                        <Form.Control type="date" name="fecha" value={fecha} onChange={(event) => { setFecha(event.target.value) }} required />
                                    </InputGroup>
                                </Form.Group>
                                <br />
                                <Form.Group controlId="formnombreusuario">
                                    <InputGroup>
                                        <InputGroup.Text>Empleado</InputGroup.Text>
                                        <Form.Control defaultValue={usuario} type="text" readOnly disabled required />
                                    </InputGroup>
                                </Form.Group>
                            </Col>

                            <Col className="scrollTabla" style={{ overflowY: 'auto', height: '210px' }}>
                                {listaPro.map((producto, key) => (
                                    <Row key={key} style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                        <Col xs={6}>
                                            <ListGroup>
                                                <ListGroupItem>
                                                    <Form.Label>Producto:
                                                        <Form.Control plaintext readOnly defaultValue={producto.nombre_producto} />
                                                    </Form.Label>
                                                </ListGroupItem>
                                            </ListGroup>
                                        </Col>
                                        <Col style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                                            <ListGroup>
                                                <ListGroupItem>
                                                    <Form.Label>Unidaes:
                                                        <Form.Control plaintext readOnly defaultValue={producto.contadorActual} />
                                                    </Form.Label>
                                                </ListGroupItem>
                                            </ListGroup>
                                        </Col>
                                    </Row>
                                ))}
                            </Col>

                        </Row>
                    </Modal.Body>
                    <ModalFooter>
                        <Col>
                            <Button variant="danger" onClick={limpiarCampos} >Cancelar</Button>
                        </Col>
                        <Col>
                            <Button variant="success" type="submit" >Crear</Button>
                        </Col>
                    </ModalFooter>
                </Form>
            </Modal>
        </div>
    );
};

export default GenerarSalida;