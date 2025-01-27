import { StyleSheet } from "react-native";
import {
    widthPercentageToDP as WP,
    heightPercentageToDP as HP,
} from "react-native-responsive-screen";
import { MyColors } from "@/constants/myColors";

const styles = StyleSheet.create({
    pickerStyle: {
        width: WP(40),
        backgroundColor: MyColors(1).gray,
    },
    container: {
        width: WP(100),
        zIndex: 100,
        alignItems: "center",
        justifyContent: "center",
        height: HP(100),
    },
    activeItem: {
        borderWidth: 1,
        backgroundColor: MyColors(1).gray,
    },
    dropdown: {
        backgroundColor: MyColors(1).black,
        color: MyColors(1).white,
    },
    pickerContainer: {
        borderWidth: WP(0.5),
        borderColor: MyColors(1).gray,
        padding: HP(2),
        borderRadius: WP(4),
        marginBottom: 20,
        height: "auto",
        width: WP(90),
    },
    pickerWrapper: {
        marginBottom: 20,
        justifyContent: "space-evenly",
    },
    Title: {
        fontSize: HP(2.2),
        color: MyColors(0.8).white,
        textAlign: "center",
    },
});

export default styles;
