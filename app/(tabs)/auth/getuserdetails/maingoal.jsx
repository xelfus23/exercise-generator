import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView } from "react-native";
import React, { useState } from "react";
import { heightPercentageToDP as HP, widthPercentageToDP as WP } from "react-native-responsive-screen";
import { MyColors } from "@/constants/myColors";
import NextButtons from './next'
import styles from "./styles";
import stylesX from '../../auth/authStyles'
const LoginRegisterStyle = stylesX.LoginRegisterStyle

export default function MainGoal({ setSelectedGoal, selectedGoal, next }) {
    const [error, setError] = useState(null);

    const nextButton = () => {
        if (selectedGoal.length === 0) {
            setError("Please select your goal.");
            setTimeout(() => {
                setError(null);
            }, 2000);
            return;
        }
        next(1); // Pass the incremented index to the next function
    };

    const mainGoals = [
        "Weight management",
        "Muscle building",
        "Cardiovascular health",
        "Flexibility",
        "Balance and coordination",
        "Injury prevention",
        "Stress reduction",
        "Mood improvement",
        "Better sleep",
        "Increased energy",
        "Confidence and self-esteem",
        "Improved health",
        "Increased lifespan",
        "Better quality of life",
        "Athletic performance",
        "Body composition",
        "Core strength development",
        "Joint mobility improvement",
        "Bone density enhancement",
        "Posture correction",
        "Metabolic health optimization",
        "Chronic pain relief",
        "Functional strength training",
        "Heart rate control",
        "Immune system support",
        "Reduction in sedentary lifestyle",
    ];

    const onPress = (item) => {
        let chosenItems = [...selectedGoal];

        if (selectedGoal.includes(item)) {
            chosenItems = chosenItems.filter((goal) => goal !== item);
        } else {
            chosenItems.push(item);
        }
        setSelectedGoal(chosenItems);
    };

    const backButton = () => {
        next(-1);
    };

    return (
        <SafeAreaView style={MainGoalStyles.container}>
            <View
                style={{
                    width: WP(90),
                    paddingTop: HP(2),
                    marginBottom: HP(2),
                }}
            >
                <Text style={[styles.Title]}>• What are your main goals?</Text>
                <Text
                    style={{ color: MyColors(0.8).white, marginLeft: HP(1.2) }}
                >
                    Choose one or more:
                </Text>
            </View>
            <View style={MainGoalStyles.pickerContainer}>
                <View
                    style={{
                        gap: WP(2),
                        height: HP(60),
                    }}
                >
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            flexDirection: "row",
                            flexWrap: "wrap",
                            gap: HP(1),
                            justifyContent: "center",
                            paddingVertical: HP(2),
                        }}
                    >
                        {mainGoals.map((item, index) => (
                            <TouchableOpacity
                                key={item}
                                onPress={() => onPress(item)}
                                style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                    padding: WP(2),
                                    backgroundColor: !selectedGoal.includes(
                                        item
                                    )
                                        ? MyColors(1).gray
                                        : MyColors(0.4).gray,
                                    borderRadius: WP(3),
                                    width: WP(40), // Adjust to fit two columns
                                    height: HP(5),
                                }}
                            >
                                <Text
                                    style={{
                                        borderColor: MyColors(1).gray,
                                        textAlign: "center",
                                        color: !selectedGoal.includes(item)
                                            ? MyColors(1).white
                                            : MyColors(1).green,
                                        fontSize: HP(1),
                                    }}
                                >
                                    {item}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </View>
            <Text style={[LoginRegisterStyle.error, { marginBottom: HP(2) }]}>
                {error}
            </Text>
            <NextButtons
                handleSubmit={nextButton}
                back={backButton}
                error={error}
            />
        </SafeAreaView>
    );
};

const MainGoalStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: MyColors(1).black,
        alignItems: "center",
        marginTop: HP(2),
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: MyColors(1).gray,
        borderRadius: WP(4),
        width: WP(90),
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
