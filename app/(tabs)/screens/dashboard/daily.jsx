import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
} from "react-native";
import {
    widthPercentageToDP as WP,
    heightPercentageToDP as HP,
} from "react-native-responsive-screen";
import React, { useEffect, useState } from "react";
import { MyColors } from "@/constants/myColors";
import { ProgressChart } from "react-native-chart-kit";
import { LinearGradient } from "expo-linear-gradient";

export default function Daily({ progress, weekProgress, exercise }) {
    const screenWidth = Dimensions.get("window").width;

    const data = {
        labels: ["Today", "WEEK"],
        data: [progress / 100 || 0, weekProgress / 100 || 0],
    };

    console.log(progress);
    return (
        <LinearGradient
            colors={[MyColors(0.5).gray, MyColors(1).black]}
            locations={[0, 1]} // Adjust the locations to 0, 0.5, 1 for proper distribution
            start={{ x: 0.1, y: 0 }}
            style={{
                borderColor: MyColors(1).gray,
                margin: WP(2),
                borderRadius: 16,
                borderWidth: 1,
                padding: WP(3),
            }}
        >
            <Text
                style={{
                    color: MyColors(1).green,
                    fontSize: HP(2),
                    fontWeight: "bold",
                    width: WP(90),
                }}
            >
                Overall Progress
            </Text>
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                }}
            >
                <ProgressChart
                    data={data}
                    width={WP(40)}
                    height={WP(40)}
                    strokeWidth={HP(1.3)}
                    radius={32}
                    chartConfig={{
                        backgroundColor: MyColors(1).gray,
                        backgroundGradientFrom: MyColors(1).black,
                        backgroundGradientTo: MyColors(1).black,
                        decimalPlaces: 2, // Controls the number of decimal places
                        color: (opacity, index) =>
                            index === 0
                                ? MyColors(opacity).green
                                : MyColors(opacity).green, // Apply color based on index
                        labelColor: (opacity) => MyColors(opacity).white, // Label color
                    }}
                    style={{
                        borderRadius: WP(100),
                    }}
                    hideLegend={true}
                />
                <View
                    style={{
                        width: WP(40),
                        gap: WP(3),
                        justifyContent: "center",
                    }}
                >
                    <View
                        style={{
                            borderWidth: 1,
                            borderColor: MyColors(1).gray,
                            padding: WP(3),
                            borderRadius: WP(4),
                            height: HP(8),
                        }}
                    >
                        <Text
                            style={{
                                color: MyColors(0.8).white,
                                fontSize: 16,
                            }}
                        >
                            Today:
                        </Text>
                        <Text
                            style={{
                                color: MyColors(0.8).green, // Dynamic color for progress
                                fontWeight: "bold",
                            }}
                        >
                            {progress?.toFixed(2)}%
                        </Text>
                    </View>
                    {/* <View
                        style={{
                            borderWidth: 1,
                            borderColor: MyColors(1).gray,
                            padding: WP(3),
                            borderRadius: WP(4),
                            height: HP(8),
                        }}
                    >
                        <Text
                            style={{
                                color: MyColors(0.8).white,
                                fontSize: 16,
                            }}
                        >
                            This week:
                        </Text>
                        <Text
                            style={{
                                color: MyColors(0.8).green, // Dynamic color for week progress
                                fontWeight: "bold",
                            }}
                        >
                            {weekProgress?.toFixed(2)}%
                        </Text>
                    </View> */}
                </View>
            </View>
        </LinearGradient>
    );
}
