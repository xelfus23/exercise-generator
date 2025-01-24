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
    setPersistence,
    browserLocalPersistence,
    inMemoryPersistence,
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
import { router, useNavigation } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        emailVerified: false,
        nickName: "",
        gender: "unspecified",
        mainGoal: "unspecified",
        birthDate: { day: 1, month: 1, year: 2000 },
        bodyMetrics: {
            heightAndWeight: {
                height: 0,
                weight: 0,
                heightUnit: "cm",
                weightUnit: "kg",
            },
            circumferences: { neck: 0, hip: 0, waist: 0, unit: "cm" },
        },
        fitnessLevel: "beginner",
        activityLevel: "low",
        selectedPlace: "unspecified",
        exercisePlans: [],
        otherExercise: [],
    });
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
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [initialDataFetched, setInitialDataFetched] = useState(false);
    const [initialUser, setInitialUser] = useState(false);

    const navigation = useNavigation();

    const calculateEverything = () => {
        console.log("calculateEverything: exercisePlans", exercisePlans);
        if (!user || !exercisePlans?.length) {
            console.log("No exercise plans to calculate.");
            return;
        }

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

        const newTodayFormatted = `${todayWeekDay}, ${
            todayParts[0] - 1
        }/${Number(todayParts[1])}/${todayParts[2].trim()}`; // Rebuild formatted date with adjusted month

        const todayYear = new Date().getFullYear();
        const todayMonth = new Date().getMonth(); // Adjust to 1-based month
        const todayDate = new Date().getDate();

        const newToday = new Date(todayYear, todayMonth, todayDate);

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

    // Corrected onAuthStateChanged
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
            setIsAuthenticated(!!userAuth);
            console.log("onAuthStateChanged - userAuth:", userAuth);
            if (userAuth) {
                console.log(
                    "onAuthStateChanged - user authenticated, updating data"
                );
                await updateUserData(userAuth.uid);
            } else {
                console.log(
                    "onAuthStateChanged - user not authenticated, resetting navigation to start"
                );
                navigation.reset({ index: 0, routes: [{ name: "start" }] });
                setInitialDataFetched(false);
            }
        });
        return unsubscribe;
    }, [isAuthenticated]);

    useEffect(() => {
        console.log(
            "useEffect - user, isLoading, initialDataFetched change",
            user,
            isLoading,
            initialDataFetched
        );
        if (user && !isLoading && initialDataFetched) {
            console.log("useEffect - checkInitializationStatus");
            checkInitializationStatus(user);
        }
    }, [isAuthenticated, isLoading, initialDataFetched, initialUser]);

    const checkInitializationStatus = async (obj) => {
        console.log("checkInitializationStatus - obj:", obj);
        if (obj?.nickName) {
            console.log(
                "checkInitializationStatus - nickname present, navigating to homeStack"
            );
            navigation.reset({
                index: 0,
                routes: [{ name: "homeStack" }],
            });
            return true;
        } else {
            console.log(
                "checkInitializationStatus - nickname not present, navigating to getDetails"
            );
            navigation.reset({
                index: 0,
                routes: [{ name: "getDetails" }],
            });
            return false;
        }
    };

    const updateUserData = async (userID) => {
        if (!userID) {
            console.log("updateUserData: No user ID provided.");
            return;
        }

        try {
            if (!currentUser) {
                console.log("updateUserData: User not authenticated.");
                throw new Error("User not authenticated.");
            }
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
                        }
                        if (exerciseData?.exercisePlans?.length > 0) {
                            exerciseData?.exercisePlans?.map((plan) => {
                                exercisePlans.push(plan);
                            });
                        }
                    }
                });

                console.log("updateUserData: User data fetched:", userData);

                // Create the updated user object without doing a full spread.
                const userData = {
                    firstName: data.firstName || "",
                    lastName: data.lastName || "",
                    email: currentUser.email || "",
                    emailVerified: currentUser.emailVerified || false,
                    nickName: data.nickName || "",
                    gender: data.gender || "unspecified",
                    mainGoal: data.mainGoal || "unspecified",
                    birthDate: {
                        day: data.birthDate?.day || 1,
                        month: data.birthDate?.month || 1,
                        year: data.birthDate?.year || 2000,
                    },
                    bodyMetrics: {
                        heightAndWeight: {
                            height: data.heightAndWeight?.height || 0,
                            weight: data.heightAndWeight?.weight || 0,
                            heightUnit:
                                data.heightAndWeight?.heightUnit || "cm",
                            weightUnit:
                                data.heightAndWeight?.weightUnit || "kg",
                        },
                        circumferences: {
                            neck: data.bodyMeasurements?.neck || 0,
                            hip: data.bodyMeasurements?.hip || 0,
                            waist: data.bodyMeasurements?.waist || 0,
                            unit: data.bodyMeasurements?.unit || "cm",
                        },
                    },
                    fitnessLevel: data.fitnessLevel || "beginner",
                    activityLevel: data.activityLevel || "low",
                    selectedPlace: data.selectedPlace || "unspecified",
                    exercisePlans,
                    otherExercise: otherExercisePlan,
                };

                setUser((prev) => {
                    console.log(
                        "updateUserData: setUser is called",
                        prev,
                        "new:",
                        userData
                    );

                    let changes = false;
                    for (const key in userData) {
                        if (
                            JSON.stringify(prev[key]) !==
                            JSON.stringify(userData[key])
                        ) {
                            changes = true;
                        }
                    }
                    if (changes) return userData;
                    return prev;
                });
                setIsLoading(false);
                setInitialDataFetched(true);
                if (!initialUser) {
                    setInitialUser(true);
                }
            } else {
                console.error(
                    "updateUserData: User document not found in Firestore."
                );
                return;
            }
        } catch (e) {
            console.log("updateUserData: Error fetching user data:", e);
            setIsLoading(false);
        }
    };

    console.log("Exercise plan data:", exercisePlans);

    const login = async (email, password) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setIsAuthenticated(true);
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
            setIsLoading(true);
            // calculateEverything();
            setTodayExercise([]);
            setAllCompletedExercise([]);
            setProgress(0);
            setUser({
                firstName: "",
                lastName: "",
                email: "",
                emailVerified: false,
                nickName: "",
                gender: "unspecified",
                mainGoal: "unspecified",
                birthDate: { day: 1, month: 1, year: 2000 },
                bodyMetrics: {
                    heightAndWeight: {
                        height: 0,
                        weight: 0,
                        heightUnit: "cm",
                        weightUnit: "kg",
                    },
                    circumferences: { neck: 0, hip: 0, waist: 0, unit: "cm" },
                },
                fitnessLevel: "beginner",
                activityLevel: "low",
                selectedPlace: "unspecified",
                exercisePlans: [],
                otherExercise: [],
            });
            navigation.reset({
                index: 0,
                routes: [{ name: "login" }],
            });
            return { success: true };
        } catch (e) {
            return { success: false, msg: e.message, error: e };
        }
    };

    const register = async (fName, lName, pw, email) => {
        console.log("register: Attempting registration with email:", email);
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
            console.log(
                "register: Registration successful, data:",
                response?.user
            );
            await updateUserData(response?.user?.uid);
            return { success: true, data: response?.user };
        } catch (e) {
            let msg = e.message;
            console.log(
                "register: Registration failed. Error:",
                e,
                "Message:",
                msg
            );
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
                setIsAuthenticated,
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
                isLoading,
                showModal,
                setShowModal,
                calculateEverything,
                checkInitializationStatus,
                initialUser,
                setInitialUser,
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
