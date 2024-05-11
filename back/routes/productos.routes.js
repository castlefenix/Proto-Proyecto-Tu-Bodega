import express from "express";
import upload from "../config/configMulter.js";
import { leerProducto, crearProducto, actualizarProducto, eliminarProducto } from "../controller/productos_controller.js";


const productosRoutes = express.Router();


productosRoutes.get('/leer', leerProducto);
productosRoutes.post('/crear', upload.single('imagen'), crearProducto);
productosRoutes.put('/actualizar', upload.single('imagen'), actualizarProducto);
productosRoutes.delete('/eliminar/:id', eliminarProducto);


export default productosRoutes;