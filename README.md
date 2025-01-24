# React Native Exercise/Workout Plan Generator with AI Chatbot

This repository contains a React Native application that generates personalized exercise or workout plans using the Google Gemini API, and also features an AI chatbot for interactive assistance. It allows users to specify their fitness goals, preferences, and other details to create a tailored workout routine, and also to interact with a chat bot.

## Features

-   **Gemini API Integration:**
    -   Utilizes the Google Gemini API to generate custom workout plans based on user inputs.
    -   Handles API requests and responses for seamless plan generation.
    -   Utilizes the Gemini API for the AI Chatbot
-   **AI Chatbot:**
    -   Integrated AI chatbot powered by Gemini.
    -   Allows users to ask questions about exercises and fitness.
-   **User Input Collection:**
    -   Collects user details like fitness level, preferred workout type, and available equipment through a step-by-step modal flow.
    -   Provides various input fields for detailed preference settings.
-   **Workout Plan Display:**
    -   Presents the generated workout plan in a clear and organized format.
    -   Includes details such as exercise names, sets, reps, rest times, and durations.
-    **AI Chatbot Interface**
    -   Has a user interface for the AI chatbot to make it interactive.
-   **Firebase Authentication:**
    -   User registration and login with email and password.
    -   User logout.
    -   Password change functionality.
    -   Handles various authentication errors such as invalid credentials and duplicate emails.
-   **Firestore Integration:**
    -   Saves and retrieves user details (nickname, gender, birthdate, etc.) and potentially workout plans to Firestore.
    -   Handles asynchronous data updates and state management for user data.
-   **Navigation Management:**
    -   Uses Expo Router for navigation.
    -   Handles initial navigation after authentication and after the user fills the details for the first time.
    -   Prevents race conditions that can lead to incorrect navigation.
-   **Asynchronous State Management:**
    -   Implements React's `useEffect` hook with a carefully managed dependency array to handle asynchronous state updates in the `AuthContextProvider`.
    -   The use of a boolean `initialCheckDone` state to run the `checkInitializationStatus` only once after the user initially enters details.
-   **Responsive UI:**
    -   The UI is created using react native elements and responsive-screen.

## Usage

-   The app starts with an authentication flow.
-   After successful login or registration, the user is taken to the user details screen.
-   The user fills out the details through the modal.
-   Once the details are submitted the user is navigated to the home screen.
-   On the home screen, the user can generate workout plans using the Gemini API.
-   Also on the home screen, the user can interact with the AI chatbot.
-   Generated workout plans are then displayed to the user.
-   Upon subsequent logins, the user is directly navigated to the home screen.

## Key Concepts and Best Practices

-   **Gemini API Integration:** Demonstrates how to interact with the Gemini API for natural language-based tasks (exercise generation and chatbot).
-   **AI Chatbot Integration:** Demonstrates how to integrate an AI chatbot into your React Native app.
-   **Race Condition Handling:** The initial versions of this code encountered a race condition where navigation occurred before data was fully updated. This was solved by the `useEffect` hook that only executes after the user state is updated.
-   **`useEffect` Dependency Arrays:** Proper use of dependency arrays in `useEffect` hooks is crucial to manage side effects correctly.
-   **Asynchronous Operations:** The code demonstrates the use of `async/await` for handling asynchronous Firebase operations, state updates, and API requests.
-  **Single Source of Truth:** The `user` object in `AuthContextProvider` acts as the single source of truth for user data throughout the application.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgements

-   [React Native](https://reactnative.dev/)
-   [Firebase](https://firebase.google.com/)
-   [Expo](https://expo.io/)
-   [Google Gemini API](https://ai.google.dev/gemini-api)
-  [lodash](https://www.npmjs.com/package/lodash)
-   [lottie-react-native](https://www.npmjs.com/package/lottie-react-native)
-  [react-native-chart-kit](https://www.npmjs.com/package/react-native-chart-kit)
- [react-native-countdown-circle-timer](https://www.npmjs.com/package/react-native-countdown-circle-timer)
-  [react-native-gesture-handler](https://www.npmjs.com/package/react-native-gesture-handler)
-  [react-native-popup-menu](https://www.npmjs.com/package/react-native-popup-menu)
-  [react-native-progress](https://www.npmjs.com/package/react-native-progress)
- [react-native-reanimated](https://www.npmjs.com/package/react-native-reanimated)
-  [react-native-responsive-screen](https://www.npmjs.com/package/react-native-responsive-screen)
-  [react-native-safe-area-context](https://www.npmjs.com/package/react-native-safe-area-context)
-  [react-native-screens](https://www.npmjs.com/package/react-native-screens)
- [react-native-svg](https://www.npmjs.com/package/react-native-svg)
- [react-native-web](https://www.npmjs.com/package/react-native-web)
-  [react-native-webview](https://www.npmjs.com/package/react-native-webview)
