import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
    Alert,
    Modal,
    TextInput,
} from "react-native";
import { MyColors } from "@/constants/myColors";
import {
    heightPercentageToDP as HP,
    widthPercentageToDP as WP,
} from "react-native-responsive-screen";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from "react-native-popup-menu";
import { botIcon } from "@/constants/common";
import { useAuth } from "@/components/auth/authProvider";
import { useState } from "react";
import { getAuth } from "firebase/auth";
import { db } from "@/components/firebase/config";
import { doc, setDoc } from "firebase/firestore";

export default function CustomHeaderB({ navigation, text, chat }) {
    const [visible, setVisible] = useState(false);

    return (
        <View style={styles.headerContainer}>
            <View style={styles.leftContainer}>
                <TouchableOpacity onPress={navigation}>
                    <Ionicons
                        name="arrow-back-outline"
                        size={24}
                        color="white"
                        style={{ marginLeft: 10, marginRight: 10 }}
                    />
                </TouchableOpacity>
                <Text style={styles.headerLabel}>{text}</Text>
            </View>
        </View>
    );
}

const CNstyles = StyleSheet.create({
    label: {
        color: MyColors(1).white,
        fontSize: WP(5),
    },
    textInput: {
        backgroundColor: MyColors(0.4).black,
        borderRadius: WP(4),
        padding: WP(4),
        color: MyColors(1).white,
        fontSize: WP(4),
    },
    container: {
        width: WP(90),
        backgroundColor: MyColors(1).gray,
        borderRadius: WP(4),
        padding: WP(5),
        gap: WP(4),
    },
    screen: {
        backgroundColor: MyColors(0.5).black,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    button: {
        borderRadius: WP(3),
        padding: WP(1),
        color: MyColors(1).white,
        fontSize: WP(5),
        width: WP(30),
        textAlign: "center",
    },
});

const styles = StyleSheet.create({
    profileImage: {
        borderRadius: HP(1),
        width: WP(11),
        borderRadius: WP(10),
        aspectRatio: 1,
    },
    leftContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    rightContainer: {
        flexDirection: "row",
        alignItems: "center",
        position: "absolute",
        right: WP(6),
    },
    headerLabel: {
        color: MyColors(1).white,
        fontSize: HP(2),
        fontWeight: "bold",
        marginLeft: WP(5),
        alignSelf: "center",
    },
    headerContainer: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderColor: MyColors(1).gray,
        alignItems: "center",
        marginTop: HP(5),
        paddingVertical: WP(4),
        justifyContent: "space-between",
    },
});

const optionStyles = StyleSheet.create({
    optionText: {
        color: MyColors(1).white,
        fontWeight: "bold",
    },
    menuOption: {
        padding: WP(3),
    },
    menuOptions: {
        marginTop: HP(7),
        backgroundColor: MyColors(1).gray,
        color: MyColors(1).white,
        width: WP(50),
        borderRadius: WP(2),
    },
});
