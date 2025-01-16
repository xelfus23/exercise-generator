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

const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
        2,
        "0"
    )}`;
};

export default function ExerciseContent({ route }) {
    const { exercise, value, sets } = route.params; // Exercise type, duration/value, and sets
    const [currentSet, setCurrentSet] = useState(1); // Current set tracker
    const [stage, setStage] = useState("getReady"); // Phases: "getReady", "exercise", "rest", "complete"
    const [timerKey, setTimerKey] = useState(0); // To reset timers

    useEffect(() => {
        setCurrentSet(1);
        setStage("getReady");
        setTimerKey(0);
    }, []);

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
            setStage("exercise")
        }
        setTimerKey((prev) => prev + 1);
    };

    const completeExercise = () => {
        console.log("Exercise completed");
        // Logic to navigate or update progress
    };

    return (
        <SafeAreaView style={styles.mainContainer}>
            <Header title={`${exercise.exercise.name} - Set ${currentSet} of ${sets}`} />
            <View style={styles.content}>
                {stage === "complete" ? (
                    <View>
                        <Text style={styles.completeText}>
                            Exercise Completed!
                        </Text>
                        <TouchableOpacity
                            style={styles.completeButton}
                            onPress={completeExercise}
                        >
                            <Text style={styles.buttonText}>Finish</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        {exercise.exercise.type === "duration" && (
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
                                colors={["#00c896", "#d1a338", "#e64848"]}
                                colorsTime={[10, 5, 0]}
                                onComplete={handleNextStage}
                            >
                                {({ remainingTime }) => (
                                    <Text style={styles.time}>
                                        {stage === "getReady" && "Get Ready"}
                                        {stage === "exercise" && "Exercise"}
                                        {stage === "rest" && "Rest"}
                                        {`\n${formatTime(remainingTime)}`}
                                    </Text>
                                )}
                            </CountdownCircleTimer>
                        )}
                        {exercise.exercise.type === "reps" && (
                            <RepsScreen
                                value={value}
                                currentSet={currentSet}
                                onComplete={handleNextStage}
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

const RepsScreen = ({ value, currentSet, onComplete }) => {
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
            <Text style={styles.time}>
                Set {currentSet}: Rep {currentRep} of {value}
            </Text>
            <TouchableOpacity onPress={handleNextRep} style={styles.nextButton}>
                <Feather name="arrow-right" size={24} color="white" />
                <Text style={styles.nextText}>Next Rep</Text>
            </TouchableOpacity>
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
        <View style={styles.repsContainer}>
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
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
    },
    time: {
        color: MyColors(1).white,
        fontWeight: "bold",
        fontSize: 24,
        textAlign: "center",
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
    completeText: {
        color: MyColors(1).white,
        fontWeight: "bold",
        fontSize: 24,
        textAlign: "center",
    },
    completeButton: {
        marginTop: 20,
        backgroundColor: "#00c896",
        padding: 15,
        borderRadius: 10,
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 18,
    },
});
