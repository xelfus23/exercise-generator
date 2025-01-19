import { MyColors } from "@/constants/myColors";
import { View, Text, TextInput } from "react-native";
import {
    widthPercentageToDP as WP,
    heightPercentageToDP as HP,
} from "react-native-responsive-screen";
import NextButtons from "./next";
import { useState } from "react";

export default function Nickname({ setNickName, next, nickName }) {
    const [error, setError] = useState(null);

    const nextButton = () => {
        if (!nickName) {
            setError("Please enter your nickname.");
            setTimeout(() => {
                setError(null);
            }, 2000);
            return;
        }
        next(1);
    };

    const backButton = () => {
        next(-1);
    };

    return (
        <View
            style={{
                flex: 1,
                alignItems: "center",
                padding: WP(5),
                gap: HP(2),
            }}
        >
            <View
                style={{
                    width: WP(80),
                    justifyContent: "center",
                    gap: HP(2),
                }}
            >
                <Text
                    style={{
                        fontWeight: "bold",
                        color: MyColors(1).white,
                        fontSize: HP(2.5),
                    }}
                >
                    • What do you want us to call you?
                </Text>

                <TextInput
                    style={{
                        padding: WP(4),
                        backgroundColor: MyColors(0.2).white,
                        borderRadius: WP(4),
                        width: WP(50),
                        fontSize: HP(1.5),
                        color: MyColors(1).white,
                    }}
                    value={nickName}
                    onChangeText={(value) => setNickName(value)}
                    maxLength={14}
                    placeholder="Enter your nickname"
                    placeholderTextColor={MyColors(0.2).white}
                />
            </View>
            <View>
                <Text style={{ color: MyColors(1).red }}>{error}</Text>
            </View>

            <View>
                <NextButtons
                    next={nextButton}
                    firstIndex={true}
                    error={error}
                />
            </View>
        </View>
    );
}
