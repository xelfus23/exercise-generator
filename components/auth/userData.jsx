import { useAuth } from "./authProvider";
import { useEffect, useState } from "react";

const UserData = () => {
    const { user, exercisePlans, weekProgress, progress } = useAuth();

    if (!user) return null;

    const [completedExercise, setCompletedExercise] = useState([]);
    const [incompleteExercise, setIncompleteExercise] = useState([]);
    const [everyExercise, setEveryExercise] = useState([]);
    const [exerciseThisWeek, setExerciseThisWeek] = useState([]);

    const bodyMetrics = user?.bodyMetrics;
    const heightAndWeight = bodyMetrics?.heightAndWeight;
    const circumferences = bodyMetrics?.circumferences;

    const birthdate = user?.birthDate;
    const day = birthdate?.day;
    const month = birthdate?.month;
    const year = birthdate?.year;

    const height = heightAndWeight?.height / 100;
    const weight = heightAndWeight?.weight;
    const BMI = weight / (height * height);

    const today = new Date();

    const next7Days = [];
    for (let i = 0; i < 7; i++) {
        const nextDay = new Date(today);
        nextDay.setDate(today.getDate() + i);
        next7Days.push(nextDay);
    }

    const next7DaysData = next7Days.map((day) => {
        const formattedDate = day.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
            timeZone: "Asia/Manila",
        });

        const parts = formattedDate.split(" ");
        const monthNumbers = day.getMonth(); // Access month number (0-11)
        return {
            weekday: parts[0].replace(",", ""),
            month: parts[1].replace(",", ""),
            day: parts[2].replace(",", ""),
            year: parts[3].replace(",", ""),
            monthNumber: monthNumbers,
        };
    });

    const day1 = next7DaysData[0];

    if (!user) {
        return;
    }

    const getTotalExercise = () => {
        let completed = [],
            incomplete = [];

        exercisePlans.forEach((plan) => {
            plan?.weeks?.map((w, i1) => {
                w?.[`week${i1 + 1}`].map((d, i2) => {
                    d?.[`day${i2 + 1}`]?.map((e) => {
                        if (e.name !== "Rest Day") {
                            if (e.completed === true) {
                                completed.push({
                                    exe: e,
                                    plan: plan.title,
                                    date: d.date,
                                    day: d,
                                });
                            } else {
                                incomplete.push({
                                    exe: e,
                                    plan: plan.title,
                                    date: d.date,
                                    day: d,
                                });
                            }
                        }
                    });
                });
            });
        });

        setCompletedExercise(completed);
        setIncompleteExercise(incomplete);
        setEveryExercise([...completed, ...incomplete]);
    };

    useEffect(() => {
        getTotalExercise();
    }, [exercisePlans]);

    const getMonth = (m) => {
        switch (m) {
            case 0:
                return "January";
            case 1:
                return "February";
            case 2:
                return "March";
            case 3:
                return "April";
            case 4:
                return "May";
            case 5:
                return "June";
            case 6:
                return "July";
            case 7:
                return "August";
            case 8:
                return "September";
            case 9:
                return "October";
            case 10:
                return "November";
            case 11:
                return "December";
            default:
                return "Invalid month";
        }
    };

    return `

Date Today:
- Today is ${day1.weekday}, ${day1.month}, ${day1.day}, ${day1.year}.

Personal Info: 
- First name: ${user?.firstName || "N/A"}
- Last name: ${user?.lastName || "N/A"}
- Email: ${user?.email || "N/A"}
- Email Verified: ${user?.emailVerified || "false"}
- Birth year: ${year || "N/A"}
- Birth month: ${getMonth(Number(month)) || "N/A"}
- Birth day: ${day || "N/A"}
    
Vitals: 
- Gender: ${user?.gender || "N/A"}
- Height: ${heightAndWeight?.height || "N/A"} ${heightAndWeight?.heightUnit}
- Weight: ${heightAndWeight?.weight || "N/A"} ${heightAndWeight?.weightUnit}
- BMI (Body mass index): ${BMI ? BMI.toFixed(2) : "N/A"}
- Body Fat Percentage: ${user?.bodyFatPercentage || "N/A"}%
- Waist Circumference: ${circumferences?.waist || "N/A"} ${
        circumferences?.unit || ""
    }
- Hip Circumference: ${circumferences?.hip || "N/A"} ${
        circumferences?.unit || ""
    }
- Neck Circumference: ${circumferences?.neck || "N/A"} ${
        circumferences?.unit || ""
    }
- Blood Pressure: ${user?.bloodPressure || "N/A"}
- Heart Rate: ${user?.heartRate || "N/A"} bpm
- Resting Heart Rate: ${user?.restingHeartRate || "N/A"} bpm
- Oxygen Saturation (SpO2): ${user?.oxygenSaturation || "N/A"}%
- Body Temperature: ${user?.bodyTemperature || "N/A"} °C

Health & Fitness: 
Main goals: 
    ${user?.mainGoal.map((goal) => `${goal}`).join(", \n    ") || "N/A"}
- Exercise Place: ${user?.selectedPlace || "N/A"}
- Rest Day: ${user?.restDay || "N/A"}
- Activity Level: ${user?.activityLevel || "N/A"}
- Fitness Level: ${user?.fitnessLevel || "N/A"}
- Health Conditions: ${user?.healthCondition || "N/A"}
- Sleep Duration: ${user?.sleepDuration || "N/A"} hours
- Water Intake: ${user?.waterIntake || "N/A"} liters
- Steps per day: ${user?.dailySteps || "N/A"}

Progress: 
- Today's Progress: ${progress.toFixed(2) || "N/A"}%
- This Week Progress: ${(weekProgress * 100).toFixed(2) || "N/A"}

Current Exercises Plans & Schedules:

[${
        exercisePlans.length > 0
            ? exercisePlans
                  .map((plan) => {
                      return `
Plan Title: ${plan.title}
Description: ${plan.planDescription}
Objectives: ${plan?.generalObjectives?.join(", ")}
Diet Recommendations: ${plan?.dietRecommendation}
${plan.weeks
    .map((week, weekIndex) => {
        return `
Week ${weekIndex + 1}:
Existing Week Key: ${week.weekKey}
${week[`week${weekIndex + 1}`]
    .map((day, dayIndex) => {
        return `
    Day ${dayIndex + 1}:
    Day Key: ${day.dayKey}
    Date: ${day.weekday}, ${getMonth(day.month)} ${day.date}, ${day.year} 
    Description: ${day.dayDescription}
    Objectives: ${day?.dayObjectives?.join(", ")}
    ${
        day?.[`day${dayIndex + 1}`][0].name === "Rest Day"
            ? "Rest Day:"
            : "Exercise:"
    }
    ${day[`day${dayIndex + 1}`]
        .map(
            (exercise) => `
        Name: ${exercise.name}
        Existing Exercise Key: ${exercise.key}
        Description: ${exercise.description}
        Benefits: ${exercise?.benefits?.map(
            (v) => `
            - ${v.replace(",", "")}`
        )}
        ${
            exercise.type === "duration"
                ? `Duration: ${exercise.duration} seconds`
                : exercise.type === "reps"
                ? `Repeats: ${exercise.reps}`
                : exercise.type === "distance"
                ? `Distance: ${exercise.distance}`
                : ""
        }
        Sets: ${exercise.sets || 0}
        Estimated Calorie Burn: ${exercise.calories || 0} cal
        Categories: ${exercise?.categories?.join(", ")}
        Muscle Groups: ${exercise?.muscleGroups?.join(", ")}
        `
        )
        .join("")}
`;
    })
    .join("")}
`;
    })
    .join("")}
`;
                  })
                  .join("")
            : `
        - N/A`
    }]

Additional Info:
    - Smoker: ${user?.isSmoker ? "Yes" : "No"}
    - Alcohol Consumption: ${user?.alcoholConsumption || "N/A"}
    - Activity Level: ${user?.activityLevel || "N/A"}
    - Allergies: ${user?.allergies || "N/A"}
    `;
};

export default UserData;
