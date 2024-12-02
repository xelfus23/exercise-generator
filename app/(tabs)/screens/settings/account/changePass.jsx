import { useState, useRef } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    ScrollView,
    Touchable,
} from "react-native";
import { useAuth } from "@/components/auth/authProvider";
import {
    widthPercentageToDP as WP,
    heightPercentageToDP as HP,
} from "react-native-responsive-screen";
import { MyColors } from "../../../../../constants/myColors";
import { getAuth } from "firebase/auth";
import {
    EmailAuthProvider,
    reauthenticateWithCredential,
    updatePassword,
} from "firebase/auth";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function ChangePassScreen({ setChangingPasswords }) {
    const scrollViewRef = useRef();

    const toggleChangingPassword = () => {
        setChangingPasswords(false);
    };

    return (
        <KeyboardAvoidingView>
            <ScrollView>
                <View style={styles.container}>
                    <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                    >
                        <TouchableOpacity onPress={toggleChangingPassword}>
                            <Ionicons
                                name="arrow-back"
                                size={24}
                                color={MyColors(1).white}
                                style={{ marginLeft: WP(5) }}
                            />
                        </TouchableOpacity>
                        <Text style={styles.title}>Change Password</Text>
                    </View>
                    <ScrollView
                        ref={scrollViewRef}
                        horizontal
                        style={{ width: "auto" }}
                        scrollEnabled={false}
                        snapToInterval={WP(90)}
                        contentContainerStyle={{
                            alignItems: "center",
                            width: WP(180),
                        }}
                    >
                        <VerifyPasswordScreen scrollViewRef={scrollViewRef} />
                        <ChangePasswordScreen
                            setChangingPasswords={setChangingPasswords}
                        />
                    </ScrollView>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const VerifyPasswordScreen = ({ scrollViewRef }) => {
    const [currentPassword, setCurrentPassword] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const verifyPassword = async () => {
        if (!currentPassword) {
            setError("Please enter your password.");
            return;
        }
        const user = getAuth().currentUser;

        try {
            const credential = EmailAuthProvider.credential(
                user.email,
                currentPassword
            );
            await reauthenticateWithCredential(user, credential);
            setError(null);
            if (scrollViewRef.current) {
                scrollViewRef.current.scrollTo({ x: WP(90), animated: true });
            }
        } catch (error) {
            let msg = error.message;
            if (msg.includes("(auth/invalid-credential)"))
                msg = "Incorrect Password.";
            if (msg.includes("(auth/too-many-requests)"))
                msg = "Too many request, Please try again later.";
            setError(msg);
            setCurrentPassword(null);
        }
    };

    return (
        <View style={styles.insideContainer}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TextInput
                    value={currentPassword}
                    onChangeText={(value) => {
                        setCurrentPassword(value);
                    }}
                    placeholder="Enter your current password."
                    placeholderTextColor={MyColors(0.5).white}
                    style={styles.input}
                    secureTextEntry={!showPassword}
                />
                <View style={styles.eyeButton}>
                    <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                    >
                        {!showPassword ? (
                            <Feather
                                name="eye"
                                size={24}
                                color={MyColors(1).green}
                            />
                        ) : (
                            <Feather
                                name="eye-off"
                                size={24}
                                color={MyColors(1).green}
                            />
                        )}
                    </TouchableOpacity>
                </View>
            </View>
            {error && <Text style={styles.error}>{error}</Text>}
            <TouchableOpacity style={styles.button} onPress={verifyPassword}>
                <Text style={styles.buttonText}>Verify</Text>
            </TouchableOpacity>
        </View>
    );
};

const ChangePasswordScreen = ({ setChangingPasswords }) => {
    const { updateUserData } = useAuth();

    const [newPassword, setNewPassword] = useState(null);
    const [conPassword, setConPassword] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [success, setSuccess] = useState(false);

    const user = getAuth().currentUser;

    const submitNewPassword = async () => {
        setLoading(true);
        if (!newPassword || !conPassword) {
            setError("Please fill in all fields.");
            setLoading(false);
            return;
        }
        if (newPassword !== conPassword) {
            setLoading(false);
            setError("Password don't match.");
            return;
        }
        try {
            await updatePassword(user, newPassword);
            setError(null);
            setSuccess(true);
            setTimeout(() => {
                setChangingPasswords(false);
            }, 1000);
        } catch (error) {
            setError("Something went wrong, Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.insideContainer}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TextInput
                    value={newPassword}
                    onChangeText={(value) => setNewPassword(value)}
                    placeholder="Enter New Password"
                    style={styles.input}
                    placeholderTextColor={MyColors(0.5).white}
                    secureTextEntry={!showPassword}
                />
                <View style={styles.eyeButton}>
                    <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                    >
                        {!showPassword ? (
                            <Feather
                                name="eye"
                                size={24}
                                color={MyColors(1).green}
                            />
                        ) : (
                            <Feather
                                name="eye-off"
                                size={24}
                                color={MyColors(1).green}
                            />
                        )}
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TextInput
                    value={conPassword}
                    onChangeText={(value) => setConPassword(value)} // Add this to update state properly
                    placeholder="Confirm New Password"
                    style={[
                        styles.input,
                        { width: "100%", borderRadius: WP(4) },
                    ]}
                    placeholderTextColor={MyColors(0.5).white}
                    secureTextEntry={!showPassword}
                />
            </View>
            {error && <Text style={styles.error}>{error}</Text>}
            {success && <Text style={styles.success}>Password Changed.</Text>}
            <View>
                <TouchableOpacity
                    style={styles.button}
                    onPress={submitNewPassword}
                >
                    <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    success: {
        color: MyColors(1).green,
        fontSize: 14,
        textAlign: "center",
    },
    eyeButton: {
        backgroundColor: MyColors(0.4).white,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        height: HP(6),
        borderTopRightRadius: WP(4),
        borderBottomRightRadius: WP(4),
    },
    backButton: {
        color: MyColors(1).white,
        fontSize: HP(3),
    },
    error: {
        color: MyColors(1).red,
        fontSize: 14,
        textAlign: "center",
    },
    insideContainer: {
        width: WP(90),
        gap: HP(3),
        padding: 20,
    },
    container: {
        paddingTop: HP(2),
        width: WP(90),
        backgroundColor: MyColors(0.9).black,
        alignSelf: "center",
        marginTop: HP(20),
        borderRadius: 20,
        borderWidth: 1,
        borderColor: MyColors(1).gray,
        overflow: "hidden",
        elevation: 5,
    },
    title: {
        color: MyColors(1).white,
        fontSize: HP(3),
        marginLeft: WP(4),
        fontWeight: "bold",
    },
    input: {
        color: MyColors(1).white,
        fontSize: 16,
        height: HP(6),
        width: WP(65),
        backgroundColor: MyColors(1).gray,
        borderTopLeftRadius: WP(4),
        borderBottomLeftRadius: WP(4),
        paddingHorizontal: 10,
    },
    button: {
        backgroundColor: MyColors(1).black,
        borderWidth: 1,
        borderColor: MyColors(1).green,
        borderRadius: WP(4),
        padding: 10,
        height: HP(6),
        justifyContent: "center",
        alignItems: "center",
    },
    buttonText: {
        textAlign: "center",
        color: MyColors(1).white,
        fontSize: HP(2),
        fontWeight: "bold",
    },
});
