import { View, Text, ScrollView, Alert, TextInput } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { heightPercentageToDP as HP, widthPercentageToDP as WP } from "react-native-responsive-screen";
import { MyColors } from "@/constants/myColors";
import NextButtons from './next'

export default function BodyFatPercentageScreen({
    selectedBodyMeasurements,
    setSelectedBodyMeasurements,
    selectedGender,
    selectedHeightAndWeight,
    next,
}) {
    const circumferences =
        selectedGender === "Male"
            ? [
                {
                    name: "Waist",
                    value: selectedBodyMeasurements.waist,
                    setter: setSelectedBodyMeasurements,
                    instructions: [
                        "First, let's measure your waist.",
                        "Measure around the narrowest part of your waist, typically just above the belly button.",
                        "Relax your abdomen and breathe out naturally while measuring to avoid tensing the muscles.",
                        "Keep the tape measure parallel to the floor",
                    ],
                },
                {
                    name: "Neck",
                    value: selectedBodyMeasurements.neck,
                    setter: setSelectedBodyMeasurements,
                    instructions: [
                        "And last, let's measure your neck.",
                        `Wrap the tape around the neck, just below your Adam’s apple.`,
                        "Keep the tape level and snug, but avoid compressing the skin.",
                        "Stand straight and look forward during this measurement.",
                    ],
                },
            ]
            : selectedGender === "Female"
                ? [
                    {
                        name: "Waist",
                        value: selectedBodyMeasurements.waist,
                        setter: setSelectedBodyMeasurements.waist,
                        instructions: [
                            "First, let's measure your waist.",
                            "Measure around the narrowest part of your waist, typically just above the belly button.",
                            "Relax your abdomen and breathe out naturally while measuring to avoid tensing the muscles.",
                            "Keep the tape measure parallel to the floor",
                        ],
                    },
                    {
                        name: "Hip",
                        value: selectedBodyMeasurements.hip,
                        setter: setSelectedBodyMeasurements.hip,
                        instructions: [
                            "Second, let's measure your hip.",
                            "Stand with your feet together and measure around the widest part of your hips and buttocks.",
                            "Ensure the tape is snug but not too tight, and it should remain parallel to the floor.",
                            "This measurement is usually taken at the fullest part of the hips.",
                        ],
                    },
                    {
                        name: "Neck",
                        value: selectedBodyMeasurements.neck,
                        setter: setSelectedBodyMeasurements.neck,
                        instructions: [
                            "And last, let's measure your neck.",
                            "Wrap the tape around the neck, just at the base of your neck.",
                            "Keep the tape level and snug, but avoid compressing the skin.",
                            "Stand straight and look forward during this measurement.",
                        ],
                    },
                ]
                : [
                    {
                        name: "Waist",
                        value: selectedBodyMeasurements.waist,
                        setter: setSelectedBodyMeasurements.waist,
                        instructions: [
                            "First, let's measure your waist.",
                            "Measure around the narrowest part of your waist, typically just above the belly button.",
                            "Relax your abdomen and breathe out naturally while measuring to avoid tensing the muscles.",
                            "Keep the tape measure parallel to the floor",
                        ],
                    },
                    {
                        name: "Hip",
                        value: selectedBodyMeasurements.hip,
                        setter: setSelectedBodyMeasurements.hip,
                        instructions: [
                            "And now, let's measure your hip.",
                            "Stand with your feet together and measure around the widest part of your hips and buttocks.",
                            "Ensure the tape is snug but not too tight, and it should remain parallel to the floor.",
                            "This measurement is usually taken at the fullest part of the hips.",
                        ],
                    },
                    {
                        name: "Neck",
                        value: selectedBodyMeasurements.neck,
                        setter: setSelectedBodyMeasurements.neck,
                        instructions: [
                            "And last, let's measure your neck.",
                            "Wrap the tape around the neck, just below the Adam’s apple for men and at the base of the neck for women.",
                            "Keep the tape level and snug, but avoid compressing the skin.",
                            "Stand straight and look forward during this measurement.",
                        ],
                    },
                ];

    // const calculateBodyFatPercentage = (
    //     selectedBodyMeasurements,
    //     gender,
    //     HW,
    //     unit
    // ) => {

    //     let waist = selectedBodyMeasurements.waist;
    //     let neck = selectedBodyMeasurements.neck;
    //     let hip = selectedBodyMeasurements.hip
    //     let height = HW.height

    //     const CM_TO_INCH = 0.393701;

    //     console.log(`Gender: ${gender}, height ${height.height}, Waist: ${waist}, Neck: ${neck} Hip: ${hip}`);
    //     console.log(selectedBodyMeasurements)

    //     if (gender === "Male" && waist <= neck) {
    //         console.log(
    //             "Waist must be larger than neck for a valid calculation."
    //         );
    //         return null; // Prevent the calculation if the waist is not larger than the neck.
    //     }

    //     if (gender === "Female" && waist + hip <= neck) {
    //         console.log(
    //             "Combined waist and hip must be larger than neck for a valid calculation."
    //         );
    //         return null; // Prevent the calculation if waist + hip is not larger than neck.
    //     }

    //     if (unit === "CM") {
    //         waist *= CM_TO_INCH;
    //         neck *= CM_TO_INCH;
    //         hip *= CM_TO_INCH;
    //     }

    //     height *= CM_TO_INCH;

    //     console.log(
    //         `Converted waist: ${waist}, neck: ${neck}, height: ${height}`
    //     );

    //     if (gender === "Male") {
    //         const bodyFat = (
    //             86.01 * Math.log10(waist - neck) -
    //             70.041 * Math.log10(height) +
    //             36.76
    //         ).toFixed(2);
    //         console.log(`Body Fat Percentage (Male): ${bodyFat} %`);
    //         return bodyFat;
    //     } else if (gender === "Female") {
    //         const bodyFat = (
    //             163.205 * Math.log10(waist + hip - neck) -
    //             97.684 * Math.log10(height) -
    //             78.387
    //         ).toFixed(2);
    //         console.log(`Body Fat Percentage (Female): ${bodyFat} %`);
    //         return bodyFat;
    //     } else {
    //         throw new Error("Invalid gender");
    //     }
    // };

    const toInches = (cm) => (cm / 2.54).toFixed(2);
    const toCm = (inches) => (inches * 2.54).toFixed(2);

    const handleUnitChange = (newUnit) => {
        if (newUnit !== unit) {
            // Ensure all measurements are converted before updating the unit
            setSelectedBodyMeasurements({
                waist:
                    unit === "CM"
                        ? toInches(selectedBodyMeasurements.waist)
                        : toCm(selectedBodyMeasurements.waist),
                hip:
                    unit === "CM"
                        ? toInches(selectedBodyMeasurements.hip)
                        : toCm(selectedBodyMeasurements.hip),
                neck:
                    unit === "CM"
                        ? toInches(selectedBodyMeasurements.neck)
                        : toCm(selectedBodyMeasurements.neck),
                unit: newUnit,
            });
            setUnit(newUnit);
        }
    };

    const [isContinue, setIsContinue] = useState(false);
    const SVRef = useRef(0);
    const [i, setI] = useState(0);

    const backButton = (value, index) => {
        if (!isContinue || index === 0) {
            if (isContinue) {
                setIsContinue(false);
            } else {
                next(-1);
            }
        } else if (index > 0) {
            SVRef.current.scrollTo({
                x: WP(100) * (index - 1),
                animated: true,
            });
        } else if (index === 0) {
            setIsContinue(false);
        }
    };

    const continueButton = () => {
        setIsContinue(true);
    };

    const nextButton = (value, index) => {
        if (!isContinue) {
            next(1);
        } else if (index < circumferences.length - 1) {
            if (!value.value) {
                Alert.alert("Error", "Please enter your measurement.");
                return;
            }

            if (/\s/.test(value.value)) {
                Alert.alert("Error", "Measurement should not contain spaces.");
                return;
            }

            if (/[^0-9.]/.test(value.value)) {
                Alert.alert(
                    "Error",
                    "Please enter a valid measurement without special characters."
                );
                return;
            }

            if (!/^\d+(\.\d+)?$/.test(value.value)) {
                Alert.alert("Error", "Please enter a numeric measurement.");
                return;
            }

            if (Math.round(value.value) === 0) {
                Alert.alert("Error", "Measurement cannot be zero.");
                return;
            }
            SVRef.current.scrollTo({
                x: WP(100) * (index + 1),
                animated: true,
            });
        } else {
            next(1); // Proceed to the next screen
        }
    };

    useEffect(() => {
        handleUnitChange("CM");
    }, [isContinue]);

    const [unit, setUnit] = useState("IN");

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
                        <Text
                            style={{
                                color:
                                    unit === "CM"
                                        ? MyColors(1).white
                                        : MyColors(0.8).white,
                                fontWeight: unit === "CM" ? "bold" : "normal",
                                width: WP(20),
                            }}
                            onPress={() => handleUnitChange("CM")}
                        >
                            Centimeters
                        </Text>
                        <Text
                            style={{ color: MyColors(1).white }}
                            onPress={() => handleUnitChange("CM")}
                        >
                            /
                        </Text>
                        <Text
                            style={{
                                color:
                                    unit === "IN"
                                        ? MyColors(1).white
                                        : MyColors(0.8).white,
                                fontWeight: unit === "IN" ? "bold" : "normal",
                                width: WP(20),
                            }}
                            onPress={() => handleUnitChange("IN")}
                        >
                            Inches
                        </Text>
                    </View>
                </View>
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
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
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
                                        value={v.value}
                                        onChangeText={(text) =>
                                            v.setter({
                                                ...selectedBodyMeasurements,
                                                [v.name.toLowerCase()]: text,
                                            })
                                        }
                                        inputMode="numeric"
                                        placeholderTextColor={
                                            MyColors(0.6).white
                                        }
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
                            </View>

                            <View style={{ gap: HP(2) }}>
                                {v.instructions.map((ins, inv) => (
                                    <View
                                        key={inv}
                                        style={{ flexDirection: "row" }}
                                    >
                                        <Text
                                            style={{ color: MyColors(1).white }}
                                        >
                                            •{" "}
                                        </Text>

                                        <Text
                                            style={{ color: MyColors(1).white }}
                                        >
                                            {ins}
                                        </Text>
                                    </View>
                                ))}
                            </View>

                            <View
                                style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <NextButtons
                                    next={() => nextButton(v, i)}
                                    back={() => backButton(v, i)}
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
                    style={{ justifyContent: "center", alignItems: "center" }}
                >
                    <NextButtons
                        next={continueButton}
                        back={backButton}
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
                        next={() => nextButton(i)}
                        back={() => backButton(i)}
                        skipIndex={true}
                        isContinue={isContinue}
                    />
                </View>
            )}
        </View>
    );
};