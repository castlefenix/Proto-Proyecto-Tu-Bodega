import express from "express"
import bcrypt from "bcryptjs";
import { parse } from "dotenv";


const rutaEmpleado = express.Router();

/** 
*@swagger
*components:
*    schemas:
*        empleados:
*            type: object
*            properties:
*                id:
*                    type: integer
*                    description: Id autogenerado en la base de datos
*                nombre_empleado:
*                    type: string
*                    description: nombre del empleado
*                apellido_empleado:
*                    type: string
*                    description: apellido del empleado
*                password_empleado: 
*                    type: string
*                    description: contraseña de ingreso empleado
*                correo_empleado:
*                    type: string
*                    description: correo empleado
*                rol_empleados_id:
*                    type: integer
*                    description: llave foranea con tabla rol_empleados 1 para administrador 2 para almacenista
*            required:
*                -   nombre_empleado
*                -   apellido_empleado
*                -   password_empleado
*                -   correo_empleado
*                -   rol_empleados_id
*            example:
*                nombre_empleado: camilo 
*                apellido_empleado: castillo
*                password_empleado: Contraseña12345
*                correo_empleado: camil-code@gmail.com
*                rol_empleados_id: 1
*/

/**
 * @swagger
 * /empleados/leer:
 *   get:
 *     summary: Lee todos los empleados
 *     tags: [empleados]
 *     description: Obtiene una lista de todos los empleados de la base de datos.
 *     responses:
 *       200:
 *         description: Una lista de empleados.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: El ID único del empleado.
 *                   nombre:
 *                     type: string
 *                     description: El nombre del empleado.
 *                   apellido:
 *                     type: string
 *                     description: El apellido del empleado.
 *                   correo:
 *                     type: string
 *                     description: El correo electrónico del empleado.
 *                   cargo:
 *                     type: string
 *                     description: El cargo del empleado.
 *       400:
 *         description: Tabla no encontrada o error en la consulta.
 *       500:
 *         description: Error en conexión con la base de datos.
 */

rutaEmpleado.get("/leer", (req, res) => {
    req.getConnection((error, conexion) => {
        error ? res.status(500).json({ error: 'Error en conexion con la base de datos' })
            : conexion.query("SELECT * FROM empleados", (err, resultado) => {
                err ? res.status(400).json({ err: 'tabla no encontrada' })
                    : res.send(resultado);
            });
    });
});

rutaEmpleado.get("/leer/:id", (req, res) => {
    const id = parseInt(req.params.id);
    req.getConnection((error, conexion) => {
        if (error) {
            res.status(500).json({ error: 'Error en conexion con la base de datos' });
        } else {
            conexion.query("SELECT nombre_empleado FROM empleados WHERE id = ?", id, (err, resultado) => {
                if (err) {
                    res.status(400).json({ err: 'tabla no encontrada' });
                } else {
                    if (resultado.length > 0) {
                        res.json({ nombre_empleado: resultado[0].nombre_empleado }); // Devolver un objeto
                    } else {
                        res.status(404).json({ error: 'Empleado no encontrado' });
                    }
                }
            });
        }
    });
});


/**
* @swagger
* /empleados/validar:
*   post:
*     summary: Valida las credenciales del empleado.
*     tags: [empleados]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               rol:
*                 type: integer
*                 description: El ID del rol del empleado.
*               correo:
*                 type: string
*                 description: El correo electrónico del empleado.
*               contra:
*                 type: string
*                 description: La contraseña del empleado.
*             required:
*               - rol
*               - correo
*               - contra
*             example:
*                rol_empleados_id: 1
*                correo_empleado: camil-code@gmail.com
*                password_empleado: Contraseña12345
*     responses:
*       200:
*         description: Autenticación exitosa, saludos al empleado.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 saludos:
*                   type: string
*                   description: Nombre del empleado.
*                 correo:
*                   type: string
*                   description: correo del empleado.
*                 mensaje:
*                   type: string
*                   description: Mensaje de bienvenida.
*       401:
*         description: Autenticación fallida debido a credenciales inválidas.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 error:
*                   type: string
*                   description: Mensaje de error indicando credenciales incorrectas.
*       500:
*         description: Error de conexión con la base de datos.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 error:
*                   type: string
*                   description: Mensaje de error indicando fallo en la conexión.
*/



rutaEmpleado.post("/validar", (req, res) => {
    const rol = parseInt(req.body.rol);
    const correo = String(req.body.correo);
    const contra = String(req.body.contra); // La contraseña que se comparará.
    const consulta = 'SELECT * FROM empleados WHERE rol_empleados_id = ? AND correo_empleado = ?';

    console.log(`Rol: ${rol}, Correo: ${correo}, Contraseña: ${contra}`);

    req.getConnection((error, validacion) => {
        if (error) {
            console.error('Fallo la conexión con la base de datos:', error);
            return res.status(500).json({ error: 'Fallo la conexión con la base de datos' });
        }
        validacion.query(consulta, [rol, correo], (err, resultados) => {
            if (err) {
                console.error('Problema al consultar la base de datos:', err);
                return res.status(400).json({ error: 'Problema al consultar la base de datos' });
            }

            if (resultados.length > 0) {
                const compareContra = bcrypt.compareSync(contra, resultados[0].password_empleado);
                if (compareContra) {
                    res.status(200).json({
                        idUser: resultados[0].id,
                        nombre: resultados[0].nombre_empleado,
                        correo: resultados[0].correo_empleado,
                        mensaje: 'Bienvenido',
                    });
                } else {
                    // Si la contraseña no coincide
                    console.error('Contraseña incorrecta');
                    res.status(200).json({ error: 'Usuario, correo o contraseña incorrectos.' });
                }
            } else {
                // Si no hay resultados de la base de datos
                console.error('No se encontraron resultados para el usuario');
                res.status(401).json({ error: 'Usuario, correo o contraseña incorrectos.' });
            }
        });
    });
});



/**
* @swagger
* /empleados/crear:
*   post:
*     summary: Crea un nuevo empleado.
*     tags: [empleados]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               nombre:
*                 type: string
*                 description: El nombre del empleado.
*               apellido:
*                 type: string
*                 description: El apellido del empleado.
*               contra:
*                 type: string
*                 description: La contraseña del empleado.
*               correo:
*                 type: string
*                 description: El correo electrónico del empleado.
*               rol:
*                 type: integer
*                 description: El ID del rol del empleado.
*             required:
*               - nombre
*               - apellido
*               - contra
*               - correo
*               - rol
*     responses:
*       201:
*         description: Usuario creado con éxito.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 mensaje:
*                   type: string
*                   description: Mensaje de éxito al crear el usuario.
*                 resultado:
*                   type: object
*                   description: Detalles del resultado de la inserción.
*       409:
*         description: Conflicto por correo electrónico ya registrado.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 mensaje:
*                   type: string
*                   description: Mensaje indicando que el correo ya está registrado.
*       500:
*         description: Error de conexión con la base de datos o error al verificar existencia del usuario.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 error:
*                   type: string
*                   description: Mensaje de error indicando el problema.
*/


rutaEmpleado.post("/crear", async (req, res) => {
    const nombre = String(req.body.nombre).trim();
    const apellido = String(req.body.apellido).trim();
    const correo = String(req.body.correo).trim();
    const contra = req.body.contra;
    const rol = parseInt(req.body.rol);
    const encriptacion = await bcrypt.hash(contra, 8);

    // Primero, verificamos si ya existe un usuario con el mismo correo
    const consultaExistencia = `SELECT * FROM empleados WHERE correo_empleado = ?`;
    req.getConnection((error, conexion) => {
        if (error) {
            return res.status(500).json({ error: 'Error en conexión con base de datos' });
        }
        conexion.query(consultaExistencia, [correo], async (err, resultados) => {
            if (err) {
                return res.status(500).json({ error: 'Error al verificar existencia del usuario' });
            }
            if (resultados.length > 0) {
                // Si encontramos al menos un resultado, significa que el correo ya está registrado
                return res.status(409).json({ mensaje: 'El correo ya está registrado. Por favor, use otro correo.' });
            } else {
                // Si no encontramos un usuario existente, procedemos a insertar el nuevo usuario
                const consult = `INSERT INTO empleados (nombre_empleado, apellido_empleado, password_empleado, correo_empleado, rol_empleados_id) VALUES (?, ?, ?, ?, ?)`;
                conexion.query(consult, [nombre, apellido, encriptacion, correo, rol], (err, resultado) => {
                    if (err) {
                        return res.status(400).json({ error: 'Error en inserción de datos' });
                    }
                    return res.status(201).send({ mensaje: "Usuario agregado con éxito", resultado });
                });
            }
        });
    });
});

/**
* @swagger
* /empleados/actualizar:
*   put:
*     summary: Actualiza la información de un empleado
*     tags: [empleados]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               id:
*                 type: integer
*                 description: ID del empleado a actualizar
*               nombre:
*                 type: string
*                 description: Nuevo nombre del empleado
*               apellido:
*                 type: string
*                 description: Nuevo apellido del empleado
*               correo:
*                 type: string
*                 description: Nuevo correo electrónico del empleado
*               contra:
*                 type: string
*                 description: Nueva contraseña del empleado (opcional, si se proporciona debe seguir el formato de seguridad especificado)
*               rol:
*                 type: integer
*                 description: Nuevo rol del empleado
*               correoU:
*                 type: string
*                 description: Correo electrónico del usuario administrador que realiza la actualización
*               contraAdmi:
*                 type: string
*                 description: Contraseña del usuario administrador para autorizar la actualización
*             required:
*               - id
*               - nombre
*               - apellido
*               - correo
*               - rol
*               - correoU
*               - contraAdmi
*             example:
*               id: 1
*               nombre: "Laura"
*               apellido: "Martínez"
*               correo: "laura.martinez@gmail.com"
*               contra: "NuevaContra1234"
*               rol: 2
*               correoU: "admin@gmail.com"
*               contraAdmi: "AdminContra1234"
*     responses:
*       201:
*         description: Usuario actualizado con éxito
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 mensaje:
*                   type: string
*                   example: "Usuario actualizado con éxito"
*       400:
*         description: Solicitud incorrecta debido a entrada de datos errónea
*       401:
*         description: No autorizado debido a credenciales inválidas o falla en la inserción
*       403:
*         description: Prohibido el acceso por contraseña de administrador incorrecta o formato de nueva contraseña incorrecto
*       500:
*         description: Error en conexión con base de datos
*/


rutaEmpleado.put("/actualizar", async (req, res) => {
    const id = parseInt(req.body.id);
    const idUser = parseInt(req.body.idUser);
    const { nombre, apellido, correo, contra, correoU, contraAdmi } = req.body;
    const rol = parseInt(req.body.rol);
    var consulActu;
    var datos;
    const regexContra = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/;

    if (contra === '') {
        var consulActu = 'nombre_empleado=?, apellido_empleado=?, correo_empleado=?, rol_empleados_id=?';
        var datos = [nombre, apellido, correo, rol, id];
    }
    else if (!regexContra.test(contra)) {
        return res.status(403).json({ mensaje: "Formato de nueva contraseña incorrecto" })
    }
    else {
        const encriptacion = await bcrypt.hash(contra, 8);
        var consulActu = 'nombre_empleado=?, apellido_empleado=?, password_empleado=?, correo_empleado=?, rol_empleados_id=?';
        var datos = [nombre, apellido, encriptacion, correo, rol, id];
    }

    req.getConnection((error, conexion) => {
        if (error) {
            return res.status(500).json({ mensaje: 'Error en conexión con base de datos' });
        }
        conexion.query("SELECT * FROM empleados WHERE id=?", id, (err, resultado) => {
            if (err) {
                return res.status(400).json({ mensaje: 'se totio' })
            }
            if (resultado.length === 0) {
                return res.status(401).json({ mensaje: 'No se encontro el usuario administrador' })
                console.log(correoU)
            } else {
                const compareContra = bcrypt.compareSync(contraAdmi, resultado[0].password_empleado);
                if (!compareContra) {
                    return res.status(403).json({ mensaje: 'contraseña de administrador incorrecta' })
                }
                else {
                    conexion.query(`UPDATE empleados SET ${consulActu} WHERE id=? `,datos, (errors, respuesta) => {
                            if (errors) {
                                console.log(consulActu);
                                console.log(datos);
                                return res.status(401).json({ mensaje: 'fallo en la insercion ' });
                            }
                            return res.status(201).send({ mensaje: "Usuario actualizado con éxito", resultado });
                        });
                }
            }
        });
    })
});

/**
* @swagger
* /empleados/eliminar/{id}:
*   delete:
*     summary: Elimina un empleado por ID
*     tags: [empleados]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: integer
*         required: true
*         description: ID del empleado a eliminar
*       - in: query
*         name: correo
*         schema:
*           type: string
*         required: true
*         description: Correo electrónico del usuario administrador que realiza la eliminación
*       - in: query
*         name: password
*         schema:
*           type: string
*         required: true
*         description: Contraseña del usuario administrador para autorizar la eliminación
*     responses:
*       200:
*         description: Usuario eliminado con éxito
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 mensaje:
*                   type: string
*                   example: "usuario eliminado con exito"
*       400:
*         description: Solicitud incorrecta debido a entrada de datos errónea
*       401:
*         description: No autorizado debido a credenciales inválidas o falla en la eliminación
*       403:
*         description: Prohibido el acceso por contraseña de administrador incorrecta
*       500:
*         description: Error en conexión con base de datos
*/


rutaEmpleado.delete("/eliminar/:id", (req, res) => {
    const id = parseInt(req.params.id); // Accede al ID proporcionado en la ruta
    const correoU = req.query.correo; // Accede al correo electrónico enviado como parámetro de consulta
    const contraAdmi = req.query.password; // Accede a la contraseña enviada como parámetro de consulta

    req.getConnection((error, conexion) => {
        if (error) {
            return res.status(500).json({ mensaje: 'Error en conexión con base de datos' });
        }
        conexion.query("SELECT * FROM empleados WHERE correo_empleado=?", correoU, (err, resultado) => {
            if (err) {
                return res.status(400).json({ mensaje: 'se totio' })
            }
            if (resultado.length === 0) {
                return res.status(401).json({ mensaje: 'No se encontro el usuario administrador' })
            } else {
                const compareContra = bcrypt.compareSync(contraAdmi, resultado[0].password_empleado);
                if (!compareContra) {
                    return res.status(403).json({ mensaje: 'contraseña de administrador incorrecta' })
                }
                else{
                    conexion.query("DELETE FROM empleados WHERE id=?", id, (err, respuesta) => {
                        if(err) {
                            return res.status(401).json({ mensaje: 'fallo en la eliminacion' });
                        }
                        return res.status(200).json({mensaje: 'usuario eliminado con exito'});
                    });
                }
            }
        });
    });
});                



export default rutaEmpleado;