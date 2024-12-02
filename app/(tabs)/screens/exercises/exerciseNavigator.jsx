import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ExerciseContent from "./exercisesContent";
import Exercises from "./exercises";
import { MyColors } from "../../../../constants/myColors.jsx";
import OtherExercise from "./otherExercise/otherExercise.jsx";

export default function ExerciseNavigator({ navigation, setTabBarVisible }) {
    const Stack = createStackNavigator();

    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: MyColors(1).black },
                headerTintColor: MyColors(1).white,
                headerShown: false,
            }}
        >
            <Stack.Screen
                name="ExercisesList"
                component={Exercises}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="ExerciseContent"
                children={(props) => (
                    <ExerciseContent
                        {...props}
                        setTabBarVisible={setTabBarVisible}
                    />
                )}
            />
        </Stack.Navigator>
    );
}
