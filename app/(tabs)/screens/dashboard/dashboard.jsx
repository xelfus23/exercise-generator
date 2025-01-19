import React from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from "react-native";
import CustomHeader from "../../../../components/customs/CustomHeader";
import { MyColors } from "@/constants/myColors";
import {
    widthPercentageToDP as WP,
    heightPercentageToDP as HP,
} from "react-native-responsive-screen";
import { useAuth } from "@/components/auth/authProvider";
import Daily from "./daily";
import ToDo from "./exerciseTodo";
import LineChartBlock from "./lineChart";
import StackedBarChartBlock from "./weekProgress";
import { useNavigation } from "expo-router";

export default function Dashboard() {
    const {
        user,
        updateUserData,
        todayExercise,
        otherExercise,
        weekIndexExercise,
        weekExercise,
        exercisePlans,
        progress,
        weekProgress,
        allDaysInAWeek,
    } = useAuth();

    const navigation = useNavigation();

    return (
        <View style={styles.mainContainer}>
            <CustomHeader title="Dashboard" />
            <ToDo todayExercise={todayExercise} />
            <ScrollView style={styles.container}>
                <Daily
                    user={user}
                    todayExercise={todayExercise}
                    weekProgress={weekProgress}
                    progress={progress}
                />
                <LineChartBlock
                    todayExercise={todayExercise}
                    allDaysInAWeek={allDaysInAWeek}
                    progress={progress}
                    exercisePlans={exercisePlans}
                />
                {todayExercise?.length === 0 ? (
                    <View style={{ width: WP(100), justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                        <Text
                            style={{
                                color: MyColors(1).yellow,
                                textAlign: "center",
                                marginVertical: HP(2),
                            }}
                        >
                            You don't have any todayExercise yet. Please generate

                        </Text>
                        <TouchableOpacity style={{
                            backgroundColor: MyColors(0.5).green,
                            padding: WP(2),
                            borderRadius: WP(4),
                        }}
                            onPress={() => navigation.navigate('Exercises')}
                        >
                            <Text style={{
                                fontWeight: 'bold',
                                color: MyColors(1).white
                            }}>
                                Generate Exercise
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <StackedBarChartBlock
                        allDaysInAWeek={allDaysInAWeek}
                        progress={progress}
                        exercisePlans={exercisePlans}
                    />
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    label: {
        color: MyColors(1).white,
    },
    mainContainer: {
        flex: 1,
        backgroundColor: MyColors(1).black,
    },
    container: {},
    rectangle: {
        width: WP(95),
        margin: WP(2.5),
        padding: WP(5),
        backgroundColor: MyColors(1).gray,
        borderRadius: WP(2),
        aspectRatio: 2 / 1,
    },
    square: {
        width: WP(40),
        margin: WP(5),
        backgroundColor: MyColors(1).gray,
        borderRadius: WP(2),
        aspectRatio: 1,
    },
});
