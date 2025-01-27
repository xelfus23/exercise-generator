import React, { useState, useEffect, useRef, useCallback } from "react";
import {
    View,
    Text,
    ScrollView,
    Alert,
    TextInput,
    TouchableOpacity,
    Animated,
} from "react-native";
import {
    heightPercentageToDP as HP,
    widthPercentageToDP as WP,
} from "react-native-responsive-screen";
import { MyColors } from "@/constants/myColors";
import LottieView from "lottie-react-native";

const MeasurementInput = ({ value, unit, onChangeText, name }) => {
    return (
        <View
            style={{
                alignItems: "center",
                flexDirection: "row",
                gap: HP(2),
                borderRadius: WP(4),
                borderWidth: 1,
                borderColor: MyColors(1).gray,
                padding: HP(1),
                paddingHorizontal: HP(2),
                justifyContent: "space-around",
            }}
        >
            <TextInput
                placeholder="Enter your measurement"
                style={{
                    color: MyColors(1).white,
                }}
                value={value}
                onChangeText={onChangeText}
                inputMode="numeric"
                placeholderTextColor={MyColors(0.6).white}
            />
            <Text
                style={{
                    color: MyColors(1).white,
                    fontSize: HP(2),
                    fontWeight: "bold",
                }}
            >
                {unit}
            </Text>
        </View>
    );
};

const MeasurementInstructions = ({ instructions }) => {
    return (
        <View style={{ gap: HP(2) }}>
            {instructions.map((ins, inv) => (
                <View key={inv} style={{ flexDirection: "row" }}>
                    <Text style={{ color: MyColors(1).white }}>• </Text>
                    <Text style={{ color: MyColors(1).white }}>{ins}</Text>
                </View>
            ))}
        </View>
    );
};

const UnitSelector = ({ unit, onUnitChange, fadeAnim }) => (
    <Animated.View style={{ width: WP(100), opacity: fadeAnim }}>
        <View
            style={{
                flexDirection: "row",
                alignItems: "center",
                gap: HP(1),
                marginHorizontal: WP(5),
                marginTop: HP(4),
            }}
        >
            <TouchableOpacity onPress={() => onUnitChange("CM")}>
                <Text
                    style={{
                        color:
                            unit === "CM"
                                ? MyColors(1).white
                                : MyColors(0.8).white,
                        fontWeight: unit === "CM" ? "bold" : "normal",
                    }}
                >
                    Centimeters
                </Text>
            </TouchableOpacity>

            <Text style={{ color: MyColors(1).white }}>/</Text>

            <TouchableOpacity onPress={() => onUnitChange("IN")}>
                <Text
                    style={{
                        color:
                            unit === "IN"
                                ? MyColors(1).white
                                : MyColors(0.8).white,
                        fontWeight: unit === "IN" ? "bold" : "normal",
                        width: WP(20),
                    }}
                >
                    Inches
                </Text>
            </TouchableOpacity>
        </View>
    </Animated.View>
);

export default function BodyFatPercentageScreen({
    selectedBodyMeasurements,
    setSelectedBodyMeasurements,
    selectedGender,
    setIndex,
    scrollY,
}) {
    const [unit, setUnit] = useState("CM");
    const [isContinue, setIsContinue] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState(null);
    const SVRef = useRef(null);
    const [currentMeasurementIndex, setCurrentMeasurementIndex] = useState(0);
    const fadeAnim = useRef(new Animated.Value(1)).current;

    const measurementConfig = {
        Male: [
            {
                name: "Waist",
                instructions: [
                    "First, let's measure your waist.",
                    "Measure around the narrowest part of your waist, typically just above the belly button.",
                    "Relax your abdomen and breathe out naturally while measuring to avoid tensing the muscles.",
                    "Keep the tape measure parallel to the floor",
                ],
            },
            {
                name: "Neck",
                instructions: [
                    "And last, let's measure your neck.",
                    `Wrap the tape around the neck, just below your Adam’s apple.`,
                    "Keep the tape level and snug, but avoid compressing the skin.",
                    "Stand straight and look forward during this measurement.",
                ],
            },
        ],
        Female: [
            {
                name: "Waist",
                instructions: [
                    "First, let's measure your waist.",
                    "Measure around the narrowest part of your waist, typically just above the belly button.",
                    "Relax your abdomen and breathe out naturally while measuring to avoid tensing the muscles.",
                    "Keep the tape measure parallel to the floor",
                ],
            },
            {
                name: "Hip",
                instructions: [
                    "Second, let's measure your hip.",
                    "Stand with your feet together and measure around the widest part of your hips and buttocks.",
                    "Ensure the tape is snug but not too tight, and it should remain parallel to the floor.",
                    "This measurement is usually taken at the fullest part of the hips.",
                ],
            },
            {
                name: "Neck",
                instructions: [
                    "And last, let's measure your neck.",
                    "Wrap the tape around the neck, just at the base of your neck.",
                    "Keep the tape level and snug, but avoid compressing the skin.",
                    "Stand straight and look forward during this measurement.",
                ],
            },
        ],
    };

    const circumferences = measurementConfig[selectedGender] || [
        {
            name: "Waist",
            instructions: [
                "First, let's measure your waist.",
                "Measure around the narrowest part of your waist, typically just above the belly button.",
                "Relax your abdomen and breathe out naturally while measuring to avoid tensing the muscles.",
                "Keep the tape measure parallel to the floor",
            ],
        },
        {
            name: "Hip",
            instructions: [
                "And now, let's measure your hip.",
                "Stand with your feet together and measure around the widest part of your hips and buttocks.",
                "Ensure the tape is snug but not too tight, and it should remain parallel to the floor.",
                "This measurement is usually taken at the fullest part of the hips.",
            ],
        },
        {
            name: "Neck",
            instructions: [
                "And last, let's measure your neck.",
                "Wrap the tape around the neck, just below the Adam’s apple for men and at the base of the neck for women.",
                "Keep the tape level and snug, but avoid compressing the skin.",
                "Stand straight and look forward during this measurement.",
            ],
        },
    ];

    // Create individual state variables for each measurement
    const [waist, setWaist] = useState("");
    const [hip, setHip] = useState("");
    const [neck, setNeck] = useState("");

    //Create individual state variables for each unit of measurement
    const [waistUnit, setWaistUnit] = useState("CM");
    const [hipUnit, setHipUnit] = useState("CM");
    const [neckUnit, setNeckUnit] = useState("CM");

    const convertMeasurement = (value, fromUnit, toUnit) => {
        const CM_TO_INCH = 0.393701;
        if (!value) return "";

        const numericValue = parseFloat(value);
        if (isNaN(numericValue)) return "";

        if (fromUnit === toUnit) return value;

        if (fromUnit === "CM" && toUnit === "IN") {
            return (numericValue * CM_TO_INCH).toFixed(2);
        } else if (fromUnit === "IN" && toUnit === "CM") {
            return (numericValue / CM_TO_INCH).toFixed(2);
        }

        return value;
    };
    const handleUnitChange = (newUnit) => {
        setUnit(newUnit);
        if (currentMeasurementIndex === 0) {
            setWaistUnit(newUnit);
            setWaist(convertMeasurement(waist, unit, newUnit));
        } else if (currentMeasurementIndex === 1) {
            setHipUnit(newUnit);
            setHip(convertMeasurement(hip, unit, newUnit));
        } else if (currentMeasurementIndex === 2) {
            setNeckUnit(newUnit);
            setNeck(convertMeasurement(neck, unit, newUnit));
        }
    };
    const handleBackPress = () => {
        if (!isContinue) {
            return;
        } else if (currentMeasurementIndex > 0) {
            setCurrentMeasurementIndex(currentMeasurementIndex - 1);
        } else {
            setIsContinue(false);
        }
    };

    const validateInput = useCallback((value) => {
        if (!value) {
            setError("Please enter your measurement.");
            return false;
        }

        if (/\s/.test(value)) {
            setError("Measurement should not contain spaces.");
            return false;
        }

        if (/[^0-9.]/.test(value)) {
            setError(
                "Please enter a valid measurement without special characters."
            );
            return false;
        }

        if (!/^\d+(\.\d+)?$/.test(value)) {
            setError("Please enter a numeric measurement.");
            return false;
        }

        if (Math.round(parseFloat(value)) === 0) {
            setError("Measurement cannot be zero.");
            return false;
        }
        return true;
    }, []);

    const moveScroll = scrollY.interpolate({
        inputRange: [3200, 5000],
        outputRange: [0, 1000],
        extrapolate: "clamp",
    });

    const scrollIconOpacity = scrollY.interpolate({
        inputRange: [3500, 3800],
        outputRange: [1, 0], // Start at 0 and fade out
        extrapolate: "clamp",
    });

    const fadeOutOpacity = scrollY.interpolate({
        inputRange: [3700, 4000],
        outputRange: [1, 0],
        extrapolate: "clamp",
    });

    const handleNextPress = () => {
        let measurementValue = "";
        if (currentMeasurementIndex === 0) {
            measurementValue = waist;
        }
        if (currentMeasurementIndex === 1) {
            measurementValue = hip;
        }
        if (currentMeasurementIndex === 2) {
            measurementValue = neck;
        }
        if (!isContinue) {
            return;
        } else if (currentMeasurementIndex < circumferences.length - 1) {
            if (!validateInput(measurementValue)) {
                setTimeout(() => {
                    setError(null);
                }, [3000]);
                return;
            }
            setCurrentMeasurementIndex((prev) => prev + 1);
        } else {
            if (!validateInput(measurementValue)) {
                setTimeout(() => {
                    setError(null);
                }, [3000]);
                return;
            }
            return;
        }
    };

    const runFadeAnimation = () => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
        }).start(() => {
            setIsSubmitted(true);
            setIndex(5);
        });
    };

    const handleSubmit = () => {
        const measurements = {
            waist,
            hip,
            neck,
            unit: waistUnit,
        };

        if (
            selectedGender === "Male"
                ? !measurements.waist || !measurements.neck
                : !measurements.waist || !measurements.hip || !measurements.neck
        ) {
            setError("Please fill all the input fields");
        } else {
            setSelectedBodyMeasurements(measurements);
            runFadeAnimation();
        }
    };

    const handleSkip = () => {
        runFadeAnimation();
    };

    useEffect(() => {
        if (isContinue) {
            handleUnitChange("CM");
        }
    }, [isContinue]);

    useEffect(() => {
        if (SVRef.current) {
            SVRef.current.scrollTo({
                x: WP(100) * currentMeasurementIndex,
                animated: true,
            });
        }
    }, [currentMeasurementIndex]);

    return (
        <View
            style={{
                height: HP(100),
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            {!isSubmitted && selectedBodyMeasurements.neck === 0 ? (
                <>
                    <Text
                        style={{
                            color: MyColors(1).white,
                            fontSize: HP(2),
                            textAlign: "center",
                            width: WP(80),
                        }}
                    >
                        Let's get your{" "}
                        <Text
                            style={{
                                color: MyColors(1).green,
                                textShadowColor: MyColors(1).green,
                                textShadowRadius: HP(1),
                            }}
                        >
                            body circumferences
                        </Text>{" "}
                        measurements
                    </Text>
                    {isContinue && (
                        <UnitSelector
                            unit={unit}
                            onUnitChange={handleUnitChange}
                            fadeAnim={fadeAnim}
                        />
                    )}
                    {!isContinue ? (
                        <Animated.View
                            style={{
                                width: WP(80),
                                gap: HP(2),
                                marginVertical: HP(5),
                                opacity: fadeAnim,
                            }}
                        >
                            <View>
                                <Text
                                    style={{
                                        color: MyColors(1).white,
                                        fontSize: HP(2),
                                        fontWeight: "bold",
                                    }}
                                >
                                    Tools:
                                </Text>

                                <View
                                    style={{ gap: HP(1), flexDirection: "row" }}
                                >
                                    <Text
                                        style={{
                                            color: MyColors(1).white,
                                            fontSize: HP(2),
                                            fontWeight: "bold",
                                        }}
                                    >
                                        –
                                    </Text>
                                    <Text
                                        style={{
                                            color: MyColors(0.8).white,
                                            fontSize: HP(2),
                                        }}
                                    >
                                        Use a flexible, non-stretchable{" "}
                                        <Text
                                            style={{
                                                fontWeight: "bold",
                                                color: MyColors(1).white,
                                            }}
                                        >
                                            Tape Measure.
                                        </Text>{" "}
                                        (usually made of cloth or plastic)
                                    </Text>
                                </View>
                            </View>

                            <View style={{}}>
                                <Text
                                    style={{
                                        color: MyColors(1).white,
                                        fontSize: HP(2),
                                        fontWeight: "bold",
                                    }}
                                >
                                    Body Position:
                                </Text>

                                <View
                                    style={{ gap: HP(1), flexDirection: "row" }}
                                >
                                    <Text
                                        style={{
                                            color: MyColors(1).white,
                                            fontSize: HP(2),
                                            fontWeight: "bold",
                                        }}
                                    >
                                        –
                                    </Text>
                                    <Text
                                        style={{
                                            color: MyColors(0.8).white,
                                            fontSize: HP(2),
                                        }}
                                    >
                                        Perform these measurements in{" "}
                                        <Text
                                            style={{
                                                fontWeight: "bold",
                                                color: MyColors(1).white,
                                            }}
                                        >
                                            standing
                                        </Text>
                                        ,{" "}
                                        <Text
                                            style={{
                                                fontWeight: "bold",
                                                color: MyColors(1).white,
                                            }}
                                        >
                                            relaxed{" "}
                                        </Text>
                                        position.
                                    </Text>
                                </View>
                            </View>

                            <View>
                                <Text
                                    style={{
                                        color: MyColors(1).white,
                                        fontSize: HP(2),
                                        fontWeight: "bold",
                                    }}
                                >
                                    Consistency:
                                </Text>

                                <View
                                    style={{ gap: HP(1), flexDirection: "row" }}
                                >
                                    <Text
                                        style={{
                                            color: MyColors(1).white,
                                            fontSize: HP(2),
                                            fontWeight: "bold",
                                        }}
                                    >
                                        –
                                    </Text>
                                    <Text
                                        style={{
                                            color: MyColors(0.8).white,
                                            fontSize: HP(2),
                                        }}
                                    >
                                        Measure each area three times, and use
                                        the average of the readings for the most
                                        accurate results.
                                    </Text>
                                </View>
                            </View>
                        </Animated.View>
                    ) : (
                        <Animated.View
                            style={{ opacity: fadeAnim, height: HP(50) }}
                        >
                            <ScrollView
                                horizontal
                                style={{ width: WP(100) }}
                                contentContainerStyle={{
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                                snapToInterval={WP(100)}
                                ref={SVRef}
                                scrollEnabled={false}
                                showsHorizontalScrollIndicator={false}
                            >
                                {circumferences.map((v, i) => (
                                    <View
                                        key={i}
                                        style={{
                                            width: WP(100),
                                            padding: WP(5),
                                            gap: HP(2),
                                            alignItems: "center",
                                            borderWidth: 1,
                                        }}
                                    >
                                        <View
                                            style={{
                                                alignItems: "center",
                                                flexDirection: "row",
                                                gap: HP(2),
                                                width: WP(100),
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: MyColors(1).white,
                                                    fontWeight: "bold",
                                                    fontSize: HP(2.5),
                                                    marginLeft: WP(5),
                                                }}
                                            >
                                                {i + 1}. {v.name}
                                            </Text>

                                            <MeasurementInput
                                                name={v.name}
                                                value={
                                                    selectedGender === "Male"
                                                        ? i === 0
                                                            ? waist
                                                            : neck
                                                        : i === 0
                                                        ? waist
                                                        : i === 1
                                                        ? hip
                                                        : neck
                                                }
                                                unit={
                                                    i === 0
                                                        ? waistUnit
                                                        : i === 1
                                                        ? hipUnit
                                                        : neckUnit
                                                }
                                                onChangeText={(text) => {
                                                    if (v.name === "Waist") {
                                                        setWaist(text);
                                                    } else if (
                                                        v.name === "Hip"
                                                    ) {
                                                        setHip(text);
                                                    } else {
                                                        setNeck(text);
                                                    }
                                                }}
                                            />
                                        </View>

                                        <View
                                            style={{
                                                width: WP(90),
                                                height: 1,
                                                backgroundColor:
                                                    MyColors(1).gray,
                                            }}
                                        />

                                        <MeasurementInstructions
                                            instructions={v.instructions}
                                        />

                                        <View
                                            style={{
                                                width: WP(90),
                                                height: 1,
                                                backgroundColor:
                                                    MyColors(1).gray,
                                            }}
                                        />

                                        <Text
                                            style={{ color: MyColors(1).red }}
                                        >
                                            {error}
                                        </Text>

                                        <View
                                            style={{
                                                justifyContent: "space-between",
                                                flexDirection: "row",
                                                alignItems: "center",
                                                width: WP(80),
                                            }}
                                        >
                                            <TouchableOpacity
                                                onPress={handleBackPress}
                                                style={{
                                                    borderWidth: 1,
                                                    borderColor:
                                                        MyColors(1).yellow,
                                                    borderRadius: WP(4),
                                                    height: HP(6),
                                                    width: WP(35),
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        color: MyColors(1)
                                                            .white,
                                                        fontWeight: "bold",
                                                    }}
                                                >
                                                    Back
                                                </Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={
                                                    i ===
                                                    circumferences.length - 1
                                                        ? handleSubmit
                                                        : handleNextPress
                                                }
                                                style={{
                                                    borderWidth: 1,
                                                    borderColor: error
                                                        ? MyColors(1).red
                                                        : MyColors(1).green,
                                                    borderRadius: WP(4),
                                                    height: HP(6),
                                                    width: WP(35),
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        color: MyColors(1)
                                                            .white,
                                                        fontWeight: "bold",
                                                    }}
                                                >
                                                    {i ===
                                                    circumferences.length - 1
                                                        ? "Submit"
                                                        : "Next"}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ))}
                            </ScrollView>
                        </Animated.View>
                    )}

                    {!isContinue && (
                        <Animated.View style={{ opacity: fadeAnim }}>
                            <TouchableOpacity
                                onPress={() => setIsContinue(true)}
                                style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: WP(4),
                                    width: WP(80),
                                    height: HP(6),
                                    borderWidth: 1,
                                    borderColor: MyColors(1).green,
                                    zIndex: 100,
                                }}
                            >
                                <Text
                                    style={{
                                        color: MyColors(1).white,
                                        textAlign: "center",
                                    }}
                                >
                                    Continue
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleSkip}>
                                <Text
                                    style={{
                                        color: MyColors(0.8).white,
                                        textDecorationLine: "underline",
                                        marginTop: HP(2),
                                        textAlign: "center",
                                    }}
                                >
                                    Skip this
                                </Text>
                            </TouchableOpacity>
                        </Animated.View>
                    )}
                </>
            ) : (
                <>
                    <Animated.Text
                        style={{
                            color: MyColors(0.8).white,
                            fontSize: HP(2),
                            opacity: fadeOutOpacity,
                        }}
                    >
                        Scroll down to continue
                    </Animated.Text>
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
                </>
            )}
        </View>
    );
}
