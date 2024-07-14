import React, { useState, useContext } from 'react';
import { StyleSheet, View, Text, TextInput, Modal, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MaterialIcons } from '@expo/vector-icons';
import RoundedButton from '../template/RoundedButton.js';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const CrearEmpleado = ({ visible, onClose, onCreate }) => {
    const { userData } = useContext(AuthContext);
    const initialEmpleadoState = {
        nombre_empleado: '',
        apellido_empleado: '',
        correo_empleado: '',
        rol_empleados_id: '2',
        password: '',
        confirmPassword: ''
    };

    const [newEmpleado, setNewEmpleado] = useState(initialEmpleadoState);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[A-Z]).{8,}$/;

    const validarFormulario = () => {
        let valid = true;
        let errorsTemp = {};

        if (!newEmpleado.nombre_empleado) {
            errorsTemp.nombre = "El campo nombre no puede estar vacío.";
            valid = false;
        }
        if (!newEmpleado.apellido_empleado) {
            errorsTemp.apellido = "El campo apellido no puede estar vacío.";
            valid = false;
        }
        if (!newEmpleado.correo_empleado) {
            errorsTemp.correo = "El campo correo no puede estar vacío.";
            valid = false;
        } else if (!emailRegex.test(newEmpleado.correo_empleado)) {
            errorsTemp.correo = "Ingrese un correo válido.";
            valid = false;
        }
        if (!newEmpleado.password || !passwordRegex.test(newEmpleado.password)) {
            errorsTemp.password = "La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, letras y números.";
            valid = false;
        }
        if (newEmpleado.password !== newEmpleado.confirmPassword) {
            errorsTemp.confirmPassword = "Las contraseñas no coinciden.";
            valid = false;
        }

        setErrors(errorsTemp);
        return valid;
    };

    const crear = async () => {
        if (!validarFormulario()) return;

        try {
            const response = await axios.post("http://192.168.2.4:3001/empleados/crear", {
                nombre: newEmpleado.nombre_empleado,
                apellido: newEmpleado.apellido_empleado,
                correo: newEmpleado.correo_empleado,
                contra: newEmpleado.password,
                rol: newEmpleado.rol_empleados_id,
                idUser: userData.idUser,
            });

            Alert.alert("Éxito", "Empleado creado con éxito");
            setNewEmpleado(initialEmpleadoState); // Limpiar los campos después de crear un nuevo empleado
            onCreate();
            onClose();
        } catch (error) {
            Alert.alert("Error", error.response ? error.response.data.mensaje : "No se recibió respuesta del servidor");
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
                        <Text style={styles.modalTitle}>Crear Empleado</Text>
                        <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
                            <MaterialIcons name="close" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder="Nombre"
                        value={newEmpleado.nombre_empleado}
                        onChangeText={(text) => setNewEmpleado({ ...newEmpleado, nombre_empleado: text })}
                    />
                    {errors.nombre && <Text style={styles.errorText}>{errors.nombre}</Text>}
                    <TextInput
                        style={styles.input}
                        placeholder="Apellido"
                        value={newEmpleado.apellido_empleado}
                        onChangeText={(text) => setNewEmpleado({ ...newEmpleado, apellido_empleado: text })}
                    />
                    {errors.apellido && <Text style={styles.errorText}>{errors.apellido}</Text>}
                    <TextInput
                        style={styles.input}
                        placeholder="Correo"
                        value={newEmpleado.correo_empleado}
                        onChangeText={(text) => setNewEmpleado({ ...newEmpleado, correo_empleado: text })}
                    />
                    {errors.correo && <Text style={styles.errorText}>{errors.correo}</Text>}
                    <Picker
                        selectedValue={newEmpleado.rol_empleados_id}
                        onValueChange={(itemValue) => setNewEmpleado({ ...newEmpleado, rol_empleados_id: itemValue })}
                        style={styles.picker}
                    >
                        <Picker.Item label="Administrador" value="1" />
                        <Picker.Item label="Almacenista" value="2" />
                    </Picker>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.inputWithIcon}
                            placeholder="Contraseña"
                            secureTextEntry={!showPassword}
                            value={newEmpleado.password}
                            onChangeText={(text) => setNewEmpleado({ ...newEmpleado, password: text })}
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
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.inputWithIcon}
                            placeholder="Confirmar Contraseña"
                            secureTextEntry={!showConfirmPassword}
                            value={newEmpleado.confirmPassword}
                            onChangeText={(text) => setNewEmpleado({ ...newEmpleado, confirmPassword: text })}
                        />
                        <TouchableOpacity
                            style={styles.showPasswordIcon}
                            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            <MaterialIcons
                                name={showConfirmPassword ? 'visibility-off' : 'visibility'}
                                size={24}
                                color="black"
                            />
                        </TouchableOpacity>
                    </View>
                    {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
                    <View style={styles.buttonContainer}>
                        <View style={styles.buttonSpacing}>
                            <RoundedButton title="Guardar" onPress={crear} />
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

export default CrearEmpleado;
