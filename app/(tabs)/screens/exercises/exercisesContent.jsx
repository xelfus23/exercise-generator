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

TaskManager.defineTask(BACKGROUND_TIMER_TASK, async () => {
    try {
        console.log("Running background task");
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


const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
        2,
        "0"
    )}`;
};

export default function ExerciseContent({ route, setTabBarVisible }) {
    const { exercise, value, sets } = route.params;
    const navigation = useNavigation();
    const [currentSet, setCurrentSet] = useState(1);
    const [isCooldown, setIsCooldown] = useState(true);

    useEffect(() => {
        setTabBarVisible(false);
        return () => setTabBarVisible(true);
    }, [setTabBarVisible]);

    useLayoutEffect(() => {
        if (exercise?.exercise?.name) {
            navigation.setOptions({ headerTitle: exercise?.exercise.name });
        }
    }, [navigation, exercise?.exercise?.name]);

    const handleCompleteSet = () => {
        if (currentSet < sets) {
            setIsCooldown(true); // Trigger cooldown before the next set
        } else {
            completeExercise();
        }
    };

    const handleCooldownComplete = () => {
        setIsCooldown(false);
        setCurrentSet((prev) => prev + 1); // Move to the next set
    };

    const completeExercise = () => {
        // Mark exercise as completed in the database
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
    };

    return (
        <SafeAreaView style={styles.mainContainer}>
            <Header title={`${exercise?.exercise?.name || "Exercise"}`} />
            <View style={styles.content}>
                {isCooldown ? (
                    <CooldownScreen onComplete={handleCooldownComplete} />
                ) : (
                    <>
                        {exercise?.exercise?.type === "duration" && (
                            <DurationScreen duration={value} onComplete={handleCompleteSet} />
                        )}
                        {exercise?.exercise?.type === "reps" && (
                            <RepsScreen value={value} onComplete={handleCompleteSet} />
                        )}
                        {exercise?.exercise?.type === "distance" && (
                            <DistanceScreen value={value} onComplete={handleCompleteSet} />
                        )}
                    </>
                )}
            </View>
        </SafeAreaView>
    );
}

const DurationScreen = ({ duration, onComplete }) => {
    return (
        <CountdownCircleTimer
            isPlaying
            duration={duration}
            colors={["#00c896", "#d1a338", "#e64848"]}
            colorsTime={[10, 5, 0]}
            onComplete={onComplete}
        >
            {({ remainingTime }) => (
                <Text style={styles.time}>{formatTime(remainingTime)}</Text>
            )}
        </CountdownCircleTimer>
    );
};

const CooldownScreen = ({ onComplete }) => {
    return (
        <CountdownCircleTimer
            isPlaying
            duration={10} // Cooldown duration
            colors={["#0077b6"]}
            onComplete={onComplete}
        >
            {({ remainingTime }) => (
                <Text style={styles.time}>{formatTime(remainingTime)}</Text>
            )}
        </CountdownCircleTimer>
    );
};

const RepsScreen = ({ value, onComplete }) => {
    const [currentRep, setCurrentRep] = useState(1);

    const handleNextRep = () => {
        if (currentRep < value) {
            setCurrentRep((prev) => prev + 1);
        } else {
            onComplete();
        }
    };

    return (
        <View style={styles.repsContainer}>
            <Text style={styles.time}>Rep {currentRep} of {value}</Text>
            <TouchableOpacity onPress={handleNextRep} style={styles.nextButton}>
                <Feather name="arrow-right" size={24} color="white" />
                <Text style={styles.nextText}>Next Rep</Text>
            </TouchableOpacity>
        </View>
    );
};

const DistanceScreen = ({ value, onComplete }) => {
    const [distance, setDistance] = useState(0);

    const handleUpdateDistance = () => {
        if (distance < value) {
            setDistance((prev) => prev + 1); // Simulating distance tracking
        } else {
            onComplete();
        }
    };

    return (
        <View style={styles.repsContainer}>
            <Text style={styles.time}>{distance} / {value} meters</Text>
            <TouchableOpacity onPress={handleUpdateDistance} style={styles.nextButton}>
                <Feather name="arrow-right" size={24} color="white" />
                <Text style={styles.nextText}>Add Distance</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: MyColors(1).black,
    },
    content: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
    },
    time: {
        color: MyColors(1).white,
        fontWeight: "bold",
        fontSize: 24,
    },
    repsContainer: {
        alignItems: "center",
    },
    nextButton: {
        marginTop: 20,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#00c896",
        padding: 10,
        borderRadius: 5,
    },
    nextText: {
        marginLeft: 10,
        color: "white",
        fontWeight: "bold",
    },
});
