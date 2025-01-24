import React, { useState, useRef } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Alert,
    ScrollView,
    StyleSheet,
    Animated,
    SafeAreaView,
    StatusBar,
    Image,
} from "react-native";
import { MyColors } from "@/constants/myColors.jsx";
import { useAuth } from "@/components/auth/authProvider.jsx";
import ScrollableInput from "@/components/customs/scrollableInput.jsx";
import {
    heightPercentageToDP as HP,
    widthPercentageToDP as WP,
} from "react-native-responsive-screen";
import Loading from "@/components/customs/loading.jsx";
import { useNavigation } from "expo-router";
import Styles from "./authStyles";
const LoginRegisterStyle = Styles.LoginRegisterStyle;

const Login = () => {
    const navigator = useNavigation();
    const { login, setIsAuthenticated } = useAuth();
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        setError(null);
        if (email || password) {
            const response = await login(email, password);
            if (!response.success) {
                setError(response.msg), setLoading(false);
            } else {
                console.log("User logged in successfully");
                setIsAuthenticated(true);
            }
        } else {
            setTimeout(() => {
                setError("Login failed, Please fill the fields!.");
                setLoading(false);
            }, 1000);
        }
    };

    return (
        <ScrollableInput>
            <StatusBar
                backgroundColor={MyColors(1).black}
                barStyle={"light-content"}
            />
            <SafeAreaView
                style={{
                    flex: 1,
                    backgroundColor: MyColors(1).black,
                    paddingHorizontal: WP(10),
                    gap: HP(3),
                    paddingTop: HP(30),
                }}
            >
                <Text style={LoginRegisterStyle.title}>Login</Text>
                <View
                    style={[
                        LoginRegisterStyle.inputContainer,
                        { marginTop: HP(2) },
                    ]}
                >
                    <TextInput
                        style={LoginRegisterStyle.input}
                        placeholderTextColor={MyColors(0.5).white}
                        placeholder="Email"
                        value={email}
                        onChangeText={(value) => setEmail(value)}
                        maxLength={30}
                        editable={!loading}
                        inputMode="email"
                    />
                    <TextInput
                        style={LoginRegisterStyle.input}
                        placeholderTextColor={MyColors(0.5).white}
                        placeholder="Password"
                        value={password}
                        onChangeText={(value) => setPassword(value)}
                        maxLength={30}
                        secureTextEntry
                        editable={!loading}
                    />
                    {error && (
                        <Text style={LoginRegisterStyle.error}>{error}</Text>
                    )}
                    <View style={LoginRegisterStyle.buttonContainer}>
                        <TouchableOpacity
                            disabled={loading}
                            onPress={handleLogin}
                            style={[
                                LoginRegisterStyle.input,
                                LoginRegisterStyle.button,
                                {
                                    width: "100%",
                                    justifyContent: "center",
                                    alignItems: "center",
                                },
                            ]}
                        >
                            {!loading ? (
                                <Text style={[LoginRegisterStyle.buttonText]}>
                                    Login
                                </Text>
                            ) : (
                                <View
                                    style={{
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <Loading />
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>
                    <View style={LoginRegisterStyle.linkContainer}>
                        <Text style={LoginRegisterStyle.bottomText}>
                            Don't have an account?
                        </Text>
                        <TouchableOpacity
                            onPress={() => navigator.navigate("signup")}
                        >
                            <Text
                                style={[
                                    LoginRegisterStyle.bottomText,
                                    LoginRegisterStyle.link,
                                ]}
                            >
                                Register
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </ScrollableInput>
    );
};

export default Login;
