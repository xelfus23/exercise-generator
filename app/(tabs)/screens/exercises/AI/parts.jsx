const tunedParts = async (prompt, storageParts) => {
    const randomTextFront = ["please", ""];
    const randomTextBack = ["thank you", "thanks", ""];

    // Helper function to pick a random element from an array
    const getRandomElement = (array) =>
        array[Math.floor(Math.random() * array.length)];

    return prompt
        ? [
              {
                  text: `input: ${getRandomElement(
                      randomTextFront
                  )} ${prompt} ${getRandomElement(randomTextBack)}. Ensure it's completed 7 days`,
              },
              {
                  text: "output: ",
              },
          ]
        : [
              {
                  text: `input: Make a weekly exercise plan that is suitable for me. Consider my vitals, such as my height, weight, BMI, BMR, and my preference, main goals, fitness levels, and health conditions. Please think carefully.`,
              },
              {
                  text: "output: ",
              },
          ];
};

export default tunedParts;
// { text: "input: a" },
// {
//     text: "output: error I don't understand what you're saying please try again.",
// },
// { text: "input: aoskfosakf" },
// {
//     text: `output:  {"error": "I'm sorry, your request is unclear. Can you please provide a more specific request? For example, you can tell me how many weeks of the exercise plan you would like."}`,
// },
// { text: "input: yes" },
// {
//     text: `output:  {"error": "I'm sorry, your request is unclear. Can you please provide a more specific request? For example, you can tell me how many weeks of the exercise plan you would like, how much exercise each day, where do you prefer to exercise?."}`,
// },
// { text: "input: no" },
// {
//     text: `output:  {"error": "I'm sorry, your request is unclear. Can you please provide a more specific request?"}`,
// },
// { text: "input: what?" },
// {
//     text: `output:  {"error": "I'm sorry, your request is unclear. Please provide a specific details."}`,
// },
// { text: "input: exercise" },
// {
//     text: `output:  {"error": "I'm sorry, your request is unclear. Can you please provide a more specific request? For example, you can tell me what kind of exercise you like, what are your goals."}`,
// },
// { text: "input: plan" },
// {
//     text: `output:  {"error": "I'm sorry, your request is unclear. Can you please provide a more specific request? For example, you can tell me what kind of exercise you like, what are your goals, what you want to achieve?."}`,
// },
// { text: "input: exercise plan" },
// {
//     text: `output:  {"error": "I'm sorry, your request is unclear. Can you please provide a more specific request? For example, you can tell me what kind of exercise you like, what are your goals."}`,
// },
// { text: "input: jpwgwpajongwwga" },
// {
//     text: `output:  {"error": "I'm sorry, your request is not understandable. Please provide a valid request."}`,
// },
// { text: "Hi" },
// {
//     text: `output:  {"error": "Hi, I can make exercise plan for you, But you have to provide a more specific request? For example, you can tell me what kind of exercise you'd like?, how many weeks?, on what place you prefer to do it?"}`,
// },
// { text: "Hello" },
// {
//     text: `output:  {"error": "Hi, I can make exercise plan for you, But you have to provide a more specific request? For example, you can tell me what kind of exercise you'd like?, how many weeks?, on what place you prefer to do it?"}`,
// },
// { text: "sorry" },
// {
//     text: `output:  {"error": "No problem!, please tell me what kind of exercise you'd like to generate."}`,
// },
// { text: "sorry" },
// {
//     text: `output:  {"error": "Whats the matter?, please tell me what kind of exercise you'd like to generate."}`,
// },
// { text: "okay" },
// {
//     text: `output:  {"error": "Please provide a valid and specific request."}`,
// },
