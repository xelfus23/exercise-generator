import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import {
    heightPercentageToDP as HP,
    widthPercentageToDP as WP,
} from "react-native-responsive-screen";
import { MyColors } from "@/constants/myColors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import stylesX from "../../auth/authStyles";
import LottieView from "lottie-react-native";
const LoginRegisterStyle = stylesX.LoginRegisterStyle;

export default function Gender({
    selectedGender,
    setSelectedGender,
    next,
    scrollY,
    nickName,
    scrollOffset,
    setIndex,
}) {
    const textOpacity = useRef(new Animated.Value(0)).current;
    const containerOpacity = useRef(new Animated.Value(0)).current;
    const fadeAnimationOpacity = useRef(new Animated.Value(1)).current;
    const [isNext, setIsNext] = useState(false);
    const [error, setError] = useState(null);

    const handlePress = (gender) => {
        setSelectedGender(gender);
    };

    const AnimatedTouchableOpacity =
        Animated.createAnimatedComponent(TouchableOpacity);

    const animateText = () => {
        Animated.timing(textOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start(() =>
            Animated.timing(containerOpacity, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }).start()
        );

        Animated.parallel([
            Animated.timing(moveGenderY, {
                toValue: 0,
                duration: 1200,
                useNativeDriver: true,
            }).start(),
            Animated.timing(moveFemaleGenderX, {
                toValue: 0,
                duration: 1500,
                useNativeDriver: true,
            }).start(),
            Animated.timing(moveMaleGenderX, {
                toValue: 0,
                duration: 1500,
                useNativeDriver: true,
            }).start(),
        ]);
    };

    const fadeAnimation = () => {
        Animated.timing(fadeAnimationOpacity, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
        }).start(() => {
            setIsNext(true);
            setIndex(2);
        });
    };

    useEffect(() => {
        if (scrollOffset > 500) {
            animateText();
        }
    }, [scrollOffset]);

    const genders = [
        {
            label: "Male",
            value: "male",
            color: MyColors(1).green,
        },
        {
            label: "Female",
            value: "female",
            color: MyColors(1).purple,
        },
    ];

    const moveScroll = scrollY.interpolate({
        inputRange: [800, 4000],
        outputRange: [0, 1000], // Adjust as needed
        extrapolate: "clamp",
    });

    const scrollIconOpacity = scrollY.interpolate({
        inputRange: [800, 1800],
        outputRange: [1, 0], // Start at 0 and fade out
        extrapolate: "clamp",
    });

    const fadeOutOpacity = scrollY.interpolate({
        inputRange: [1000, 1400],
        outputRange: [1, 0],
        extrapolate: "clamp",
    });

    const moveGenderY = useRef(new Animated.Value(100)).current;
    const moveMaleGenderX = useRef(new Animated.Value(-190)).current;
    const moveFemaleGenderX = useRef(new Animated.Value(190)).current;

    const handleNext = () => {
        if (!selectedGender) {
            setError("Please select a gender");
            setTimeout(() => {
                setError(null);
            }, 5000);
        } else {
            fadeAnimation();
        }
    };

    return (
        <View
            style={{
                height: HP(100),
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Animated.View
                style={{ paddingHorizontal: WP(5), opacity: fadeOutOpacity }}
            >
                <View style={{ marginBottom: HP(3) }}>
                    {!isNext ? (
                        <Animated.View
                            style={{ opacity: fadeAnimationOpacity }}
                        >
                            <Animated.Text
                                style={{
                                    fontSize: HP(2),
                                    color: MyColors(1).white,
                                    textAlign: "center",
                                    opacity: textOpacity,
                                }}
                            >
                                Okay{" "}
                                <Text
                                    style={{
                                        fontWeight: "bold",
                                        color: MyColors(1).green,
                                        textShadowColor: MyColors(1).green,
                                        textShadowRadius: HP(1),
                                    }}
                                >
                                    {nickName}
                                </Text>
                                , can you tell us more about yourself? What is
                                your gender?
                            </Animated.Text>
                        </Animated.View>
                    ) : (
                        <Animated.Text
                            style={{
                                color: MyColors(0.8).white,
                                fontSize: HP(2),
                                opacity: fadeOutOpacity,
                                fontWeight: "bold",
                                textAlign: "center",
                            }}
                        >
                            Continue{" "}
                            <Animated.Text
                                style={{
                                    color: MyColors(1).green,
                                    fontSize: HP(2),
                                    opacity: fadeOutOpacity,
                                    fontWeight: "bold",
                                    textShadowRadius: HP(2),
                                    textShadowColor: MyColors(1).green,
                                }}
                            >
                                Scrolling
                            </Animated.Text>{" "}
                            for next steps
                        </Animated.Text>
                    )}
                </View>
                <Animated.View
                    style={{
                        padding: HP(2),
                        marginBottom: 20,
                        height: "auto",
                        width: WP(90),
                        opacity: containerOpacity,
                    }}
                >
                    {!isNext && (
                        <Animated.View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-around",
                                marginVertical: HP(5),
                                opacity: fadeAnimationOpacity,
                            }}
                        >
                            {genders.map((gen) => (
                                <Animated.View
                                    key={gen.label}
                                    style={{
                                        justifyContent: "center",
                                        alignItems: "center",
                                        gap: HP(2),
                                        height: HP(20),
                                        transform: [
                                            {
                                                translateX:
                                                    gen.label === "Male"
                                                        ? moveMaleGenderX
                                                        : moveFemaleGenderX,
                                            },
                                            {
                                                translateY: moveGenderY,
                                            },
                                        ],
                                    }}
                                >
                                    <TouchableOpacity
                                        disabled={isNext}
                                        onPress={() => handlePress(gen.label)}
                                    >
                                        <FontAwesome
                                            name={gen.value}
                                            size={
                                                gen.label === selectedGender
                                                    ? HP(16)
                                                    : HP(15)
                                            }
                                            color={
                                                gen.label === "Male"
                                                    ? selectedGender ===
                                                      gen.label
                                                        ? MyColors(1).green
                                                        : MyColors(0.4).green
                                                    : selectedGender ===
                                                      gen.label
                                                    ? MyColors(1).purple
                                                    : MyColors(0.4).purple
                                            }
                                            style={{
                                                shadowColor:
                                                    gen.label === "Male"
                                                        ? selectedGender ===
                                                          gen.label
                                                            ? MyColors(1).green
                                                            : MyColors(1).green
                                                        : selectedGender ===
                                                          gen.label
                                                        ? MyColors(1).purple
                                                        : MyColors(1).purple,
                                                textShadowRadius:
                                                    selectedGender === gen.label
                                                        ? 20
                                                        : 0,
                                            }}
                                        />
                                    </TouchableOpacity>
                                    <Text
                                        style={{
                                            color:
                                                gen.label === "Male"
                                                    ? selectedGender ===
                                                      gen.label
                                                        ? MyColors(1).green
                                                        : MyColors(0.8).white
                                                    : selectedGender ===
                                                      gen.label
                                                    ? MyColors(1).purple
                                                    : MyColors(0.8).white,
                                            fontWeight: "bold",
                                            fontSize: HP(2),
                                        }}
                                    >
                                        {gen.label}
                                    </Text>
                                </Animated.View>
                            ))}
                        </Animated.View>
                    )}
                </Animated.View>
            </Animated.View>
            {!isNext && error && (
                <Text
                    style={[LoginRegisterStyle.error, { marginBottom: HP(3) }]}
                >
                    {error}
                </Text>
            )}
            <View style={{ height: HP(10) }}>
                {!isNext && selectedGender ? (
                    <AnimatedTouchableOpacity
                        onPress={handleNext}
                        style={{
                            // backgroundColor: MyColors(1).gray,
                            borderWidth: 1,
                            borderColor: MyColors(1).green,
                            borderRadius: WP(4),
                            width: WP(60),
                            alignItems: "center",
                            justifyContent: "center",
                            height: HP(6),
                            opacity: fadeAnimationOpacity,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: HP(2),
                                color: MyColors(1).white,
                                fontWeight: "bold",
                            }}
                        >
                            Submit
                        </Text>
                    </AnimatedTouchableOpacity>
                ) : (
                    selectedGender && (
                        <Animated.View
                            style={{
                                alignItems: "center",
                                justifyContent: "center",
                                height: HP(15),
                                transform: [{ translateY: moveScroll }],
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
            </View>
        </View>
    );
}

{
    /* <View
        style={{
            justifyContent: "center",
            alignItems: "center",
        }}
    >
        <TouchableOpacity
            onPress={() => handlePress("Other")}
            style={{
                marginTop: HP(5),
                paddingHorizontal: 20,
                borderRadius: 20,
                height: "auto",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Text
                style={{
                    color:
                        selectedGender === "Other"
                            ? MyColors(1).white
                            : MyColors(0.4).white,
                    fontSize: 16,
                }}
            >
                Others / I'd rather not say
            </Text>
        </TouchableOpacity>
    </View> */
}
