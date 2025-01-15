import { View, Text, TouchableOpacity, SafeAreaView, TextInput, StatusBar } from "react-native";
import { MyColors } from "../../../../constants/myColors";
import { heightPercentageToDP as HP, widthPercentageToDP as WP } from "react-native-responsive-screen";
import styles from '../authStyles'
import { useState } from "react";
import { Feather } from "@expo/vector-icons";

const LoginRegisterStyle = styles.LoginRegisterStyle

export default function PasswordRegistration({ setPassword, onNext, scrolling, onBack }) {
    const [pW, setPW] = useState();
    const [conPw, setConPW] = useState();
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const nextButton = () => {
        setError(null);
        setLoading(true);

        if (!pW || !conPw) {
            setTimeout(() => {
                setError("Please enter your password.");
                setLoading(false);
            }, 100);
            return;
        }
        if (pW.length < 8) {
            setTimeout(() => {
                setLoading(false);
                setError("Password must be at least 8 characters long.");
            }, 1000);
            return;
        }
        if (pW !== conPw) {
            setTimeout(() => {
                setError("Password don't match.");
                setLoading(false);
            }, 1000);
            return;
        }
        setPassword(pW);
        setLoading(false);
        setError(null);
        onNext(WP(200));
    };

    return (
        <SafeAreaView style={LoginRegisterStyle.container}>
            <StatusBar
                backgroundColor={MyColors(1).black}
                barStyle={"light-content"}
            />
            <View style={LoginRegisterStyle.inputContainer}>
                <View style={LoginRegisterStyle.inputView}>
                    <TextInput
                        placeholderTextColor={MyColors(0.5).white}
                        placeholder="Password"
                        value={pW}
                        onChangeText={(value) => setPW(value)}
                        maxLength={30}
                        secureTextEntry={!showPassword}
                        style={LoginRegisterStyle.input}
                        editable={!scrolling}
                    />
                    <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        style={LoginRegisterStyle.eye}
                    >
                        {!showPassword ? (
                            <Feather
                                name="eye"
                                size={30}
                                color={MyColors(1).white}
                            />
                        ) : (
                            <Feather
                                name="eye-off"
                                size={30}
                                color={MyColors(1).white}
                            />
                        )}
                    </TouchableOpacity>
                </View>
                <View style={LoginRegisterStyle.inputView}>
                    <TextInput
                        placeholderTextColor={MyColors(0.5).white}
                        placeholder="Confirm Password"
                        value={conPw}
                        onChangeText={(value) => setConPW(value)}
                        maxLength={30}
                        secureTextEntry={!showPassword}
                        style={LoginRegisterStyle.input}
                        editable={!scrolling}
                    />
                </View>
                {error && <Text style={LoginRegisterStyle.error}>{error}</Text>}
                <View style={LoginRegisterStyle.buttonContainer}>
                    <TouchableOpacity
                        style={[
                            LoginRegisterStyle.input,
                            LoginRegisterStyle.button,
                            {
                                width: "45%",
                                justifyContent: "center",
                                alignItems: "center",
                                borderColor: MyColors(1).yellow,
                            },
                        ]}
                        onPress={() => onBack(0)}
                    >
                        <Text style={LoginRegisterStyle.buttonText}>Back</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        disabled={loading || scrolling}
                        onPress={nextButton}
                        style={[
                            LoginRegisterStyle.input,
                            LoginRegisterStyle.button,
                            {
                                width: "45%",
                                justifyContent: "center",
                                alignItems: "center",
                            },
                        ]}
                    >
                        {!loading ? (
                            <Text style={[LoginRegisterStyle.buttonText]}>
                                Next
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
            </View>
        </SafeAreaView>
    );
};
