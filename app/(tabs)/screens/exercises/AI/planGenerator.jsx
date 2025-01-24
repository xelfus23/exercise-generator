import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import PlanInstructions from "./instructions/planInstructions";
import DayInstructions from "./instructions/dayInstructions";
import UserData from "@/components/auth/userData";
import PlanParts from "./parts";
import {
    collection,
    doc,
    getDocs,
    setDoc,
    updateDoc,
} from "firebase/firestore";
import { db } from "@/components/firebase/config";
import { useAuth } from "@/components/auth/authProvider";

const PlanGenerator = () => {
    const {
        GoogleGenerativeAI,
        HarmCategory,
        HarmBlockThreshold,
    } = require("@google/generative-ai");
    const apiKey = "AIzaSyCmhylFECtUBZlWpD6LJIQn9llBPmqbZ_c";
    const genAI = new GoogleGenerativeAI(apiKey);
    const config = {
        temperature: 0.4,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
    };
    const currentUser = getAuth().currentUser;

    const userData = UserData();

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
                            mainPlan = { ...pl };

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
            console.warn(error);
        }
    };

    const generatePlan = async ({ input, setError, instructions }) => {
        setError && setError("generating exercise please wait...");

        try {
            const model = genAI.getGenerativeModel({
                model: "gemini-1.5-flash",
                systemInstruction: instructions,
            });

            const parts = await PlanParts({ prompt: input });

            console.log("PARTS", parts);

            try {
                const results = await model.generateContent({
                    contents: [{ role: "user", parts: parts }],
                    generationConfig: config,
                });

                return results.response.text();
            } catch (error) {
                console.warn("Error stage 4:", error);
                return generatePlan({
                    input: input,
                    setError: setError,
                    instructions: instructions,
                });
            }
        } catch (error) {
            console.warn("Error Stage 3:", error);
            return null;
        }
    };

    const safetySettings = [
        {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
        },
    ];

    const generateDaily = async ({
        input,
        instructions,
        retry = 5,
        setIsError,
    }) => {
        try {
            const model = genAI.getGenerativeModel({
                model: "gemini-1.5-flash",
                systemInstruction: instructions,
                safetySettings,
            });
            const parts = await PlanParts({ prompt: input });
            const results = await model.generateContent({
                contents: [{ role: "user", parts: parts }],
                generationConfig: config,
            });
            return results.response.text();
        } catch (error) {
            console.warn(`Error Stage 5 (Retry ${6 - retry}):`, error);
            if (retry > 0) {
                return generateDaily({
                    input: input,
                    instructions: instructions,
                    retry: retry - 1,
                    setIsError: setIsError,
                });
            } else {
                setIsError(true);
                return `{"error":"An error has occurred while generating the exercise plan, please try again."}`;
            }
        }
    };

    const addToDatabase = async (exercisePlanData) => {
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
                await Promise.all(promises);
            }
        } catch (error) {
            console.warn("Error saving exercise data to Firestore:", error);
        }
    };

    const planInstructions = PlanInstructions(userData);

    const Generate = async ({ input, setError, setGenerating, setIsError }) => {
        try {
            setError("Generating...");
            setGenerating("Generating plan please wait...");
            console.log("INPUT:", input);

            const firstResult = await generatePlan({
                instructions: planInstructions,
                input: input,
            });

            console.log("FIRST RESULT:", firstResult);

            const parsedFirstResult = JSON.parse(firstResult);

            if (!parsedFirstResult.error) {
                const dayInstructions = DayInstructions({
                    planResult: parsedFirstResult,
                    data: userData,
                });

                setGenerating("Adding exercise...");
                setError("Adding Exercise...");

                const secondResult = await generateDaily({
                    input: input,
                    instructions: dayInstructions,
                    setIsError: setIsError,
                });

                console.log("SECOND RESULT:", secondResult);

                const parsedSecondResult = JSON.parse(secondResult);

                if (
                    parsedFirstResult.weeks &&
                    Array.isArray(parsedFirstResult.weeks)
                ) {
                    parsedFirstResult.weeks.forEach((week) => {
                        if (week["week1"]) {
                            week["week1"] = parsedSecondResult["week1"];
                        }
                    });
                }

                setError("Adding to database...");
                setGenerating("Adding to database...");
                await addToDatabase(parsedFirstResult);
                return { success: true };
            } else {
                setError(parsedFirstResult.error);
                return { success: true };
            }
        } catch (e) {
            console.warn("Error Stage 2: ", e);
            return { success: false };
        }
    };

    return {
        Generate,
    };
};

export default PlanGenerator;
