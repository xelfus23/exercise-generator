import React, { useEffect, useState } from "react";
import {
    Text,
    SafeAreaView,
    View,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import Feather from "@expo/vector-icons/Feather";
import Header from "./header";
import { MyColors } from "@/constants/myColors";
import { useNavigation } from "expo-router";
import {
    heightPercentageToDP as HP,
    widthPercentageToDP as WP,
} from "react-native-responsive-screen";
import { useAuth } from "@/components/auth/authProvider";
import { addComplete } from "./exercisehandler";
import { getAuth } from "firebase/auth";

const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
        2,
        "0"
    )}`;
};

export default function ExerciseContent({ route, setTabBarVisible }) {
    const { exercise, value, index, sets } = route.params; // Exercise type, duration/value, and sets
    const [currentSet, setCurrentSet] = useState(1); // Current set tracker
    const [stage, setStage] = useState("getReady"); // Phases: "getReady", "exercise", "rest", "complete"
    const [timerKey, setTimerKey] = useState(0); // To reset timers
    const currentUser = getAuth().currentUser;

    const { user, updateUserData, exercisePlans, dayCount } = useAuth();

    const navigation = useNavigation();

    useEffect(() => {
        setCurrentSet(1);
        setStage("getReady");
        setTimerKey(0);
    }, []);

    useEffect(() => {
        setTabBarVisible(false);
        return () => setTabBarVisible(true);
    }, [setTabBarVisible]);

    const handleNextStage = () => {
        if (stage === "getReady") {
            setStage("exercise");
        } else if (stage === "exercise") {
            if (currentSet < sets) {
                setStage("rest");
            } else {
                setStage("complete");
            }
        } else if (stage === "rest") {
            setCurrentSet((prev) => prev + 1);
            setStage("exercise");
        }
        setTimerKey((prev) => prev + 1);
    };

    const completeExercise = async (item) => {
        console.log("Exercise completed");
        if (user) {
            await addComplete(
                user,
                item,
                value,
                sets,
                index,
                exercisePlans,
                dayCount
            );
        }
        await updateUserData(currentUser.uid);
        navigation.navigate("ExercisesList", {
            setTabBarVisible,
        });
    };

    return (
        <SafeAreaView style={styles.mainContainer}>
            <Header title={`${exercise.exercise.name}`} />
            <View style={styles.content}>
                {stage === "complete" ? (
                    <View>
                        <Text style={styles.completeText}>
                            Exercise Completed!
                        </Text>
                        <View
                            style={{
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <TouchableOpacity
                                style={styles.completeButton}
                                onPress={() => completeExercise(exercise)}
                            >
                                <Text style={styles.buttonText}>Finish</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <>
                        {exercise.exercise.type === "duration" && (
                            <>
                                <View>
                                    <Text
                                        style={{
                                            color: MyColors(1).white,
                                            fontWeight: "bold",
                                            fontSize: HP(2.5),
                                        }}
                                    >
                                        Set number {currentSet} of {sets}
                                    </Text>
                                </View>
                                <View
                                    style={{
                                        flex: 2 / 3,
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <CountdownCircleTimer
                                        key={timerKey}
                                        isPlaying
                                        duration={
                                            stage === "getReady"
                                                ? 10
                                                : stage === "exercise"
                                                ? value
                                                : 10
                                        }
                                        colors={[
                                            "#00c896",
                                            "#d1a338",
                                            "#e64848",
                                        ]}
                                        size={HP(35)}
                                        colorsTime={[10, 5, 0]}
                                        onComplete={handleNextStage}
                                    >
                                        {({ remainingTime }) => (
                                            <View
                                                style={{
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <Text style={styles.time}>
                                                    {formatTime(remainingTime)}
                                                </Text>
                                            </View>
                                        )}
                                    </CountdownCircleTimer>
                                </View>
                            </>
                        )}
                        {exercise.exercise.type === "reps" && (
                            <RepsScreen
                                value={value}
                                currentSet={currentSet}
                                onComplete={handleNextStage}
                                sets={sets}
                                setCurrentSet={setCurrentSet}
                            />
                        )}
                        {exercise.exercise.type === "distance" && (
                            <DistanceScreen
                                value={value}
                                currentSet={currentSet}
                                onComplete={handleNextStage}
                            />
                        )}
                    </>
                )}
            </View>
        </SafeAreaView>
    );
}

const RepsScreen = ({ value, currentSet, onComplete, sets, setCurrentSet }) => {
    const [currentRep, setCurrentRep] = useState(1);

    const handleNextRep = () => {
        if (currentRep < value) {
            if (currentSet <= sets) {
                setCurrentRep((prev) => prev + 1);
            } else {
                onComplete();
            }
        } else {
            if (currentSet == sets) {
                onComplete();
            } else {
                setCurrentRep(0);
                setCurrentSet((prev) => prev + 1);
            }
        }
    };

    return (
        <View style={styles.content}>
            <Text style={styles.time}>
                Set {currentSet}: Rep {currentRep} of {value}
            </Text>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
                <TouchableOpacity
                    onPress={handleNextRep}
                    style={styles.nextButton}
                >
                    <Text style={styles.nextText}>Done</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const DistanceScreen = ({ value, currentSet, onComplete }) => {
    const [distance, setDistance] = useState(0);

    const handleUpdateDistance = () => {
        if (distance < value) {
            setDistance((prev) => prev + 1); // Simulating distance tracking
        } else {
            onComplete();
        }
    };

    return (
        <View style={styles.content}>
            <Text style={styles.time}>
                Set {currentSet}: {distance} / {value} meters
            </Text>
            <TouchableOpacity
                onPress={handleUpdateDistance}
                style={styles.nextButton}
            >
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
        flex: 1,
        padding: WP(4),
    },
    time: {
        color: MyColors(1).white,
        fontWeight: "bold",
        fontSize: HP(6),
        textAlign: "center",
    },
    nextButton: {
        marginTop: 20,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: MyColors(1).green,
        padding: 10,
        borderRadius: WP(4),
        justifyContent: "center",
        width: WP(40),
    },
    nextText: {
        color: "white",
        fontWeight: "bold",
        fontSize: HP(1.7),
    },
    completeText: {
        color: MyColors(1).white,
        fontWeight: "bold",
        fontSize: 24,
        textAlign: "center",
    },
    completeButton: {
        marginTop: 20,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: MyColors(1).green,
        padding: 10,
        borderRadius: WP(4),
        justifyContent: "center",
        width: WP(60),
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 18,
    },
});
