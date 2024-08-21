import { useState } from 'react';
import Axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../../css/Proveedores.css"
import Swal from 'sweetalert2';


function CrearProveedores() {

    const [nit, setNit] = useState("");
    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [direccion, setDireccion] = useState("");
    const [telefono, setTelefono] = useState();

    const lipiarCampos = () => {
        setNit("");
        setNombre("");
        setCorreo("");
        setDireccion("");
        setTelefono("");
        document.querySelector('.mensajeProveedores').style.display = 'none';

    }

    const ValidarFormulario = () => {
        const regexCorreo = /^(?=.{1,64}@)[A-Za-z0-9]+(?:[._-][A-Za-z0-9]+)*@[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*(?:\.[A-Za-z]{2,})+$/;
        if (!nit.trim() || !nombre.trim() || !correo.trim() || !direccion.trim() || !telefono.trim()) {
            Swal.fire("Error", "Todos los campos son obligatorios y no deben contener sólo espacios.", "error");
            return false;
        }
        if (!regexCorreo.test(correo)) {
            Swal.fire("Error", "Correo inválido", "error");
            document.querySelector('.mensajeProveedores').style.display = 'flex';
            return false;
        }
        return true;
    }

    const agregarProveedor = (event) => {
        event.preventDefault();
        if (!ValidarFormulario()) return;

        Axios.post('http://localhost:3001/proveedores/crear', {
            nit: nit,
            nombre: nombre,
            correo: correo,
            direccion: direccion,
            telefono: telefono,
        }).then(() => {
            lipiarCampos();
            Swal.fire("Éxito", "Proveedor agregado con éxito", "success");
        }).catch((error) => {
            Swal.fire("Error", error.response ? error.response.data.mensaje : "No se recibió respuesta del servidor", "error");
        });
    };
    return (
        <div className="containerProductos">

            <form className=" proveedoresAgregar" onSubmit={agregarProveedor}>

                <div className="input-group mb-3">
                    <span className="input-group-text">Nit:</span>
                    <input value={nit} onChange={(event) => { setNit(event.target.value) }} type="text"
                        className="form-control" placeholder="Nit" aria-label="Username" required>
                    </input>
                </div>
                <div className="input-group mb-3">
                    <span className="input-group-text">Nombre:</span>
                    <input value={nombre} onChange={(event) => { setNombre(event.target.value) }} type="text"
                        className="form-control" placeholder="Nombre" required>
                    </input>
                </div>
                <div className="input-group mb-3">
                    <span className="input-group-text">Correo:</span>
                    <input value={correo} onChange={(event) => { setCorreo(event.target.value) }} type="text"
                        className="form-control" placeholder="Correo" required>
                    </input>
                </div>
                <div className='mensajeProveedores'>  
                    Por favor, ingresa una dirección de correo electrónico válida, 
                    no debe contener espacios ni emojis.
                    </div>
                <div className="input-group mb-3">
                    <span className="input-group-text">Direccion:</span>
                    <input value={direccion} onChange={(event) => { setDireccion(event.target.value) }} type="text"
                        className="form-control" placeholder="Direccion" required>
                    </input>
                </div>
                <div className="input-group mb-3">
                    <span className="input-group-text">Telefono:</span>
                    <input value={telefono} onChange={(event) => { setTelefono(event.target.value) }} type="number"
                        className="form-control" placeholder="Telefono" required>
                    </input>
                </div>
                <div className='contenedorBtnP'>
                    <button className='btn btn-success' type='submit'>Registrar Proveedor</button>
                </div>
            </form>

        </div>
    );
}

export default CrearProveedores;
