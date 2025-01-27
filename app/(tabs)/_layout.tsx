import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useAuth } from "@/components/auth/authProvider";
import getStarted from "./index";
import DrawerTabNav from "./screens/drawerNavigator";
import login from "./auth/login";
import signup from "./auth/signup";
import { Image, View } from "react-native";
import {
    heightPercentageToDP as HP,
    widthPercentageToDP as WP,
} from "react-native-responsive-screen";
import HWModal from "./auth/hwmodal";
import { MyColors } from "@/constants/myColors";

const StartNavigation = () => {
    const Stack = createStackNavigator();
    const { isAuthenticated } = useAuth();

    return (
        <Stack.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName="start"
        >
            <>
                <Stack.Screen name="homeStack" component={DrawerTabNav} />
                <Stack.Screen name="start" component={getStarted} />
                <Stack.Screen name="login" component={login} />
                <Stack.Screen name="signup" component={signup} />
                <Stack.Screen name="getDetails" component={HWModal} />
            </>
        </Stack.Navigator>
    );
};

export default StartNavigation;
