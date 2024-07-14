import React, { useState, useContext } from 'react';
import { StyleSheet, View, Text, TextInput, Modal, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import RoundedButton from '../template/RoundedButton.js';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const EliminarEmpleado = ({ visible, onClose, empleadoId, empleadoNombre, onDelete }) => {
    const { userData } = useContext(AuthContext);
    const [adminPassword, setAdminPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const eliminar = async () => {
        if (adminPassword.trim() === '') {
            setError('El campo de contraseña no puede estar vacío.');
            return;
        }

        try {
            const response = await axios.delete(`http://192.168.2.4:3001/empleados/eliminar/${empleadoId}`, {
                params: {
                    correo: userData.correo,
                    password: adminPassword
                }
            });

            Alert.alert("Éxito", `Empleado ${empleadoNombre} eliminado con éxito`);
            onDelete();
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
                        <Text style={styles.modalTitle}>Eliminar Empleado</Text>
                        <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
                            <MaterialIcons name="close" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.confirmText}>
                        ¿Está seguro de que desea eliminar a {empleadoNombre}?
                    </Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Contraseña del Administrador"
                            secureTextEntry={!showPassword}
                            value={adminPassword}
                            onChangeText={(text) => {
                                setAdminPassword(text);
                                setError('');
                            }}
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
                    {error ? <Text style={styles.errorText}>{error}</Text> : null}
                    <View style={styles.buttonContainer}>
                        <View style={styles.buttonSpacing}>
                            <RoundedButton title="Eliminar" onPress={eliminar} />
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
        height: '40%',
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
    confirmText: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
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
    input: {
        flex: 1,
        padding: 10,
    },
    showPasswordIcon: {
        padding: 10,
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

export default EliminarEmpleado;
