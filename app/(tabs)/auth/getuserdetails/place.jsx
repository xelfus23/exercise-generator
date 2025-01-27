import {
    View,
    Text,
    Pressable,
    Animated,
    TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import {
    heightPercentageToDP as HP,
    widthPercentageToDP as WP,
} from "react-native-responsive-screen";
import { MyColors } from "@/constants/myColors";
import LottieView from "lottie-react-native";

export default function PreferablePlaces({
    setSelectedPlaces,
    selectedPlaces,
    next,
    scrollY,
    setIndex,
}) {
    const places = [
        {
            name: "Home",
            description:
                "A personal and private space, typically inside a house or apartment, where you can relax, live, and manage daily activities. It's easily accessible, allowing you to have flexibility in your schedule.",
        },
        {
            name: "Outdoor",
            description:
                "Any open, natural environment such as parks, fields, or beaches. It provides fresh air, natural scenery, and a space that can be used for recreational activities, walking, or socializing.",
        },
        {
            name: "Gym",
            description:
                "A fitness center or facility equipped with machines, free weights, and other exercise tools. It’s a controlled environment specifically designed for training and physical exercise.",
        },
    ];

    const [error, setError] = useState(null);
    const [isSubmitted, setSubmitted] = useState(false);
    const AnimatedTouchableOpacity =
        Animated.createAnimatedComponent(TouchableOpacity);

    const updateSelectedItem = (item) => {
        setSelectedPlaces((prev) => {
            if (prev?.includes(item)) {
                return prev.filter((selectedItem) => selectedItem !== item);
            } else {
                return [...prev, item];
            }
        });
    };

    const handleNext = () => {
        if (selectedPlaces?.length === 0) {
            setError("Please select at least one place.");
        } else {
            setSubmitted(true);
            setIndex(7);
        }
    };

    const moveScroll = scrollY.interpolate({
        inputRange: [5000, 8800],
        outputRange: [0, 1000],
        extrapolate: "clamp",
    });

    const scrollIconOpacity = scrollY.interpolate({
        inputRange: [5400, 5500],
        outputRange: [1, 0], // Start at 0 and fade out
        extrapolate: "clamp",
    });

    const fadeOutOpacity = scrollY.interpolate({
        inputRange: [5400, 5800],
        outputRange: [1, 0],
        extrapolate: "clamp",
    });

    return (
        <View
            style={{
                alignItems: "center",
                justifyContent: "center",
                height: HP(100),
            }}
        >
            <View
                style={{
                    marginTop: HP(4),
                    width: WP(100),
                    alignItems: "center",
                    gap: HP(2),
                }}
            >
                <Text
                    style={{
                        color: MyColors(0.8).white,
                        fontWeight: "bold",
                        fontSize: HP(2),
                        textAlign: "center",
                        width: WP(70),
                    }}
                >
                    On what place do you prefer to do your exercise?
                </Text>
                <Text
                    style={{
                        color: MyColors(0.8).white,
                        fontSize: HP(1.6),
                        textAlign: "center",
                    }}
                >
                    please choose one or more
                </Text>
            </View>
            <View
                style={{
                    marginHorizontal: WP(5),
                    marginTop: HP(3),
                    borderRadius: WP(4),
                    width: WP(90),
                    padding: HP(1),
                    gap: HP(1),
                }}
            >
                {places.map((item, index) => (
                    <Pressable
                        key={index}
                        onPress={() => updateSelectedItem(item.name)}
                    >
                        <View
                            style={{
                                justifyContent: "space-between",
                                alignItems: "center",
                                borderRadius: WP(4),
                                borderWidth: 1,
                                borderColor: selectedPlaces?.includes(item.name)
                                    ? MyColors(0.8).green
                                    : MyColors(1).gray,
                                padding: HP(1),
                                paddingHorizontal: HP(2),
                                flexDirection: "row",
                                gap: WP(4),
                            }}
                        >
                            <Text
                                style={{
                                    color: selectedPlaces?.includes(item.name)
                                        ? MyColors(0.8).green
                                        : MyColors(0.5).white,
                                    fontSize: HP(2),
                                    fontWeight: "bold",
                                    elevation: selectedPlaces?.includes(
                                        item.name
                                    )
                                        ? 4
                                        : 0,
                                }}
                            >
                                {item.name}
                            </Text>

                            <Text
                                style={{
                                    color: selectedPlaces?.includes(item.name)
                                        ? MyColors(0.8).white
                                        : MyColors(0.5).white,
                                    fontSize: HP(1.5),
                                    width: WP(50),
                                }}
                            >
                                {item.description}
                            </Text>
                        </View>
                    </Pressable>
                ))}
            </View>

            <Text
                style={{
                    color: MyColors(0.8).red,
                    textAlign: "center",
                    paddingVertical: HP(2),
                }}
            >
                {error}
            </Text>

            <Animated.View
                style={{
                    opacity: fadeOutOpacity,
                    width: WP(100),
                    alignItems: "center",
                    height: HP(6),
                }}
            >
                {!isSubmitted && selectedPlaces?.length > 0 ? (
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
                    selectedPlaces.length > 0 && (
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
