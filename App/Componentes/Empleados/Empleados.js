import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import BackgroundContainer from '../template/BackgroundContainer';
import { AuthContext } from '../../context/AuthContext';
import ActualizarEmpleado from './ActualizarEmpleado';
import CrearEmpleado from './CrearEmpleado';
import EliminarEmpleado from './EliminarEmpleado';

const Empleados = ({ navigation }) => {
    const { logout, userData } = useContext(AuthContext);
    const [empleados, setEmpleados] = useState([]);
    const [selectedEmpleado, setSelectedEmpleado] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [crearModalVisible, setCrearModalVisible] = useState(false);
    const [eliminarModalVisible, setEliminarModalVisible] = useState(false);
    const [empleadoIdToDelete, setEmpleadoIdToDelete] = useState(null);
    const [empleadoNombreToDelete, setEmpleadoNombreToDelete] = useState('');

    const fetchEmpleados = async () => {
        try {
            const response = await axios.get('http://192.168.2.4:3001/empleados/leer');
            setEmpleados(response.data);
        } catch (error) {
            console.error('Error fetching empleados:', error);
        }
    };

    useEffect(() => {
        fetchEmpleados();
    }, []);

    const openModal = (empleado) => {
        setSelectedEmpleado(empleado);
        setModalVisible(true);
    };

    const closeModal = () => {
        setSelectedEmpleado(null);
        setModalVisible(false);
    };

    const openCrearModal = () => {
        setCrearModalVisible(true);
    };

    const closeCrearModal = () => {
        setCrearModalVisible(false);
        fetchEmpleados();
    };

    const openEliminarModal = (empleadoId, empleadoNombre) => {
        setEmpleadoIdToDelete(empleadoId);
        setEmpleadoNombreToDelete(empleadoNombre);
        setEliminarModalVisible(true);
    };

    const closeEliminarModal = () => {
        setEmpleadoIdToDelete(null);
        setEliminarModalVisible(false);
        fetchEmpleados();
    };

    return (
        <BackgroundContainer>
            <View style={styles.container}>
                <TouchableOpacity style={styles.logoutIcon} onPress={logout}>
                    <MaterialIcons name="logout" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.backIcon} onPress={() => navigation.goBack()}>
                    <MaterialIcons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <View style={styles.innerContainer}>
                    <View style={styles.addIconContainer}>
                        <TouchableOpacity style={styles.addIcon} onPress={openCrearModal}>
                            <MaterialIcons name="add" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                    <ScrollView contentContainerStyle={styles.scrollContainer}>
                        {empleados.map((dato, index) => (
                            <View key={index} style={styles.empleadoContainer}>
                                <View style={styles.empleadoInfo}>
                                    <Text style={styles.empleadoNombre}>{dato.nombre_empleado}</Text>
                                    <Text style={styles.empleadoRol}>
                                        {dato.rol_empleados_id === 1 ? 'Administrador' : 'Almacenista'}
                                    </Text>
                                </View>
                                <View style={styles.empleadoActions}>
                                    <TouchableOpacity onPress={() => openModal(dato)}>
                                        <MaterialIcons name="edit" size={24} color="white" />
                                    </TouchableOpacity>
                                    {dato.id !== 1 && (
                                        <TouchableOpacity onPress={() => openEliminarModal(dato.id, dato.nombre_empleado)}>
                                            <MaterialIcons name="delete" size={24} color="white" />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                        ))}
                        <View style={{ height: 20 }} />
                    </ScrollView>
                </View>
                {selectedEmpleado && (
                    <ActualizarEmpleado
                        visible={modalVisible}
                        onClose={closeModal}
                        empleado={selectedEmpleado}
                        onUpdate={fetchEmpleados} // Pasa la función de actualización
                    />
                )}
                <CrearEmpleado
                    visible={crearModalVisible}
                    onClose={closeCrearModal}
                    onCreate={fetchEmpleados} // Pasa la función de actualización
                />
                {eliminarModalVisible && (
                    <EliminarEmpleado
                        visible={eliminarModalVisible}
                        onClose={closeEliminarModal}
                        empleadoId={empleadoIdToDelete}
                        empleadoNombre={empleadoNombreToDelete}
                        onDelete={fetchEmpleados} // Pasa la función de actualización
                    />
                )}
            </View>
        </BackgroundContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        height: '100%',
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 70,
        paddingHorizontal: 10,
        paddingBottom: 20
    },
    logoutIcon: {
        position: 'absolute',
        top: 20,
        right: 20,
    },
    backIcon: {
        position: 'absolute',
        top: 20,
        left: 20,
    },
    innerContainer: {
        borderColor: '#ffffff',
        borderWidth: 2,
        width: '95%',
        height: '100%',
        backgroundColor: 'rgba(128, 128, 128, 0.8)',
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingBottom: 20,
    },
    addIconContainer: {
        alignItems: 'flex-end',
        marginTop: 10,
        marginBottom: 10,
    },
    addIcon: {
        zIndex: 1,
    },
    scrollContainer: {
        paddingHorizontal: 5,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
        paddingTop: 0,
        paddingBottom: 0,
    },
    empleadoContainer: {
        borderColor: '#ffffff',
        borderWidth: 2,
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#333',
        borderRadius: 10,
        padding: 10,
        marginVertical: 5,
    },
    empleadoInfo: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        width: '70%',
    },
    empleadoNombre: {
        fontSize: 18,
        color: '#fff',
    },
    empleadoRol: {
        fontSize: 16,
        color: '#ccc',
    },
    empleadoActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '20%',
    },
});

export default Empleados;
