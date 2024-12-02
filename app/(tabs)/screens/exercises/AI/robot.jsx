import {
    View,
    Text,
    Animated,
    PanResponder,
    TouchableOpacity,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { MyColors } from "../../../../../constants/myColors";
import {
    widthPercentageToDP as WP,
    heightPercentageToDP as HP,
} from "react-native-responsive-screen";
import { useNavigation } from "expo-router";

export default function Robot({ text, setText, open }) {
    const [position, setPosition] = useState({ x: 0, y: 0 }); // Initialize position state
    const eyes = useRef(new Animated.Value(1)).current;
    const mouth = useRef(new Animated.Value(2)).current;
    const robot = useRef(new Animated.Value(0)).current;
    const navigation = useNavigation();

    const blinkingAnimation = () => {
        Animated.sequence([
            Animated.timing(eyes, {
                toValue: 2 / 1,
                duration: 100, // Fast closing blink
                useNativeDriver: false,
            }),
            Animated.timing(eyes, {
                toValue: 1, // Eyes open back
                duration: 100, // Fast opening
                useNativeDriver: false,
            }),
        ]).start(() => {
            // After the animation ends, start a new blink with a random delay
            const randomDelay = Math.floor(Math.random() * 7000) + 3000; // Random delay between 3000ms (3s) and 10000ms (10s)
            setTimeout(blinkingAnimation, randomDelay);
        });
    };

    useEffect(() => {
        hoverAnimation(); // Start the hovering animation
        blinkingAnimation(); // Start the blinking animation with random delay
    }, []);

    const hoverAnimation = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(robot, {
                    toValue: -2, // Move up
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(robot, {
                    toValue: 0, // Move back to original position
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    };

    const speakAnimation = (textLength) => {
        const durationPerCharacter = 50; // Set 50ms per character as the base duration
        const totalDuration = textLength * durationPerCharacter;

        const animationLoop = Animated.loop(
            Animated.sequence([
                Animated.timing(mouth, {
                    toValue: 5, // Mouth opens
                    duration: 300,
                    useNativeDriver: false, // For mouth size change
                }),
                Animated.timing(mouth, {
                    toValue: 2, // Mouth closes
                    duration: 300,
                    useNativeDriver: false,
                }),
            ])
        );

        animationLoop.start();

        setTimeout(() => {
            animationLoop.stop(); // Stop speaking after the calculated time
            if (text !== "generating...") {
                setText(null);
            }
        }, totalDuration);
    };

    useEffect(() => {
        if (text) {
            const textLength = text.length;
            speakAnimation(textLength); // Trigger speaking animation based on text length
        }
    }, [text]);

    return (
        <Animated.View
            style={[
                {
                    zIndex: 100,
                    flexDirection: "row",
                    position: "absolute",
                    right: WP(10),
                    bottom: WP(12), // Keep this fixed if you want to adjust the vertical position
                    transform: [{ translateY: robot }],
                },
            ]}
        >
            <View style={{ position: "relative" }}>
                {text && (
                    <View
                        style={{
                            backgroundColor: MyColors(1).gray,
                            maxWidth: WP(80),
                            marginBottom: HP(7), // Adjust margin instead of absolute positioning
                            borderBottomRightRadius: 0,
                            marginRight: WP(6),
                            borderRadius: WP(4),
                            borderWidth: 1,
                            borderColor: MyColors(1).gray,
                            padding: WP(3),
                            maxHeight: HP(30),
                        }}
                    >
                        <Text style={{ color: MyColors(1).white }}>{text}</Text>

                        {text?.includes(
                            "chat screen" || "Chats" || "Go to Chats"
                        ) && (
                            <TouchableOpacity
                                onPress={() => navigation.navigate("Chats")}
                                style={{
                                    marginTop: WP(3),
                                    borderRadius: WP(3),
                                    width: WP(40),
                                    borderWidth: 1,
                                    borderColor: MyColors(1).green,
                                }}
                            >
                                <Text
                                    style={{
                                        color: MyColors(1).green,
                                        padding: WP(2),
                                    }}
                                >
                                    Chat with me here
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            </View>

            <TouchableOpacity onLongPress={open}>
                <View
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                        position: "absolute",
                        right: 0,
                        bottom: 45,
                    }}
                >
                    <View
                        style={{
                            backgroundColor: MyColors(1).green,
                            height: 15,
                            width: 3,
                            position: "absolute",
                            top: -35,
                        }}
                    />
                    <View
                        style={{
                            backgroundColor: MyColors(1).white,
                            height: 10,
                            aspectRatio: 1,
                            position: "absolute",
                            top: -40,
                            borderRadius: 10,
                        }}
                    />

                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            position: "absolute",
                        }}
                    >
                        <View
                            style={{
                                backgroundColor: MyColors(1).white,
                                width: 10,
                                height: 18,
                                borderTopLeftRadius: WP(3),
                                borderBottomLeftRadius: WP(3),
                                margin: -1,
                            }}
                        />
                        <View
                            style={{
                                backgroundColor: MyColors(1).white,
                                width: 50,
                                height: 40,
                                borderRadius: 16,
                                margin: -1,
                            }}
                        />
                        <View
                            style={{
                                backgroundColor: MyColors(1).white,
                                width: 10,
                                height: 18,
                                borderTopRightRadius: WP(3),
                                borderBottomRightRadius: WP(3),
                                margin: -1,
                            }}
                        />
                    </View>

                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            position: "absolute",
                        }}
                    >
                        <View
                            style={{
                                backgroundColor: MyColors(1).green,
                                width: 46,
                                height: 32,
                                borderRadius: 14,
                            }}
                        />
                    </View>

                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            position: "absolute",
                        }}
                    >
                        <View
                            style={{
                                backgroundColor: MyColors(1).gray,
                                width: 40,
                                height: 28,
                                borderRadius: 10,
                                justifyContent: "space-evenly",
                                alignItems: "center",
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-evenly",
                                    width: "100%",
                                    gap: 5,
                                }}
                            >
                                <Animated.View
                                    style={{
                                        backgroundColor: MyColors(1).green,
                                        width: 5,
                                        aspectRatio: eyes,
                                        borderRadius: 5,
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <Animated.View
                                        style={{
                                            backgroundColor: MyColors(1).white,
                                            borderRadius: WP(1),
                                            width: 3,
                                            aspectRatio: eyes,
                                        }}
                                    />
                                </Animated.View>
                                <Animated.View
                                    style={{
                                        backgroundColor: MyColors(1).green,
                                        width: 5,
                                        aspectRatio: eyes,
                                        borderRadius: 5,
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <Animated.View
                                        style={{
                                            backgroundColor: MyColors(1).white,
                                            borderRadius: WP(1),
                                            width: 3,
                                            aspectRatio: eyes,
                                        }}
                                    />
                                </Animated.View>
                            </View>

                            <Animated.View
                                style={{
                                    width: 16, // Width of the smile
                                    height: 6, // Height of the smile arc
                                    borderBottomColor: MyColors(1).green, // Color of the smile
                                    borderBottomWidth: mouth, // Thickness of the smile arc
                                    borderBottomLeftRadius: 100, // Create the left side curve
                                    borderBottomRightRadius: 100, // Create the right side curve
                                    backgroundColor: "transparent",
                                    alignItems: "center",
                                }}
                            >
                                <View
                                    style={{
                                        width: 12, // Width of the smile
                                        height: 3, // Height of the smile arc
                                        marginTop: 2,
                                        borderBottomColor: MyColors(1).white, // Color of the smile
                                        borderBottomWidth: 2, // Thickness of the smile arc
                                        borderBottomLeftRadius: 100, // Create the left side curve
                                        borderBottomRightRadius: 100, // Create the right side curve
                                        backgroundColor: "transparent",
                                    }}
                                />
                            </Animated.View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
}
