import { View, Text, Platform, TouchableOpacity } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
    widthPercentageToDP as WP,
    heightPercentageToDP as HP,
} from "react-native-responsive-screen";
import { Image } from "expo-image";
import { MyColors } from "@/constants/myColors.jsx";
import { defaultIcon } from "@/constants/common.jsx";
import { useAuth } from "@/components/auth/authProvider.jsx";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
const ios = Platform.OS == "ios";
import Entypo from "@expo/vector-icons/Entypo";

export default function CustomHeader({ onPress, title }) {
    const { user } = useAuth();

    const navigation = useNavigation();

    const { top } = useSafeAreaInsets();

    return (
        <LinearGradient
            colors={[MyColors(0.3).gray, MyColors(1).black]}
            style={{
                paddingTop: ios ? top : top + 10,
                paddingHorizontal: 20,
                zIndex: 3,
                paddingBottom: 10,
                borderBottomRightRadius: 20,
                borderBottomLeftRadius: 20,
                flexDirection: "row",
                justifyContent: "space-between",
                backgroundColor: MyColors(1).black,
                borderBottomWidth: 1,
                borderLeftWidth: 1,
                borderRightWidth: 1,
                borderColor: MyColors(1).gray,
            }}
        >
            <View style={{ justifyContent: "center" }}>
                <Text style={{ fontSize: HP(3), color: MyColors(1).white }}>
                    {title}
                </Text>
            </View>
            <View
                style={{
                    flexDirection: "row",
                    gap: 20,
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <Entypo name="menu" size={35} color={MyColors(1).white} />
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
}
