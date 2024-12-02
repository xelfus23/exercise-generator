import {
    setDoc,
    doc,
    collection,
    getDocs,
    serverTimestamp,
    getDoc,
    updateDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db, storage } from "@/components/firebase/config";
import { useAuth } from "@/components/auth/authProvider";
import tunedParts from "./AI/parts";
import { getDownloadURL, ref } from "firebase/storage";
import { useEffect, useState } from "react";

const generator = () => {
    const { user } = useAuth();
    const { GoogleGenerativeAI } = require("@google/generative-ai");
    const apiKey = "AIzaSyCmhylFECtUBZlWpD6LJIQn9llBPmqbZ_c";
    const genAI = new GoogleGenerativeAI(apiKey);
    const [AIparts, setAIParts] = useState(null);
    const currentUser = getAuth().currentUser;

    //TODO: Fetch every exercise week from firebase

    const getStorage = async (plan) => {
        try {
            const userDocRef = doc(db, "users", currentUser.uid);
            const docSnapShot = await getDoc(userDocRef);
            const subCollectionRef = collection(userDocRef, "exercisePlans");
            const exerciseSnapShot = await getDocs(subCollectionRef);

            if (docSnapShot.exists()) {
                let mainPlan = {};
                let week1 = {};

                let AI_PARTS = [];
                let otherWeeks = [];

                exerciseSnapShot?.forEach((doc) => {
                    const exerciseData = doc.data();
                    exerciseData?.exercisePlans?.forEach((pl) => {
                        if (pl.title === plan.title) {
                            // Extract the main plan (week1) and other weeks
                            mainPlan = { ...pl }; // Copy the plan data

                            // Separate out the weeks
                            pl.weeks?.forEach((week, index) => {
                                if (index === 0 && week.week1) {
                                    // Week1 for the main plan
                                    week1 = { week1: week.week1 };
                                    delete mainPlan.weeks;
                                } else {
                                    otherWeeks.push(
                                        {
                                            text: `input: Add week ${
                                                index + 1
                                            } to my plan`,
                                        },
                                        {
                                            text: `output: ${JSON.stringify(
                                                week
                                            )}`,
                                        },
                                        {
                                            text: `input: Add week ${
                                                pl.weeks.length + 1
                                            } to my plan, same JSON structure as the week ${
                                                pl.weeks.length
                                            }`,
                                        },
                                        {
                                            text: "output: ",
                                        }
                                    );
                                }
                            });

                            AI_PARTS =
                                otherWeeks.length > 0
                                    ? [
                                          {
                                              text: `You must upgrade the user plan, and this is the plan history`,
                                          },
                                          {
                                              text: `input: Add week 1 to my plan`,
                                          },
                                          {
                                              text: `output: ${JSON.stringify(
                                                  week1
                                              )}`,
                                          },
                                          ...otherWeeks,
                                      ]
                                    : [
                                          {
                                              text: `You must upgrade the user plan, and this is the plan history`,
                                          },
                                          {
                                              text: `input: Add week 1 to my plan`,
                                          },
                                          {
                                              text: `output: ${JSON.stringify(
                                                  week1
                                              )}`,
                                          },
                                          {
                                              text: `input: Add week 2 to my plan it should be same JSON structure as the week 1`,
                                          },
                                          { text: `output: ` },
                                      ];
                        }
                    });
                });

                return { AI_PARTS, mainPlan };
            }
        } catch (error) {
            console.log(error);
        }
    };

    const generationConfig = {
        temperature: 0.4,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
    };

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const exerciseGenerator = async (
        { input, setError, setGenerating, instructions },
        retries = 5
    ) => {
        console.log("Generating");
        setError && setError("generating exercise please wait...");
        if (instructions) {
            try {
                console.log(instructions)
                const model = genAI.getGenerativeModel({
                    model: "gemini-1.5-flash",
                    systemInstruction: instructions,
                });

                const parts = await tunedParts(input, AIparts);

                console.log(parts);
                setError && setError("generating...");
                try {
                    const results = await model.generateContent({
                        contents: [{ role: "user", parts }],
                        generationConfig,
                    });
                    const result = results.response.text(); // Ensure this is accessing the correct part of the response
                    if (result) {
                        return result;
                    }
                } catch (error) {
                    console.log("Error generating exercise:", error);
                    setError &&
                        setError(
                            "An error occurred while generating the exercise plan, please try again"
                        );
                }
            } catch (error) {
                if (retries > 0) {
                    console.log(`Retrying... (${5 - retries + 1}/5)`);
                    await delay(3000); // Delay for 2 seconds
                    return exerciseGenerator(
                        {
                            input: input,
                            setError: setError,
                            setGenerating: setGenerating,
                            instructions: instructions,
                        },
                        retries - 1
                    );
                } else {
                    setError &&
                        setError(
                            "Error: Unable to generate exercise plan after multiple attempts. Please try again later."
                        );
                    return null; // Return null or handle the failure case appropriately
                }
            }
        }
    };

    const upgradeExercisePlan = async ({ instructions, parts }) => {
        if (instructions) {
            try {
                const model = genAI.getGenerativeModel({
                    model: "gemini-1.5-flash",
                    systemInstruction: instructions,
                });

                try {
                    const results = await model.generateContent({
                        contents: [{ role: "user", parts }],
                        generationConfig,
                    });
                    const result = results.response.text(); // Ensure this is accessing the correct part of the response

                    if (result) {
                        return result;
                    }
                } catch (error) {
                    console.log("Error upgrading exercise:", error);
                }
            } catch (error) {
                await delay(3000);
                return upgradeExercisePlan({
                    instructions: instructions,
                });
            }
        }
    };

    const addUpgradeToDatabase = async (data, plan) => {
        try {
            const auth = getAuth();

            const currentUser = auth.currentUser;
            const userDocRef = doc(db, "users", currentUser.uid);
            const subCollectionRef = collection(userDocRef, "exercisePlans");

            const querySnapshot = await getDocs(subCollectionRef);

            const promises = querySnapshot.docs.map(async (doc) => {
                const exercisePlans = doc.data().exercisePlans;

                for (const item of exercisePlans) {
                    if (item.title === plan.title) {
                        // how do I update the item inside the item property named weeks,
                        const newWeek = data;
                        item.weeks.push(newWeek);
                        await updateDoc(doc.ref, { exercisePlans });
                    }
                }

                return null;
            });
        } catch (e) {
            console.log(e);
        }
    };

    const addToDatabase = async (exercisePlanData, user, setError) => {
        try {
            const auth = getAuth();
            const currentUser = auth.currentUser;

            const userDocRef = doc(db, "users", currentUser.uid);
            const subCollectionRef = collection(userDocRef, "exercisePlans");

            const subCollectionIsEmpty = (await getDocs(subCollectionRef))
                .empty;

            if (subCollectionIsEmpty) {
                await setDoc(doc(subCollectionRef), {
                    exercisePlans: [exercisePlanData],
                });
            } else {
                const querySnapshot = await getDocs(subCollectionRef);
                const promises = querySnapshot.docs.map(async (doc) => {
                    const exercisePlans = doc.data().otherExercise || [];
                    await updateDoc(doc.ref, {
                        otherExercise: [...exercisePlans, exercisePlanData],
                    });
                });
                await Promise.all(promises); // Ensure all updates are complete
            }
        } catch (error) {
            console.error("Error saving exercise data to Firestore:", error);
            if (setError)
                setError("Error saving exercise data. Please try again.");
        }
    };

    return {
        addToDatabase,
        upgradeExercisePlan,
        exerciseGenerator,
        addUpgradeToDatabase,
        getStorage,
    };
};

export default generator;
