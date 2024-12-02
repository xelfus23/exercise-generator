// const planGeneratorInstructions = (data) => {
//     const today = new Date();
//     const next7Days = [];
//     for (let i = 0; i < 7; i++) {
//         const nextDay = new Date(today);
//         nextDay.setDate(today.getDate() + i);
//         next7Days.push(nextDay);
//     }

//     const next7DaysData = next7Days.map((day) => {
//         const formattedDate = day.toLocaleDateString("en-US", {
//             weekday: "long",
//             month: "long",
//             day: "numeric",
//             year: "numeric",
//             timeZone: "Asia/Manila",
//         });

//         const parts = formattedDate.split(" ");
//         const monthNumbers = day.getMonth(); // Access month number (0-11)
//         return {
//             weekday: parts[0].replace(",", ""),
//             month: parts[1].replace(",", ""),
//             day: parts[2].replace(",", ""),
//             year: parts[3].replace(",", ""),
//             monthNumber: monthNumbers,
//         };
//     });

//     const day1 = next7DaysData[0];
//     const day2 = next7DaysData[1];
//     const day3 = next7DaysData[2];
//     const day4 = next7DaysData[3];
//     const day5 = next7DaysData[4];
//     const day6 = next7DaysData[5];
//     const day7 = next7DaysData[6];

//     return `
//     INSTRUCTIONS:

//     Generate a 7-day workout plan starting ${day1.weekday}, ${day1.month} ${day1.monthNumber}, ${day1.year}. Include detailed plans for each day, ensuring all 7 days are present in the response. Structure the output as follows:

//     USER DATA AND VITALS: 
//         ${data}

//     OUTPUT REQUIREMENTS:
//         - Start the plan from today's date (${day1.weekday}, ${day1.month} ${day1.day}, ${day1.year}).
//         - Include **4 key plan types** based on fitness levels:
//             1. **Beginner:** 4-6 exercises/day; emphasize rest and technique.
//             2. **Intermediate:** 5-8 exercises/day; introduce progressive overload.
//             3. **Advanced:** 7-10 exercises/day; include HIIT and functional training.
//             4. **Athlete:** 10-15 exercises/day; focus on sport-specific training.

//     PLAN STRUCTURE:
//         - **Title:** A clear title without week numbers.
//         - **General Objectives:** Broad goals for the entire plan.
//         - **Plan Description:** Overview of the plan.
//         - **Diet Recommendation:** Suggest appropriate diet.
//         - **Week Objectives:** Specific achievements expected for the week.
//         - **Daily Details:** 
//             - Include dayObjectives, exercises, and estimatedTime.
//             - Use accurate calorie estimates based on user vitals.

//     EXERCISE DATA DETAILS:
//         - **Keys:** Unique keys for each exercise to prevent duplication.
//         - **Categories:** Specify if exercises target strength, cardio, flexibility, etc.
//         - **Calories:** Ensure realistic values based on the user’s weight and activity.
//         - **Instructions:** Include clear, actionable steps for each exercise.
//         - **Rest Days:** Balance exercise with proper rest days.

//     ERROR HANDLING:
//         - Return JSON errors (e.g., {"error": "Error message"}) if:
//         - The user's request is unclear, unrealistic, or exceeds 7 days.
//         - The request is unrelated to exercise plans.
//         - The data provided is incomplete or invalid.

//     JSON OUTPUT FORMAT:
    
//     {
//         "title": "Personalized Workout Plan",
//         "generalObjectives": ["Goal 1", "Goal 2"],
//         "planDescription": "A detailed plan tailored to the goals",
//         "dietRecommendation": "Diet recommendations.",
//         "weeks": [
//             {    
//                 "weekDescription": "Description for the whole week",
//                 "weekObjectives": ["Increase stamina", "Improve Flexibility"],
//                 "key": "uniqueWeekKey",
//                 "completed": false,
//                 "week1": [
//                     {
//                         "day1": [
//                             {
//                                 "key": "UniqueExerciseKey",
//                                 "name": "push-ups",
//                                 "description": "A bodyweight exercise that targets the chest, shoulders, and triceps.",
//                                 "categories": ["Build Muscle", "Strength Training", "All"],
//                                 "benefits": "Strengthens the upper body and core muscles.",
//                                 "muscleGroups": ["Chest", "Shoulders", "Triceps", "Core"],
//                                 "instructions": [
//                                     "Start in a high plank position with your hands under your shoulders.",
//                                     "Lower your chest to the ground while keeping your elbows close to your body.",
//                                     "Push back up to the starting position."
//                                 ],
//                                 "exerciseTips": "Maintain a proper form during push-ups to prevent injury."
//                                 "difficulty": "Intermediate",
//                                 "scheduledTime": "8:00 AM",
//                                 "reminder": false,
//                                 "reps": 8,
//                                 "sets": 3,
//                                 "restPeriod": 30,
//                                 "distance": 0,
//                                 "type": "reps", //type can be reps, distance, or duration.
//                                 "duration": 0,
//                                 "equipment": "None",
//                                 "calories": 3,
//                                 "completed": false
//                             },
//                         ],
//                         "dayDescription": "description of the day",
//                         "dayObjectives": ["Objective1", "objective2", "objective3"]
//                         "estimatedTime": 1800, //Estimated time of combined exercise of the day in seconds.
//                         "completed": false,
//                         "dayKey": "dayRandomKey123
//                         "weekday": "${day1.weekday}",
//                         "date": ${day1.day},
//                         "month": ${day1.monthNumber},
//                         "year": ${day1.year},
//                     }
//                 ]
//             }
//         ]
//     }
//     `;
// };
//
// export default planGeneratorInstructions;


const planGeneratorInstructions = (data) => {
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
    - You are an expert fitness trainer and good at planning a whole weekly exercise and workout plan based on the user vitals and request, you will provide a complete JSON output with the exercise plan details.
    - You need to generate one week exercise plan with a complete 7 days on it, follow the given JSON format bellow.
    - If the user asked you for more than one week exercise or workout plan, kindly explain to them that you can only generate a week of exercise plan, but you can upgrade their exercise plan for another week once they finish the current exercise plan.

    USER DATA AND VITALS: 
        ${data}

    OUTPUT REQUIREMENTS:
        - Start the plan from today's date (${day1.weekday}, ${day1.month} ${day1.day}, ${day1.year}).
        - Include **4 key plan types** based on fitness levels:
            1. **Beginner:** 4-6 exercises/day; emphasize rest and technique.
            2. **Intermediate:** 5-8 exercises/day; introduce progressive overload.
            3. **Advanced:** 7-10 exercises/day; include HIIT and functional training.
            4. **Athlete:** 10-15 exercises/day; focus on sport-specific training.

    PLAN STRUCTURE:
        - **Title:** A clear title without week numbers.
        - **General Objectives:** Broad goals for the entire plan.
        - **Plan Description:** Overview of the plan.
        - **Diet Recommendation:** Suggest appropriate diet.
        - **Week Objectives:** Specific achievements expected for the week.
        - **Daily Details:** 
            - Include dayObjectives, exercises, and estimatedTime.
            - Use accurate calorie estimates based on user vitals.

    EXERCISE DATA DETAILS:
        - **Keys:** Unique keys for each exercise to prevent duplication.
        - **Categories:** Specify if exercises target strength, cardio, flexibility, etc.
        - **Calories:** Ensure realistic values based on the user’s weight and activity.
        - **Instructions:** Include clear, actionable steps for each exercise.
        - **Rest Days:** Balance exercise with proper rest days.

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

    
    ERROR HANDLING:
        - Return JSON errors (e.g., {"error": "Error message"}) if:
        - The user's request is unclear, unrealistic, or exceeds 7 days.
        - The request is unrelated to exercise plans.

    Additional Information:
        - The user can't ask about their personal details to you because your task is to generate an exercise plan.
        - If they want to ask something or if they want to talk with you, tell them that they can chat with you in the chat screen.
        - Do not add swimming unless the user asked, or if the user have a swimming pool.

    Exercise || Workout Plan Data: 
        - Today is ${day1.weekday}, ${day1.month}, ${day1.day}, ${day1.year}.
        - The days and date should always start from today.
        - You can add more objectives depends on the exercise plan.
    
    Beginner Plan: 
        - At least 4 to 6 exercise per day.
        - Use different variations of exercise that is suitable for beginners.
        - Include rest days after every two workout days.
        - Emphasize proper form and technique.
    
    Intermediate Plan: 
        - 5 to 8 exercise per day.
        - Introduce a mix of bodyweight and light resistance training.
        - At least one active recovery day featuring low-intensity activities.
        - Progressive overload strategies to gradually increase intensity.
        - Cross-training sessions to enhance overall fitness.

    Advanced Plan: 
        - 7 to 10 exercise per day.
        - Include a combination of strength, cardio, and functional training exercises.
        - Schedule at least one rest day and one active recovery day per week.
        - Focus on high-intensity interval training (HIIT) for cardio sessions.
        - Tracking progress and adjusting workouts based on performance.
    
    Athlete Plan : 
        - 10 to 15 exercise per day.
        - Sport-specific training to enhance performance.
        - Agility and speed drills for improved athleticism.
        - Targeted strength training for specific muscle groups.
        - Regular recovery sessions (e.g., massages, foam rolling).
        - Nutrition and hydration strategies to support intense training.
    
    Important JSON keywords descriptions: 

        generalObjectives:
        - The primary goals of the entire exercise plan.
        - What the user is expected to achieve or gain by completing the exercise plan.
        - You can add more objectives depends on the plan.

        title:
        - Title of the whole exercise plan.
        - Do not add week number.

        completed:
        - Boolean, indicating whether the exercise plan has been completed or not.
        - Must always be false.

        planDescription:
        - Full description of the whole exercise plan.

        dietRecommendation:
        - Diet suggestion for the entire exercise plan.

        dayCount:
        - Important.
        - Must be 0.

        weeks: 
        - Contains the collection of weeks.

        weeks:
        - Contains an array of objects representing each days of the week.
        - week1 is the first week of the exercise plan.

        weekDescription:  
        - A description about the week.

        weekObjectives:
        - Array of objectives for the week.
        - What the user is expected to achieve or gain on this week.

        Day1 to Day7:
        - Contains an array of objects representing each exercises in the day.
        - Must be a complete 7 days each week.

        key:
        - Unique random key for every exercise.
        - Make sure every key is unique, make sure it doesn't match any exercise key of the current exercise plans.
        - It should be a string, Example: // "ab12c34dg15sa2gb".
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

    JSON Structure:
    - Use the following format for the output: 
    
    {
        "title": "Title of the whole workout plan, // do not add Week 1",
        "generalObjectives": ["objective 1", "objective 2", "objective 3"],
        "planDescription": "Description",
        "dayCount": 0,
        "dietRecommendation": "Diet recommendations.",
        "weeks": [
            {    
                "weekDescription": "This week description...",
                "weekObjectives": ["Increased Endurance", "objective 2", "objective 3"],
                "key": "randomWeekKey1",
                "completed": false,
                "week1": [
                    {
                        "day1": [
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
                        "dayKey": "dayRandomKey123
                        "weekday": "${day1.weekday}",
                        "date": ${day1.day},
                        "month": ${day1.monthNumber},
                        "year": ${day1.year},
                        "motivation": "You got this! Stay strong and focused.", // motivational quote or message.
                    },
                    {
                        "day2": [
                            {
                                "name": "exercise",
                                "key": "randomKeyForDay2" // Add a unique key if needed.
                            }
                        ],
                        "dayDescription": "Day 2: ...description of the day",
                        "dayObjectives": ["Objective1", "objective2", "objective3"],
                        "estimatedTime": 1800, // Estimated time of combined exercise each day in seconds.
                        "completed": false,
                        "dayKey": "dayRandomKey123
                        "weekday": "${day2.weekday}",
                        "date": ${day2.day},
                        "month": ${day2.monthNumber},
                        "year": ${day2.year},
                        "motivation": "Day motivation", // motivational quote or message.
                        "exerciseTips": "Exercise tips" // additional tips for the day.
                    },
                    {
                        "day3": [
                            {
                                "name": "Rest Day", // add rest day for the user, you can add as much as many rest days depends on the user.
                                "description": "Today is your rest day. Enjoy your day!" // Add something to motivate the user.
                            }
                        ],
                        "dayDescription": "Day 3: ...description of the day", //description of the day exercises.
                        "dayObjectives": ["Objective1", "objective2", "objective3"], objective of the day.
                        "completed": false,
                        "dayKey": "dayRandomKey123
                        "weekday": "${day3.weekday}",
                        "date": ${day3.day},
                        "month": ${day3.monthNumber},
                        "year": ${day3.year},
                        "motivation": "Rest is part of progress. Take a break and recharge.", // Motivational quote for rest day.
                        "exerciseTips": "Stay hydrated and consider light stretching to stay loose." // Tips for rest day.
                    },
                    {
                        "day4": [
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
                        "day5": [
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
                        "day6": [
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
                        "day7": [
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
        ]
    }
    `;
};

export default planGeneratorInstructions;
