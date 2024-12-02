import { useAuth } from "./authProvider";
import { useEffect, useState } from "react";

export const userData = () => {
    const {
        user,
        updateUserData,
        exercise,
        weekIndexExercise,
        weekExercise,
        dayCount,
        exercisePlans,
        weekProgress,
        progress,
    } = useAuth();

    if (!user) return null;

    const [completedExercise, setCompletedExercise] = useState([]);
    const [incompleteExercise, setIncompleteExercise] = useState([]);
    const [everyExercise, setEveryExercise] = useState([]);
    const [exerciseThisWeek, setExerciseThisWeek] = useState([]);

    const height = user?.bodyMetrics?.heightAndWeight?.height / 100;
    const weight = user?.bodyMetrics?.heightAndWeight?.weight;
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
        - Birth year: ${user?.birthDate?.year || "N/A"}
        - Birth month: ${getMonth(Number(user?.birthDate?.month)) || "N/A"}
        - Birth day: ${user?.birthDate?.day || "N/A"}
      
    Vitals: 
        - Gender: ${user?.gender || "N/A"}
        - Height: ${user?.bodyMetrics?.heightAndWeight?.height || "N/A"} ${
        user?.bodyMetrics?.heightAndWeight?.heightUnit
    }
        - Weight: ${user?.bodyMetrics?.heightAndWeight?.weight || "N/A"} ${
        user?.bodyMetrics?.heightAndWeight?.weightUnit
    }
        - BMI (Body mass index): ${BMI ? BMI.toFixed(2) : "N/A"}
        - Body Fat Percentage: ${user?.bodyFatPercentage || "N/A"}%
        - Waist Circumference: ${
            user?.bodyMetrics?.circumferences?.waist || "N/A"
        } ${user?.bodyMetrics?.circumferences?.unit || ""}
        - Hip Circumference: ${
            user?.bodyMetrics?.circumferences?.hip || "N/A"
        } ${user?.bodyMeasurements?.unit || ""}
        - Neck Circumference: ${
            user?.bodyMetrics?.circumferences?.neck || "N/A"
        } ${user?.bodyMetrics?.circumferences?.unit || ""}
        - Blood Pressure: ${user?.bloodPressure || "N/A"}
        - Heart Rate: ${user?.heartRate || "N/A"} bpm
        - Resting Heart Rate: ${user?.restingHeartRate || "N/A"} bpm
        - Oxygen Saturation (SpO2): ${user?.oxygenSaturation || "N/A"}%
        - Body Temperature: ${user?.bodyTemperature || "N/A"} °C
      
    Health & Fitness: 
        Main goals: 
          ${
              user?.mainGoal.map((goal) => `${goal}`).join(", \n          ") ||
              "N/A"
          }
        - Exercise Place: ${user?.selectedPlace || "N/A"}
        - Activity Level: ${user?.activityLevel || "N/A"}
        - Fitness Level: ${user?.fitnessLevel || "N/A"}
        - Health Conditions: ${user?.healthCondition || "N/A"}
        - Sleep Duration: ${user?.sleepDuration || "N/A"} hours
        - Water Intake: ${user?.waterIntake || "N/A"} liters
        - Steps per day: ${user?.dailySteps || "N/A"}

    Progress: 
        - Today's Progress: ${progress.toFixed(2) || "N/A"}%
        - This Week Progress: ${(weekProgress * 100).toFixed(2) || "N/A"}

    Exercises Plans & Schedules:

    ${
        exercisePlans.length > 0
            ? exercisePlans
                  .map((plan) => {
                      return `
        Plan: ${plan.title}
        Description: ${plan.planDescription}
        Objectives: ${plan?.generalObjectives?.join(", ")}
        Diet Recommendations: ${plan?.dietRecommendation}
        ${plan.weeks
            .map((week, weekIndex) => {
                return `
        Week ${weekIndex + 1}:
        ${week[`week${weekIndex + 1}`]
            .map((day, dayIndex) => {
                return `
            Day ${dayIndex + 1}:
            Date: ${day.weekday}, ${getMonth(day.month)} ${day.date}, ${
                    day.year
                } 
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
                Description: ${exercise.description}
                Benefits: ${exercise.benefits}
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
            : "None"
    }

    Additional Info:
        - Smoker: ${user?.isSmoker ? "Yes" : "No"}
        - Alcohol Consumption: ${user?.alcoholConsumption || "N/A"}
        - Activity Level: ${user?.activityLevel || "N/A"}
        - Allergies: ${user?.allergies || "N/A"}
    `;
};
