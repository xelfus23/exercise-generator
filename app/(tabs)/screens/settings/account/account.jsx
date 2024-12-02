import {
    Text,
    TouchableOpacity,
    View,
    Alert,
    StyleSheet,
    Modal,
} from "react-native";
import {
    heightPercentageToDP as HP,
    widthPercentageToDP as WP,
} from "react-native-responsive-screen";
import { MyColors } from "../../../../../constants/myColors";
import { useAuth } from "@/components/auth/authProvider";
import React, { useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import ChangePassScreen from "./changePass";
import { getAuth } from "firebase/auth";
import CustomHeaderB from "../customDrawerLabel";

const AccountSettings = ({ navigation }) => {
    const [changingUsername, setChangingUsername] = useState(false);
    const [changingPasswords, setChangingPasswords] = useState(false);
    const [showAlert, setShowAlert] = useState(null);
    const { user, updateUserData } = useAuth();
    const currentUser = getAuth().currentUser;

    const ToggleShowAlert = () => {
        setShowAlert(!showAlert);
    };

    const toggleChangePassword = () => {
        setChangingPasswords(!changingPasswords);
    };

    const toggleChangeUsername = () => {
        setChangingUsername(!changingUsername);
    };

    return (
        <View style={{ backgroundColor: MyColors(1).black, flex: 1 }}>
            <CustomHeaderB
                navigation={() => navigation.goBack()}
                text={"Account"}
            />

            {changingPasswords && (
                <Modal transparent={true} animationType="fade">
                    <ChangePassScreen
                        setChangingPasswords={setChangingPasswords}
                    />
                </Modal>
            )}
            <View style={styles.container}>
                <View style={styles.dataContainer}>
                    <Text style={styles.label}>Email:</Text>
                    <Text style={styles.userData}>{user.email}</Text>
                    <TouchableOpacity
                        style={{ marginLeft: WP(4) }}
                        onPress={() =>
                            user.emailVerified
                                ? console.log("Email Verified")
                                : console.log("Email not verified")
                        }
                    >
                        {user.emailVerified ? (
                            <AntDesign
                                name="checkcircle"
                                size={24}
                                style={{
                                    backgroundColor: MyColors(1).white,
                                    borderRadius: WP(5),
                                }}
                                color={MyColors(1).green}
                            />
                        ) : (
                            <AntDesign
                                name="exclamationcircle"
                                size={24}
                                style={{
                                    backgroundColor: MyColors(1).white,
                                    borderRadius: WP(5),
                                }}
                                color={MyColors(1).yellow}
                            />
                        )}
                    </TouchableOpacity>
                </View>
                <View style={styles.dataContainer}>
                    <TouchableOpacity onPress={toggleChangePassword}>
                        <Text style={styles.button}>Change Password</Text>
                    </TouchableOpacity>
                </View>
                <View style={[styles.dataContainer]}>
                    <TouchableOpacity onPress={toggleChangePassword}>
                        <Text
                            style={[
                                styles.button,
                                { backgroundColor: MyColors(1).red },
                            ]}
                        >
                            Delete Account
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default AccountSettings;

const styles = StyleSheet.create({
    button: {
        backgroundColor: MyColors(1).yellow,
        padding: WP(2),
        borderRadius: WP(2),
        justifyContent: "center",
        alignItems: "center",
        color: MyColors(1).white,
        fontSize: WP(3),
        fontWeight: "bold",
    },
    userData: {
        color: MyColors(1).white,
        marginLeft: WP(3),
        backgroundColor: MyColors(0.5).gray,
        padding: WP(4),
        fontSize: 16,
        borderRadius: WP(4),
        justifyContent: "center",
        alignItems: "center",
    },
    dataContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    container: {
        borderColor: MyColors(1).gray,
        borderRadius: WP(5),
        padding: WP(5),
        margin: WP(5),
        borderWidth: 1,
        gap: HP(3),
    },
    label: {
        fontSize: 18,
        fontWeight: "bold",
        color: MyColors(1).white,
    },
});
