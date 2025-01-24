import { View, Text } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { MyColors } from "../../constants/myColors";
import MaskedView from "@react-native-masked-view/masked-view";

export default function GradientText(props) {
    return (
        <MaskedView
            maskElement={
                <Text style={[props.style, { backgroundColor: "transparent" }]}>
                    {props.text}
                </Text>
            }
        >
            <LinearGradient colors={props.colors}>
                <Text style={[props.style, { opacity: 0 }]}>{props.text}</Text>
            </LinearGradient>
        </MaskedView>
    );
}
