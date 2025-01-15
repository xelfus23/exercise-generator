import { View, Text, ScrollView, StyleSheet } from "react-native";
import React, { useState } from "react";
import { heightPercentageToDP as HP, widthPercentageToDP as WP } from "react-native-responsive-screen";
import { MyColors } from "@/constants/myColors";
import NextButtons from "./next";

export default function SubmitScreen({
    selectedGender,
    selectedHeightAndWeight,
    selectedBirthDay,
    selectedBirthMonth,
    selectedBirthYear,
    selectedGoal,
    selectedPlaces,
    selectedActivityLevel,
    selectedFitnessLevel,
    selectedBodyMeasurements,
    submit,
    isLoading,
    next,
}) {
    const getMonth = (m) => {
        switch (m) {
            case 0:
                return "January";
            case 1:
                return "February";
            case 2:
                return "March";
            case 3:
                return "April";
            case 4:
                return "May";
            case 5:
                return "June";
            case 6:
                return "July";
            case 7:
                return "August";
            case 8:
                return "September";
            case 9:
                return "October";
            case 10:
                return "November";
            case 11:
                return "December";
            default:
                return "Invalid month";
        }
    };

    const [error, setError] = useState(false);

    const handleSubmit = () => {
        submit(true);
    };

    const backButton = () => {
        next(-1);
    };


    return (
        <ScrollView
            style={{ marginTop: HP(5) }}
            contentContainerStyle={{ alignItems: "center", gap: HP(2) }}
        >
            <View
                style={{
                    borderWidth: 1,
                    borderColor: MyColors(1).gray,
                    borderRadius: WP(4),
                    width: WP(90),
                    padding: WP(4),
                    gap: HP(1),
                }}
            >
                <Text
                    style={{
                        fontSize: HP(2.5),
                        fontWeight: "bold",
                        color: MyColors(1).white,
                    }}
                >
                    Review your information
                </Text>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: HP(1),
                        borderWidth: 1,
                        borderRadius: WP(2),
                        borderColor: MyColors(1).gray,
                        padding: HP(1),
                    }}
                >
                    <Text style={submitStyles.label}>Gender:</Text>
                    <Text style={submitStyles.value}>{selectedGender}</Text>
                </View>
                <View
                    style={{
                        borderWidth: 1,
                        borderColor: MyColors(1).gray,
                        padding: HP(1),
                        gap: HP(1),
                        borderRadius: WP(2),
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: HP(1),
                        }}
                    >
                        <Text style={submitStyles.label}>Height:</Text>
                        <Text style={submitStyles.value}>
                            {selectedHeightAndWeight.height}{" "}
                            {selectedHeightAndWeight.unit}
                        </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: HP(1),
                        }}
                    >
                        <Text style={submitStyles.label}>Weight:</Text>
                        <Text style={submitStyles.value}>
                            {selectedHeightAndWeight.weight}{" "}
                            {selectedHeightAndWeight.unit}
                        </Text>
                    </View>
                </View>
                <View
                    style={{
                        borderWidth: 1,
                        borderColor: MyColors(1).gray,
                        padding: HP(1),
                        gap: HP(1),
                        borderRadius: WP(2),
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: HP(1),
                        }}
                    >
                        <Text style={submitStyles.label}>Birth Date:</Text>
                        <Text style={submitStyles.value}>
                            {getMonth(selectedBirthMonth)} {selectedBirthDay},{" "}
                            {selectedBirthYear}
                        </Text>
                    </View>
                </View>
                <View
                    style={{
                        borderWidth: 1,
                        borderColor: MyColors(1).gray,
                        padding: HP(1),
                        gap: HP(1),
                        borderRadius: WP(2),
                        flexDirection: "row",
                    }}
                >
                    <Text style={submitStyles.label}>Goals:</Text>
                    <Text style={submitStyles.value}>
                        {selectedGoal?.map(
                            (v, i) =>
                                `• ${v} ${i !== selectedGoal.length - 1 ? "\n" : ""
                                }`
                        )}
                    </Text>
                </View>
                {Number(selectedBodyMeasurements.waist) !== 0 &&
                    Number(selectedBodyMeasurements.neck) !== 0 && (
                        <View
                            style={{
                                borderWidth: 1,
                                borderColor: MyColors(1).gray,
                                padding: HP(1),
                                gap: HP(1),
                                borderRadius: WP(2),
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: HP(1),
                                }}
                            >
                                <Text style={submitStyles.label}>Waist:</Text>
                                <Text style={submitStyles.value}>
                                    {selectedBodyMeasurements.waist}{" "}
                                    {selectedBodyMeasurements?.unit}
                                </Text>
                            </View>

                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: HP(1),
                                }}
                            >
                                <Text style={submitStyles.label}>Neck:</Text>
                                <Text style={submitStyles.value}>
                                    {selectedBodyMeasurements?.neck}{" "}
                                    {selectedBodyMeasurements?.unit}
                                </Text>
                            </View>

                            {selectedGender === "Female" && (
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        gap: HP(1),
                                    }}
                                >
                                    <Text style={submitStyles.label}>
                                        Hips:
                                    </Text>
                                    <Text style={submitStyles.value}>
                                        {selectedBodyMeasurements?.hip}{" "}
                                        {selectedBodyMeasurements?.unit}
                                    </Text>
                                </View>
                            )}
                        </View>
                    )}
                <View
                    style={{
                        borderWidth: 1,
                        borderColor: MyColors(1).gray,
                        padding: HP(1),
                        gap: HP(1),
                        borderRadius: WP(2),
                        flexDirection: "row",
                    }}
                >
                    <Text style={submitStyles.label}>Places:</Text>
                    <Text style={submitStyles.value}>
                        {selectedPlaces?.map(
                            (v, i) =>
                                `• ${v} ${i !== selectedPlaces.length - 1 ? "\n" : ""
                                }`
                        )}
                    </Text>
                </View>
                <View
                    style={{
                        borderWidth: 1,
                        borderColor: MyColors(1).gray,
                        padding: HP(1),
                        gap: HP(1),
                        borderRadius: WP(2),
                        flexDirection: "row",
                    }}
                >
                    <Text style={submitStyles.label}>Activity Level:</Text>
                    <Text style={submitStyles.value}>
                        {selectedActivityLevel}
                    </Text>
                </View>
                <View
                    style={{
                        borderWidth: 1,
                        borderColor: MyColors(1).gray,
                        padding: HP(1),
                        gap: HP(1),
                        borderRadius: WP(2),
                        flexDirection: "row",
                    }}
                >
                    <Text style={submitStyles.label}>Fitness Level:</Text>
                    <Text style={submitStyles.value}>
                        {selectedFitnessLevel}
                    </Text>
                </View>
            </View>

            <NextButtons
                lastIndex={true}
                isLoading={isLoading}
                handleSubmit={handleSubmit}
                back={backButton}
            />
        </ScrollView>
    );
};

const submitStyles = StyleSheet.create({
    label: {
        fontSize: HP(1.8),
        fontWeight: "bold",
        color: MyColors(0.8).white,
    },
    value: {
        color: MyColors(0.7).white,
        fontSize: HP(1.8),
        flex: 1,
    },
});