import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Animated,
} from "react-native";
import {
    heightPercentageToDP as HP,
    widthPercentageToDP as WP,
} from "react-native-responsive-screen";
import { MyColors } from "@/constants/myColors";
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

    const [isSubmitted, setSubmitted] = useState(false);
    const [selectedItem, setSelectedItem] = useState(
        selectedActivityLevel
            ? ActivityLevels.findIndex(
                  (level) => level.label === selectedActivityLevel
              )
            : null
    );

    const handleSelect = (index) => {
        setSelectedItem(index);
        setSelectedActivityLevel(ActivityLevels[index].label);
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

            <View
                style={{
                    marginTop: HP(5),
                    width: WP(100),
                    alignItems: "center",
                }}
            >
                <ScrollView
                    contentContainerStyle={{
                        alignItems: "center",
                    }}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                >
                    {ActivityLevels.map((level, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => handleSelect(index)}
                            style={{
                                padding: WP(3),
                                margin: WP(2),
                                borderColor:
                                    selectedItem === index
                                        ? MyColors(0.8).green
                                        : MyColors(0.8).gray,
                                borderWidth: 1,
                                borderRadius: WP(4),
                                minWidth: WP(30),
                                alignItems: "center",
                            }}
                        >
                            <Text
                                style={{
                                    color:
                                        selectedItem === index
                                            ? MyColors(1).white
                                            : MyColors(0.8).white,
                                    fontWeight: "bold",
                                    textAlign: "center",
                                }}
                            >
                                {level.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <View
                    style={{
                        marginVertical: HP(2),
                        padding: WP(3),
                        borderRadius: WP(4),
                        alignItems: "center",
                    }}
                >
                    <Text
                        style={{
                            color: MyColors(0.8).white,
                            textAlign: "center",
                        }}
                    >
                        {selectedItem !== null
                            ? ActivityLevels[selectedItem].description
                            : "Select an activity level"}
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
                    {selectedItem !== null && !isSubmitted ? (
                        <AnimatedTouchableOpacity
                            style={{
                                height: HP(6),
                                width: WP(80),
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
        </View>
    );
}
