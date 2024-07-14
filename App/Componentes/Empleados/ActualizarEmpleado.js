import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, Text, TextInput, Modal, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MaterialIcons } from '@expo/vector-icons';
import RoundedButton from '../template/RoundedButton.js';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const ActualizarEmpleado = ({ visible, onClose, empleado, onUpdate, }) => {
    const { userData, login } = useContext(AuthContext);
    const [updatedEmpleado, setUpdatedEmpleado] = useState(empleado);
    const [adminPassword, setAdminPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showAdminPassword, setShowAdminPassword] = useState(false);
    const [errors, setErrors] = useState({});

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[A-Z]).{8,}$/;

    const validarFormulario = () => {
        let valid = true;
        let errorsTemp = {};

        if (!updatedEmpleado.nombre_empleado) {
            errorsTemp.nombre = "El campo nombre no puede estar vacío.";
            valid = false;
        }
        if (!updatedEmpleado.apellido_empleado) {
            errorsTemp.apellido = "El campo apellido no puede estar vacío.";
            valid = false;
        }
        if (!updatedEmpleado.correo_empleado) {
            errorsTemp.correo = "El campo correo no puede estar vacío.";
            valid = false;
        } else if (!emailRegex.test(updatedEmpleado.correo_empleado)) {
            errorsTemp.correo = "Ingrese un correo válido.";
            valid = false;
        }
        if (updatedEmpleado.password && !passwordRegex.test(updatedEmpleado.password)) {
            errorsTemp.password = "La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, letras y números, y no puede contener emoticones.";
            valid = false;
        }
        if (!adminPassword) {
            errorsTemp.adminPassword = "Ingrese la contraseña del administrador.";
            valid = false;
        }

        setErrors(errorsTemp);
        return valid;
    };

    const actualizar = async () => {
        if (!validarFormulario()) return;

        const actualizarEmpleado = async () => {
            return axios.put("http://192.168.2.4:3001/empleados/actualizar", {
                id: updatedEmpleado.id,
                idUser: userData.idUser,
                nombre: updatedEmpleado.nombre_empleado,
                apellido: updatedEmpleado.apellido_empleado,
                correo: updatedEmpleado.correo_empleado,
                contra: updatedEmpleado.password || '',
                correoU: userData.correo,
                contraAdmi: adminPassword,
                rol: updatedEmpleado.rol_empleados_id,
            });
        };

        const timeout = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("No se recibió respuesta en el tiempo esperado")), 4000)
        );

        try {
            const response = await Promise.race([actualizarEmpleado(), timeout]);

            if (updatedEmpleado.id === userData.idUser) {
                // Actualiza el contexto si el usuario actualiza su propio perfil
                login({
                    ...userData,
                    nombre: updatedEmpleado.nombre_empleado,
                    correo: updatedEmpleado.correo_empleado
                });
            }

            Alert.alert("Éxito", "Usuario actualizado con éxito");
            onUpdate();
            onClose();
        } catch (error) {
            Alert.alert("Error", error.response ? error.response.data.mensaje : error.message);
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <Text style={styles.modalTitle}>Editar Empleado</Text>
                        <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
                            <MaterialIcons name="close" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder="Nombre"
                        value={updatedEmpleado.nombre_empleado}
                        onChangeText={(text) => setUpdatedEmpleado({ ...updatedEmpleado, nombre_empleado: text })}
                    />
                    {errors.nombre && <Text style={styles.errorText}>{errors.nombre}</Text>}
                    <TextInput
                        style={styles.input}
                        placeholder="Apellido"
                        value={updatedEmpleado.apellido_empleado}
                        onChangeText={(text) => setUpdatedEmpleado({ ...updatedEmpleado, apellido_empleado: text })}
                    />
                    {errors.apellido && <Text style={styles.errorText}>{errors.apellido}</Text>}
                    <TextInput
                        style={styles.input}
                        placeholder="Correo"
                        value={updatedEmpleado.correo_empleado}
                        onChangeText={(text) => setUpdatedEmpleado({ ...updatedEmpleado, correo_empleado: text })}
                    />
                    {errors.correo && <Text style={styles.errorText}>{errors.correo}</Text>}
                    <Picker
                        selectedValue={updatedEmpleado.rol_empleados_id}
                        onValueChange={(itemValue) => setUpdatedEmpleado({ ...updatedEmpleado, rol_empleados_id: itemValue })}
                        style={styles.picker}
                        enabled={updatedEmpleado.id !== 1}
                    >
                        <Picker.Item label="Administrador" value="1" />
                        <Picker.Item label="Almacenista" value="2" />
                    </Picker>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.inputWithIcon}
                            placeholder="Contraseña"
                            secureTextEntry={!showPassword}
                            onChangeText={(text) => setUpdatedEmpleado({ ...updatedEmpleado, password: text })}
                        />
                        <TouchableOpacity
                            style={styles.showPasswordIcon}
                            onPress={() => setShowPassword(!showPassword)}
                        >
                            <MaterialIcons
                                name={showPassword ? 'visibility-off' : 'visibility'}
                                size={24}
                                color="black"
                            />
                        </TouchableOpacity>
                    </View>
                    {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                    <Text style={styles.adminPasswordInfo}>
                        Solo se pueden efectuar los cambios si se ingresa la contraseña del administrador.
                    </Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.inputWithIcon}
                            placeholder="Contraseña del Administrador"
                            secureTextEntry={!showAdminPassword}
                            value={adminPassword}
                            onChangeText={setAdminPassword}
                        />
                        <TouchableOpacity
                            style={styles.showPasswordIcon}
                            onPress={() => setShowAdminPassword(!showAdminPassword)}
                        >
                            <MaterialIcons
                                name={showAdminPassword ? 'visibility-off' : 'visibility'}
                                size={24}
                                color="black"
                            />
                        </TouchableOpacity>
                    </View>
                    {errors.adminPassword && <Text style={styles.errorText}>{errors.adminPassword}</Text>}
                    <View style={styles.buttonContainer}>
                        <View style={styles.buttonSpacing}>
                            <RoundedButton title="Guardar" onPress={actualizar} />
                        </View>
                        <View style={styles.buttonSpacing}>
                            <RoundedButton title="Cancelar" onPress={onClose} />
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    modalContent: {
        height: '80%',
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        alignItems: 'center',
        position: 'relative',
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    closeIcon: {
        zIndex: 1,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    input: {
        width: '100%',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        marginBottom: 10,
    },
    inputWithIcon: {
        flex: 1,
        padding: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        marginBottom: 10,
    },
    showPasswordIcon: {
        padding: 10,
    },
    picker: {
        width: '100%',
        marginBottom: 10,
    },
    adminPasswordInfo: {
        fontSize: 14,
        color: 'red',
        marginBottom: 10,
        textAlign: 'center',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginBottom: 10,
    },
    buttonContainer: {
        width: '100%',
        marginTop: 20,
    },
    buttonSpacing: {
        marginBottom: 10,
    },
});

export default ActualizarEmpleado;
