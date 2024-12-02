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
import { heightPercentageToDP as HP } from "react-native-responsive-screen";
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

export default function DrawerTabNav() {
    const Drawer = createDrawerNavigator();
    const navigation = useNavigation();
    const { user } = useAuth();

    return (
        <Drawer.Navigator
            screenOptions={{
                headerShown: false,
                drawerActiveBackgroundColor: MyColors(1).gray,
                drawerActiveTintColor: MyColors(1).green,
                drawerInactiveTintColor: MyColors(1).white,
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
                            height: HP(20),
                            backgroundColor: MyColors(1).black,
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: HP(15),
                        }}
                    >
                        <View
                            style={{
                                borderRadius: 100,
                                borderColor: MyColors(1).green,
                                borderWidth: 5,
                            }}
                        >
                            <TouchableOpacity
                                onPress={() =>
                                    navigation.navigate("SettingsNav", {
                                        screen: "Profile",
                                    })
                                }
                            >
                                <Image
                                    style={{
                                        height: HP(15),
                                        aspectRatio: 1,
                                        borderRadius: 100,
                                    }}
                                    source={{ uri: user?.ProfilePic }}
                                    placeholder={defaultIcon}
                                    contentFit="cover"
                                    transition={500}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <Text
                        style={{
                            textAlign: "center",
                            color: MyColors(1).white,
                            marginBottom: HP(3),
                            fontWeight: "bold",
                            fontSize: HP(2),
                        }}
                    >
                        {user?.firstName} {user?.lastName}
                    </Text>

                    <DrawerItemList {...props} />
                </SafeAreaView>
            )}
            initialRouteName="ScreenNav"
        >
            <Drawer.Screen
                name="ScreenNav"
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
                        <MaterialCommunityIcons
                            name="chat-question-outline"
                            size={24}
                            color={MyColors(1).green}
                        />
                    ),
                }}
                component={ChatNavigator}
            />
            <Drawer.Screen
                name="SettingsNav"
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
            <Drawer.Screen
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
            />
        </Drawer.Navigator>
    );
}
