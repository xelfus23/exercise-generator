import { useEffect, useRef, useState } from "react";
import { View, Animated, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "expo-router";
import {
    widthPercentageToDP as WP,
    heightPercentageToDP as HP,
} from "react-native-responsive-screen";
import { MyColors } from "../../../constants/myColors";
import TypingAnimation from "@/components/customs/typingAnimation";

export default function Screen2({ handleScroll, screenIndex }) {
    const navigator = useNavigation();
    const opacity1 = useRef(new Animated.Value(0)).current;
    const opacity2 = useRef(new Animated.Value(0)).current;
    const opacity3 = useRef(new Animated.Value(0)).current;
    const buttonOpacity = useRef(new Animated.Value(0)).current; // New animated value for button
    const [enable, setEnable] = useState(false);
    const [loaded, setLoaded] = useState(false);

    const animateTexts = () => {
        Animated.timing(opacity1, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
            delay: 1000,
        }).start(() => {
            Animated.timing(opacity2, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
                delay: 1000,
            }).start(() => {
                Animated.timing(opacity3, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                    delay: 3000,
                }).start(() => {
                    Animated.timing(buttonOpacity, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: true,
                        delay: 2000,
                    }).start(() => {
                        setEnable(true);
                    });
                });
                setLoaded(true);
            });
        });
    };

    if (screenIndex === 1) {
        if (!loaded) {
            animateTexts();
        }
    }

    return (
        <View
            style={{
                width: WP(100),
                backgroundColor: MyColors(1).black,
                justifyContent: "center",
                alignItems: "center",
                gap: HP(3),
            }}
        >
            <View style={{ alignItems: "center", gap: HP(1.5) }}>
                <Animated.Text
                    style={{
                        fontSize: HP(4),
                        color: MyColors(0.8).green,
                        opacity: opacity1,
                        fontWeight: "bold",
                    }}
                >
                    Hello!
                </Animated.Text>
                {loaded && (
                    <Animated.Text
                        style={{
                            color: MyColors(1).white,
                            opacity: opacity2,
                            fontSize: HP(2),
                            textAlign: "center",
                            width: WP(80),
                        }}
                    >
                        <TypingAnimation
                            text={`Welcome! Let's kickstart your personalized fitness journey with AI-powered workouts tailored just for you.`}
                            speed={50}
                        />
                    </Animated.Text>
                )}
            </View>

            <Animated.View style={{ opacity: buttonOpacity }}>
                <TouchableOpacity
                    disabled={!enable}
                    onPress={() => navigator.navigate("signup")}
                    style={{
                        height: HP(5),
                        width: HP(20),
                        backgroundColor: MyColors(1).green,
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 100,
                        flexDirection: "row",
                    }}
                >
                    <Text
                        style={{
                            fontSize: HP(2),
                            textAlign: "center",
                            color: MyColors(0.8).white,
                            fontWeight: "bold",
                        }}
                    >
                        Continue
                    </Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
}
