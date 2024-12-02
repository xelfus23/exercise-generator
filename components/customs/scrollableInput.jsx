import {
    View,
    Text,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
} from "react-native";
import React from "react";
import { MyColors } from "../../constants/myColors";

const ios = Platform.OS == "ios";
export default function ScrollableInput({ children }) {
    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: MyColors(1).black }}
        >
            <ScrollView
                style={{ flex: 1 }}
                bounces={false}
                showsVerticalScrollIndicator={false}
            >
                {children}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
