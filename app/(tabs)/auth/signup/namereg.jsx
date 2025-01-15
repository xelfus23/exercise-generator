import { View, Text, TouchableOpacity, SafeAreaView, TextInput } from "react-native";
import { MyColors } from "../../../../constants/myColors";
import { heightPercentageToDP as HP, widthPercentageToDP as WP } from "react-native-responsive-screen";
import { useState } from "react";
import styles from '../authStyles'
import { useNavigation } from "expo-router";
const LoginRegisterStyle = styles.LoginRegisterStyle

export default function NameRegistration({ setFirstName, setLastName, onNext, scrolling }) {
    const navigator = useNavigation();

    const capitalizeFirstLetters = (str) => {
        return str
            .split(" ")
            .map((word) => {
                return (
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                );
            })
            .join(" ");
    };

    const [fName, setFName] = useState(null);
    const [lName, setLName] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const nextButton = () => {
        setLoading(true);
        setError(null);
        if (!fName || !lName) {
            setTimeout(() => {
                setError("Please enter your name.");
                setLoading(false);
            }, 100);
            return;
        }
        const FIRST = capitalizeFirstLetters(fName);
        const LAST = capitalizeFirstLetters(lName);
        if (FIRST && LAST) {
            setFirstName(FIRST);
            setLastName(LAST);
            setError(null);
            setLoading(false);
            onNext(WP(100));
        }
    };

    return (
        <SafeAreaView style={LoginRegisterStyle.container}>
            <View style={LoginRegisterStyle.inputContainer}>
                <TextInput
                    style={LoginRegisterStyle.input}
                    placeholderTextColor={MyColors(0.5).white}
                    placeholder="First Name"
                    value={fName}
                    onChangeText={(value) => setFName(value)}
                    maxLength={30}
                    editable={!scrolling}
                />
                <TextInput
                    style={LoginRegisterStyle.input}
                    placeholderTextColor={MyColors(0.5).white}
                    placeholder="Last Name"
                    value={lName}
                    onChangeText={(value) => setLName(value)}
                    maxLength={30}
                    editable={!scrolling}
                />
                {error && <Text style={LoginRegisterStyle.error}>{error}</Text>}

                <TouchableOpacity
                    disabled={loading}
                    onPress={nextButton}
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
                            Continue
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

                <View style={LoginRegisterStyle.linkContainer}>
                    <Text style={LoginRegisterStyle.bottomText}>
                        Already have an account?
                    </Text>

                    <TouchableOpacity
                        onPress={() => navigator.navigate("login")}
                    >
                        <Text
                            style={[
                                LoginRegisterStyle.bottomText,
                                LoginRegisterStyle.link,
                            ]}
                        >
                            Login now
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};
