import { View, Text, Image, ImageBackground, StyleSheet } from "react-native";
import {
    heightPercentageToDP as HP,
    widthPercentageToDP as WP,
} from "react-native-responsive-screen";
import React from "react";
import { MyColors } from "@/constants/myColors";

const opacity = 1;

export const AnatomyFront = ({ exercise }) => {
    return (
        <View
            style={{
                justifyContent: "center",
                alignItems: "center",
                width: WP(45),
                height: HP(30),
            }}
        >
            <ImageBackground
                source={require("@/assets/images/Body-front/Full-Body.png")}
                style={{
                    width: "100%",
                    height: "100%",
                    opacity: opacity,
                }}
                resizeMode="center"
            >
                {exercise?.exercise?.muscleGroups?.includes("Chest") && (
                    <Image
                        source={require("@/assets/images/Body-front/Chest.png")}
                        style={{
                            width: "100%",
                            height: "100%",
                            position: "absolute",
                        }}
                        resizeMode="center"
                    />
                )}

                {exercise?.exercise?.muscleGroups?.includes("Core") && (
                    <Image
                        source={require("@/assets/images/Body-front/Core-Front.png")}
                        style={{
                            width: "100%",
                            height: "100%",
                            position: "absolute",
                        }}
                        resizeMode="center"
                    />
                )}

                {exercise?.exercise?.muscleGroups?.includes(
                    "Arms" || "Arm"
                ) && (
                    <Image
                        source={require("@/assets/images/Body-front/Arm-Front.png")}
                        style={{
                            width: "100%",
                            height: "100%",
                            position: "absolute",
                        }}
                        resizeMode="center"
                    />
                )}

                {exercise?.exercise?.muscleGroups?.includes(
                    "Biceps" || "Bicep"
                ) && (
                    <Image
                        source={require("@/assets/images/Body-front/Biceps.png")}
                        style={{
                            width: "100%",
                            height: "100%",
                            position: "absolute",
                        }}
                        resizeMode="center"
                    />
                )}

                {exercise?.exercise?.muscleGroups?.includes("Quads") && (
                    <Image
                        source={require("@/assets/images/Body-front/Quads.png")}
                        style={{
                            width: "100%",
                            height: "100%",
                            position: "absolute",
                        }}
                        resizeMode="center"
                    />
                )}

                {exercise?.exercise?.muscleGroups?.includes("Neck") && (
                    <Image
                        source={require("@/assets/images/Body-front/Neck.png")}
                        style={{
                            width: "100%",
                            height: "100%",
                            position: "absolute",
                        }}
                        resizeMode="center"
                    />
                )}

                {exercise?.exercise?.muscleGroups?.includes("Face") && (
                    <Image
                        source={require("@/assets/images/Body-front/Face.png")}
                        style={{
                            width: "100%",
                            height: "100%",
                            position: "absolute",
                        }}
                        resizeMode="center"
                    />
                )}

                {exercise?.exercise?.muscleGroups?.includes(
                    "Oblique" || "Obliques"
                ) && (
                    <Image
                        source={require("@/assets/images/Body-front/Oblique.png")}
                        style={{
                            width: "100%",
                            height: "100%",
                            position: "absolute",
                        }}
                        resizeMode="center"
                    />
                )}

                {exercise?.exercise?.muscleGroups?.includes("Lower Abs") && (
                    <Image
                        source={require("@/assets/images/Body-front/Lower-Abs.png")}
                        style={{
                            width: "100%",
                            height: "100%",
                            position: "absolute",
                        }}
                        resizeMode="center"
                    />
                )}

                {exercise?.exercise?.muscleGroups?.includes("Legs") && (
                    <Image
                        source={require("@/assets/images/Body-front/Leg-Muscle-Front.png")}
                        style={{
                            width: "100%",
                            height: "100%",
                            position: "absolute",
                        }}
                        resizeMode="center"
                    />
                )}

                {exercise?.exercise?.muscleGroups?.includes(
                    "Shoulders" || "Shoulder"
                ) && (
                    <Image
                        source={require("@/assets/images/Body-front/Shoulder-Front.png")}
                        style={{
                            width: "100%",
                            height: "100%",
                            position: "absolute",
                        }}
                        resizeMode="center"
                    />
                )}
            </ImageBackground>
        </View>
    );
};

export const AnatomyBack = ({ exercise }) => {
    return (
        <View
            style={{
                justifyContent: "center",
                alignItems: "center",
                width: WP(45),
                height: HP(30),
            }}
        >
            <ImageBackground
                source={require("@/assets/images/Body-Back/Full-Body.png")}
                style={{
                    width: "100%",
                    height: "100%",
                    opacity: opacity,
                }}
                resizeMode="center"
            >
                {exercise?.exercise?.muscleGroups?.includes("Legs") && (
                    <Image
                        source={require("@/assets/images/Body-Back/Leg-Muscle-Back.png")}
                        style={{
                            width: "100%",
                            height: "100%",
                            position: "absolute",
                        }}
                        resizeMode="center"
                    />
                )}

                {exercise?.exercise?.muscleGroups?.includes("Back") && (
                    <Image
                        source={require("@/assets/images/Body-Back/Back.png")}
                        style={{
                            width: "100%",
                            height: "100%",
                            position: "absolute",
                        }}
                        resizeMode="center"
                    />
                )}

                {exercise?.exercise?.muscleGroups?.includes("Hamstrings") && (
                    <Image
                        source={require("@/assets/images/Body-Back/Hamstring.png")}
                        style={{
                            width: "100%",
                            height: "100%",
                            position: "absolute",
                        }}
                        resizeMode="center"
                    />
                )}

                {exercise?.exercise?.muscleGroups?.includes("Calves") && (
                    <Image
                        source={require("@/assets/images/Body-Back/Calves.png")}
                        style={{
                            width: "100%",
                            height: "100%",
                            position: "absolute",
                        }}
                        resizeMode="center"
                    />
                )}

                {exercise?.exercise?.muscleGroups?.includes(
                    "Arms" || "Arm"
                ) && (
                    <Image
                        source={require("@/assets/images/Body-Back/Arm-Back.png")}
                        style={{
                            width: "100%",
                            height: "100%",
                            position: "absolute",
                        }}
                        resizeMode="center"
                    />
                )}

                {exercise?.exercise?.muscleGroups?.includes("Triceps") && (
                    <Image
                        source={require("@/assets/images/Body-Back/Triceps.png")}
                        style={{
                            width: "100%",
                            height: "100%",
                            position: "absolute",
                        }}
                        resizeMode="center"
                    />
                )}

                {exercise?.exercise?.muscleGroups?.includes(
                    "Glutes" || "Glute"
                ) && (
                    <Image
                        source={require("@/assets/images/Body-Back/Glutes.png")}
                        style={{
                            width: "100%",
                            height: "100%",
                            position: "absolute",
                        }}
                        resizeMode="center"
                    />
                )}

                {exercise?.exercise?.muscleGroups?.includes("Rotator Cuff") && (
                    <Image
                        source={require("@/assets/images/Body-Back/Rotator-Cuff.png")}
                        style={{
                            width: "100%",
                            height: "100%",
                            position: "absolute",
                        }}
                        resizeMode="center"
                    />
                )}

                {exercise?.exercise?.muscleGroups?.includes(
                    "Shoulders" || "Shoulder"
                ) && (
                    <Image
                        source={require("@/assets/images/Body-Back/Shoulder-Back.png")}
                        style={{
                            width: "100%",
                            height: "100%",
                            position: "absolute",
                        }}
                        resizeMode="center"
                    />
                )}

                {exercise?.exercise?.muscleGroups?.includes("Legs") && (
                    <Image
                        source={require("@/assets/images/Body-Back/Leg-Muscle-Back.png")}
                        style={{
                            width: "100%",
                            height: "100%",
                            position: "absolute",
                        }}
                        resizeMode="center"
                    />
                )}

                {exercise?.exercise?.muscleGroups?.includes("Rear Delts") && (
                    <Image
                        source={require("@/assets/images/Body-Back/Rear-Delts.png")}
                        style={{
                            width: "100%",
                            height: "100%",
                            position: "absolute",
                        }}
                        resizeMode="center"
                    />
                )}
            </ImageBackground>
        </View>
    );
};
