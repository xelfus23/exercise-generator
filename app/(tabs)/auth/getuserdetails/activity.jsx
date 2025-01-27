import { View, Text, Animated, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import {
    heightPercentageToDP as HP,
    widthPercentageToDP as WP,
} from "react-native-responsive-screen";
import { MyColors } from "@/constants/myColors";
import { LinearGradient } from "expo-linear-gradient";
import Slider from "@react-native-community/slider";
import styles from "./styles";
import LottieView from "lottie-react-native";

export default function ActivityLevel({
    setSelectedActivityLevel,
    selectedActivityLevel,
    scrollY,
    setIndex,
}) {
    const ActivityLevels = [
        {
            label: "Sedentary",
            description: "Little to no exercise; primarily sitting.",
        },
        {
            label: "Lightly Active",
            description: "Engaging in light exercise 1-3 days per week.",
        },
        {
            label: "Moderately Active",
            description:
                "Participating in moderate exercise 3-5 days per week.",
        },
        {
            label: "Very Active",
            description: "Engaging in vigorous exercise 6-7 days per week.",
        },
        {
            label: "Extremely Active",
            description:
                "Undergoing intense exercise twice a day or having a physically demanding job.",
        },
    ];

    const [sliderValue, setSliderValue] = useState(0);
    const [isSubmitted, setSubmitted] = useState(false);

    const handleValueChange = (value) => {
        setSliderValue(value);
        setSelectedActivityLevel(ActivityLevels[value].label);
    };

    const AnimatedTouchableOpacity =
        Animated.createAnimatedComponent(TouchableOpacity);

    const moveScroll = scrollY.interpolate({
        inputRange: [6300, 10000],
        outputRange: [0, 1000],
        extrapolate: "clamp",
    });

    const scrollIconOpacity = scrollY.interpolate({
        inputRange: [6400, 7500],
        outputRange: [1, 0], // Start at 0 and fade out
        extrapolate: "clamp",
    });

    const fadeOutOpacity = scrollY.interpolate({
        inputRange: [6200, 7100],
        outputRange: [1, 0],
        extrapolate: "clamp",
    });

    const handleNext = () => {
        setSubmitted(true);
        setIndex(8);
    };
    return (
        <View
            style={{
                height: HP(100),
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Text
                style={{
                    fontSize: HP(2),
                    color: MyColors(1).white,
                }}
            >
                What's your current{" "}
                <Text
                    style={{
                        color: MyColors(1).green,
                        textShadowColor: MyColors(1).green,
                        textShadowRadius: HP(1),
                        fontWeight: "bold",
                    }}
                >
                    Activity Level
                </Text>
                ?
            </Text>

            <LinearGradient
                colors={[MyColors(0.5).black, MyColors(1).black]}
                locations={[0, 1]}
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    height: HP(40),
                    marginTop: HP(3),
                    width: WP(90),
                    justifyContent: "flex-end",
                    borderWidth: 1,
                    borderColor: MyColors(1).gray,
                    borderRadius: WP(4),
                }}
            >
                <Slider
                    style={{
                        width: HP(32),
                        height: 10,
                        transform: [{ rotate: "-90deg" }],
                        position: "absolute",
                        left: -HP(10),
                        borderWidth: 1,
                        paddingVertical: WP(3),
                        borderRadius: WP(4),
                        borderColor: MyColors(1).gray,
                    }}
                    minimumValue={0}
                    maximumValue={ActivityLevels.length - 1}
                    step={1}
                    value={sliderValue}
                    onValueChange={handleValueChange}
                    minimumTrackTintColor={MyColors(1).green}
                    maximumTrackTintColor={MyColors(1).white}
                    thumbTintColor={MyColors(1).white}
                />

                <View
                    style={{
                        justifyContent: "space-between",
                        height: HP(30),
                        width: WP(40),
                        marginRight: WP(25),
                    }}
                >
                    {ActivityLevels.slice()
                        .reverse()
                        .map((item, index) => (
                            <View key={item.label}>
                                <Text
                                    style={{
                                        color:
                                            index ===
                                            ActivityLevels.length -
                                                1 -
                                                sliderValue // Adjust index to match reversed array
                                                ? MyColors(0.8).green
                                                : MyColors(0.8).white,
                                        fontSize: HP(2),
                                        fontWeight: "bold",
                                    }}
                                >
                                    {item.label}
                                </Text>
                            </View>
                        ))}
                </View>
            </LinearGradient>

            <View
                style={{
                    marginVertical: HP(2),
                    padding: WP(3),
                    borderRadius: WP(4),
                }}
            >
                <Text style={{ color: MyColors(0.8).white }}>
                    {selectedActivityLevel?.description}
                </Text>
            </View>

            <Animated.View
                style={{
                    opacity: fadeOutOpacity,
                    width: WP(100),
                    alignItems: "center",
                    height: HP(6),
                }}
            >
                {!isSubmitted && selectedActivityLevel ? (
                    <AnimatedTouchableOpacity
                        style={{
                            height: HP(6),
                            width: WP(80),
                            // backgroundColor: MyColors(1).gray,
                            borderWidth: 1,
                            borderColor: MyColors(1).green,
                            borderRadius: WP(4),
                            justifyContent: "center",
                            alignItems: "center",
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
                    selectedActivityLevel &&
                    isSubmitted && (
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
                    )
                )}
            </Animated.View>
        </View>
    );
}
