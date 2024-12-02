import {
    reauthenticateWithCredential,
    EmailAuthProvider,
    updatePassword,
    getAuth,
} from "firebase/auth";
import {
    SafeAreaView,
    Text,
    TouchableOpacity,
    View,
    Alert,
    StyleSheet,
    TextInput,
    Modal,
} from "react-native";
import {
    heightPercentageToDP as HP,
    widthPercentageToDP as WP,
} from "react-native-responsive-screen";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { MyColors } from "@/constants/myColors";
import { useAuth } from "@/components/auth/authProvider";
import { createStackNavigator } from "@react-navigation/stack";
import styleX from "@/app/(tabs)/auth/authStyles";
import React, { useRef, useState, useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import CustomHeaderB from "./customDrawerLabel";

import AccountSettings from "./account/account";
import Profile from "./Profile/profile";

const { style } = styleX;
const Stack = createStackNavigator();

const Settings = () => {
    const navigation = useNavigation();
    const { logout } = useAuth();

    return (
        <View style={style.main_container}>
            <CustomHeaderB
                navigation={() => navigation.openDrawer()}
                text={"Settings"}
            />

            <View style={{ flex: 1, alignItems: "center" }}>
                <TouchableOpacity
                    onPress={() => navigation.navigate("Profile")}
                    style={styles.SettingsOptions}
                >
                    <Text style={styles.OptionLabel}>Profile</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => navigation.navigate("Account")}
                    style={styles.SettingsOptions}
                >
                    <Text style={styles.OptionLabel}>Account</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={logout}
                    style={styles.SettingsOptions.logout}
                >
                    <Text style={styles.OptionLabel}>Logout</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default function SettingsNavigator() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                headerStyle: { backgroundColor: MyColors(1).black },
                headerTintColor: MyColors(1).white,
            }}
            initialRouteName="Settings"
        >
            <Stack.Screen name="Settings" children={() => <Settings />} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="Account" component={AccountSettings} />
        </Stack.Navigator>
    );
}

const styles = StyleSheet.create({
    headerLabel: {
        color: MyColors(1).white,
        fontSize: HP(2.5),
    },
    headerContainer: {
        marginTop: HP(5),
        padding: WP(2),
        flexDirection: "row",
        alignItems: "center",
    },
    OptionLabel: {
        fontSize: 18,
        color: MyColors(1).white,
        textAlign: "center",
    },
    SettingsOptions: {
        backgroundColor: MyColors(1).gray,
        padding: 20,
        marginTop: 10,
        width: WP(90),
        borderRadius: 20,
        logout: {
            backgroundColor: MyColors(1).red,
            padding: 20,
            marginTop: 10,
            width: WP(90),
            borderRadius: 20,
        },
    },
});
