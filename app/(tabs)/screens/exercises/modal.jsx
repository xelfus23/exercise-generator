import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Touchable,
} from "react-native";
import {
    heightPercentageToDP as HP,
    widthPercentageToDP as WP,
} from "react-native-responsive-screen";
import React, { useState, useEffect } from "react";
import { MyColors } from "@/constants/myColors";
import Entypo from "@expo/vector-icons/Entypo";
import { AntDesign } from "@expo/vector-icons";
import { useAuth } from "@/components/auth/authProvider";
import { useNavigation } from "expo-router";
import { addToRecent } from "./exercisehandler.jsx";
import { getAuth } from "firebase/auth";
import { AnatomyFront, AnatomyBack } from "@/components/customs/anatomy.jsx";

export default function Exercise({ selectedItem, closeModal }) {
    const { user, updateUserData } = useAuth();
    const currentUser = getAuth().currentUser;

    const item = selectedItem.item;
    const index = selectedItem.index;

    const [duration, setDuration] = useState(item?.exercise?.duration || 0);
    const [repeats, setRepeats] = useState(item?.exercise?.reps || 0);
    const [sets, setSets] = useState(item?.exercise?.sets || 0);
    const [distance, setDistance] = useState(item?.exercise?.distance || 0);

    const [totalCalories, setTotalCalories] = useState(0); // New state for total calories

    const calculateCalories = () => {
        const calorie = item?.exercise?.calories || 0;
        let totalBurn = 0;

        if (item?.exercise?.type === "duration") {
            totalBurn = duration * 0.1; // Adjust multiplier for duration
        } else if (item?.exercise?.type === "reps") {
            totalBurn = (repeats * sets * calorie) / 25;
        }

        setTotalCalories(totalBurn);
    };

    useEffect(() => {
        calculateCalories();
    }, [repeats, sets]);

    const addRepeats = () => {
        if (repeats < 60) {
            setRepeats(repeats + 1);
        }
    };

    const minusRepeats = () => {
        if (repeats > 0) {
            setRepeats(repeats - 1);
        }
    };

    const addSets = () => {
        if (sets < 60) {
            setSets(sets + 1);
        }
    };

    const minusSets = () => {
        if (sets > 1) {
            setSets(sets - 1);
        }
    };

    const addDuration = () => {
        if (duration < 3600) {
            if (duration >= 600) {
                // change condition to include 600
                setDuration(duration + 60);
            } else {
                // no need for else if since duration < 600
                setDuration(duration + 5);
            }
        }
    };

    const minusDuration = () => {
        if (duration > 10) {
            if (duration >= 600) {
                // change condition to include 600
                setDuration(duration - 60);
            } else {
                // no need for else if since duration < 600
                setDuration(duration - 5);
            }
        }
    };

    const addDistance = () => {
        if (distance < 20) {
            setDistance(distance + 0.1);
        }
    };

    const minusDistance = () => {
        if (distance > 0) {
            setDistance(distance - 0.1);
        }
    };

    const formatTime = (totalSeconds) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}`;
    };

    const navigation = useNavigation();

    const startExercise = ({ item, value }) => {
        closeModal();
        addToRecent(item);
        navigation.navigate("ExerciseContent", {
            exercise: item,
            value: value,
            index: index,
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.nameContainer}>
                <TouchableOpacity onPress={closeModal}>
                    <Text style={{ color: MyColors(1).white }}>
                        <AntDesign
                            name="closecircleo"
                            size={30}
                            color={MyColors(1).green}
                        />
                    </Text>
                </TouchableOpacity>
                <View>
                    <Text style={styles.name}>{item?.exercise?.name}</Text>
                    <Text
                        style={{ color: MyColors(1).yellow, fontSize: HP(1.2) }}
                    >
                        {item?.plan.title}
                    </Text>
                </View>

                <View style={styles.playContainer}>
                    <TouchableOpacity
                        style={{ width: HP(6) }}
                        onPress={() =>
                            startExercise({
                                item: item,
                                value: duration || repeats || distance,
                                sets: sets,
                            })
                        }
                    >
                        <AntDesign
                            name="play"
                            size={HP(6)}
                            color={MyColors(1).green}
                        />
                    </TouchableOpacity>

                    <View style={{ gap: WP(1) }}>
                        <View style={styles.durationContainer}>
                            <Text style={styles.durationLabel}>SETS</Text>

                            <View style={styles.DButtonContainer}>
                                <TouchableOpacity onPress={minusSets}>
                                    <AntDesign
                                        name="caretdown"
                                        size={WP(3)}
                                        color={MyColors(1).white}
                                        style={styles.durationButtons}
                                    />
                                </TouchableOpacity>
                                <Text style={styles.duration}>{sets}</Text>
                                <TouchableOpacity onPress={addSets}>
                                    <AntDesign
                                        name="caretup"
                                        size={WP(3)}
                                        color={MyColors(1).white}
                                        style={styles.durationButtons}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.durationContainer}>
                            <Text style={styles.durationLabel}>
                                {item?.exercise.type === "duration"
                                    ? "DURATION"
                                    : item?.exercise.type === "reps"
                                    ? "REPEATS"
                                    : "DISTANCE"}
                            </Text>

                            <View style={styles.DButtonContainer}>
                                <TouchableOpacity
                                    onPress={
                                        item?.exercise.type === "duration"
                                            ? minusDuration
                                            : item?.exercise.type === "reps"
                                            ? minusRepeats
                                            : minusDistance
                                    }
                                >
                                    <AntDesign
                                        name="caretdown"
                                        size={WP(3)}
                                        color={MyColors(1).white}
                                        style={styles.durationButtons}
                                    />
                                </TouchableOpacity>
                                <Text style={styles.duration}>
                                    {item?.exercise.type === "duration"
                                        ? formatTime(duration)
                                        : item?.exercise?.type === "reps"
                                        ? repeats
                                        : distance.toFixed(2) + " km"}
                                </Text>
                                <TouchableOpacity
                                    onPress={
                                        item?.exercise.type === "duration"
                                            ? addDuration
                                            : item?.exercise?.type === "reps"
                                            ? addRepeats
                                            : addDistance
                                    }
                                >
                                    <AntDesign
                                        name="caretup"
                                        size={WP(3)}
                                        color={MyColors(1).white}
                                        style={styles.durationButtons}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.itemContainer}>
                    {item.name !== "Rest Day" && (
                        <View>
                            <Text
                                style={[styles.label, { position: "static" }]}
                            >
                                Instructions:
                            </Text>
                            {item?.exercise?.instructions.map(
                                (value, index) => (
                                    <View
                                        style={styles.instructionsTextContainer}
                                        key={index}
                                    >
                                        <Entypo
                                            name="dot-single"
                                            size={24}
                                            color={MyColors(1).white}
                                        />
                                        <Text style={styles.instructions}>
                                            {value}
                                        </Text>
                                    </View>
                                )
                            )}
                        </View>
                    )}

                    <View>
                        <Text style={styles.label}>Benefits:</Text>

                        <View style={styles.instructionsTextContainer}>
                            <Entypo
                                name="dot-single"
                                size={24}
                                color={MyColors(1).white}
                            />
                            <Text style={styles.instructions}>
                                {item?.exercise?.benefits}
                            </Text>
                        </View>
                    </View>

                    <View>
                        <Text style={styles.label}>Equipment:</Text>

                        <View style={styles.instructionsTextContainer}>
                            <Entypo
                                name="dot-single"
                                size={24}
                                color={MyColors(1).white}
                            />
                            <Text style={styles.instructions}>
                                {item?.exercise?.equipment}
                            </Text>
                        </View>
                    </View>

                    <View>
                        <Text style={styles.label}>Estimated calory burn:</Text>

                        <View style={styles.instructionsTextContainer}>
                            <Entypo
                                name="dot-single"
                                size={24}
                                color={MyColors(1).white}
                            />
                            <Text style={styles.instructions}>
                                {totalCalories.toFixed(2)} cal
                            </Text>
                        </View>
                    </View>

                    <View>
                        <Text style={styles.label}>Muscle Group:</Text>
                        <View style={styles.muscleGroupContainer}>
                            {item?.exercise?.muscleGroups.map(
                                (value, index) => (
                                    <View
                                        style={styles.muscleGroup}
                                        key={index}
                                    >
                                        <Text style={styles.muscleGroupText}>
                                            {value}
                                        </Text>
                                    </View>
                                )
                            )}
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                backgroundColor: MyColors(0.1).white,
                                marginVertical: HP(2),
                                borderRadius: WP(4),
                                borderWidth: 1,
                                borderColor: MyColors(0.2).white,
                            }}
                        >
                            <AnatomyFront exercise={item} />
                            <View
                                style={{
                                    width: 1,
                                    height: "100%",
                                    backgroundColor: MyColors(0.2).white,
                                }}
                            />
                            <AnatomyBack exercise={item} />
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    duration: {
        color: MyColors(1).white,
        fontWeight: "bold",
        fontSize: WP(4),
        width: WP(15),
        textAlign: "center",
    },
    durationButtons: {
        backgroundColor: MyColors(1).green,
        padding: WP(1),
        borderRadius: WP(2),
    },
    durationLabel: {
        color: MyColors(1).white,
        fontWeight: "bold",
        fontSize: WP(4),
        marginRight: WP(2),
    },
    durationContainer: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-end",
        width: WP(70),
        justifyContent: "flex-end",
    },
    DButtonContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: WP(2),
    },
    playContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    itemContainer: {
        gap: WP(4),
    },
    muscleGroupText: {
        color: MyColors(1).white,
    },
    muscleGroupContainer: {
        flexDirection: "row",
        gap: WP(3),
    },
    muscleGroup: {
        backgroundColor: MyColors(1).gray,
        borderRadius: WP(4),
        padding: WP(3),
        height: HP(5),
    },
    instructionsTextContainer: {
        flexDirection: "row",
        marginRight: WP(5),
    },
    label: {
        color: MyColors(1).white,
        fontSize: 20,
        fontWeight: "bold",
        borderColor: MyColors(1).gray,
        paddingVertical: WP(4),
    },
    mainContainer: {},
    container: {
        padding: WP(4),
        gap: HP(2),
        backgroundColor: MyColors(1).black,
        borderWidth: 1,
        borderColor: MyColors(1).gray,
        borderRadius: WP(4),
        position: "absolute",
        height: HP(78),
        width: WP(100),
        bottom: 0,
    },
    name: {
        color: MyColors(1).white,
        fontWeight: "bold",
        fontSize: HP(3),
    },
    nameContainer: {
        gap: HP(2),
        borderBottomWidth: 1,
        borderColor: MyColors(1).gray,
        paddingBottom: WP(5),
    },
    instructions: {
        color: MyColors(1).white,
        fontSize: 14,
    },
});
