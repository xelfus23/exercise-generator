import { useRef, useState } from "react";
import { View, Animated, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "expo-router";
import { widthPercentageToDP as WP, heightPercentageToDP as HP } from "react-native-responsive-screen";
import { MyColors } from '../../../constants/myColors'

export default function Screen2({ handleScroll, screenIndex }) {
    const navigator = useNavigation();

    const opacity1 = useRef(new Animated.Value(0)).current;
    const opacity2 = useRef(new Animated.Value(0)).current;
    const opacity3 = useRef(new Animated.Value(0)).current;
    const buttonOpacity = useRef(new Animated.Value(0)).current; // New animated value for button

    const [enable, setEnable] = useState(false);

    const animateTexts = () => {
        Animated.timing(opacity1, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start(() => {
            Animated.timing(opacity2, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }).start(() => {
                Animated.timing(opacity3, {
                    toValue: 1,
                    duration: 1500,
                    useNativeDriver: true,
                }).start(() => {
                    Animated.timing(buttonOpacity, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: true,
                    }).start(() => setEnable(true));
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
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
};
