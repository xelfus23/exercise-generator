import { TouchableOpacity, Text, Dimensions, View } from "react-native";
import {
    heightPercentageToDP as HP,
    widthPercentageToDP as WP,
} from "react-native-responsive-screen";
import { DiscretePalette, MyColors } from "../../../../constants/myColors";
import { Pedometer } from "expo-sensors";
import { LinearGradient } from "expo-linear-gradient";
import { useState, useEffect } from "react";

const ScreenWidth = Dimensions.get("window").width;

const Blocks = ({ item, length, scrollPosition }) => {
    return (
        <View
            style={{
                width: WP(30),
                borderRadius: WP(4),
                borderColor: item.color,
                borderWidth: 1,
                overflow: "hidden",
            }}
        >
            <LinearGradient
                colors={["transparent", MyColors(1).black]}
                style={{
                    flex: 1,
                    alignItems: "center",
                }}
            >
                <Text
                    style={{
                        color: MyColors(0.8).green,
                        fontWeight: "bold",
                        fontSize: WP(3.5),
                        borderBottomWidth: 1,
                        borderColor: MyColors(1).gray,
                        width: "85%",
                        textAlign: "center",
                        padding: WP(1),
                    }}
                >
                    {item.text}
                </Text>
                <Text
                    style={{
                        color: MyColors(0.8).white,
                        padding: WP(2),
                        fontSize: WP(2.5),
                    }}
                >
                    {item.value}
                </Text>
            </LinearGradient>
        </View>
    );
};

export default Blocks;
