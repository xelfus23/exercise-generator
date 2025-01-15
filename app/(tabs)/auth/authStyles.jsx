import { StyleSheet } from "react-native";
import { MyColors } from "@/constants/myColors";
import {
    widthPercentageToDP as WP,
    heightPercentageToDP as HP,
} from "react-native-responsive-screen";

export const style = StyleSheet.create({
    main_container: {
        backgroundColor: MyColors(1).black,
        width: WP(100),
        flex: 1,
    },
});

export const LoginRegisterStyle = StyleSheet.create({
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    titleContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: WP(20),
        marginLeft: WP(10),
    },
    error: {
        color: MyColors(1).red,
        textAlign: "center",
    },
    eye: {
        right: WP(5),
        position: "absolute",
    },
    mainContainer: {
        flex: 1,
        paddingTop: HP(30),
    },
    scrollView: {
        backgroundColor: MyColors(1).black,
        width: "auto",
    },
    container: {
        paddingHorizontal: WP(10),
        gap: HP(3),
        width: WP(100),
        paddingTop: HP(5),
        backgroundColor: MyColors(1).black,
    },
    title: {
        color: MyColors(1).white,
        fontSize: HP(4),
        fontWeight: "bold",
        textAlign: "center",
    },
    input: {
        backgroundColor: MyColors(0.2).white,
        borderRadius: WP(4),
        paddingHorizontal: WP(4),
        fontSize: WP(3.5),
        height: HP(6),
        width: "100%",
        justifyContent: "space-between",
        color: MyColors(1).white,
    },
    inputView: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
    },
    inputContainer: {
        gap: HP(2),
    },
    button: {
        backgroundColor: MyColors(1).gray,
        borderWidth: 1,
        borderColor: MyColors(1).green,
        textAlign: "center",
        alignItems: "center",
        width: "45%",
        borderRadius: WP(5),
    },
    buttonText: {
        fontWeight: "bold",
        color: MyColors(1).white,
        textAlign: "center",
        alignItems: "center",
        fontSize: HP(2),
    },
    linkContainer: {
        flexDirection: "row",
        color: MyColors(1).white,
        alignItems: "center",
        gap: WP(1),
        justifyContent: "center",
    },
    bottomText: {
        fontSize: HP(2),
        textAlign: "center",
        color: MyColors(1).white,
    },
    link: {
        color: MyColors(1).green,
        fontWeight: "bold",
    },
});