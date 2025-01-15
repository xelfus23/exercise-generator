import React, { useEffect, useLayoutEffect, useState } from "react";
import {
    Text,
    SafeAreaView,
    View,
    StyleSheet,
    TouchableOpacity,
    Platform,
    PermissionsAndroid,
} from "react-native";
import { useNavigation } from "expo-router";
import styleX from "@/app/(tabs)/auth/authStyles";
import { MyColors } from "@/constants/myColors";
import {
    widthPercentageToDP as WP,
    heightPercentageToDP as HP,
} from "react-native-responsive-screen";
import Header from "./header";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import Feather from "@expo/vector-icons/Feather";
import { useAuth } from "@/components/auth/authProvider";
import { addComplete } from "./exercisehandler";
import * as Notification from "expo-notifications";
import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";

const BACKGROUND_TIMER_TASK = "background-timer-task";
const style = styleX.style

TaskManager.defineTask(BACKGROUND_TIMER_TASK, async () => {
    try {
        console.log("Running background task");
        // You could store elapsed time in AsyncStorage or update a notification here
        return BackgroundFetch.Result.NewData;
    } catch (err) {
        console.error("Background task error:", err);
        return BackgroundFetch.Result.Failed;
    }
});

const registerBackgroundFetch = async () => {
    return BackgroundFetch.registerTaskAsync(BACKGROUND_TIMER_TASK, {
        minimumInterval: 1, // Minimum 1 minute interval
        stopOnTerminate: false,
        startOnBoot: true,
    });
};

Notification.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

export default function ExerciseContent({ route, setTabBarVisible }) {
    const { exercise, value, index, sets } = route.params;
    const { user, updateUserData, exercisePlans, dayCount } = useAuth();
    const [cooledDown, setCooledDown] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        setTabBarVisible(false);
        return () => setTabBarVisible(true);
    }, [setTabBarVisible]);

    useLayoutEffect(() => {
        if (exercise?.exercise?.name) {
            navigation.setOptions({ headerTitle: exercise?.exercise.name });
        }
    }, [navigation, exercise?.exercise?.name]);

    const [countdown, setCountdown] = useState(30 * 60); // 30 minutes in seconds

    useEffect(() => {
        const startBackgroundTask = async () => {
            await registerBackgroundFetch();
        };

        startBackgroundTask();

        // Setup countdown timer that reduces every second
        const timer = setInterval(() => {
            setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(timer); // Cleanup on unmount
    }, []);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
            2,
            "0"
        )}`;
    };

    const requestPermissions = async () => {
        const { status } = await Notification.requestPermissionsAsync();
        if (status !== "granted") {
            alert("Notification permissions not granted!");
            return;
        }
    };

    useEffect(() => {
        requestPermissions();
    }, []);

    const complete = (item) => {
        if (user) {
            addComplete(
                user,
                item,
                value,
                sets,
                index,
                updateUserData,
                exercisePlans,
                dayCount
            );
            navigation.navigate("ExercisesList");
        }
    };

    return (
        <SafeAreaView style={[style.main_container]}>
            <Header title={exercise?.exercise?.name || "Exercise"} />
            {/* Fallback to "Exercise" if name is undefined */}
            {!cooledDown ? (
                <ExerciseScreen setCooledDown={setCooledDown} />
            ) : (
                <Exercise
                    complete={complete}
                    duration={value}
                    item={exercise}
                />
            )}
        </SafeAreaView>
    );
}

const ExerciseScreen = ({ setCooledDown }) => {
    const getReadyCountdown = 10;
    const [time, setTime] = useState(getReadyCountdown);

    return (
        <View style={styles.container}>
            <Text style={styles.label}>
                Get Ready! <Text style={styles.timer}>{time}</Text>
            </Text>
            <CountdownCircleTimer
                key="get-ready-timer" // Ensures re-render on reset
                isPlaying
                duration={getReadyCountdown}
                colors={["#00c896", "#d1a338", "#e64848"]}
                colorsTime={[10, 5, 0]}
                onComplete={() => setCooledDown(true)}
                onUpdate={setTime}
            >
                {() => (
                    <TouchableOpacity
                        style={styles.centered}
                        onPress={() => setCooledDown(true)}
                        accessibilityLabel="Skip to Exercise"
                    >
                        <Feather
                            name="skip-forward"
                            size={HP(5)}
                            color={MyColors(1).white}
                        />
                    </TouchableOpacity>
                )}
            </CountdownCircleTimer>
        </View>
    );
};

const Exercise = ({ duration, item, complete }) => {
    const formatTime = (totalSeconds) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}`;
    };

    return (
        <View style={styles.container}>
            {item?.exercise?.type === "duration" ? (
                <View style={styles.timerContainer}>
                    <CountdownCircleTimer
                        key="exercise-timer"
                        isPlaying
                        duration={duration}
                        colors={["#00c896", "#d1a338", "#e64848"]}
                        colorsTime={[10, 5, 0]}
                        onComplete={() => complete(item)}
                    >
                        {({ remainingTime }) => (
                            <Text style={styles.remainingTime}>
                                {formatTime(remainingTime)}
                            </Text>
                        )}
                    </CountdownCircleTimer>
                </View>
            ) : (
                <View style={styles.repsContainer}>
                    <View style={styles.row}>
                        <Text style={styles.label}>
                            {item?.exercise?.name || "Exercise"}
                        </Text>
                        <Text style={styles.reps}>{duration}x</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.doneButton}
                        onPress={() => complete(item)}
                        accessibilityLabel="Mark Exercise as Done"
                    >
                        <Text style={styles.doneText}>Done</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        alignItems: "center",
        gap: HP(8),
        paddingTop: HP(20),
    },
    timer: {
        fontSize: HP(3),
        color: MyColors(1).green,
        fontWeight: "bold",
    },
    label: {
        fontSize: HP(3),
        color: MyColors(1).white,
    },
    remainingTime: {
        color: MyColors(1).green,
        fontSize: HP(4),
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    repsContainer: {
        gap: HP(2),
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: WP(2),
    },
    reps: {
        color: MyColors(1).green,
        fontSize: HP(3),
    },
    doneButton: {
        padding: WP(1),
        backgroundColor: MyColors(1).gray,
        borderRadius: WP(4),
        borderColor: MyColors(1).green,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    doneText: {
        color: MyColors(1).green,
        fontSize: HP(3),
        fontWeight: "bold",
    },
});
