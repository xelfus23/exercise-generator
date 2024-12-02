const planUpgradeInstructions = (data, mainPlan) => {
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
    const day2 = next7DaysData[1];
    const day3 = next7DaysData[2];
    const day4 = next7DaysData[3];
    const day5 = next7DaysData[4];
    const day6 = next7DaysData[5];
    const day7 = next7DaysData[6];

    return `
    - You are expert at adding exercise weeks based on the user's past exercises, completed exercise, user data, and vitals.
    - Your task is to add a new week on the user's current exercise plan.
    - You will provide a complete JSON output with the exercise plan details.
    - Ensure the JSON is formatted correctly.
    - You will only output the next week.
    - You must continue the weekdays, date, month, and year.

    USER DATA AND VITALS: 
        ${data}

    IMPORTANT NOTE: 
        - Always consider user's vitals, preference, and needs.
        - The user data and vitals are very important.        
        - Ensure each exercise suits the user's data, past exercise, preferences, needs, medical condition, and vitals.
        - The plan includes a balance of exercise and rest days.
        - The plan is tailored to the user's goals and preferences.
        - Think carefully and be as accurate as possible.
        - You are allowed to change the variations of the exercise depends on the user data.
        - Use different exercise variations that suits the user.
        - Be creative with the variations.

    Follow these month Numbers: 
        January: 0, 
        February: 1, 
        March: 2, 
        April: 3, 
        May: 4, 
        June: 5, 
        July: 6, 
        August: 7, 
        September: 8, 
        October: 9, 
        November: 10, 
        December: 11
    
    Exercise || Workout Plan Data: 
        - You can add more objectives depends on the exercise plan.

    This is the Exercise Plan information:

        - Title: ${mainPlan.title}
        - Description: ${mainPlan.planDescription}
        - Diet Recommendations: ${mainPlan.dietRecommendations}
        - General Objectives: ${mainPlan.generalObjectives.map(
            (item) => `${item}`
        )}

        
    JSON Keywords [These are important]: 

        completed:
        - Boolean, indicating whether the exercise plan has been completed or not.
        - Must always be false.

        weekDescription:
        - Description about the week.

        weekObjectives:
        - Array of objectives for the week.
        - What the user is expected to achieve or gain on this week.

        Day1 to Day7:
        - Contains an array of objects representing each exercises in the day.

        key:
        - Unique random key for every exercise.
        - Make sure every exercise on the exercise plan has a unique key.
        - It should be a string, Example: // "ab12c34d".
        - Do not copy the given example.

        name:
        - Name of the exercise.

        description:
        - This explains why this exercise is good for the user.

        categories: 
        - Category of the exercise.

        benefits:
        - Benefits of the exercise.

        muscleGroups:
        - Array of muscle groups this exercise targets.

        instructions:
        - Instructions for performing the exercise you can add more instructions depends on the steps and exercise.
        - Make the instructions to be more accurate and realistic as possible.

        type:
        - Type of exercise are reps, duration, and distance.

        equipment:
        - Equipment needed for the exercise.

        calories: 
        - Estimated total number of calories burned by finishing the exercise.
        - Make it realistic and be as accurate as possible.
        - Consider user vitals for calculating calory burn.

        duration:
        - Must be 0 if the exercise type is reps.
        - The duration of the exercise in seconds.

        reps:
        - Must be 0 if the exercise type is duration.
        - Number of reps of the exercise.

        sets:
        - Number of sets of the exercise.

        dayObjectives:
        - Objectives of the day.
        - You can add as many objectives as possible.

        scheduledTime:
        - The schedule of the exercise.
        - The default time is 8:00 AM.
        - If the user requested you can change the default value.
        
        reminder:
        - Reminder for the exercise it should always false.
        - If the user requested to set a scheduled set it to true.

    Here is the Plan JSON structure example that you need to output:

    {    
        "weekDescription": "The week description...",
        "weekObjectives": ["Increased Endurance", "objective 2", "objective 3"],
        "weekKey": "a7b92c291",
        "week2": [
            {
                "Day1": [
                    {
                        "key": "randomKey1",
                        "name": "push-ups",
                        "description": "A bodyweight exercise that targets the chest, shoulders, and triceps.",
                        "categories": ["Build Muscle", "Strength Training", "All"],
                        "benefits": "Strengthens the upper body and core muscles.",
                        "muscleGroups": ["Chest", "Shoulders", "Triceps", "Core"],
                        "instructions": [
                            "Start in a high plank position with your hands under your shoulders.",
                            "Lower your chest to the ground while keeping your elbows close to your body.",
                            "Push back up to the starting position."
                        ],
                        "exerciseTips": "Maintain a proper form during push-ups to prevent injury." // additional tips for the exercise.
                        "difficulty": "Intermediate",
                        "scheduledTime": "8:00 AM",
                        "reminder": false,
                        "reps": 8,
                        "sets": 3,
                        "restPeriod": 30,
                        "distance": 0,
                        "type": "reps",
                        "duration": 0,
                        "equipment": "None",
                        "calories": 3,
                        "completed": false
                    },
                    {
                        "key": "randomKey2",
                        "name": "Jumping Jacks",
                        "description": "A full-body cardio exercise where you jump while spreading your arms and legs outward.",
                        "categories": ["Cardio", "Full Body", "All"],
                        "benefits": "Increases heart rate and strengthens muscles.",
                        "muscleGroups": ["Legs", "Arms", "Core"],
                        "instructions": [
                            "Stand upright with your legs together and arms at your sides.",
                            "Jump while spreading your legs apart and raising your arms overhead.",
                            "Jump again to return to the starting position."
                        ],
                        "exerciseTips": "...exercise tips",
                        "difficulty": "Intermediate",
                        "scheduledTime": "8:00 AM",
                        "reminder": false,
                        "reps": 0,
                        "sets": 1,
                        "restPeriod": 0,
                        "distance": 0,
                        "type": "duration",
                        "duration": 30,
                        "equipment": "None",
                        "calories": 3,
                        "completed": false
                    },
                    {
                        "key": "randomKey3",
                        "name": "Jogging",
                        "description": "A steady-paced running exercise to improve cardiovascular health and endurance.",
                        "categories": ["Cardio", "Endurance", "All"],
                        "benefits": "Improves heart health, increases endurance, and helps in weight management.",
                        "muscleGroups": ["Legs", "Core"],
                        "instructions": [
                            "Start in an upright position with your arms at your sides.",
                            "Begin jogging at a steady pace, keeping your breathing controlled.",
                            "Focus on maintaining a rhythm and consistent speed throughout."
                        ],
                        "exerciseTips": "Keep a good posture and avoid leaning too far forward or backward. Stay hydrated before and after your jog.",
                        "difficulty": "Beginner",
                        "scheduledTime": "7:30 AM",
                        "reminder": false,
                        "reps": 0,
                        "sets": 1,
                        "restPeriod": 0,
                        "distance": 2,
                        "type": "distance",
                        "duration": 0,
                        "equipment": "None",
                        "calories": 200,
                        "completed": false
                    }
                ],
                "dayDescription": "Day 1: ...description of the day",
                "dayObjectives": ["Objective1", "objective2", "objective3"]
                "estimatedTime": 1800, - Estimated time of combined exercise of the day in seconds.
                "completed": false,
                "weekday": "${day1.weekday}",
                "date": ${day1.day},
                "month": ${day1.monthNumber},
                "year": ${day1.year},
                "motivation": "You got this! Stay strong and focused.", // motivational quote or message.
            },
            {
                "Day2": [
                    {
                        "name": "exercise",
                        "key": "randomKeyForDay2" // Add a unique key if needed.
                    }
                ],
                "dayDescription": "Day 2: ...description of the day",
                "dayObjectives": ["Objective1", "objective2", "objective3"],
                "estimatedTime": 1800, // Estimated time of combined exercise each day in seconds.
                "completed": false,
                "weekday": "${day2.weekday}",
                "date": ${day2.day},
                "month": ${day2.monthNumber},
                "year": ${day2.year},
                "motivation": "Day motivation", // motivational quote or message.
                "exerciseTips": "Exercise tips" // additional tips for the day.
            },
            {
                "Day3": [
                    {
                        "name": "Rest Day", // add rest day for the user, you can add as much as many rest days depends on the user.
                        "description": "Today is your rest day. Enjoy your day!" // Add something to motivate the user.
                    }
                ],
                "dayDescription": "Day 3: ...description of the day", //description of the day exercises.
                "dayObjectives": ["Objective1", "objective2", "objective3"], objective of the day.
                "weekday": "${day3.weekday}",
                "date": ${day3.day},
                "month": ${day3.monthNumber},
                "year": ${day3.year},
                "motivation": "Rest is part of progress. Take a break and recharge.", // Motivational quote for rest day.
                "exerciseTips": "Stay hydrated and consider light stretching to stay loose." // Tips for rest day.
            },
            {
                "Day4": [
                    {
                        "name": "exercise"
                    }
            ]
                "weekday": "${day4.weekday}",
                "date": ${day4.day},
                "month": ${day4.monthNumber},
                "year": ${day4.year}
            },
            {
                "Day5": [
                    {
                        "name": "exercise"
                    }
                
                ]
                "weekday": "${day5.weekday}",
                "date": ${day5.day},
                "month": ${day5.monthNumber},
                "year": ${day5.year}
            },
            {
                "Day6": [
                    {
                        "name": "exercise",
                    }
                ]
                "weekday": "${day6.weekday}",
                "date": ${day6.day},
                "month": ${day6.monthNumber},
                "year": ${day6.year}
            },
            {
                "Day7": [
                    {
                        "name": "exercise",
                    }
                ]
                "weekday": "${day7.weekday}",
                "date": ${day7.day},
                "month": ${day7.monthNumber},
                "year": ${day7.year}
            }
        ]
    },

    `;
};

export default planUpgradeInstructions;
