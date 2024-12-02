import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { MenuProvider } from "react-native-popup-menu";

import { useSegments, useRouter, Slot } from "expo-router";
import { useColorScheme } from "@/hooks/useColorScheme";
import { AuthContextProvider, useAuth } from "@/components/auth/authProvider";
import { MyColors } from "@/constants/myColors";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const MainLayout = () => {
    const { isAuthenticated } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (typeof isAuthenticated === "undefined") return;

        const inApp = segments[0] === "(tabs)";

        if (isAuthenticated && !inApp) {
            router.replace("/(tabs)/screens/drawerNavigator");
        } else if (!isAuthenticated) {
            router.replace("/(tabs)");
        }
    }, [isAuthenticated]);

    return <Slot />;
};

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    });

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
            <MenuProvider>
                <AuthContextProvider>
                    <MainLayout />
                    <StatusBar style="auto" />
                </AuthContextProvider>
            </MenuProvider>
        </ThemeProvider>
    );
}
