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
import stylesX from "@/app/(tabs)/auth/authStyles";
import { MyColors } from "@/constants/myColors";
import {
    widthPercentageToDP as WP,
    heightPercentageToDP as HP,
} from "react-native-responsive-screen";
import Header from "./header";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import Feather from "@expo/vector-icons/Feather";
import { useAuth } from "@/components/auth/authProvider";
import exerciseHandler from "./exercisehandler";
import * as Notification from "expo-notifications";
import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";
import { getAuth } from "firebase/auth";

export default function ExerciseContent({ route, setTabBarVisible }) {
    const { exercise, value, index, sets } = route.params;
    const currentUser = getAuth().currentUser;
    const {
        user,
        updateUserData,
        exercisePlans,
        dayCount,
        calculateEverything,
    } = useAuth(); // Add `calculateEverything` here
    const [cooledDown, setCooledDown] = useState(false);
    const navigation = useNavigation();
    const style = stylesX.style;
    const AddComplete = exerciseHandler.addComplete;
    const restTime = 10;
    const getReady = 10;

    useEffect(() => {
        setTabBarVisible(false);
    }, [setTabBarVisible]);

    useLayoutEffect(() => {
        if (exercise?.exercise?.name) {
            navigation.setOptions({ headerTitle: exercise?.exercise.name });
        }
    }, [navigation, exercise?.exercise?.name]);

    const [countdown, setCountdown] = useState(30 * 60); // 30 minutes in seconds

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
            2,
            "0"
        )}`;
    };

    const [phase, setPhase] = useState("Get Ready");
    const [currentSet, setCurrentSet] = useState(1);

    const handlePhaseChange = () => {
        if (phase === "Get Ready") {
            setPhase("Exercise");
            console.log("Phase: ", phase);
        } else if (phase === "Exercise") {
            if (currentSet < sets) {
                setPhase("Rest");
                console.log("Phase: ", phase);
            } else {
                setPhase("Done");
                console.log("Phase: ", phase);
            }
        } else if (phase === "Rest") {
            setPhase("Exercise");
            console.log("Phase: ", phase);
            setCurrentSet((prev) => prev + 1);
        }
    };

    const complete = async (item) => {
        if (user) {
            console.log("Completing Exercise");
            const result = await AddComplete(
                user,
                item,
                value,
                sets,
                index,
                exercisePlans,
                dayCount
            );

            if (result.success) {
                console.log("Successfully updated exercise");
                await updateUserData(currentUser.uid);
                calculateEverything(); // Call calculateEverything
                navigation.goBack();
                setTabBarVisible(true);
            } else {
                console.log("Error exercise completion.");
            }
        }
    };

    const [timer, setTimer] = useState(0);

    return (
        <SafeAreaView style={[style.main_container]}>
            <Header title={exercise?.exercise?.name || "Exercise"} />
            {phase !== "Done" ? (
                <View style={styles.container}>
                    <Text style={styles.label}>
                        {phase === "Get Ready" && `Get Ready in`}{" "}
                        {phase === "Get Ready" && (
                            <Text
                                style={{
                                    color: MyColors(1).green,
                                    fontWeight: "bold",
                                }}
                            >
                                {timer}
                            </Text>
                        )}
                        {phase === "Exercise" && `Perform Set ${currentSet}`}
                        {phase === "Rest" && "Take a Rest!"}
                    </Text>

                    {phase === "Get Ready" ||
                    phase === "Rest" ||
                    exercise?.exercise?.type === "duration" ? (
                        <View style={styles.timerContainer}>
                            <CountdownCircleTimer
                                key={`${phase}-${currentSet}`}
                                isPlaying
                                duration={
                                    phase === "Get Ready"
                                        ? getReady
                                        : phase === "Exercise"
                                        ? value
                                        : restTime
                                }
                                onComplete={
                                    phase === "Get Ready"
                                        ? handlePhaseChange
                                        : phase === "Exercise"
                                        ? handlePhaseChange
                                        : phase === "Rest"
                                        ? handlePhaseChange
                                        : phase === "Done"
                                        ? handlePhaseChange
                                        : handlePhaseChange
                                }
                                colors={["#00c896", "#d1a338", "#e64848"]}
                                colorsTime={[10, 5, 0]}
                                onUpdate={(time) => setTimer(time)}
                            >
                                {({ remainingTime }) =>
                                    phase !== "Get Ready" ? (
                                        <Text style={styles.remainingTime}>
                                            {formatTime(remainingTime)}
                                        </Text>
                                    ) : (
                                        phase !== "Exercise" && (
                                            <TouchableOpacity
                                                style={styles.skipButton}
                                                onPress={handlePhaseChange}
                                                accessibilityLabel="Skip to Next Phase"
                                            >
                                                <Feather
                                                    name="skip-forward"
                                                    size={HP(5)}
                                                    color={MyColors(1).white}
                                                />
                                            </TouchableOpacity>
                                        )
                                    )
                                }
                            </CountdownCircleTimer>
                        </View>
                    ) : (
                        <View style={styles.repsContainer}>
                            <View style={styles.row}>
                                <Text style={styles.label}>
                                    {exercise?.exercise?.name || "Exercise"}
                                </Text>
                                <Text style={styles.reps}>{value}x</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.doneButton}
                                onPress={handlePhaseChange}
                            >
                                <Text style={styles.doneText}>Done</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            ) : (
                <View
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                        flex: 1,
                    }}
                >
                    <TouchableOpacity
                        style={styles.doneButton}
                        onPress={() => complete(exercise)}
                        accessibilityLabel="Mark Routine as Done"
                    >
                        <Text style={styles.doneText}>Complete!</Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
}

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
        width: WP(70),
    },
    doneText: {
        color: MyColors(1).green,
        fontSize: HP(3),
        fontWeight: "bold",
    },
});
