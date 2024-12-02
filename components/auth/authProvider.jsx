import { Alert } from "react-native";
import { auth, db, userRef } from "../firebase/config";
import {
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    reauthenticateWithCredential,
    EmailAuthProvider,
    updatePassword,
    getAuth,
} from "firebase/auth";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const otherExercise = user?.otherExercise || [];
    const exercisePlans = user?.exercisePlans || [];

    const currentUser = getAuth().currentUser;
    const today = new Date();

    const [progress, setProgress] = useState(0);
    const [weekProgress, setWeekProgress] = useState(0);
    const [exercisePlanInAWeek, setExercisePlanInAWeek] = useState([]);
    const [allCompletedExercise, setAllCompletedExercise] = useState([]);
    const [completedExerciseToday, setCompletedExerciseToday] = useState([]);
    const [todayExercise, setTodayExercise] = useState([]);

    const calculateEverything = () => {
        console.log(exercisePlans)
        if (exercisePlans?.length === 0) return;

        let exercisePlanToday = [],
            everyExercise = [],
            completedExerciseToday = [],
            everyCompletedExercise = [],
            dailyExercise = [];

        const todayFormatted = today.toLocaleString("en-US", {
            month: "numeric",
            day: "numeric", // Include day for comparison
            year: "numeric",
            timeZone: "Asia/Manila",
        });

        const todayWeekDay = today.toLocaleString("en-US", {
            weekday: "long",
            timeZone: "Asia/Manila",
        });

        const todayParts = todayFormatted.split("/"); // Split by '/'

        const newTodayFormatted = `${todayWeekDay}, ${todayParts[0] - 1}/${Number(
            todayParts[1]
        )}/${todayParts[2].trim()}`; // Rebuild formatted date with adjusted month

        const todayYear = new Date().getFullYear();
        const todayMonth = new Date().getMonth(); // Adjust to 1-based month
        const todayDate = new Date().getDate();

        const newToday = new Date(todayYear, todayMonth, todayDate);
        console.log(newTodayFormatted);

        exercisePlans?.forEach((plan) => {
            plan?.weeks?.map((week, i1) => {
                week?.[`week${i1 + 1}`]?.map((day, i2) => {
                    const dayFormatted = `${day?.weekday}, ${day?.month}/${day?.date}/${day?.year}`;

                    // const dayDateObj = new Date(dayYear, dayMonth , dayDate);

                    const dayDateOjb = new Date(
                        day?.year,
                        day?.month,
                        day?.date
                    );

                    if (dayDateOjb < newToday) {
                        addCompletedDay(day);
                    }

                    if (newTodayFormatted === dayFormatted) {
                        day?.[`day${i2 + 1}`]?.map((exe) => {
                            if (exe) {
                                if (exe.completed === true) {
                                    completedExerciseToday = [
                                        ...completedExerciseToday,
                                        {
                                            exercise: exe,
                                            plan: plan,
                                        },
                                    ];
                                }
                                exercisePlanToday = [
                                    ...exercisePlanToday,
                                    { exercise: exe, plan: plan },
                                ];
                            }
                        });
                    }

                    day?.[`day${i2 + 1}`]?.map((exe) => {
                        everyExercise.push(exe);
                        if (exe.completed === true) {
                            everyCompletedExercise = [
                                ...everyCompletedExercise,
                                { exercise: exe, plan: plan },
                            ];
                        }
                    });
                });
            });
        });

        const dayExercise = exercisePlanToday.filter(
            (exe) => exe?.exercise?.name !== "Rest Day"
        );
        const daily =
            (completedExerciseToday?.length / dayExercise?.length) * 100;

        setProgress(daily);
        setTodayExercise(exercisePlanToday);
        setCompletedExerciseToday(completedExerciseToday);
        setAllCompletedExercise(everyCompletedExercise);
    };

    const addCompletedDay = async (value) => {
        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (!currentUser) throw new Error("User not authenticated");

        try {
            const docRef = doc(db, "users", currentUser.uid);
            const docSnapshot = await getDoc(docRef);
            const exercisePlansRef = collection(docRef, "exercisePlans");
            const exercisesSnapshot = await getDocs(exercisePlansRef);

            if (docSnapshot.exists()) {
                exercisesSnapshot?.forEach(async (exerciseDoc) => {
                    const exerciseData = exerciseDoc.data();
                    let isUpdated = false;
                    let completedDayInAWeek = [];
                    if (exerciseData) {
                        if (exerciseData?.exercisePlans?.length > 0) {
                            exerciseData?.exercisePlans.map((plan) => {
                                plan?.weeks?.map((week, i1) => {
                                    week?.[`week${i1 + 1}`]?.map((day, i2) => {
                                        if (
                                            value.date === day.date &&
                                            value.weekday === day.weekday &&
                                            value.year === day.year &&
                                            value.month === day.month &&
                                            !day.completed
                                        ) {
                                            day.completed = true; // Mark day as completed
                                            isUpdated = true;
                                        }
                                        if (day.completed) {
                                            completedDayInAWeek.push(day);
                                        }
                                    });

                                    console.log(completedDayInAWeek.length);

                                    if (completedDayInAWeek.length === 7) {
                                        handleAddWeek(plan);
                                        console.log("Adding week");
                                    }
                                });
                            });

                            if (isUpdated) {
                                const planDocRef = doc(
                                    exercisePlansRef,
                                    exerciseDoc.id
                                );

                                // Debugging: Log the updated structure
                                console.log(
                                    "Updated exerciseData before saving:",
                                    exerciseData
                                );

                                // Write the updated data back to Firestore
                                await updateDoc(planDocRef, {
                                    exercisePlans: exerciseData.exercisePlans, // Update the entire exercisePlans array
                                });
                                console.log(
                                    "Day marked as completed in Firestore."
                                );
                            } else {
                                console.log("No matching day found to update.");
                            }
                        } else {
                            console.log("No exercise data found");
                        }
                    }
                });
            } else {
                console.log("Error");
            }
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        calculateEverything();
    }, [user]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (userAuth) => {
            if (userAuth) {
                setIsAuthenticated(true);
                console.log("User is Authenticated");
            } else {
                setIsAuthenticated(false);
                setUser(null);
                console.log("User is not authenticated");
            }
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        updateUserData(currentUser?.uid);
    }, [isAuthenticated]);

    const updateUserData = async (userID) => {
        try {
            if (!currentUser) throw new Error("User not authenticated.");

            const docRef = doc(db, "users", userID);
            const docSnapShot = await getDoc(docRef);
            const exercisePlanRef = collection(docRef, "exercisePlans");
            const exerciseSnapShot = await getDocs(exercisePlanRef);

            if (docSnapShot.exists()) {
                const data = docSnapShot.data();
                let exercisePlans = [];
                let otherExercisePlan = [];

                exerciseSnapShot?.forEach((docs) => {
                    const exerciseData = docs.data();
                    if (exerciseData) {
                        if (exerciseData?.otherExercise?.length > 0) {
                            exerciseData?.otherExercise?.map((plan) => {
                                otherExercisePlan.push(plan);
                            });
                        } else {
                            console.log("No other exercise data found.");
                        }
                        if (exerciseData?.exercisePlans?.length > 0) {
                            exerciseData?.exercisePlans?.map((plan) => {
                                exercisePlans.push(plan);
                            });
                        } else {
                            console.log("No exercise data found.");
                        }
                    }
                });

                setUser({
                    ...user,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: currentUser.email,
                    emailVerified: currentUser.emailVerified,
                    gender: data.gender,
                    mainGoal: data.mainGoal,
                    birthDate: {
                        day: data.birthDate?.day,
                        month: data.birthDate?.month,
                        year: data.birthDate?.year,
                    },
                    bodyMetrics: {
                        heightAndWeight: {
                            height: data.heightAndWeight?.height,
                            weight: data.heightAndWeight?.weight,
                            heightUnit: data.heightAndWeight?.heightUnit,
                            weightUnit: data.heightAndWeight?.weightUnit,
                        },
                        circumferences: {
                            neck: data.bodyMeasurements?.neck,
                            hip: data.bodyMeasurements?.hip,
                            waist: data.bodyMeasurements?.waist,
                            unit: data.bodyMeasurements?.unit,
                        },
                    },
                    fitnessLevel: data.fitnessLevel,
                    activityLevel: data.activityLevel,
                    selectedPlace: data.selectedPlace,
                    exercisePlans: exercisePlans,
                    otherExercise: otherExercisePlan,
                });
            } else {
                console.log("User document not found.");
            }
        } catch (e) {
            console.log("Error fetching user data: ", e);
        }
    };

    const login = async (email, password) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            return { success: true };
        } catch (e) {
            let msg = e.message;
            if (msg.includes("(auth/invalid-email)")) msg = "Invalid Email.";
            if (msg.includes("(auth/invalid-credential)."))
                msg = "Invalid Email or Password.";
            return { success: false, msg };
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            return { success: true };
        } catch (e) {
            return { success: false, msg: e.message, error: e };
        }
    };

    const register = async (fName, lName, pw, email) => {
        try {
            const response = await createUserWithEmailAndPassword(
                auth,
                email,
                pw
            );
            await setDoc(doc(db, "users", response?.user?.uid), {
                firstName: fName,
                lastName: lName,
                userID: response?.user?.uid,
            });
            setUser(response.user);
            setIsAuthenticated(true);
            await updateUserData(response.user.uid);
            return { success: true, data: response?.user };
        } catch (e) {
            let msg = e.message;
            if (msg.includes("(auth/invalid-email)")) msg = "Invalid email";
            if (msg.includes("(auth/email-already-in-use)"))
                msg = "This email is already in use";
            if (msg.includes("(auth/missing-email)"))
                msg = "Enter your email address";
            return { success: false, msg };
        }
    };

    const changePassword = async (currentPassword, newPassword) => {
        try {
            const credential = EmailAuthProvider.credential(
                currentUser.email,
                currentPassword
            );
            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, newPassword);
            return { success: true };
        } catch (e) {
            Alert.alert("Error:", e.message);
            let msg = e.message;
            if (msg.includes("(auth/invalid-credential)"))
                msg = "Incorrect Password.";
            return { success: false, msg };
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                updateUserData,
                login,
                register,
                logout,
                changePassword,
                updatePassword,
                exercisePlans,
                todayExercise,
                otherExercise,
                progress,
                weekProgress,
                exercisePlanInAWeek,
                completedExerciseToday,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("userAuth must be used within an AuthContextProvider");
    }
    return context;
};
