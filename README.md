# React Native Exercise/Workout Plan Generator

This repository contains a React Native application that generates personalized exercise or workout plans using the Google Gemini API. It allows users to specify their fitness goals, preferences, and other details to create a tailored workout routine.

## Features

-   **Gemini API Integration:**
    -   Utilizes the Google Gemini API to generate custom workout plans based on user inputs.
    -   Handles API requests and responses for seamless plan generation.
-   **User Input Collection:**
    -   Collects user details like fitness level, preferred workout type, and available equipment through a step-by-step modal flow.
    -   Provides various input fields for detailed preference settings.
-   **Workout Plan Display:**
    -   Presents the generated workout plan in a clear and organized format.
    -   Potentially includes details such as exercise names, sets, reps, rest times, and durations.
-   **Firebase Authentication:**
    -   User registration and login with email and password.
    -   User logout.
    -   Password change functionality.
    -   Handles various authentication errors such as invalid credentials and duplicate emails.
-   **Firestore Integration:**
    -   Saves and retrieves user details (nickname, gender, birthdate, etc.) and potentially workout plans to Firestore.
    -   Handles asynchronous data updates and state management for user data.
-    **Navigation Management:**
    -   Uses Expo Router for navigation.
    -   Handles initial navigation after authentication and after the user fills the details for the first time.
    -   Prevents race conditions that can lead to incorrect navigation.
-    **Asynchronous State Management:**
    -   Implements React's `useEffect` hook with a carefully managed dependency array to handle asynchronous state updates in the `AuthContextProvider`.
    -   The use of a boolean `initialCheckDone` state to run the `checkInitializationStatus` only once after the user initially enters details.
-   **Responsive UI:**
    -  The UI is created using react native elements and responsive-screen

## Key Components

-   `AuthContextProvider.js`:
    -   Manages the authentication state, user data, and Firebase interactions.
    -   Provides authentication methods (login, register, logout) and user data management.
    -   Includes the `updateUserData` function for fetching user data.
    -   The `checkInitializationStatus` function determines the first navigation after the user has filled the details.
    -   Manages the `initialCheckDone` state for the first navigation.
-   `HWmodal.js`:
    -   The Modal component that contains the user details collection flow.
    -   Contains several screens for each part of the user details collection.
    -   Uses a stepper for visual progress.
    -   Utilizes `setDoc` to update the user information in Firestore.
    -   Utilizes `updateUserData` to get data from firestore
-   `getuserdetails/`:
    -   Folder containing all the components for the modal for the user details collection.
    -  Contains components such as `nickname.js`, `gender.js`, `birthdate.js`, etc.
-   `GeminiAPI.js` (or similar):
    -   Handles interaction with the Google Gemini API.
    -   Formats the user inputs and makes the API calls.
    -   Parses the response from Gemini and formats it into a displayable workout plan.
-  `WorkoutPlan.js`:
   - The component that takes the response from the GeminiAPI, parses it and shows the generated workout plan.

## Getting Started

### Prerequisites

-   Node.js (v16 or higher)
-   npm or yarn
-   Expo CLI
-   Firebase project
-   Google Gemini API access

### Installation

1.  Clone the repository:

    ```bash
    git clone [repository-url]
    cd [repository-directory]
    ```

2.  Install dependencies:

    ```bash
    npm install
    # or
    yarn install
    ```

3.  Set up Firebase:

    -   Create a new Firebase project or use an existing one.
    -   Add your Firebase web configuration to `components/firebase/config.js`:

        ```javascript
        // Replace with your actual Firebase config
        const firebaseConfig = {
          apiKey: "YOUR_API_KEY",
          authDomain: "YOUR_AUTH_DOMAIN",
          projectId: "YOUR_PROJECT_ID",
          storageBucket: "YOUR_STORAGE_BUCKET",
          messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
          appId: "YOUR_APP_ID",
        };
        ```
4.  Set up the Google Gemini API:
      -   Set up the Google Gemini API.
      -  Create an API key and save it in a `.env` file.

        ```env
         GEMINI_API_KEY = "YOUR_GEMINI_API_KEY"
        ```

5.  Start the Expo development server:

    ```bash
    npm start
    # or
    yarn start
    ```

6.  Scan the QR code or use an emulator/simulator to run the app.

## Usage

-   The app starts with an authentication flow.
-   After successful login or registration, the user is taken to the user details screen.
-   The user fills out the details through the modal.
-   Once the details are submitted the user is navigated to the home screen.
-   On the home screen, the user can generate workout plans using the Gemini API.
-   Generated workout plans are then displayed to the user.
-   Upon subsequent logins, the user is directly navigated to the home screen.

## Key Concepts and Best Practices

-  **Gemini API Integration:** Demonstrates how to interact with the Gemini API for natural language-based tasks.
-   **Race Condition Handling:** The initial versions of this code encountered a race condition where navigation occurred before data was fully updated. This was solved by the `useEffect` hook that only executes after the user state is updated.
-   **`useEffect` Dependency Arrays:** Proper use of dependency arrays in `useEffect` hooks is crucial to manage side effects correctly.
-   **Asynchronous Operations:** The code demonstrates the use of `async/await` for handling asynchronous Firebase operations and state updates and api requests.
-   **Single Source of Truth:** The `user` object in `AuthContextProvider` acts as the single source of truth for user data throughout the application.

## Contributing

Feel free to contribute to this project. Here's how:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature`).
3.  Make your changes and commit (`git commit -m "Add some feature"`).
4.  Push to the branch (`git push origin feature/your-feature`).
5.  Create a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgements

-   [React Native](https://reactnative.dev/)
-   [Firebase](https://firebase.google.com/)
-   [Expo](https://expo.io/)
-   [Google Gemini API](https://ai.google.dev/gemini-api)
