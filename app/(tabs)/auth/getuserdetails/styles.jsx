import { StyleSheet } from "react-native";
import { widthPercentageToDP as WP, heightPercentageToDP as HP } from "react-native-responsive-screen";
import { MyColors } from "@/constants/myColors";

const styles = StyleSheet.create({
    pickerStyle: {
        width: WP(40),
        backgroundColor: MyColors(1).gray,
    },
    container: {
        width: WP(100),
        flex: 1,
        backgroundColor: MyColors(1).black,
        zIndex: 100,
        alignItems: "center",
        marginTop: HP(5),
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
        fontSize: HP(2),
        fontWeight: "bold",
        color: MyColors(1).white,
    },
});

export default styles