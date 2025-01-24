const PlanParts = async ({ prompt }) => {
    const randomInput = [
        "Based on the provided user data, including height, weight, BMI, BMR, fitness level, goals, and health conditions, design a seven-day exercise plan.",
        "Using the user vitals and preferences provided in the instructions, generate a detailed weekly workout schedule tailored to their fitness level and objectives.",
        "Create a personalized seven-day fitness plan for the user, taking into account their height, weight, BMI, BMR, fitness goals, and any health limitations.",
        "Given the user's data in the instructions, generate an exercise plan for seven days that aligns with their fitness level and specific health needs.",
        "Using the vitals and preferences listed in the user data, provide a custom seven-day workout schedule focused on achieving their fitness goals.",
        "Based on the instructions and the user's specific vitals (height, weight, BMI, BMR, etc.), create a seven-day workout plan tailored to their goals.",
        "Design a weekly fitness program for the user, considering the provided data about their fitness level, preferences, and overall health conditions.",
        "Using the user's fitness data and goals as outlined in the instructions, generate a detailed exercise plan for the next seven days.",
        "Given the user data and fitness objectives described, create a personalized workout schedule that spans seven days and accommodates their health conditions.",
        "Craft a seven-day workout routine based on the user's metrics (height, weight, BMI, BMR) and fitness goals as provided in the instructions.",
        "Generate a weekly exercise plan that aligns with the user's data, focusing on their preferences, fitness level, and specific health needs.",
        "Using the user details (height, weight, BMI, BMR, etc.) provided in the instructions, design a seven-day workout routine tailored to their needs.",
        "Create a seven-day fitness program for the user, focusing on their fitness level, goals, and any health considerations outlined in the data.",
        "Generate a custom seven-day workout plan based on the user metrics and vitals provided in the instructions, targeting their fitness objectives.",
        "Using the given user data, including height, weight, BMI, BMR, and goals, create a detailed weekly exercise plan tailored to their preferences and needs.",
    ];

    return prompt
        ? [
              {
                  text: `input: ${prompt}`,
              },
              {
                  text: "output: ",
              },
          ]
        : [
              {
                  text: `input: ${
                      randomInput[
                          Math.floor(Math.random() * randomInput.length)
                      ]
                  }`,
              },
              {
                  text: "output: ",
              },
          ];
};

export default PlanParts;
