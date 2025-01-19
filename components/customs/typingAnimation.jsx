import { useState, useEffect, useRef } from "react";
import { Animated, View, Text } from "react-native";

export default function TypingAnimation({ text, speed = 100 }) {
    const sentenceRef = useRef(new Animated.Value(0)).current; // Animated value for progress
    const [currentText, setCurrentText] = useState("");

    useEffect(() => {
        const chars = text?.split("") || []; // Handle empty text gracefully

        const animateTyping = async () => {
            for (let i = 0; i < chars.length; i++) {
                await new Promise((resolve) => setTimeout(resolve, speed)); // Delay between characters
                setCurrentText(prevText => prevText + chars[i]); // Correct way to append
            }
        };

        animateTyping();
    }, [text, speed]); // Re-run effect on text or speed change

    const interpolatedProgress = sentenceRef.interpolate({
        inputRange: [0, 1],
        outputRange: ["0%", "100%"], // Animate text visibility based on progress
    });

    return (
        <Animated.Text style={{ width: interpolatedProgress }}>
            {currentText}
        </Animated.Text>
    );
}
