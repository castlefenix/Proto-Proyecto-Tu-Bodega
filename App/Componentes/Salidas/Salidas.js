import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import axios from 'axios';
import { MaterialIcons } from '@expo/vector-icons';
import BackgroundContainer from '../template/BackgroundContainer';
import { Card } from 'react-native-paper';

const Salidas = ({ navigation }) => {
    const [salidas, setSalidas] = useState([]);
    const [expanded, setExpanded] = useState(null);
    const [filteredSalidas, setFilteredSalidas] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchSalidas = async () => {
        try {
            const response = await axios.get('http://192.168.2.4:3001/salidas/registro');
            const datosFormateados = response.data.datos.map(salida => {
                if (typeof salida.productos === 'string' && typeof salida.descripciones === 'string' && typeof salida.Unidades === 'string') {
                    const productosArray = salida.productos.split(', ');
                    const descripcionesArray = salida.descripciones.split('; ');
                    const unidadesArray = salida.Unidades.split('; ');

                    const productosDetalle = productosArray.map((producto, index) => ({
                        nombre: producto,
                        descripcion: descripcionesArray[index] || '',
                        unidades: unidadesArray[index] || ''
                    }));

                    return { ...salida, productos: productosDetalle };
                }

                return salida;
            });

            setSalidas(datosFormateados);
            setFilteredSalidas(datosFormateados);
        } catch (error) {
            console.error('Error fetching salidas:', error);
        }
    };

    useEffect(() => {
        fetchSalidas();
    }, []);

    const toggleExpand = (id) => {
        setExpanded(expanded === id ? null : id);
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        if (query.trim() === '') {
            setFilteredSalidas(salidas);
        } else {
            const filtered = salidas.filter(salida =>
                salida.nombre_cliente.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredSalidas(filtered);
        }
    };

    return (
        <BackgroundContainer>
            <View style={styles.iconsContainer}>
                <TouchableOpacity style={styles.icon} onPress={() => navigation.goBack()}>
                    <MaterialIcons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <View style={styles.searchContainer}>
                    <View style={styles.inputContainer}>
                        <MaterialIcons name="search" size={24} color="white" style={styles.searchIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Buscar por cliente"
                            placeholderTextColor="#ccc"
                            value={searchQuery}
                            onChangeText={handleSearch}
                        />
                    </View>
                </View>
                <TouchableOpacity style={styles.icon} onPress={() => navigation.navigate('Login')}>
                    <MaterialIcons name="logout" size={24} color="white" />
                </TouchableOpacity>
            </View>
            <View style={styles.mainContainer}>
                <View style={styles.refreshIconContainer}>
                    <TouchableOpacity onPress={fetchSalidas}>
                        <MaterialIcons name="refresh" size={24} color="white" />
                    </TouchableOpacity>
                </View>
                <ScrollView contentContainerStyle={styles.container}>
                    {filteredSalidas.map((salida) => (
                        <Card key={salida.salidas_id} style={styles.card}>
                            <TouchableOpacity onPress={() => toggleExpand(salida.salidas_id)} style={styles.salidaHeader}>
                                <View style={styles.headerTextContainer}>
                                    <Text style={styles.salidaText}>Fecha: {new Date(salida.fecha_salida).toLocaleDateString()}</Text>
                                    <Text style={styles.salidaText}>N°: {salida.salidas_id}</Text>
                                </View>
                                <MaterialIcons name={expanded === salida.salidas_id ? "expand-less" : "expand-more"} size={24} color="white" />
                            </TouchableOpacity>
                            {expanded === salida.salidas_id && (
                                <View style={styles.salidaDetails}>
                                    <Text style={styles.salidaDetailText}>Cliente: {salida.nombre_cliente}</Text>
                                    <Text style={styles.salidaDetailText}>Empleado: {salida.nombre_empleado}</Text>
                                    <Text style={styles.salidaDetailText}>Productos:</Text>
                                    <ScrollView style={styles.productosContainer}>
                                        {salida.productos.map((producto, index) => (
                                            <View key={index} style={styles.producto}>
                                                <Text style={styles.productoText}>Nombre: {producto.nombre}</Text>
                                                <Text style={styles.productoText}>Descripción: {producto.descripcion}</Text>
                                                <Text style={styles.productoText}>Unidades: {producto.unidades}</Text>
                                            </View>
                                        ))}
                                    </ScrollView>
                                </View>
                            )}
                        </Card>
                    ))}
                </ScrollView>
            </View>
        </BackgroundContainer>
    );
};

const styles = StyleSheet.create({
    iconsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        padding: 20,
        position: 'absolute',
        top: 0,
        zIndex: 1,
    },
    icon: {
        padding: 10,
    },
    searchContainer: {
        flex: 1,
        marginHorizontal: 20,
        borderColor: '#ffffff',
        borderWidth: 2,
        backgroundColor: 'rgba(128, 128, 128, 0.8)',
        borderRadius: 20,
        paddingHorizontal: 10,
        justifyContent: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        padding: 10,
        borderColor: '#ccc',
        borderWidth: 0,
        borderRadius: 10,
        backgroundColor: 'rgba(128, 128, 128, 0.2)',
        color: '#fff',
    },
    mainContainer: {
        marginTop: 100, 
        borderColor: '#ffffff',
        borderWidth: 2,
        width: '90%',
        backgroundColor: 'rgba(128, 128, 128, 0.8)',
        borderRadius: 20,
        paddingTop: 10,
        paddingBottom: 40,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        marginBottom: 38
    },
    refreshIconContainer: {
        alignSelf: 'flex-end',
        marginBottom: 10,
        marginRight:10
    },
    container: {
        padding: 0,
    },
    card: {
        backgroundColor: '#4F4F4F',
        borderRadius: 10,
        marginBottom: 10,
        overflow: 'hidden',
        borderColor: '#ffffff',
        borderWidth: 2,
    },
    salidaHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#333',
    },
    headerTextContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
    },
    salidaText: {
        color: '#fff',
        fontSize: 16,
    },
    salidaDetails: {
        padding: 10,
    },
    salidaDetailText: {
        color: '#ccc',
        marginBottom: 5,
    },
    productosContainer: {
        maxHeight: 150,
    },
    producto: {
        marginBottom: 10,
    },
    productoText: {
        color: '#ccc',
    },
});

export default Salidas;
