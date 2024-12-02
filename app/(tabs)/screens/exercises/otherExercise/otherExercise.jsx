import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import {
    widthPercentageToDP as WP,
    heightPercentageToDP as HP,
} from "react-native-responsive-screen";
import { MyColors } from "@/constants/myColors";
import { Entypo } from "@expo/vector-icons";
import { useAuth } from "@/components/auth/authProvider";
import { getAuth } from "firebase/auth";
import {
    doc,
    getDocs,
    collection,
    getDoc,
    setDoc,
    updateDoc,
    arrayRemove,
} from "firebase/firestore";
import { db, storage } from "@/components/firebase/config";
import { deleteObject } from "firebase/storage";
import Loading from "@/components/customs/loading";

export default function OtherExercise({ item, back }) {
    const [adding, setAdding] = useState(false);
    const { user, updateUserData } = useAuth();

    const auth = getAuth();
    const currentUser = auth.currentUser;

    const addToPlan = async () => {
        setAdding(true);
        try {
            const userDocRef = doc(db, "users", currentUser.uid);
            const subCollectionRef = collection(userDocRef, "exercisePlans");

            const subCollectionExists = (await getDocs(subCollectionRef)).empty;

            if (subCollectionExists) {
                return;
            } else {
                const querySnapshot = await getDocs(subCollectionRef);

                querySnapshot.docs.map(async (doc) => {
                    const exercisePlans = doc.data().exercisePlans || [];

                    await updateDoc(doc.ref, {
                        exercisePlans: [...exercisePlans, item],
                    });

                    const otherExercise = doc.data().otherExercise || [];
                    console.log(otherExercise);
                });

                deleteExercise();
                updateUserData(currentUser.uid);
            }
        } catch (error) {
            console.error("Error saving exercise data to Firestore:", error);
        } finally {
            updateUserData(currentUser.uid);
            setAdding(false);
        }
    };

    const deleteExercise = async () => {
        setAdding(true);
        try {
            const userDocRef = doc(db, "users", currentUser.uid);
            const subCollectionRef = collection(userDocRef, "exercisePlans");

            const querySnapshot = await getDocs(subCollectionRef);
            querySnapshot.docs.map(async (doc) => {
                const exercisePlans = doc.data().otherExercise || [];

                // Check if the exercise is in the plans
                if (exercisePlans.some((ex) => ex.title === item.title)) {
                    await updateDoc(doc.ref, {
                        otherExercise: arrayRemove(item), // This will remove the exercise from the array
                    });
                }
            });
            await updateUserData();
        } catch (error) {
            console.error(
                "Error deleting exercise data from Firestore:",
                error
            );
        } finally {
            setAdding(false);
            back();
        }
    };

    return (
        <ScrollView
            contentContainerStyle={{
                alignItems: "center",
                justifyContent: "center",
                paddingBottom: HP(8),
            }}
        >
            <View style={{ padding: WP(5), gap: WP(3), flex: 1 }}>
                {/* Title */}
                <Text
                    style={{
                        color: MyColors(0.8).green,
                        fontSize: WP(6),
                        fontWeight: "bold",
                    }}
                >
                    {item?.title}
                </Text>

                {/* Description */}
                <Text
                    style={{
                        color: MyColors(0.8).white,
                        marginVertical: HP(1),
                    }}
                >
                    {item?.planDescription}
                </Text>

                {/* Objectives */}
                <View style={{ gap: WP(2) }}>
                    <Text
                        style={{
                            color: MyColors(0.8).green,
                            fontSize: WP(4),
                            fontWeight: "bold",
                        }}
                    >
                        Upon completing this exercise plan you are expected to:
                    </Text>
                    {item?.generalObjectives?.map((obj, index) => (
                        <View
                            key={index}
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                            }}
                        >
                            <Text
                                style={{
                                    color: MyColors(0.8).white,
                                    fontSize: 12,
                                }}
                            >
                                <Entypo
                                    name="dot-single"
                                    size={14}
                                    color={MyColors(1).white}
                                />

                                {obj}
                            </Text>
                        </View>
                    ))}
                </View>

                <View
                    style={{
                        marginTop: HP(4),
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    {!adding ? (
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-around",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <View
                                style={{
                                    borderRadius: WP(6),
                                    borderWidth: 1,
                                    borderColor: MyColors(1).red,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: HP(5),
                                    overflow: "hidden",
                                }}
                            >
                                <TouchableOpacity
                                    onPress={deleteExercise}
                                    style={{
                                        backgroundColor: MyColors(1).gray,
                                        width: WP(40),
                                        height: "100%",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: MyColors(1).red,
                                            fontSize: WP(4),
                                            fontWeight: "bold",
                                        }}
                                    >
                                        Delete
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View
                                style={{
                                    borderRadius: WP(6),
                                    borderWidth: 1,
                                    borderColor: MyColors(1).green,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: HP(5),
                                    overflow: "hidden",
                                }}
                            >
                                <TouchableOpacity
                                    onPress={addToPlan}
                                    style={{
                                        backgroundColor: MyColors(1).gray,
                                        width: WP(40),
                                        height: "100%",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: MyColors(0.8).green,
                                            fontSize: WP(4),
                                            fontWeight: "bold",
                                        }}
                                    >
                                        Add to my plan
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : (
                        <View style={{ height: HP(5) }}>
                            <Loading />
                        </View>
                    )}
                </View>
            </View>
        </ScrollView>
    );
}
