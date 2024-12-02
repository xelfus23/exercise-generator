import React, { useEffect, useState } from "react";
import { SafeAreaView, View } from "react-native";
import { MyColors } from "../../../constants/myColors";
import {
    createIonicons,
    FontAwesome5,
    MaterialCommunityIcons,
} from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
    heightPercentageToDP as HP,
    widthPercentageToDP as WP,
} from "react-native-responsive-screen";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";

import ExerciseNavigator from "./exercises/exerciseNavigator";
import Dashboard from "./dashboard/dashboard";
import HomeScreen from "./home/homeScreen";

import { useNavigation } from "expo-router";

const Tab = createBottomTabNavigator();

export default function BottomTabNav() {
    const [tabBarVisible, setTabBarVisible] = useState(true);

    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: {
                    backgroundColor: MyColors(1).black,
                    display: tabBarVisible ? "flex" : "none",
                    justifyContent: "center", // Center the tab bar items
                    alignItems: "center", // Center the tab bar items
                    paddingTop: HP(0.5)
                },
                tabBarItemStyle: {
                    justifyContent: "center",
                    alignItems: "center",
                },
                tabBarIconStyle: {
                    justifyContent: "center",
                    alignItems: "center",
                },
            })}
        >
            <Tab.Screen
                name="Dashboard"
                component={Dashboard}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View
                            style={{
                                justifyContent: "center",
                                alignItems: "center",
                                width: WP(10),
                            }}
                        >
                            <Feather
                                name="activity"
                                size={WP(5)}
                                color={
                                    focused
                                        ? MyColors(1).white
                                        : MyColors(0.3).white
                                }
                            />
                        </View>
                    ),
                }}
            />
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View
                            style={{
                                justifyContent: "center",
                                alignItems: "center",
                                width: WP(10),
                            }}
                        >
                            <Ionicons
                                name="grid"
                                size={WP(5)}
                                color={
                                    focused
                                        ? MyColors(1).white
                                        : MyColors(0.3).white
                                }
                            />
                        </View>
                    ),
                }}
            />

            <Tab.Screen
                name="Exercises"
                children={() => (
                    <ExerciseNavigator setTabBarVisible={setTabBarVisible} />
                )}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View
                            style={{
                                justifyContent: "center",
                                alignItems: "center",
                                width: WP(10),
                            }}
                        >
                            <FontAwesome5
                                name="dumbbell"
                                size={WP(5)}
                                color={
                                    focused
                                        ? MyColors(1).white
                                        : MyColors(0.3).white
                                }
                            />
                        </View>
                    ),
                }}
            />
        </Tab.Navigator>
    );
}
