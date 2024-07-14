import React, { useState, useContext } from 'react';
import { StyleSheet, View, Text, TextInput, Dimensions, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { Button as PaperButton, Dialog, Portal, Paragraph, Provider as PaperProvider } from 'react-native-paper';
import RoundedButton from '../template/RoundedButton';
import { Picker } from '@react-native-picker/picker';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import BackgroundContainer from '../template/BackgroundContainer';

const { height } = Dimensions.get('window');

const LoginScreen = () => {
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userType, setUserType] = useState("1");
    const [visible, setVisible] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const showDialog = (message) => {
        setDialogMessage(message);
        setVisible(true);
    };

    const hideDialog = () => {
        setVisible(false);
    };

    const validateFields = () => {
        if (!email) {
            showDialog('El campo de correo no puede estar vacío.');
            return false;
        }
        if (!password) {
            showDialog('El campo de contraseña no puede estar vacío.');
            return false;
        }
        return true;
    };

    const handleLogin = async () => {
        if (!validateFields()) {
            return; // Si la validación falla, no procede con la solicitud
        }

        console.log(`rol => ${userType}`);
        console.log(`correo => ${email}`);
        console.log(`contraseña => ${password}`);
        try {
            const response = await axios.post('http://192.168.2.4:3001/login/validar', {
                rol: parseInt(userType),
                correo: email,
                contra: password
            });

            console.log(response.data); // Log para ver la respuesta del servidor

            if (response.data.mensaje === 'Bienvenido') {
                login(response.data); // Llama a la función login del contexto de autenticación con los datos del usuario
            } else {
                showDialog('Credenciales inválidas');
            }
        } catch (error) {
            if (error.response) {
                console.error('Error de respuesta:', error.response.data);
                showDialog(`Error de servidor: ${error.response.data.message}`);
            } else if (error.request) {
                console.error('Error de solicitud:', error.request);
                showDialog('No se recibió respuesta del servidor. Verifique su conexión de red.');
            } else {
                console.error('Error en configuración de solicitud:', error.message);
                showDialog(`Error en la solicitud: ${error.message}`);
            }
        }
    };

    return (
        <PaperProvider>
            <BackgroundContainer>
                <KeyboardAvoidingView
                    style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' }}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
                >
                    <View style={styles.formulario}>
                        <Text style={styles.titulo}>Login</Text>

                        <View style={styles.inputContainer}>
                            <Picker
                                selectedValue={userType}
                                onValueChange={(value) => setUserType(value)}
                                style={styles.input}
                                enabled={true}
                            >
                                <Picker.Item label="Administrador" value="1" style={{ fontSize: 18 }} />
                            </Picker>
                        </View>

                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                keyboardType="email-address"
                                placeholder="correo"
                                placeholderTextColor="#ccc"
                                value={email}
                                onChangeText={setEmail}
                            />
                            <MaterialIcons
                                name="person"
                                size={24}
                                color="white"
                                style={styles.icon}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                secureTextEntry={!showPassword}
                                placeholder="contraseña"
                                placeholderTextColor="#ccc"
                                value={password}
                                onChangeText={setPassword}
                            />
                            <TouchableOpacity
                                style={styles.showPasswordIcon}
                                onPress={() => setShowPassword(!showPassword)}
                            >
                                <MaterialIcons
                                    name={showPassword ? 'visibility-off' : 'visibility'}
                                    size={24}
                                    color="white"
                                />
                            </TouchableOpacity>
                        </View>

                        <View style={{ marginTop: 30, width: '100%' }}>
                            <RoundedButton title="Login" onPress={handleLogin} />
                        </View>
                    </View>
                </KeyboardAvoidingView>

                <Portal>
                    <Dialog visible={visible} onDismiss={hideDialog}>
                        <Dialog.Title>Atención</Dialog.Title>
                        <Dialog.Content>
                            <Paragraph>{dialogMessage}</Paragraph>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <PaperButton onPress={hideDialog}>OK</PaperButton>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </BackgroundContainer>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    formulario: {
        borderColor: '#ffffff',
        borderWidth: 2,
        width: '80%',
        backgroundColor: 'rgba(128, 128, 128, 0.8)',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    titulo: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#fff',
    },
    inputContainer: {
        marginBottom: 15,
        width: '100%',
        position: 'relative', // Añadir posición relativa para el contenedor del icono
    },
    input: {
        fontSize: 18,
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 25, 
        paddingHorizontal: 15,
        backgroundColor: 'rgba(128, 128, 128)', 
        color: '#fff', 
        marginVertical: 10,
        width: '100%',
    },
    icon: {
        position: 'absolute',
        right: 15,
        top: 18,
    },
    showPasswordIcon: {
        position: 'absolute',
        right: 15,
        top: 18,
    },
});

export default LoginScreen;
