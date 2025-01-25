import {
    View,
    Text,
    ScrollView,
    Animated,
    Image,
    TouchableOpacity,
    Pressable,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { MyColors } from "../../../../../constants/myColors";
import { useAuth } from "@/components/auth/authProvider";
import {
    widthPercentageToDP as WP,
    heightPercentageToDP as HP,
} from "react-native-responsive-screen";
import ProfilePic from "./profilePic";
import CustomHeaderB from "../customDrawerLabel";
import { useNavigation } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import { LinearGradient } from "expo-linear-gradient";

export default function Profile() {
    const { user, allExerciseToday } = useAuth();
    const [description, setDescription] = useState(null);
    const [age, setAge] = useState(null);
    const [formattedDate, setFormattedDate] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);

    const bodyMetrics = user?.bodyMetrics;
    const heightAndWeight = bodyMetrics?.heightAndWeight;
    const birthDate = user?.birthDate;

    const circumferences = bodyMetrics?.circumferences;

    const birthDay = birthDate.day;
    const birthMonth = birthDate.month;
    const birthYear = birthDate.year;

    const height = heightAndWeight?.height;
    const weight = heightAndWeight?.weight;
    const hUnit = heightAndWeight?.heightUnit;
    const wUnit = heightAndWeight?.weightUnit;

    const heightInMeters = height / 100;
    const BMI = weight / (heightInMeters * heightInMeters);

    const scrollY = useRef(new Animated.Value(0)).current;

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

    const handleGender = (v) => {
        switch (v) {
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

    const handleScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: true }
    );

    const translateY = scrollY.interpolate({
        inputRange: [0, 2000],
        outputRange: [0, 1000], // Adjust as needed
        extrapolate: "clamp",
    });

    const translateX = scrollY.interpolate({
        inputRange: [0, 1500],
        outputRange: [WP(-100), 0], // Start from -100% width
        extrapolate: "clamp",
    });

    const scaleX = scrollY.interpolate({
        // Interpolate scaleX
        inputRange: [0, 1000],
        outputRange: [0, 1], // 0 for no width, 1 for full width
        extrapolate: "clamp",
    });

    const rotate = scrollY.interpolate({
        inputRange: [0, 2500], // Adjust range as needed
        outputRange: ["0deg", "360deg"],
        extrapolate: "clamp",
    });

    const imageScale = scrollY.interpolate({
        inputRange: [0, 1000], // Adjust scroll range as needed
        outputRange: [0.8, 1.2], // Start at scale 1, scale down to 0.7
        extrapolate: "clamp",
    });

    const navigation = useNavigation();

    const borderRadius = WP(3);

    const datas = [
        {
            label: "Gender",
            value: handleGender(user?.gender),
        },
        {
            label: "Age",
            value: age,
        },
        {
            label: "Date of Birth",
            value: formattedDate,
        },
        {
            label: "Height",
            value: `${height} ${hUnit}`,
        },
        {
            label: "Weight",
            value: `${weight} ${wUnit}`,
        },
        {
            label: "BMI",
            value: BMI ? BMI.toFixed(2) : "N/A",
        },
        {
            label: "Body Fat Percentage",
            value: user?.bodyFatPercentage || "N/A",
        },
        {
            label: "Circumferences",
            value: circumferences,
        },

        {
            label: "BMI Description",
            value: description,
        },
    ];

    useEffect(() => {
        console.log(selectedItem);
    }, [selectedItem]);

    const handlePress = (item) => {
        setSelectedItem(item);
    };

    return (
        <View style={{ backgroundColor: MyColors(1).black, width: WP(100) }}>
            <CustomHeaderB
                navigation={() => navigation.goBack()}
                text={"Profile"}
            />
            <Animated.ScrollView
                contentContainerStyle={{
                    width: WP(100),
                    alignItems: "center",
                    backgroundColor: MyColors(1).gray,
                }}
                style={{
                    height: HP(95),
                    paddingBottom: HP(20),
                    borderBottomWidth: 1,
                }}
                onScroll={handleScroll}
                decelerationRate={0.998}
            >
                <View
                    style={{
                        borderBottomWidth: 1,
                        borderRightWidth: 1,
                        borderLeftWidth: 1,
                        borderBottomLeftRadius: WP(5),
                        borderBottomRightRadius: WP(5),
                        width: WP(102),
                        borderColor: MyColors(1).green,
                        backgroundColor: MyColors(1).black,
                    }}
                >
                    <Animated.View
                        style={{
                            justifyContent: "center",
                            alignItems: "center",
                            height: HP(80),
                            transform: [{ translateY }], // Use interpolated value
                            transitionDelay: "1s",
                            borderColor: MyColors(1).green,
                        }}
                    >
                        <Animated.Image
                            source={require("@/assets/images/ui/round-1.png")}
                            resizeMethod={"scale"}
                            resizeMode="contain"
                            style={{
                                aspectRatio: 1,
                                position: "absolute",
                                transform: [
                                    { rotate },
                                    { rotateZ: "-90deg" },
                                    { scale: imageScale },
                                ], // Use interpolated value
                                width: WP(60),
                            }}
                        />

                        <Animated.View
                            style={{
                                borderWidth: WP(1),
                                borderColor: MyColors(1).white,
                                borderRadius: WP(50),
                                aspectRatio: 1,
                            }}
                        >
                            <ProfilePic />
                        </Animated.View>
                    </Animated.View>
                </View>

                <View
                    style={{
                        gap: HP(5),
                        backgroundColor: MyColors(1).gray,
                        paddingTop: HP(5),
                    }}
                >
                    <View
                        style={{
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <View
                            style={{
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Text
                                style={{
                                    fontWeight: "bold",
                                    color: MyColors(1).white,
                                    fontSize: WP(6),
                                    elevation: 8,
                                    textShadowColor: MyColors(0.5).white,
                                    textShadowRadius: 20,
                                    textAlign: "center",
                                    width: "100%",
                                }}
                            >
                                {user?.firstName} {user?.lastName}
                            </Text>
                        </View>
                        <TouchableOpacity>
                            <Text
                                style={{
                                    fontSize: WP(3),
                                    color: MyColors(0.6).white,
                                }}
                            >
                                {user?.email}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ width: WP(102) }}>
                        <View
                            style={{
                                flexDirection: "row",
                                borderTopWidth: 1,
                                borderColor: MyColors(1).green,
                                borderTopRightRadius: WP(5),
                                borderTopLeftRadius: WP(5),
                                borderLeftWidth: 1,
                                borderRightWidth: 1,
                                width: WP(102),
                                backgroundColor: MyColors(0.5).black,
                                padding: WP(5),
                                paddingVertical: WP(10),
                                gap: WP(2),
                            }}
                        >
                            <Pressable
                                style={{
                                    position: "absolute",
                                    right: WP(10),
                                    top: -HP(2),
                                }}
                            >
                                <Feather
                                    name="edit-2"
                                    size={WP(8)}
                                    color={MyColors(1).green}
                                    style={{
                                        backgroundColor: MyColors(1).gray,
                                        borderRadius: WP(10),
                                        borderWidth: 2,
                                        borderColor: MyColors(1).green,
                                        padding: WP(2),
                                        elevation: 4,
                                    }}
                                />
                            </Pressable>
                            <View
                                style={{
                                    gap: HP(1),
                                    width: "auto",
                                }}
                            >
                                {datas.map((dataItem, index) => (
                                    // <Pressable
                                    //     key={index}
                                    //     onPress={() => handlePress(dataItem)}
                                    // >
                                    <View
                                        key={index}
                                        style={
                                            {
                                                // gap: HP(1),
                                                // borderWidth:
                                                //     selectedItem?.label ===
                                                //     dataItem.label
                                                //         ? 1
                                                //         : 0,
                                                // borderColor:
                                                //     selectedItem?.label ===
                                                //     dataItem.label
                                                //         ? MyColors(1).green
                                                //         : null,
                                            }
                                        }
                                    >
                                        <View
                                            style={{
                                                flexDirection:
                                                    dataItem.label !==
                                                    "Circumferences"
                                                        ? "row"
                                                        : "column",
                                                gap: WP(2),
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: MyColors(1).white,
                                                    fontSize: HP(2),
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                {dataItem.label}:
                                            </Text>
                                            <View
                                                style={{
                                                    justifyContent: "center",
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        color: MyColors(0.8)
                                                            .white,
                                                    }}
                                                >
                                                    {dataItem.label ===
                                                        "Circumferences" &&
                                                    dataItem.value ? (
                                                        Object.entries(
                                                            dataItem.value
                                                        ).map(
                                                            ([key, value]) => (
                                                                <Text
                                                                    key={key}
                                                                    style={{
                                                                        color: MyColors(
                                                                            0.8
                                                                        ).white,
                                                                    }}
                                                                >
                                                                    <Text
                                                                        style={{
                                                                            fontWeight:
                                                                                "bold",
                                                                            color: MyColors(
                                                                                1
                                                                            )
                                                                                .white,
                                                                        }}
                                                                    >
                                                                        {key
                                                                            .charAt(
                                                                                0
                                                                            )
                                                                            .toUpperCase() +
                                                                            key.slice(
                                                                                1
                                                                            )}
                                                                    </Text>
                                                                    : {value}{" "}
                                                                    {
                                                                        circumferences?.unit
                                                                    }
                                                                    {" \n"}
                                                                </Text>
                                                            )
                                                        )
                                                    ) : (
                                                        <Text
                                                            style={{
                                                                color: MyColors(
                                                                    0.8
                                                                ).white,
                                                            }}
                                                        >
                                                            {dataItem.value}
                                                        </Text>
                                                    )}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                    // </Pressable>
                                ))}
                            </View>
                        </View>
                    </View>

                    <View
                        style={{
                            backgroundColor: MyColors(0.1).white,
                            padding: WP(4),
                            gap: HP(2),
                            borderRadius: WP(4),
                        }}
                    >
                        <Text
                            style={{
                                color: MyColors(1).white,
                                fontWeight: "bold",
                            }}
                        >
                            Main Goals:
                        </Text>
                        <View>
                            <Text
                                style={{
                                    color: MyColors(0.9).white,
                                }}
                            >
                                {user?.mainGoal?.map((v) => `• ${v} \n`)}
                            </Text>
                        </View>
                    </View>

                    <View
                        style={{
                            backgroundColor: MyColors(1).gray,
                            padding: WP(4),
                            gap: HP(2),
                            borderRadius: WP(4),
                        }}
                    >
                        <Text
                            style={{
                                color: MyColors(1).white,
                                fontWeight: "bold",
                            }}
                        >
                            My Exercise Plans:
                        </Text>
                        <View>
                            <Text
                                style={{
                                    color: MyColors(0.9).white,
                                }}
                            >
                                {user?.exercisePlan}
                            </Text>
                        </View>
                    </View>
                </View>
            </Animated.ScrollView>
        </View>
    );
}
