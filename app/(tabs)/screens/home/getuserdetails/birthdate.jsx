import { View, Text, TouchableOpacity, ScrollView, Modal, } from "react-native";
import React, { useState } from "react";
import { heightPercentageToDP as HP, widthPercentageToDP as WP } from "react-native-responsive-screen";
import { MyColors } from "@/constants/myColors";
import { AntDesign } from "@expo/vector-icons";
import NextButtons from './next'
import styles from "./styles";

export default function BirthDate({
    setBirthDay,
    setBirthMonth,
    setBirthYear,
    selectedBirthDay,
    selectedBirthMonth,
    selectedBirthYear,
    next,
}) {
    const getDaysInMonth = (month, year) =>
        new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (month, year) =>
        new Date(year, month, 1).getDay();
    const getMonthName = (month) => {
        const monthNames = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];
        return monthNames[month];
    };

    const today = new Date();
    const [isYearPickerVisible, setYearPickerVisible] = useState(false);

    const nextButton = () => {
        next(1);
    };

    const todayYear = today.getFullYear();

    const handlePreviousMonth = () => {
        if (selectedBirthMonth === 0) {
            setBirthMonth(11);
            setBirthYear(selectedBirthYear - 1);
        } else {
            setBirthMonth(selectedBirthMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (selectedBirthMonth === 11) {
            setBirthMonth(0);
            setBirthYear(selectedBirthYear + 1);
        } else {
            setBirthMonth(selectedBirthMonth + 1);
        }
    };

    const daysInMonth = getDaysInMonth(selectedBirthMonth, selectedBirthYear);
    const firstDayOfMonth = getFirstDayOfMonth(
        selectedBirthMonth,
        selectedBirthYear
    );

    const daysArray = Array.from(
        { length: firstDayOfMonth },
        () => null
    ).concat(Array.from({ length: daysInMonth }, (_, index) => index + 1));

    // Show a year picker when the year is tapped
    const showYearPicker = () => {
        setYearPickerVisible(true);
    };

    const selectYear = (year) => {
        setBirthYear(year);
        setYearPickerVisible(false);
    };

    const generateYears = (start, end) => {
        let years = [];
        for (let i = start; i <= end; i++) {
            years.push(i);
        }
        return years;
    };

    const backButton = () => {
        next(-1);
    };

    return (
        <View style={styles.container}>
            <View
                style={{
                    padding: HP(2),
                    width: "90%",
                    gap: HP(1),
                    borderWidth: 1,
                    borderColor: MyColors(1).gray,
                    borderRadius: WP(4),
                }}
            >
                <Text style={styles.Title}>• Select your date of birth:</Text>

                <View
                    style={{
                        padding: HP(1),
                        backgroundColor: MyColors(1).black,
                        borderRadius: WP(2),
                        alignSelf: "center",
                        borderWidth: 1,
                        borderColor: MyColors(1).gray,
                        height: HP(45)
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-around",
                            alignItems: "center",
                            borderBottomWidth: 1,
                            borderColor: MyColors(1).gray,
                            borderRadius: WP(4),
                            paddingVertical: HP(2),
                        }}
                    >
                        <TouchableOpacity
                            onPress={handlePreviousMonth}
                            style={{
                                padding: 5,
                                borderWidth: 1,
                                borderColor: MyColors(1).green,
                                borderRadius: WP(20),
                            }}
                        >
                            <AntDesign
                                name="caretleft"
                                size={HP(3)}
                                color={MyColors(1).green}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={showYearPicker}>
                            <Text
                                style={{
                                    fontSize: 20,
                                    fontWeight: "bold",
                                    color: MyColors(0.8).green,
                                }}
                            >{`${getMonthName(
                                selectedBirthMonth
                            )} ${selectedBirthYear}`}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleNextMonth}
                            style={{
                                padding: 5,
                                borderWidth: 1,
                                borderColor: MyColors(1).green,
                                borderRadius: WP(20),
                            }}
                        >
                            <AntDesign
                                name="caretright"
                                size={HP(3)}
                                color={MyColors(1).green}
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Days of the Week */}
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-around",
                            marginTop: HP(1),
                        }}
                    >
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                            (day) => (
                                <Text
                                    key={day}
                                    style={{
                                        width: "14.28%",
                                        textAlign: "center",
                                        fontWeight: "bold",
                                        color: MyColors(1).white,
                                    }}
                                >
                                    {day}
                                </Text>
                            )
                        )}
                    </View>

                    <View
                        style={{
                            flexDirection: "row",
                            flexWrap: "wrap",
                            height: '100%'
                        }}
                    >
                        {daysArray.map((day, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    {
                                        width: "14.28%",
                                        aspectRatio: 1,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginVertical: HP(0.5),
                                    },
                                    selectedBirthDay === day
                                        ? {
                                            borderWidth: 1,
                                            borderColor: MyColors(0.8).green,
                                            borderRadius: WP(2),
                                            backgroundColor: MyColors(0.1).white
                                        }
                                        : null,
                                ]}
                                onPress={() => day && setBirthDay(day)}
                                disabled={!day}
                            >
                                <Text
                                    style={[
                                        {
                                            fontSize: 16,
                                            color: MyColors(1).white,
                                        },
                                        !day
                                            ? {
                                                color: "transparent",
                                            }
                                            : null,
                                    ]}
                                >
                                    {day || ""}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </View>

            <Text style={styles.error}></Text>

            <Modal visible={isYearPickerVisible} transparent>
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: MyColors(0.8).black,
                    }}
                >
                    <View
                        style={{
                            backgroundColor: MyColors(1).black,
                            borderWidth: 1,
                            borderColor: MyColors(1).gray,
                            padding: HP(2),
                            height: HP(40),
                            borderRadius: WP(4),
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: HP(2),
                        }}
                    >
                        <ScrollView
                            style={{
                                width: WP(80),
                                borderWidth: 1,
                                borderRadius: WP(2),
                                borderColor: MyColors(1).gray,
                            }}
                            contentContainerStyle={{
                                justifyContent: "center",
                                alignItems: "center",
                                flexWrap: "wrap",
                                flexDirection: "row",
                            }}
                        >
                            {generateYears(todayYear - 71, todayYear)
                                .reverse()
                                .map((year) => (
                                    <TouchableOpacity
                                        key={year}
                                        onPress={() => selectYear(year)}
                                        style={{
                                            width: WP(20),
                                            justifyContent: "center",
                                            alignItems: "center",
                                            paddingVertical: HP(1),
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color:
                                                    selectedBirthYear === year
                                                        ? MyColors(1).green
                                                        : MyColors(1).white,
                                                fontSize: HP(2),
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {year}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                        </ScrollView>
                        <TouchableOpacity
                            onPress={() => setYearPickerVisible(false)}
                            style={{
                                backgroundColor: MyColors(1).black,
                                borderColor: MyColors(1).gray,
                                borderWidth: 1,
                                padding: HP(1),
                                paddingHorizontal: HP(3),
                                borderRadius: WP(4),
                            }}
                        >
                            <Text
                                style={{
                                    color: MyColors(1).green,
                                    fontWeight: "bold",
                                    fontSize: HP(2),
                                }}
                            >
                                Close
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <NextButtons handleSubmit={nextButton} back={backButton} />
        </View>
    );
};
