import { useNavigation } from "expo-router";
import {
    heightPercentageToDP as HP,
    widthPercentageToDP as WP,
} from "react-native-responsive-screen";
import { View, TouchableOpacity, Text, Image } from "react-native";
import { MyColors } from "../../../constants/myColors";

const Screen1 = ({ handleScroll }) => {
    const navigator = useNavigation();

    return (
        <View
            style={{
                width: WP(100),
                justifyContent: "center",
                alignItems: "center",
                gap: WP(3),
                backgroundColor: MyColors(1).black,
            }}
        >
            <TouchableOpacity
                onPress={handleScroll}
                style={{
                    height: HP(7),
                    width: HP(25),
                    backgroundColor: MyColors(0.8).green,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 100,
                    zIndex: 2,
                }}
            >
                <Text
                    style={{
                        fontSize: HP(2),
                        textAlign: "center",
                        color: MyColors(1).white,
                        fontWeight: "bold",
                        zIndex: 2,
                    }}
                >
                    Get Started
                </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigator.navigate("login")}>
                <Text
                    style={{
                        fontSize: HP(1.8),
                        textAlign: "center",
                        color: MyColors(0.6).white,
                        fontWeight: "bold",
                        zIndex: 2,
                    }}
                >
                    Already have an account?
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default Screen1;
