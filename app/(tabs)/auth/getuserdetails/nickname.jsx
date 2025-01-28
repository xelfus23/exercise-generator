import { MyColors } from "@/constants/myColors";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Animated,
} from "react-native";
import {
    widthPercentageToDP as WP,
    heightPercentageToDP as HP,
} from "react-native-responsive-screen";
import { useRef, useState, useEffect } from "react";
import { useAuth } from "@/components/auth/authProvider";
import LottieView from "lottie-react-native";

export default function Nickname({
    setNickName,
    nickName,
    scrollY,
    setIndex,
    scrollOffset,
}) {
    const { user } = useAuth();
    const [error, setError] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false); // Renamed for clarity

    const handleNext = async () => {
        if (!nickName || nickName.trim().length === 0) {
            setError("Please enter your nickname");
            setTimeout(() => setError(null), 5000);
            return; // Stop further execution if there's an error
        } else if (nickName.trim().length < 3) {
            setError("Please enter a valid nickname");
            setTimeout(() => setError(null), 5000);
            return; // Stop further execution if there's an error
        } else {
            setError(null);
            setIsSubmitted(true);
            setIndex(1);
        }
    };

    const AnimatedTouchableOpacity =
        Animated.createAnimatedComponent(TouchableOpacity);

    const welcomeOpacity = useRef(new Animated.Value(0)).current;
    const questionOpacity = useRef(new Animated.Value(0)).current;
    const textInputOpacity = useRef(new Animated.Value(0)).current;
    const buttonOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const animations = [
            Animated.timing(welcomeOpacity, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(questionOpacity, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(textInputOpacity, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(buttonOpacity, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
        ];

        animations.reduce(
            (p, anim) => p.then(() => anim.start()),
            Promise.resolve()
        );

        return () => {
            animations.forEach((anim) => anim.stop()); // Cancel animations
        };
    }, []);

    const moveScroll = scrollY.interpolate({
        inputRange: [0, 2000],
        outputRange: [0, 1000], // Adjust as needed
        extrapolate: "clamp",
    });

    const scrollIconOpacity = scrollY.interpolate({
        inputRange: [0, 900],
        outputRange: [1, 0], // Start at 0 and fade out
        extrapolate: "clamp",
    });

    const fadeOutOpacity = scrollY.interpolate({
        inputRange: [0, 400],
        outputRange: [1, 0],
        extrapolate: "clamp",
    });

    return (
        <View
            style={{
                alignItems: "center",
                justifyContent: "center",
                padding: WP(5),
                gap: HP(3),
                height: HP(100),
            }}
        >
            <Animated.View
                style={{
                    width: WP(80),
                    justifyContent: "center",
                    alignItems: "center",
                    opacity: fadeOutOpacity,
                }}
            >
                <Animated.Text
                    style={{
                        color: MyColors(0.8).white,
                        fontSize: HP(3),
                        textAlign: "center",
                        width: WP(90),
                        opacity: welcomeOpacity,
                    }}
                >
                    Welcome{" "}
                    <Text
                        style={{
                            color: MyColors(1).green,
                            fontWeight: "bold",
                            textShadowRadius: HP(2),
                            textShadowColor: MyColors(1).green,
                        }}
                    >{`${user?.firstName} ${user?.lastName}`}</Text>
                </Animated.Text>

                {!isSubmitted && (
                    <Animated.Text
                        style={{
                            color: MyColors(0.8).white,
                            fontSize: HP(2),
                            textAlign: "center",
                            width: WP(90),
                            opacity: questionOpacity,
                        }}
                    >
                        What nickname would you prefer we use?
                    </Animated.Text>
                )}

                <Animated.View style={{ opacity: textInputOpacity, marginTop: HP(5) }}>
                    {!isSubmitted && (
                        <View
                            style={{
                                flexDirection: "row",
                                backgroundColor: "#272727",

                                borderRadius: WP(4),
                                marginTop: HP(2),
                                alignItems: "center",
                                justifyContent: "space-between",
                                width: WP(80),
                                borderWidth: isSubmitted ? 1 : 0,
                                borderColor: isSubmitted && MyColors(1).green,
                            }}
                        >
                            <TextInput
                                style={{
                                    padding: WP(4),
                                    fontSize: HP(2),
                                    color: MyColors(1).white,
                                    width: "85%",
                                }}
                                value={nickName}
                                onChangeText={(value) => setNickName(value)}
                                maxLength={14}
                                placeholder="Enter your nickname"
                                placeholderTextColor={MyColors(0.2).white}
                                editable={!isSubmitted}
                            />
                            <Text
                                style={{
                                    color: MyColors(0.8).white,
                                    width: "15%",
                                    fontSize: HP(1.5),
                                }}
                            >
                                {`${nickName?.split("").length || 0}`} / 14
                            </Text>
                        </View>
                    )}
                </Animated.View>
            </Animated.View>
            {error && <Text style={{ color: MyColors(1).red }}>{error}</Text>}

            {isSubmitted && (
                <Animated.Text
                    style={{
                        color: MyColors(0.8).white,
                        opacity: fadeOutOpacity,
                        fontSize: HP(2),
                    }}
                >
                    Scroll Down
                </Animated.Text>
            )}

            <Animated.View
                style={{
                    opacity: fadeOutOpacity,
                    width: WP(100),
                    alignItems: "center",
                }}
            >
                {!isSubmitted ? (
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
                            opacity: buttonOpacity,
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
