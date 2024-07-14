import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native';
import RoundedButton from '../template/RoundedButton';
import BackgroundContainer from '../template/BackgroundContainer';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';

const Admi = () => {
    const { userData, logout } = useContext(AuthContext);
    const navigation = useNavigation();
    const [user, setUser] = useState('');

    const fetchEmpleados = async () => {
        const id = userData.idUser;
        if (!id) {
            console.log("ID de usuario no disponible");
            return;
        }
        try {
            const response = await axios.get(`http://192.168.2.4:3001/empleados/leer/${id}`);
            if (response.data && response.data.nombre_empleado) {
                setUser(response.data.nombre_empleado);
            } else {
                throw new Error("Datos de usuario no válidos");
            }
        } catch (error) {
            console.error('Error aqui:', error);
        }
    };

    useEffect(() => {
        fetchEmpleados();
    }, []);

    useEffect(() => {
        setUser(userData.nombre); // Actualiza el nombre cuando el contexto cambia
    }, [userData]);

    const imprime = () => {
        console.log("Correo guardado en variables globales:", userData.correo);
    };

    return (
        <BackgroundContainer>
            <View style={styles.container}>
                <TouchableOpacity style={styles.logoutIcon} onPress={logout}>
                    <MaterialIcons name="logout" size={24} color="white" />
                </TouchableOpacity>
                <View style={styles.innerContainer}>
                    <Text style={styles.welcomeText}>Bienvenido, {user}</Text>
                    <View style={styles.buttonsContainer}>
                        <RoundedButton title="Empleados" onPress={() => navigation.navigate('Empleados')} />
                        <RoundedButton title="Salidas" onPress={() => navigation.navigate('Salidas')} />
                    </View>
                </View>
            </View>
        </BackgroundContainer>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    logoutIcon: {
        position: 'absolute',
        top: 20,
        right: 20,
    },
    innerContainer: {
        borderColor: '#ffffff',
        borderWidth: 2,
        width: '80%',
        backgroundColor: 'rgba(128, 128, 128, 0.8)',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    welcomeText: {
        fontSize: 24,
        color: '#fff',
        marginBottom: 40,
    },
    buttonsContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 150,
    },
});

export default Admi;
