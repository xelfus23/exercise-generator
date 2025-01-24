const DayInstructions = ({ planResult, data }) => {
    const today = new Date();

    const next7Days = [];
    for (let i = 0; i < 7; i++) {
        const nextDay = new Date(today);
        nextDay.setDate(today.getDate() + i);
        next7Days.push(nextDay);
    }

    //TODO: USE THE PLAN OUTPUT AS THE INPUT FOR DAY PROMPT
    
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

### INSTRUCTIONS ###
- **You are an expert at making exercise/workout plans**, different exercise variations, tailored to the given exercise plan details, and make sure each exercise os suitable for user age, vitals, preferences, and requests.
- **Each response must cover 7 days.**
- **Day 1 must start on ${day1.weekday}, ${day1.month} ${day1.day}, ${
        day1.year
    }.**
- Each day should include:
  - A **unique key** for each exercise (6 alphanumeric characters).
  - Comprehensive details like name, description, categories, benefits, and instructions.
- You can add more exercise for each day as necessary. 
- Rest days can be included if needed.
- Ensure the unique keys don't conflict with existing keys.

### USER DATA AND VITALS ###
    ${data}

---

### MONTH NUMBERS REFERENCE ###
    January = 0,
    February = 1,
    March = 2,
    April = 3,
    May = 4,
    June = 5,
    July = 6,
    August = 7,
    September = 8,
    October = 9,
    November = 10,
    December = 11

---

### PLAN DETAILS ###

**Title:**
${planResult?.title}

**General Objectives:**
${planResult?.generalObjectives?.map(
    (v) => `
- ${v.replace(",", "")}`
)}

**Description**:
${planResult?.planDescription}

**Diet Recommendations**:
${planResult?.dietRecommendation}

#### Week Details ####

${planResult?.weeks?.map(
    (v, i) =>
        `
**Week ${i + 1}:**
**Description:**
${v.weekDescription}

**Objectives:**
${v.weekObjectives.join(", ")}
`
)}

---

### OUTPUT JSON STRUCTURE ###

week1: [
    {
        "day1": [
            {
                "key": "unique-key",
                "name": "exercise",
                "description": "A bodyweight exercise that targets the chest, shoulders, and triceps.",
                "categories": ["Category 1", "Category 2", // more categories if needed.],
                "benefits": ["Benefit 1", "Benefit 2", // more benefit],
                "muscleGroups": ["Chest", "Shoulders", "Triceps", "Core", // more muscle groups if included],
                "instructions": [
                    "instructions 1",
                    "instructions 2",
                    // more instructions if needed.
                ],
                "exerciseTips": "Exercise Tips" // additional tips for the exercise.
                "scheduledTime": "8:00 AM",
                "reminder": false,
                "reps": 8,
                "sets": 3,
                "restPeriod": 30,
                "distance": 0,
                "type": "reps", //can be reps, distance, or duration.
                "duration": 0,
                "equipment": ["None"],
                "calories": 3,
                "completed": false
            },
            {
                "key": "unique-key",
                "name": "exercise 2",
                "description": "A full-body cardio exercise where you jump while spreading your arms and legs outward.",
                "categories": ["Category 1", "Category 2" ],
                "benefits": ["Benefit 1", "Benefit 2", // more benefit],
                "muscleGroups": ["Legs", "Arms", "Core" // more muscle groups if included],
                "instructions": [
                    "instructions 1",
                    "instructions 2",
                ],
                "exerciseTips": "...exercise tips",
                "scheduledTime": "8:00 AM",
                "reminder": false,
                "reps": 0,
                "sets": 1,
                "restPeriod": 0,
                "distance": 0,
                "type": "duration",
                "duration": 30,
                "equipment": ["None"],
                "calories": 3,
                "completed": false
            },
            {
                "key": "unique-key",
                "name": "exercise 3",
                "description": "A steady-paced running exercise to improve cardiovascular health and endurance.",
                "categories": ["Category 1", "Category 2"],
                "benefits": ["Benefit 1", "Benefit 2", // more benefit],
                "muscleGroups": ["Legs", "Core" // more muscle groups if included],
                "instructions": [
                    "instructions 1",
                    "instructions 2",
                ],
                "exerciseTips": "Keep a good posture and avoid leaning too far forward or backward. Stay hydrated before and after your jog.",
                "scheduledTime": "7:30 AM",
                "reminder": false,
                "reps": 0,
                "sets": 1,
                "restPeriod": 0,
                "distance": 2,
                "type": "distance",
                "duration": 0,
                "equipment": ["None"],
                "calories": 200,
                "completed": false
            }
        ],
        "dayDescription": "Day 1: ...description of the day",
        "dayObjectives": ["Objective1", "objective2", "objective3" // more objectives if needed],
        "estimatedTime": 1800, - Estimated time of combined exercise of the day in seconds.
        "completed": false,
        "dayKey": "unique-key",
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
                "key": "zb37y8r" // Add a unique key if needed.
            }
        ],
        "dayDescription": "Day 2: ...description of the day",
        "dayObjectives": ["Objective1", "objective2", "objective3"],
        "estimatedTime": 1800, // Estimated time of combined exercise each day in seconds.
        "completed": false,
        "dayKey": "unique-key",
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
        "dayKey": "unique-key",
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
        "year": ${day4.year},
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
        "year": ${day5.year},
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
        "year": ${day6.year},
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
        "year": ${day7.year},
    }
]

`;

};

export default DayInstructions;
