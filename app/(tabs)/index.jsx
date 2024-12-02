import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Animated,
    StatusBar,
} from "react-native";
import React, { useRef, useState } from "react";
import {
    heightPercentageToDP as HP,
    widthPercentageToDP as WP,
} from "react-native-responsive-screen";
import { MyColors } from "@/constants/myColors";
import { useNavigation } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function GetStarted() {
    const scrollViewRef = useRef(null);

    const [screenIndex, setScreenIndex] = useState(0);

    const handleScroll = (screenIndex) => {
        scrollViewRef.current.scrollTo({ x: WP(100) });
        setScreenIndex(screenIndex);
    };

    return (
        <ScrollView
            ref={scrollViewRef}
            style={{ height: HP(100), width: WP(100) }}
            bounces={false}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            snapToInterval={WP(100)}
            pagingEnabled={true}
            decelerationRate={0.8}
            scrollEnabled={false}
        >
            <StatusBar
                backgroundColor={MyColors(1).black}
                barStyle={"light-content"}
            />

            <Screen1 handleScroll={() => handleScroll(1)} />

            <Screen2
                handleScroll={() => handleScroll(2)}
                screenIndex={screenIndex}
            />
        </ScrollView>
    );
}

const Screen1 = ({ handleScroll }) => {
    const navigator = useNavigation();

    return (
        <View
            style={{
                width: WP(100),
                backgroundColor: MyColors(1).black,
                justifyContent: "center",
                alignItems: "center",
                gap: WP(3),
            }}
        >
            <TouchableOpacity
                onPress={handleScroll}
                style={{
                    height: HP(7),
                    width: HP(25),
                    backgroundColor: MyColors(0.8).green,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 100,
                }}
            >
                <Text
                    style={{
                        fontSize: HP(2),
                        textAlign: "center",
                        color: MyColors(1).white,
                        fontWeight: "bold",
                    }}
                >
                    Get Started
                </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigator.navigate("login")}>
                <Text
                    style={{
                        fontSize: HP(1.8),
                        textAlign: "center",
                        color: MyColors(0.6).white,
                        fontWeight: "bold",
                    }}
                >
                    Already have an account?
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const Screen2 = ({ handleScroll, screenIndex }) => {
    const navigator = useNavigation();

    const opacity1 = useRef(new Animated.Value(0)).current;
    const opacity2 = useRef(new Animated.Value(0)).current;
    const opacity3 = useRef(new Animated.Value(0)).current;
    const buttonOpacity = useRef(new Animated.Value(0)).current; // New animated value for button

    const [enable, setEnable] = useState(false);

    const animateTexts = () => {
        // Animate the first text
        Animated.timing(opacity1, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start(() => {
            // After first animation completes, start the second
            Animated.timing(opacity2, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }).start(() => {
                // After second animation completes, start the third
                Animated.timing(opacity3, {
                    toValue: 1,
                    duration: 1500,
                    useNativeDriver: true,
                }).start(() => {
                    Animated.timing(buttonOpacity, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: true,
                    }).start(() => setEnable(true)); // Enable button after animation
                });
            });
        });
    };

    if (screenIndex === 1) {
        animateTexts();
    }

    return (
        <View
            style={{
                width: WP(100),
                backgroundColor: MyColors(1).black,
                justifyContent: "center",
                alignItems: "center",
                gap: WP(4),
            }}
        >
            <View style={{ alignItems: "center" }}>
                {/* Animated text elements with staggered fade-in effect */}
                <Animated.Text
                    style={{
                        fontSize: HP(4),
                        color: MyColors(1).green,
                        opacity: opacity1,
                        fontWeight: "bold",
                    }}
                >
                    Hello!
                </Animated.Text>
                <Animated.Text
                    style={{
                        color: MyColors(1).white,
                        opacity: opacity2,
                        fontSize: HP(1.6),
                        textAlign: "center",
                        width: WP(60),
                    }}
                >
                    Welcome to our app.
                </Animated.Text>
                <Animated.Text
                    style={{
                        color: MyColors(1).white,
                        opacity: opacity3,
                        fontSize: HP(1.6),
                    }}
                >
                    Get personalized workout routines tailored just for you.
                </Animated.Text>
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
                            color: MyColors(1).white,
                            fontWeight: "bold",
                        }}
                    >
                        Continue
                    </Text>
                    <AntDesign
                        style={{ position: "absolute", right: 20 }}
                        name="caretright"
                        size={15}
                        color={MyColors(1).white}
                    />
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
};
