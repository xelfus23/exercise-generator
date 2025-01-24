import React, { useState, useEffect } from "react";
import { useNavigation } from "expo-router";
import { useAuth } from "@/components/auth/authProvider";
import {
    setDoc,
    doc,
    getDoc,
    updateDoc,
    collection,
    getDocs,
} from "firebase/firestore";
import { db } from "@/components/firebase/config";
import { getAuth } from "firebase/auth";

export const addToRecent = async (item) => {
    let complete = false;

    try {
        const auth = getAuth();
        const user = auth.currentUser;

        await setDoc(
            doc(db, "users", user.uid),
            {
                recentExercises: item,
            },
            { merge: true }
        );
        complete = true;
    } catch (error) {
        console.error("Error saving recent", error);
        complete = false;
    }
    return complete;
};

export const addComplete = async (
    localUser,
    item,
    value,
    sets,
    index,
    exercisePlans,
    dayCount
) => {
    try {
        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (!currentUser) throw new Error("User not authenticated");

        const exerciseKey = item?.exercise?.key; // Unique key for the exercise
        const exerciseName = item?.exercise?.name;

        // Construct the Firestore document path
        const userDocRef = doc(db, "users", currentUser.uid); // Reference to the user's document
        const exercisePlansRef = collection(userDocRef, "exercisePlans"); // Reference to the subcollection

        // Retrieve the existing exercisePlan data (assuming a single document)
        const docSnap = await getDocs(exercisePlansRef);
        if (!docSnap.empty) {
            const exercisePlans = docSnap.docs[0].data().exercisePlans; // Get the exercisePlans data from the first document

            exercisePlans.forEach((exercisePlan) => {
                exercisePlan?.weeks?.map((week, i1) => {
                    week?.[`week${i1 + 1}`]?.map((day, i2) => {
                        day?.[`day${i2 + 1}`]?.map((exe) => {
                            if (
                                exe.key === exerciseKey &&
                                exe.name === exerciseName
                            ) {
                                // If the key matches, update the exercise as completed
                                if (exe.type === "duration") {
                                    exe.completed = true;
                                    exe.sets = sets ?? 0;
                                    exe.duration = value ?? 0;
                                } else {
                                    exe.completed = true;
                                    exe.sets = sets ?? 0;
                                    exe.reps = value ?? 0;
                                }
                            }
                        });
                    });
                });
            });

            const exercisePlansDocRef = doc(
                exercisePlansRef,
                docSnap.docs[0].id
            );

            await updateDoc(exercisePlansDocRef, {
                exercisePlans: exercisePlans,
            });

            return { success: true };
        } else {
            console.error("Exercise plans document not found.");
        }
    } catch (error) {
        console.error("Error completing exercise:", error);
    }
};

export default { addToRecent, addComplete };
