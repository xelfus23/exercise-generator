import React, { useState, useEffect, useRef, useCallback } from "react";

import {
    View,
    Text,
    ScrollView,
    Alert,
    TextInput,
    TouchableOpacity,
} from "react-native";
import {
    heightPercentageToDP as HP,
    widthPercentageToDP as WP,
} from "react-native-responsive-screen";
import { MyColors } from "@/constants/myColors";
import NextButtons from "./next";

const MeasurementInput = ({ value, unit, onChangeText, name, isLastItem }) => {
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

const UnitSelector = ({ unit, onUnitChange }) => (
    <View style={{ width: WP(100) }}>
        <View
            style={{
                padding: HP(1),
                flexDirection: "row",
                alignItems: "center",
                gap: HP(1),
                marginHorizontal: WP(5),
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
                        width: WP(20),
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
    </View>
);

export default function BodyFatPercentageScreen({
    selectedBodyMeasurements,
    setSelectedBodyMeasurements,
    selectedGender,
    next,
}) {
    const [unit, setUnit] = useState("CM");
    const [isContinue, setIsContinue] = useState(false);
    const SVRef = useRef(null);
    const [currentMeasurementIndex, setCurrentMeasurementIndex] = useState(0);

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
        if (newUnit !== unit) {
            setSelectedBodyMeasurements((prevMeasurements) => {
                const updatedMeasurements = {
                    ...prevMeasurements,
                    unit: newUnit,
                };
                circumferences.forEach(({ name }) => {
                    const lowerName = name.toLowerCase();
                    if (updatedMeasurements[lowerName]) {
                        updatedMeasurements[lowerName] = convertMeasurement(
                            updatedMeasurements[lowerName],
                            unit,
                            newUnit
                        );
                    }
                });
                return updatedMeasurements;
            });
            setUnit(newUnit);
        }
    };

    const handleBackPress = () => {
        if (!isContinue) {
            next(-1);
        } else if (currentMeasurementIndex > 0) {
            setCurrentMeasurementIndex(currentMeasurementIndex - 1);
            SVRef.current?.scrollTo({
                x: WP(100) * (currentMeasurementIndex - 1),
                animated: true,
            });
        } else {
            setIsContinue(false);
        }
    };

    const handleContinuePress = () => {
        setIsContinue(true);
    };

    const validateInput = useCallback((value) => {
        if (!value) {
            Alert.alert("Error", "Please enter your measurement.");
            return false;
        }

        if (/\s/.test(value)) {
            Alert.alert("Error", "Measurement should not contain spaces.");
            return false;
        }

        if (/[^0-9.]/.test(value)) {
            Alert.alert(
                "Error",
                "Please enter a valid measurement without special characters."
            );
            return false;
        }

        if (!/^\d+(\.\d+)?$/.test(value)) {
            Alert.alert("Error", "Please enter a numeric measurement.");
            return false;
        }

        if (Math.round(parseFloat(value)) === 0) {
            Alert.alert("Error", "Measurement cannot be zero.");
            return false;
        }
        return true;
    }, []);

    const handleNextPress = () => {
        if (!isContinue) {
            next(1);
        } else if (currentMeasurementIndex < circumferences.length - 1) {
            const currentMeasurement = circumferences[currentMeasurementIndex];
            const measurementValue =
                selectedBodyMeasurements[currentMeasurement.name.toLowerCase()];
            if (!validateInput(measurementValue)) {
                return;
            }
            setCurrentMeasurementIndex(currentMeasurementIndex + 1);
            SVRef.current.scrollTo({
                x: WP(100) * (currentMeasurementIndex + 1),
                animated: true,
            });
        } else {
            const currentMeasurement = circumferences[currentMeasurementIndex];
            const measurementValue =
                selectedBodyMeasurements[currentMeasurement.name.toLowerCase()];
            if (!validateInput(measurementValue)) {
                return;
            }
            next(1);
        }
    };

    useEffect(() => {
        if (isContinue) {
            handleUnitChange("CM");
        }
    }, [isContinue]);

    return (
        <View style={{}}>
            <Text
                style={{
                    color: MyColors(1).white,
                    fontWeight: "bold",
                    fontSize: HP(2.5),
                    padding: WP(5),
                }}
            >
                Let's get your body circumferences measurements
            </Text>
            {isContinue && (
                <UnitSelector unit={unit} onUnitChange={handleUnitChange} />
            )}
            {!isContinue ? (
                <View style={{ padding: WP(5), gap: HP(2) }}>
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

                        <View style={{ gap: HP(1), flexDirection: "row" }}>
                            <Text
                                style={{
                                    color: MyColors(1).white,
                                    fontSize: HP(2),
                                    fontWeight: "bold",
                                }}
                            >
                                •
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
                                </Text>
                                (usually made of cloth or plastic)
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
                            Body Position:
                        </Text>

                        <View style={{ gap: HP(1), flexDirection: "row" }}>
                            <Text
                                style={{
                                    color: MyColors(1).white,
                                    fontSize: HP(2),
                                    fontWeight: "bold",
                                }}
                            >
                                •
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

                        <View style={{ gap: HP(1), flexDirection: "row" }}>
                            <Text
                                style={{
                                    color: MyColors(1).white,
                                    fontSize: HP(2),
                                    fontWeight: "bold",
                                }}
                            >
                                •
                            </Text>
                            <Text
                                style={{
                                    color: MyColors(0.8).white,
                                    fontSize: HP(2),
                                }}
                            >
                                Measure each area three times, and use the
                                average of the readings for the most accurate
                                results.
                            </Text>
                        </View>
                    </View>
                </View>
            ) : (
                <ScrollView
                    horizontal
                    contentContainerStyle={{}}
                    style={{ width: WP(100) }}
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
                            }}
                        >
                            <View
                                style={{
                                    alignItems: "center",
                                    flexDirection: "row",
                                    gap: HP(2),
                                }}
                            >
                                <Text
                                    style={{
                                        color: MyColors(1).white,
                                        fontWeight: "bold",
                                        fontSize: HP(2.5),
                                    }}
                                >
                                    {i + 1}. {v.name}
                                </Text>
                                <MeasurementInput
                                    value={
                                        selectedBodyMeasurements[
                                            v.name.toLowerCase()
                                        ] || ""
                                    }
                                    unit={unit}
                                    onChangeText={(text) => {
                                        setSelectedBodyMeasurements({
                                            ...selectedBodyMeasurements,
                                            [v.name.toLowerCase()]: text,
                                        });
                                    }}
                                    name={v.name}
                                />
                            </View>

                            <MeasurementInstructions
                                instructions={v.instructions}
                            />

                            <View
                                style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <NextButtons
                                    next={handleNextPress}
                                    back={handleBackPress}
                                    skipIndex={true}
                                    isContinue={isContinue}
                                />
                            </View>
                        </View>
                    ))}
                </ScrollView>
            )}
            {!isContinue && (
                <View
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <NextButtons
                        next={handleContinuePress}
                        back={handleBackPress}
                        skip={true}
                    />
                </View>
            )}
            {!isContinue && (
                <View
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <NextButtons
                        next={handleNextPress}
                        back={handleBackPress}
                        skipIndex={true}
                        isContinue={isContinue}
                    />
                </View>
            )}
        </View>
    );
}
