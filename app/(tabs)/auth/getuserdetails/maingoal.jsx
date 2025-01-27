import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    SafeAreaView,
    Animated,
} from "react-native";
import React, { useState } from "react";
import {
    heightPercentageToDP as HP,
    widthPercentageToDP as WP,
} from "react-native-responsive-screen";
import { MyColors } from "@/constants/myColors";
import styles from "./styles";
import stylesX from "../../auth/authStyles";
const LoginRegisterStyle = stylesX.LoginRegisterStyle;
import LottieView from "lottie-react-native";

export default function MainGoal({
    setSelectedGoal,
    selectedGoal,
    next,
    scrollY,
    setIndex,
    nickName,
}) {
    const [error, setError] = useState(null);
    const [isSubmitted, setSubmitted] = useState(false);
    const AnimatedTouchableOpacity =
        Animated.createAnimatedComponent(TouchableOpacity);

    const moveScroll = scrollY.interpolate({
        inputRange: [1700, 4000],
        outputRange: [0, 1000],
        extrapolate: "clamp",
    });

    const scrollIconOpacity = scrollY.interpolate({
        inputRange: [4000, 4400],
        outputRange: [1, 0], // Start at 0 and fade out
        extrapolate: "clamp",
    });

    const fadeOutOpacity = scrollY.interpolate({
        inputRange: [4500, 5000],
        outputRange: [1, 0],
        extrapolate: "clamp",
    });

    const mainGoals = [
        "Muscle Gain",
        "Improve Balance",
        "Weight Loss",
        "Increase Endurance",
        "Improve Flexibility",
        "Reduce Stress",
        "Improve Overall Fitness",
        "Enhance Athletic Performance",
        "Increase Strength",
        "Improve Posture",
        "Rehabilitation",
    ];

    const onPress = (item) => {
        if (selectedGoal.includes(item)) {
            setSelectedGoal((prev) => prev.filter((goal) => goal !== item));
        } else {
            setSelectedGoal((prev) => [...prev, item]);
        }
    };

    const handleNext = () => {
        if (selectedGoal.length < 1) {
            setError("Please select one or more main goals.");
            setTimeout(() => {
                setError(null);
            }, 5000);
        } else {
            setSubmitted(true);
            setIndex(6);
        }
    };

    return (
        <SafeAreaView
            style={{
                height: HP(100),
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <View
                style={{
                    width: WP(90),
                    paddingTop: HP(2),
                    marginBottom: HP(3),
                }}
            >
                <Text style={[styles.Title]}>
                    What are your goals{" "}
                    <Text
                        style={{
                            color: MyColors(1).green,
                            fontWeight: "bold",
                            textShadowColor: MyColors(1).green,
                            textShadowRadius: HP(1),
                        }}
                    >
                        {nickName}
                    </Text>
                    ?
                </Text>
                <Text
                    style={{ color: MyColors(0.8).white, textAlign: "center" }}
                >
                    you can select one or more
                </Text>
            </View>
            <View
                style={{
                    borderRadius: WP(4),
                    width: WP(100),
                }}
            >
                <Text
                    style={{
                        color: MyColors(0.8).white,
                        marginLeft: WP(4),
                        fontSize: HP(1.5),
                        marginBottom: HP(2),
                    }}
                >
                    You have selected:{" "}
                    <Text style={{ color: MyColors(1).green }}>
                        {selectedGoal?.length}
                    </Text>{" "}
                    items
                </Text>

                <ScrollView
                    contentContainerStyle={{
                        flexWrap: "wrap",
                        gap: HP(1),
                        maxWidth: WP(200),
                        padding: WP(2),
                    }}
                    style={{
                        borderRadius: WP(4),
                        width: WP(100),
                    }}
                    showsHorizontalScrollIndicator={false}
                    horizontal
                >
                    {mainGoals.map((item, index) => (
                        <TouchableOpacity
                            key={item}
                            onPress={() => onPress(item)}
                            style={{
                                justifyContent: "center",
                                alignItems: "center",
                                padding: WP(4),
                                backgroundColor: !selectedGoal.includes(item)
                                    ? MyColors(1).gray
                                    : MyColors(0.5).gray,
                                borderRadius: WP(3),
                            }}
                        >
                            <Text
                                style={{
                                    borderColor: MyColors(1).gray,
                                    textAlign: "center",
                                    color: !selectedGoal.includes(item)
                                        ? MyColors(0.8).white
                                        : MyColors(1).white,
                                    fontSize: HP(1.5),
                                }}
                            >
                                {item}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <Text style={[LoginRegisterStyle.error]}>{error}</Text>

            <Animated.View
                style={{
                    opacity: fadeOutOpacity,
                    width: WP(100),
                    alignItems: "center",
                    height: HP(6),
                }}
            >
                {!isSubmitted && selectedGoal.length > 0 ? (
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
        </SafeAreaView>
    );
}

const MainGoalStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: MyColors(1).black,
        alignItems: "center",
        marginTop: HP(2),
    },
    button: {
        width: "auto",
        padding: 10,
        backgroundColor: MyColors(1).gray,
        width: WP(80),
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
    },
    label: {
        fontSize: WP(4),
        color: MyColors(1).white,
    },
});
