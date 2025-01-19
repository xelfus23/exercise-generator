import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React, { useState } from "react";
import {
    heightPercentageToDP as HP,
    widthPercentageToDP as WP,
} from "react-native-responsive-screen";
import { MyColors } from "@/constants/myColors";
import { LinearGradient } from "expo-linear-gradient";
import Xstyles from "../../../auth/authStyles";
const LoginRegisterStyle = Xstyles.LoginRegisterStyle;
const styles = Xstyles.style;
import NextButtons from "./next";

export default function SelectFitnessLevel({
    setSelectedFitnessLevel,
    submit,
    isLoading,
    next,
}) {
    const FitnessLevels = [
        {
            label: "Beginner",
            characteristics: [
                "New to exercise or returning after a long break.",
                "May have low endurance and strength.",
            ],
            typicalActivities: [
                "Light cardio (walking, jogging).",
                "Basic strength exercises (bodyweight squats, push-ups).",
                "Flexibility exercises (stretching, yoga).",
            ],
        },
        {
            label: "Intermediate",
            characteristics: [
                "Regularly exercises but has not reached advanced fitness levels.",
                "Moderate endurance and strength.",
            ],
            typicalActivities: [
                "Moderate cardio (running, cycling).",
                "Weight training (using weights or resistance bands).",
                "More structured flexibility routines (yoga, Pilates).",
            ],
        },
        {
            label: "Advanced",
            characteristics: [
                "Highly consistent with workouts, with significant strength and endurance.",
                "Often participates in specific sports or competitive activities.",
            ],
            typicalActivities: [
                "Intense cardio (interval training, long-distance running).",
                "Advanced weight training (heavy lifting, complex compound movements).",
                "Specialized flexibility and mobility work (dynamic stretching, advanced yoga).",
            ],
        },
        {
            label: "Athlete",
            characteristics: [
                "Dedicated to a specific sport or competitive training program.",
                "High endurance, strength, and skill level in specific physical activities.",
            ],
            typicalActivities: [
                "Sport-specific training (speed, agility, skill drills).",
                "Sport-specific strength and conditioning exercises.",
                "Recovery techniques (foam rolling, sports massage, advanced stretching).",
            ],
        },
    ];

    const [fitnessLevel, setFitnessLevel] = useState({
        label: "Beginner",
        characteristics: [
            "New to exercise or returning after a long break.",
            "May have low endurance and strength.",
        ],
        typicalActivities: [
            "Light cardio (walking, jogging).",
            "Basic strength exercises (bodyweight squats, push-ups).",
            "Flexibility exercises (stretching, yoga).",
        ],
    });

    const [error, setError] = useState(false);

    const handleSubmit = () => {
        if (!fitnessLevel) {
            setError("Please select your fitness level.");
            setTimeout(() => {
                setError(null);
            }, 2000);
            return;
        }
        setSelectedFitnessLevel(fitnessLevel?.label);
        next(1);
    };

    const backButton = () => {
        next(-1);
    };

    const updateSelectedItems = (item) => {
        if (!fitnessLevel || fitnessLevel.label !== item.label) {
            setFitnessLevel(item);
        }
    };

    return (
        <View
            style={{
                justifyContent: "center",
                alignItems: "center",
                marginTop: HP(5)
            }}
        >
            <Text
                style={{
                    fontSize: WP(5),
                    color: MyColors(1).white,
                    fontWeight: "bold",
                    width: WP(90),
                    marginBottom: HP(2),
                }}
            >
                {" "}
                What's your current fitness level?
            </Text>
            <ScrollView
                style={{ marginTop: HP(2) }}
                contentContainerStyle={{ gap: HP(2) }}
                showsVerticalScrollIndicator={false}
            >
                <View style={{ flexDirection: "row", paddingBottom: HP(3) }}>
                    <View style={{ gap: HP(3.5) }}>
                        {FitnessLevels.map((levels) => (
                            <TouchableOpacity
                                key={levels.label}
                                style={{
                                    width: WP(30),
                                    borderRadius: HP(3),
                                    borderWidth: 1,
                                    borderColor:
                                        fitnessLevel?.label === levels.label
                                            ? MyColors(1).green
                                            : MyColors(1).gray,
                                    overflow: "hidden",
                                }}
                                onPress={() => updateSelectedItems(levels)}
                            >
                                <LinearGradient
                                    colors={[
                                        fitnessLevel?.label === levels.label
                                            ? MyColors(0.1).black
                                            : MyColors(1).black,
                                        MyColors(1).black,
                                    ]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    locations={[0, 0.7]}
                                    style={{
                                        justifyContent: "center",
                                        alignItems: "center",
                                        padding: HP(2),
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: MyColors(0.8).white,
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {levels.label}
                                    </Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View
                        style={{
                            width: WP(60),
                            paddingHorizontal: WP(5),
                        }}
                    >
                        {fitnessLevel && (
                            <View style={{ gap: HP(1) }}>
                                <Text
                                    style={{
                                        color: MyColors(1).green,
                                        fontWeight: "bold",
                                        fontSize: HP(2),
                                    }}
                                >
                                    Description:
                                </Text>
                                {fitnessLevel.characteristics.map(
                                    (char, index) => (
                                        <Text
                                            key={index}
                                            style={{
                                                color: MyColors(1).white,
                                                fontSize: HP(1.5),
                                            }}
                                        >
                                            {char}
                                        </Text>
                                    )
                                )}

                                <Text
                                    style={{
                                        color: MyColors(1).green,
                                        fontWeight: "bold",
                                        fontSize: HP(2),
                                    }}
                                >
                                    Typical Activities:
                                </Text>
                                {fitnessLevel.typicalActivities.map(
                                    (act, index) => (
                                        <Text
                                            key={index}
                                            style={{
                                                color: MyColors(1).white,
                                                fontSize: HP(1.5),
                                            }}
                                        >
                                            {act}
                                        </Text>
                                    )
                                )}
                            </View>
                        )}
                    </View>
                </View>

                {error && (
                    <Text style={[LoginRegisterStyle.error]}>{error}</Text>
                )}

                <NextButtons
                    handleSubmit={handleSubmit}
                    isLoading={isLoading}
                    error={error}
                    back={backButton}
                />
            </ScrollView>
        </View>
    );
}
