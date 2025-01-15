import { useEffect, useRef, useState } from "react";
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

    const randomMessage = [
        "Get personalized workout routines tailored just for you. Our AI-powered fitness app creates custom exercise plans based on your goals, fitness level, and available equipment. Start your fitness journey today!",
        "Stop wasting time with generic workout plans that don't deliver results. Our AI fitness app creates personalized exercise routines that maximize your progress. Get a workout plan tailored to your body, your goals, and your lifestyle.", "Experience the future of fitness with AI-powered personalized workouts. Our advanced artificial intelligence analyzes your individual needs to generate exercise plans that are optimized for your success. No more guesswork, just results.", "Ready to transform your fitness journey? Our AI-powered workout generator creates personalized exercise routines tailored to your specific needs. Tell us about your goals and get your custom plan today!", "One size doesn't fit all when it comes to fitness. Our AI creates exercise plans customized to your unique profile. Input your fitness level, goals, and equipment, and let our AI build the perfect workout routine for you."
    ]

    const [randomText, setRandomText] = useState(null);

    useEffect(() => {
        setRandomText(randomMessage[Math.floor(Math.random() * randomMessage.length)])
    }, [])

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
                    Welcome! Let's get you started on your personalized fitness journey.
                </Animated.Text>
                <Animated.Text
                    style={{
                        color: MyColors(1).white,
                        opacity: opacity3,
                        fontSize: HP(1.6),
                        textAlign: 'center',
                        width: WP(90),
                        marginTop: HP(1),
                    }}
                >
                    {randomText}
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
