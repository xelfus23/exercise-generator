import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
    Theme, // Added Theme type
} from "@react-navigation/native";
import { useFonts, FontSource } from "expo-font"; // Added FontSource type
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { MenuProvider } from "react-native-popup-menu";
import { useSegments, useRouter, Slot } from "expo-router";
import { useColorScheme } from "@/hooks/useColorScheme";
import { AuthContextProvider, useAuth } from "@/components/auth/authProvider";
import { View } from "react-native";
import { MyColors } from "@/constants/myColors";
import Loading from "@/components/customs/loading";
import {
    widthPercentageToDP as WP,
    heightPercentageToDP as HP,
} from "react-native-responsive-screen";

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
        SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf") as FontSource,
    });

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <View style={{ width: WP(70), height: HP(10) }}>
                    <Loading size={WP(5)}/>
                </View>
            </View>
        );
    }

    return (
        <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme as Theme}
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