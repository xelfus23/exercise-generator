import React, { useState } from "react";
import {
    createDrawerNavigator,
    DrawerItemList,
} from "@react-navigation/drawer";
import {
    SafeAreaView,
    Text,
    TouchableOpacity,
    View,
    Alert,
    StatusBar,
} from "react-native";
import {
    heightPercentageToDP as HP,
    widthPercentageToDP as WP,
} from "react-native-responsive-screen";
import { Image } from "expo-image";
import { useAuth } from "@/components/auth/authProvider.jsx";
import { Ionicons } from "@expo/vector-icons";
import { defaultIcon } from "@/constants/common.jsx";
import { MyColors } from "@/constants/myColors.jsx";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import SettingsNavigator from "./settings/settings.jsx";
import BottomTabNav from "./bottomNavigator.jsx";
import { useNavigation } from "@react-navigation/native";
import ChatNavigator from "./chats/chats.jsx";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";

export default function DrawerTabNav() {
    const Drawer = createDrawerNavigator();
    const navigation = useNavigation();
    const { user } = useAuth();
    const [activeItem, setActiveItem] = useState("ScreenNav"); // Initialize with the initial route name

    return (
        <Drawer.Navigator
            screenOptions={{
                headerShown: false,
                drawerActiveBackgroundColor: MyColors(0.4).gray,
                drawerActiveTintColor: MyColors(1).green,
                drawerInactiveTintColor: MyColors(0.8).white,
                drawerStyle: {
                    width: WP(70),
                    borderRightWidth: 1,
                    borderColor: MyColors(1).green,
                    padding: WP(3),
                    backgroundColor: MyColors(1).black,
                    gap: HP(1),
                },
                drawerLabelStyle: {
                    fontSize: HP(1.7),
                    fontWeight: "bold",
                },
            }}
            drawerContent={(props) => (
                <SafeAreaView
                    style={{ backgroundColor: MyColors(1).black, flex: 1 }}
                >
                    <StatusBar
                        barStyle={"light-content"}
                        backgroundColor={"transparent"}
                    />
                    <View
                        style={{
                            marginTop: HP(15),
                            marginHorizontal: WP(1),
                            marginBottom: HP(4),
                            gap: HP(2),
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                            }}
                        >
                            <View
                                style={{
                                    height: HP(10),
                                    backgroundColor: MyColors(1).black,
                                    aspectRatio: 1,
                                }}
                            >
                                <LinearGradient
                                    colors={[
                                        MyColors(1).green,
                                        MyColors(1).purple,
                                    ]}
                                    style={{
                                        width: "auto",
                                        height: "100%",
                                        borderRadius: WP(100),
                                        padding: WP(1),
                                    }}
                                >
                                    <TouchableOpacity>
                                        <Image
                                            style={{
                                                aspectRatio: 1,
                                                borderRadius: WP(100),
                                            }}
                                            source={{ uri: user?.ProfilePic }}
                                            placeholder={defaultIcon}
                                            contentFit="cover"
                                            transition={500}
                                        />
                                    </TouchableOpacity>
                                </LinearGradient>
                            </View>
                            <View
                                style={{
                                    marginHorizontal: WP(2),
                                    alignSelf: "flex-end",
                                    marginBottom: HP(1),
                                    maxWidth: "75%",
                                }}
                            >
                                <Text
                                    style={{
                                        color: MyColors(1).white,
                                        fontWeight: "900",
                                        fontSize: HP(2.8),
                                    }}
                                >
                                    {user?.nickName}
                                </Text>
                                <Text
                                    style={{
                                        color: MyColors(0.8).white,
                                        fontSize: HP(1.5),
                                    }}
                                >
                                    {user?.email}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <DrawerItemList {...props} />
                </SafeAreaView>
            )}
            initialRouteName="ScreenNav"
        >
            <Drawer.Screen
                name="ScreenNav"
                initialParams={{ activeItem }}
                options={{
                    drawerLabel: "Home",
                    drawerIcon: () => (
                        <Ionicons
                            name="home-outline"
                            size={24}
                            color={MyColors(1).green}
                        />
                    ),
                }}
                component={BottomTabNav}
            />

            <Drawer.Screen
                name="Chats"
                options={{
                    drawerLabel: "Ask AI",
                    drawerIcon: () => (
                        <Ionicons
                            name="chatbubble-ellipses-outline"
                            size={24}
                            color={MyColors(1).green}
                        />
                    ),
                }}
                component={ChatNavigator}
            />

            <Drawer.Screen
                name="SettingsNavigation"
                initialParams={{ activeItem }}
                options={{
                    drawerLabel: "Settings",
                    drawerIcon: () => (
                        <Ionicons
                            name="settings-outline"
                            size={24}
                            color={MyColors(1).green}
                        />
                    ),
                }}
                component={SettingsNavigator}
            />
            {/* <Drawer.Screen
                name="Feedback"
                options={{
                    drawerLabel: "Feedback",
                    drawerIcon: () => (
                        <MaterialIcons
                            name="feedback"
                            size={24}
                            color={MyColors(1).green}
                        />
                    ),
                }}
                component={SettingsNavigator}
            /> */}
        </Drawer.Navigator>
    );
}
