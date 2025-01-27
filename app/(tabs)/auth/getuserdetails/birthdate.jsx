import React, { useState, useMemo, useCallback, useRef } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Modal,
    StyleSheet,
    Animated,
} from "react-native";
import {
    heightPercentageToDP as HP,
    widthPercentageToDP as WP,
} from "react-native-responsive-screen";
import { MyColors } from "@/constants/myColors";
import { AntDesign } from "@expo/vector-icons";
import LottieView from "lottie-react-native";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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

export default function BirthDate({
    setBirthDay,
    setBirthMonth,
    setBirthYear,
    selectedBirthDay,
    selectedBirthMonth,
    selectedBirthYear,
    setIndex,
    scrollY,
    scrollOffset,
}) {
    const [isYearPickerVisible, setYearPickerVisible] = useState(false);
    const [isMonthPickerVisible, setMonthPickerVisible] = useState(false);
    const fadeAnimationOpacity = useRef(new Animated.Value(1)).current;
    const AnimatedTouchableOpacity =
        Animated.createAnimatedComponent(TouchableOpacity);

    const [isSubmitted, setSubmitted] = useState(false);
    const [error, setError] = useState(false);
    const today = new Date();
    const currentYear = today.getFullYear();

    const getDaysInMonth = (month, year) =>
        new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (month, year) =>
        new Date(year, month, 1).getDay();

    const daysArray = useMemo(() => {
        const daysInMonth = getDaysInMonth(
            selectedBirthMonth,
            selectedBirthYear
        );
        const firstDayOfMonth = getFirstDayOfMonth(
            selectedBirthMonth,
            selectedBirthYear
        );
        return Array.from({ length: firstDayOfMonth }, () => null).concat(
            Array.from({ length: daysInMonth }, (_, index) => index + 1)
        );
    }, [selectedBirthMonth, selectedBirthYear]);

    const fadeAnimation = () => {
        Animated.timing(fadeAnimationOpacity, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
        }).start(() => {
            setSubmitted(true);
            setIndex(3);
        });
    };

    const generateYears = useMemo(() => {
        return (start, end) => {
            let years = [];
            for (let i = start; i <= end; i++) {
                years.push(i);
            }
            return years;
        };
    }, []);

    const handlePreviousMonth = useCallback(() => {
        setBirthMonth((prevMonth) => {
            if (prevMonth === 0) {
                setBirthYear((prevYear) => prevYear - 1);
                return 11;
            } else {
                return prevMonth - 1;
            }
        });
    }, [setBirthMonth, setBirthYear]);

    const handleNextMonth = useCallback(() => {
        setBirthMonth((prevMonth) => {
            if (prevMonth === 11) {
                setBirthYear((prevYear) => prevYear + 1);
                return 0;
            } else {
                return prevMonth + 1;
            }
        });
    }, [setBirthMonth, setBirthYear]);

    const showYearPicker = () => {
        setYearPickerVisible(true);
    };

    const handleDayPress = useCallback(
        (day) => {
            if (day) {
                setBirthDay(day);
            }
        },
        [setBirthDay]
    );

    const showMonthPicker = () => {
        setMonthPickerVisible(true);
    };

    const selectYear = (year) => {
        setBirthYear(year);
        setYearPickerVisible(false);
    };
    const selectMonth = (month) => {
        setBirthMonth(month);
        setMonthPickerVisible(false);
    };

    const handleNext = () => {
        if (!selectedBirthDay || !selectedBirthMonth || !selectedBirthYear) {
            setError("Please select a valid birth date");
            setTimeout(() => {
                setError(null);
            }, 5000);
        } else {
            fadeAnimation();
        }
    };

    const moveScroll = scrollY.interpolate({
        inputRange: [1700, 4000],
        outputRange: [0, 1000], // Adjust as needed
        extrapolate: "clamp",
    });

    const scrollIconOpacity = scrollY.interpolate({
        inputRange: [1700, 2400],
        outputRange: [1, 0], // Start at 0 and fade out
        extrapolate: "clamp",
    });

    const fadeOutOpacity = scrollY.interpolate({
        inputRange: [1700, 2400],
        outputRange: [1, 0],
        extrapolate: "clamp",
    });

    return (
        <View
            style={{
                height: HP(100),
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            {isSubmitted ? (
                <Animated.Text
                    style={{
                        fontSize: HP(2),
                        color: MyColors(1).white,
                        textAlign: "center",
                        fontWeight: "bold",
                        opacity: fadeOutOpacity,
                    }}
                >
                    keep scrolling
                </Animated.Text>
            ) : (
                <Animated.View
                    style={{
                        padding: HP(2),
                        width: "90%",
                        gap: HP(1),
                        borderRadius: WP(4),
                        alignItems: "center",
                        height: HP(45),
                        opacity: fadeOutOpacity,
                    }}
                >
                    <Animated.Text
                        style={{
                            color: MyColors(0.8).white,
                            fontSize: HP(2),
                            opacity: fadeAnimationOpacity,
                        }}
                    >
                        Select your{" "}
                        {!selectedBirthYear ? (
                            <Text
                                style={{
                                    color: MyColors(1).green,
                                    fontWeight: "bold",
                                    textShadowRadius: HP(1),
                                    textShadowColor: MyColors(1).green,
                                }}
                            >
                                Birth Year
                            </Text>
                        ) : !selectedBirthMonth ? (
                            <Text
                                style={{
                                    color: MyColors(1).green,
                                    fontWeight: "bold",
                                    textShadowRadius: HP(1),
                                    textShadowColor: MyColors(1).green,
                                }}
                            >
                                Birth Month
                            </Text>
                        ) : !selectedBirthDay ? (
                            <Text
                                style={{
                                    color: MyColors(1).green,
                                    fontWeight: "bold",
                                    textShadowRadius: HP(1),
                                    textShadowColor: MyColors(1).green,
                                }}
                            >
                                Birth Day
                            </Text>
                        ) : (
                            <Text
                                style={{
                                    color: MyColors(1).green,
                                    fontWeight: "bold",
                                    textShadowRadius: HP(1),
                                    textShadowColor: MyColors(1).green,
                                }}
                            >
                                Birth Day
                            </Text>
                        )}
                    </Animated.Text>

                    <Animated.View
                        style={{
                            padding: HP(1),
                            borderRadius: WP(2),
                            alignSelf: "center",
                            height: "100%",
                            opacity: fadeAnimationOpacity,
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                borderRadius: WP(4),
                                paddingVertical: HP(2),
                                paddingHorizontal: HP(2),
                                // borderWidth: 1,
                                // borderColor: MyColors(1).green,
                            }}
                        >
                            <TouchableOpacity
                                disabled={!selectedBirthYear}
                                onPress={handlePreviousMonth}
                                style={{
                                    padding: 5,
                                    borderWidth: 1,
                                    borderColor: selectedBirthYear
                                        ? MyColors(1).green
                                        : MyColors(0.2).white,
                                    borderRadius: WP(20),
                                }}
                            >
                                <AntDesign
                                    name="caretleft"
                                    size={HP(2)}
                                    color={
                                        selectedBirthYear
                                            ? MyColors(1).green
                                            : MyColors(0.2).white
                                    }
                                />
                            </TouchableOpacity>

                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                }}
                            >
                                <TouchableOpacity
                                    onPress={showMonthPicker}
                                    disabled={!selectedBirthYear}
                                >
                                    <Text
                                        style={{
                                            color:
                                                selectedBirthYear &&
                                                !selectedBirthMonth
                                                    ? MyColors(1).green
                                                    : selectedBirthYear &&
                                                      selectedBirthMonth
                                                    ? MyColors(1).white
                                                    : MyColors(0.2).white,
                                            fontSize: HP(2),
                                            fontWeight: "bold",
                                        }}
                                    >{`${
                                        monthNames[selectedBirthMonth] ||
                                        "Select"
                                    }`}</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={showYearPicker}>
                                    <Text
                                        style={{
                                            fontSize: HP(2),
                                            fontWeight: "bold",
                                            color:
                                                selectedBirthMonth ||
                                                selectedBirthYear
                                                    ? MyColors(1).white
                                                    : MyColors(1).green,
                                        }}
                                    >
                                        {` ${selectedBirthYear || "Select"}`}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity
                                disabled={!selectedBirthYear}
                                onPress={handleNextMonth}
                                style={{
                                    padding: 5,
                                    borderWidth: 1,
                                    borderColor: selectedBirthYear
                                        ? MyColors(1).green
                                        : MyColors(0.2).white,
                                    borderRadius: WP(20),
                                }}
                            >
                                <AntDesign
                                    name="caretright"
                                    size={HP(2)}
                                    color={
                                        selectedBirthYear
                                            ? MyColors(1).green
                                            : MyColors(0.2).white
                                    }
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
                            {daysOfWeek.map((day) => (
                                <Text
                                    key={day}
                                    style={{
                                        width: "14.28%",
                                        textAlign: "center",
                                        fontWeight: "bold",
                                        color: !selectedBirthMonth
                                            ? MyColors(0.2).white
                                            : MyColors(1).white,
                                    }}
                                >
                                    {day}
                                </Text>
                            ))}
                        </View>

                        <View
                            style={{
                                flexDirection: "row",
                                flexWrap: "wrap",
                                height: "100%",
                            }}
                        >
                            {daysArray.map((day, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.dayButton,
                                        selectedBirthDay === day && {
                                            borderWidth: selectedBirthDay
                                                ? 1
                                                : 0,
                                            borderColor: MyColors(0.8).green,
                                            borderRadius: WP(2),
                                        },
                                    ]}
                                    onPress={() => handleDayPress(day)}
                                    disabled={!day || !selectedBirthMonth}
                                >
                                    <Text
                                        style={[
                                            {
                                                fontSize: 16,
                                                color: !selectedBirthMonth
                                                    ? MyColors(0.2).white
                                                    : MyColors(1).white,
                                            },
                                            !day && styles.dayTextTransparent,
                                        ]}
                                    >
                                        {day || ""}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </Animated.View>
                </Animated.View>
            )}

            <Text style={styles.error}></Text>

            <View style={{ height: HP(6) }}>
                {!isSubmitted &&
                selectedBirthDay &&
                selectedBirthMonth &&
                selectedBirthYear ? (
                    <AnimatedTouchableOpacity
                        onPress={handleNext}
                        style={{
                            // backgroundColor: MyColors(1).gray,
                            borderWidth: 1,
                            borderColor: MyColors(1).green,
                            borderRadius: WP(4),
                            width: WP(60),
                            alignItems: "center",
                            justifyContent: "center",
                            height: HP(6),
                            opacity: fadeAnimationOpacity,
                            marginTop: HP(5)
                        }}
                    >
                        <Text
                            style={{
                                fontSize: HP(2),
                                color: MyColors(1).white,
                                fontWeight: "bold",
                            }}
                        >
                            Submit
                        </Text>
                    </AnimatedTouchableOpacity>
                ) : (
                    isSubmitted &&
                    selectedBirthDay &&
                    selectedBirthMonth &&
                    selectedBirthYear && (
                        <Animated.View
                            style={{
                                alignItems: "center",
                                justifyContent: "center",
                                height: HP(15),
                                transform: [{ translateY: moveScroll }],
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
                    )
                )}
            </View>

            <Modal visible={isMonthPickerVisible} transparent>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <ScrollView
                            style={styles.monthPickerScroll}
                            contentContainerStyle={styles.monthPickerContainer}
                        >
                            {monthNames.map((month, index) => (
                                <TouchableOpacity
                                    key={month}
                                    onPress={() => selectMonth(index)}
                                    style={styles.monthButton}
                                >
                                    <Text
                                        style={[
                                            styles.monthText,
                                            selectedBirthMonth === index &&
                                                styles.selectedMonthText,
                                        ]}
                                    >
                                        {month}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        <TouchableOpacity
                            onPress={() => setMonthPickerVisible(false)}
                            style={styles.modalCloseButton}
                        >
                            <Text style={styles.modalCloseText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal visible={isYearPickerVisible} transparent>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <ScrollView
                            style={styles.yearPickerScroll}
                            contentContainerStyle={styles.yearPickerContainer}
                        >
                            {generateYears(currentYear - 71, currentYear)
                                .reverse()
                                .map((year) => (
                                    <TouchableOpacity
                                        key={year}
                                        onPress={() => selectYear(year)}
                                        style={styles.yearButton}
                                    >
                                        <Text
                                            style={[
                                                styles.yearText,
                                                selectedBirthYear === year &&
                                                    styles.selectedYearText,
                                            ]}
                                        >
                                            {year}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                        </ScrollView>
                        <TouchableOpacity
                            onPress={() => setYearPickerVisible(false)}
                            style={styles.modalCloseButton}
                        >
                            <Text style={styles.modalCloseText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    dayButton: {
        width: "14.28%",
        aspectRatio: 1,
        justifyContent: "center",
        alignItems: "center",
        marginVertical: HP(0.5),
    },
    dayTextTransparent: {
        color: "transparent",
    },
    error: {
        color: "red",
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: MyColors(0.8).black,
    },
    modalContent: {
        backgroundColor: MyColors(1).black,
        borderWidth: 1,
        borderColor: MyColors(1).gray,
        padding: HP(2),
        height: HP(40),
        borderRadius: WP(4),
        justifyContent: "space-between",
        alignItems: "center",
        gap: HP(2),
    },
    yearPickerScroll: {
        width: WP(80),
        borderWidth: 1,
        borderRadius: WP(2),
        borderColor: MyColors(1).gray,
    },
    yearPickerContainer: {
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "wrap",
        flexDirection: "row",
    },
    yearButton: {
        width: WP(20),
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: HP(1),
    },
    yearText: {
        fontSize: HP(2),
        fontWeight: "bold",
        color: MyColors(1).white,
    },
    selectedYearText: {
        color: MyColors(1).green,
    },
    monthPickerScroll: {
        width: WP(80),
        borderWidth: 1,
        borderRadius: WP(2),
        borderColor: MyColors(1).gray,
    },
    monthPickerContainer: {
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "wrap",
        flexDirection: "row",
    },
    monthButton: {
        width: WP(30),
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: HP(1),
    },
    monthText: {
        fontSize: HP(2),
        fontWeight: "bold",
        color: MyColors(1).white,
    },
    selectedMonthText: {
        color: MyColors(1).green,
    },
    modalCloseButton: {
        backgroundColor: MyColors(1).black,
        borderColor: MyColors(1).gray,
        borderWidth: 1,
        padding: HP(1),
        paddingHorizontal: HP(3),
        borderRadius: WP(4),
    },
    modalCloseText: {
        color: MyColors(1).green,
        fontWeight: "bold",
        fontSize: HP(2),
    },
});
