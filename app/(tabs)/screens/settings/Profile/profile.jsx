import { View, Text, StyleSheet, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import { MyColors } from "../../../../../constants/myColors";
import { useAuth } from "@/components/auth/authProvider";
import {
    widthPercentageToDP as WP,
    heightPercentageToDP as HP,
} from "react-native-responsive-screen";
import ProfilePic from "./profilePic";
import { accountstyles } from "../account/account";
import CustomHeaderB from "../customDrawerLabel";
import { useNavigation } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Entypo } from "@expo/vector-icons";

export default function Profile() {
    const { user } = useAuth();
    const [description, setDescription] = useState(null);
    const [age, setAge] = useState(null);
    const [formattedDate, setFormattedDate] = useState(null);

    const bodyMetrics = user?.bodyMetrics;
    const heightAndWeight = bodyMetrics?.heightAndWeight;
    const birthDate = user?.birthDate;

    const birthDay = birthDate.day;
    const birthMonth = birthDate.month;
    const birthYear = birthDate.year;

    const height = heightAndWeight?.height;
    const weight = heightAndWeight?.weight;
    const hUnit = heightAndWeight?.heightUnit;
    const wUnit = heightAndWeight?.weightUnit;

    const heightInMeters = height / 100;
    const BMI = weight / (heightInMeters * heightInMeters);

    useEffect(() => {
        if (BMI < 18.5) {
            setDescription("You are underweight.");
        } else if (BMI >= 18.5 && BMI <= 24.9) {
            setDescription("Normal, keep it up!");
        } else if (BMI >= 25 && BMI <= 29.9) {
            setDescription("You are overweight.");
        } else if (BMI >= 30) {
            setDescription("You are obese.");
        }
        if (birthYear && birthMonth && birthDay) {
            const birthDate = new Date(birthYear, birthMonth, birthDay);
            const formattedBirthDate = birthDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
            setAge(new Date().getFullYear() - birthYear);
            setFormattedDate(formattedBirthDate);
        }
    }, [user]);

    const handleGender = () => {
        switch (user.gender) {
            case "Male":
                return "Male";
            case "Female":
                return "Female";
            case "Others":
                return "N/A";
            default:
                return "N/A";
        }
    };

    console.log(user?.heightAndWeight);
    const navigation = useNavigation();

    return (
        <View style={{ backgroundColor: MyColors(1).black, flex: 1 }}>
            <CustomHeaderB
                navigation={() => navigation.goBack()}
                text={"Profile"}
            />

            <ProfilePic />

            <ScrollView contentContainerStyle={{ padding: HP(1), gap: HP(1) }}>
                <View
                    style={{
                        flexDirection: "row",
                        gap: HP(1),
                    }}
                >
                    <TouchableOpacity style={[styles.container]}>
                        <Text style={styles.label}>Height:</Text>
                        <Text style={styles.value}>
                            {height}{" "}
                            {hUnit}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.container]}>
                        <Text style={styles.label}>Weight:</Text>
                        <Text style={styles.value}>
                            {weight}{" "}
                            {wUnit}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.container, { flex: 1 }]}>
                        <Text style={styles.label}>Gender:</Text>
                        <Text style={styles.value}>{handleGender()}</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ flexDirection: "row", gap: HP(1) }}>
                    <TouchableOpacity style={styles.container}>
                        <Text style={styles.label}>Birth Date:</Text>
                        <Text style={styles.value}>{formattedDate}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.container, { gap: HP(1), flex: 1 }]}
                    >
                        <Text style={styles.label}>Selected Places:</Text>

                        <View style={{ flexDirection: "row", gap: HP(1) }}>
                            {user?.selectedPlace.map((item, index) => (
                                <Text
                                    key={item + index}
                                    style={[
                                        styles.value,
                                        {
                                            borderRadius: WP(2),
                                            borderWidth: 1,
                                            borderColor: MyColors(1).gray,
                                            textAlign: "center",
                                            padding: HP(0.5),
                                            width: WP(18),
                                        },
                                    ]}
                                >
                                    {item}
                                </Text>
                            ))}
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={{ gap: HP(1), flexDirection: "row" }}>
                    <TouchableOpacity
                        style={[styles.container, { width: WP(47) }]}
                    >
                        <Text style={styles.label}>Fitness Level:</Text>
                        <Text style={styles.value}>{user?.fitnessLevel}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.container, { width: WP(47) }]}
                    >
                        <Text style={styles.label}>Activity Level:</Text>
                        <Text style={styles.value}>{user?.activityLevel}</Text>
                    </TouchableOpacity>
                </View>

                <View
                    style={{
                        justifyContent: "space-between",
                    }}
                >
                    <TouchableOpacity style={[styles.container]}>
                        <Text style={styles.label}>Main Goals:</Text>
                        <View
                            style={{ flexWrap: "wrap", flexDirection: "row" }}
                        >
                            {user?.mainGoal?.map((item, index) => (
                                <View
                                    key={index}
                                    style={{
                                        flexDirection: "row",
                                        gap: HP(0.1),
                                        alignItems: "center",
                                        width: WP(45),
                                    }}
                                >
                                    <Entypo
                                        name="dot-single"
                                        size={HP(2)}
                                        color={MyColors(1).white}
                                    />
                                    <Text style={styles.value}>{item}</Text>
                                </View>
                            ))}
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderColor: MyColors(1).gray,
        borderRadius: WP(2),
        borderWidth: 1,
        padding: HP(1),
        gap: HP(1),
    },
    label: {
        color: MyColors(0.8).green,
        fontWeight: "bold",
        fontSize: HP(1.5),
    },
    value: {
        color: MyColors(0.8).white,
        fontSize: HP(1.4),
    },
});
