import { View, Text, TouchableOpacity, SafeAreaView, TextInput } from "react-native";
import { MyColors } from "../../../../constants/myColors";
import { heightPercentageToDP as HP, widthPercentageToDP as WP } from "react-native-responsive-screen";
import { useState } from "react";
import { useNavigation } from "expo-router";
import styles from '../authStyles'
const LoginRegisterStyle = styles.LoginRegisterStyle
import Loading from "@/components/customs/loading";

export default function EmailRegistration({ handleSubmit, scrolling, onBack }) {
    const [mail, setMail] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const submit = async () => {
        setError(null);
        setLoading(true);

        if (!mail) {
            setLoading(false);
            setError("Please enter your email.");
            return;
        }
        if (!validateEmail(mail)) {
            setLoading(false);
            setError("Please enter a valid email address.");
            return;
        }
        handleSubmit(mail, setLoading, setError);
    };

    return (
        <SafeAreaView style={LoginRegisterStyle.container}>
            <View style={LoginRegisterStyle.inputContainer}>
                <TextInput
                    style={LoginRegisterStyle.input}
                    placeholderTextColor={MyColors(0.5).white}
                    placeholder="Email"
                    value={mail}
                    onChangeText={(value) => setMail(value)}
                    maxLength={30}
                    editable={!scrolling}
                    inputMode="email"
                />

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
                        onPress={() => onBack(WP(100))}
                    >
                        <Text style={LoginRegisterStyle.buttonText}>Back</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        disabled={loading || scrolling}
                        onPress={submit}
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
                                Register
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