import { View, Text, TouchableOpacity, Animated } from "react-native";
import React, { useRef, useState } from "react";
import {
    heightPercentageToDP as HP,
    widthPercentageToDP as WP,
} from "react-native-responsive-screen";
import { MyColors } from "@/constants/myColors";
import { LinearGradient } from "expo-linear-gradient";
import Xstyles from "../../auth/authStyles";
import LottieView from "lottie-react-native";
const LoginRegisterStyle = Xstyles.LoginRegisterStyle;
const styles = Xstyles.style;

export default function SelectFitnessLevel({
    setSelectedFitnessLevel,
    scrollY,
    setIndex,
}) {
    const FitnessLevels = [
        {
            label: "Beginner",
            characteristics: [
                "New to exercise or returning after a long break.",
                "May have low endurance and strength.",
            ],
            typicalActivities: [
                "Light cardio (walking, jogging).",
                "Basic strength exercises (bodyweight squats, push-ups).",
                "Flexibility exercises (stretching, yoga).",
            ],
        },
        {
            label: "Intermediate",
            characteristics: [
                "Regularly exercises but has not reached advanced fitness levels.",
                "Moderate endurance and strength.",
            ],
            typicalActivities: [
                "Moderate cardio (running, cycling).",
                "Weight training (using weights or resistance bands).",
                "More structured flexibility routines (yoga, Pilates).",
            ],
        },
        {
            label: "Advanced",
            characteristics: [
                "Highly consistent with workouts, with significant strength and endurance.",
                "Often participates in specific sports or competitive activities.",
            ],
            typicalActivities: [
                "Intense cardio (interval training, long-distance running).",
                "Advanced weight training (heavy lifting, complex compound movements).",
                "Specialized flexibility and mobility work (dynamic stretching, advanced yoga).",
            ],
        },
        {
            label: "Athlete",
            characteristics: [
                "Dedicated to a specific sport or competitive training program.",
                "High endurance, strength, and skill level in specific physical activities.",
            ],
            typicalActivities: [
                "Sport-specific training (speed, agility, skill drills).",
                "Sport-specific strength and conditioning exercises.",
                "Recovery techniques (foam rolling, sports massage, advanced stretching).",
            ],
        },
    ];

    const [fitnessLevel, setFitnessLevel] = useState({
        label: "Beginner",
        characteristics: [
            "New to exercise or returning after a long break.",
            "May have low endurance and strength.",
        ],
        typicalActivities: [
            "Light cardio (walking, jogging).",
            "Basic strength exercises (bodyweight squats, push-ups).",
            "Flexibility exercises (stretching, yoga).",
        ],
    });

    const [error, setError] = useState(false);
    const [isSubmitted, setSubmitted] = useState(false);
    const fadeAnimationOpacity = useRef(new Animated.Value(0)).current;

    const updateSelectedItems = (item) => {
        if (!fitnessLevel || fitnessLevel.label !== item.label) {
            setFitnessLevel(item);
        }
    };

    const AnimatedTouchableOpacity =
        Animated.createAnimatedComponent(TouchableOpacity);

    const moveScroll = scrollY.interpolate({
        inputRange: [7200, 9800],
        outputRange: [0, 1000],
        extrapolate: "clamp",
    });

    const scrollIconOpacity = scrollY.interpolate({
        inputRange: [6400, 6500],
        outputRange: [1, 0], // Start at 0 and fade out
        extrapolate: "clamp",
    });

    const fadeOutOpacity = scrollY.interpolate({
        inputRange: [6400, 6800],
        outputRange: [1, 0],
        extrapolate: "clamp",
    });

    const handleNext = () => {
        if (!fitnessLevel) {
            setError(true);
            return;
        }
        setSelectedFitnessLevel(fitnessLevel.label);
        fadeAnimation();
    };

    const fadeAnimation = () => {
        Animated.timing(fadeAnimationOpacity, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
        }).start(() => {
            setSubmitted(true);
            setIndex(9);
        });
    };

    return (
        <View
            style={{
                justifyContent: "center",
                alignItems: "center",
                height: HP(100),
            }}
        >
            <Text
                style={{
                    color: MyColors(1).white,
                    width: WP(90),
                    marginBottom: HP(2),
                    textAlign: "center",
                    fontSize: HP(2),
                }}
            >
                Select your current{" "}
                <Text
                    style={{
                        color: MyColors(1).green,
                        textShadowColor: MyColors(1).green,
                        textShadowRadius: HP(1),
                        fontWeight: "bold",
                    }}
                >
                    fitness level
                </Text>
            </Text>
            <View
                style={{
                    flexDirection: "row",
                    paddingBottom: HP(3),
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: WP(80),
                    height: HP(50),
                }}
            >
                <View style={{ gap: HP(2) }}>
                    {FitnessLevels.map((levels) => (
                        <TouchableOpacity
                            key={levels.label}
                            style={{
                                width: WP(30),
                                borderRadius: HP(3),
                                borderWidth: 1,
                                borderColor:
                                    fitnessLevel?.label === levels.label
                                        ? MyColors(1).green
                                        : MyColors(1).gray,
                                overflow: "hidden",
                            }}
                            onPress={() => updateSelectedItems(levels)}
                        >
                            <LinearGradient
                                colors={[
                                    fitnessLevel?.label === levels.label
                                        ? MyColors(0.1).black
                                        : MyColors(1).black,
                                    MyColors(1).black,
                                ]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                locations={[0, 0.7]}
                                style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                    padding: HP(2),
                                }}
                            >
                                <Text
                                    style={{
                                        color:
                                            fitnessLevel?.label === levels.label
                                                ? MyColors(1).green
                                                : MyColors(0.8).white,
                                        fontWeight: "bold",
                                    }}
                                >
                                    {levels.label}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    ))}
                </View>

                <View
                    style={{
                        width: WP(40),
                    }}
                >
                    {fitnessLevel && (
                        <View style={{ gap: HP(1) }}>
                            <Text
                                style={{
                                    color: MyColors(1).green,
                                    fontWeight: "bold",
                                    fontSize: HP(2),
                                }}
                            >
                                Description:
                            </Text>
                            {fitnessLevel.characteristics.map((char, index) => (
                                <Text
                                    key={index}
                                    style={{
                                        color: MyColors(1).white,
                                        fontSize: HP(1.5),
                                    }}
                                >
                                    {char}
                                </Text>
                            ))}

                            <Text
                                style={{
                                    color: MyColors(1).green,
                                    fontWeight: "bold",
                                    fontSize: HP(2),
                                }}
                            >
                                Typical Activities:
                            </Text>
                            {fitnessLevel.typicalActivities.map(
                                (act, index) => (
                                    <Text
                                        key={index}
                                        style={{
                                            color: MyColors(1).white,
                                            fontSize: HP(1.5),
                                        }}
                                    >
                                        {act}
                                    </Text>
                                )
                            )}
                        </View>
                    )}
                </View>
            </View>

            <Text style={{ color: MyColors(1).red }}>
                {error && "Please select your fitness level"}
            </Text>

            <Animated.View
                style={{
                    opacity: fadeOutOpacity,
                    width: WP(100),
                    alignItems: "center",
                    height: HP(6),
                }}
            >
                {!isSubmitted ? (
                    <AnimatedTouchableOpacity
                        style={{
                            height: HP(6),
                            width: WP(80),
                            borderColor: MyColors(1).green,
                            borderRadius: WP(4),
                            justifyContent: "center",
                            alignItems: "center",
                            opacity: fadeOutOpacity,
                            borderWidth: 1,
                        }}
                        onPress={handleNext}
                    >
                        <Text
                            style={{
                                color: MyColors(1).white,
                                fontWeight: "bold",
                                fontSize: HP(2),
                            }}
                        >
                            Submit
                        </Text>
                    </AnimatedTouchableOpacity>
                ) : (
                    <Animated.View
                        style={{
                            alignItems: "center",
                            justifyContent: "center",
                            height: HP(15),
                            transform: [{ translateY: moveScroll }], // Use interpolated value
                            opacity: scrollIconOpacity,
                        }}
                    >
                        <LottieView
                            source={require("@/assets/json/scrolldown.json")}
                            autoPlay
                            loop
                            style={{
                                height: "100%",
                                aspectRatio: 1,
                                zIndex: 1000,
                            }}
                        />
                    </Animated.View>
                )}
            </Animated.View>
        </View>
    );
}
