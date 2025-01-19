import { View, Text, TouchableOpacity, StyleSheet, } from "react-native";
import React, { useState } from "react";
import { heightPercentageToDP as HP, widthPercentageToDP as WP, } from "react-native-responsive-screen";
import { MyColors } from "@/constants/myColors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import styles from './styles'
import stylesX from '../../../auth/authStyles'
const LoginRegisterStyle = stylesX.LoginRegisterStyle
import NextButtons from './next'

export default function Gender({ selectedGender, setSelectedGender, next }) {
    const [error, setError] = useState(null);

    const handlePress = (gender) => {
        setSelectedGender(gender);
    };

    const nextButton = () => {
        if (!selectedGender) {
            setError("Please select your gender.");
            setTimeout(() => {
                setError(null);
            }, 2000);
            return;
        }
        next(1);
    };

    const backButton = () => {
        next(-1);
    };

    return (
        <View style={styles.container}>
            <View style={{ paddingHorizontal: WP(5) }}>
                <View style={{ marginBottom: HP(3) }}>
                    <Text style={styles.Title}>
                        • Please select your gender
                    </Text>
                </View>
                <View style={styles.pickerContainer}>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-around",
                            marginTop: HP(5),
                        }}
                    >
                        <View
                            style={{
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => handlePress("Male")}
                                style={genderStyles.button}
                            >
                                <FontAwesome
                                    name="male"
                                    size={100}
                                    color={
                                        selectedGender === "Male"
                                            ? MyColors(1).green
                                            : MyColors(0.2).green
                                    }
                                />
                            </TouchableOpacity>
                            <Text style={genderStyles.label}>Male</Text>
                        </View>

                        <View
                            style={{
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => handlePress("Female")}
                                style={genderStyles.button}
                            >
                                <FontAwesome
                                    name="female"
                                    size={100}
                                    color={
                                        selectedGender === "Female"
                                            ? MyColors(1).purple
                                            : MyColors(0.2).purple
                                    }
                                />
                            </TouchableOpacity>
                            <Text style={genderStyles.label}>Female</Text>
                        </View>
                    </View>

                    <View
                        style={{
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => handlePress("Other")}
                            style={{
                                marginTop: HP(5),
                                paddingHorizontal: 20,
                                borderRadius: 20,
                                height: "auto",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Text
                                style={{
                                    color:
                                        selectedGender === "Other"
                                            ? MyColors(1).white
                                            : MyColors(0.4).white,
                                    fontSize: 16,
                                }}
                            >
                                Others / I'd rather not say
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <Text style={[LoginRegisterStyle.error, { marginBottom: HP(3) }]}>
                {error}
            </Text>
            <NextButtons
                handleSubmit={nextButton}
                error={error}
                back={backButton}
            />
        </View>
    );
};

const genderStyles = StyleSheet.create({
    label: {
        fontSize: 24,
        color: MyColors(1).white,
        paddingHorizontal: 10,
        borderRadius: 10,
    },
    button: {
        width: 100,
        height: 100,
        alignItems: "center",
        justifyContent: "center",
    },
});
