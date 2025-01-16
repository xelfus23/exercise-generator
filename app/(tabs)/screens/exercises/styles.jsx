import { StyleSheet } from "react-native";
import { MyColors } from "@/constants/myColors";
import {
    widthPercentageToDP as WP,
    heightPercentageToDP as HP,
} from "react-native-responsive-screen";

const Xtyles = StyleSheet.create({
    dotContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    itemLabelContainer: {
        width: "100%",
    },
    container: {
        gap: HP(2),
    },
    labelContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: WP(4),
    },
    itemContainer: {
        width: WP(90),
        marginHorizontal: WP(5),
        gap: WP(3),
        borderColor: MyColors(1).green,
        flexDirection: "column",
        justifyContent: "space-between",
    },
    itemLabel: {
        fontSize: WP(5),
        color: MyColors(0.8).white,
        fontWeight: "bold",
        paddingHorizontal: WP(2),
        elevation: WP(4),
        shadowColor: MyColors(0.2).white,
        borderRadius: WP(10),
        width: "auto",
    },
    itemDescription: {
        fontSize: HP(1.2) + WP(1),
        color: MyColors(1).white,
        backgroundColor: MyColors(0.5).black,
        padding: WP(2),
        borderRadius: WP(2),
    },
    title: {
        fontSize: WP(4),
        color: MyColors(1).green,
        marginHorizontal: WP(5),
        marginTop: HP(2),
    },
});

const levelStyles = (level) =>
    StyleSheet.create({
        button: {
            width: WP(12),
            borderRadius: WP(10),
        },
        text: {
            color:
                level === "Beginner"
                    ? MyColors(0.5).green
                    : level === "Intermediate"
                    ? MyColors(0.5).yellow
                    : level === "Advanced"
                    ? MyColors(0.5).red
                    : "",
            borderRadius: WP(1),
            fontSize: 12,
            paddingHorizontal: WP(2),
            width: "70%",
            elevation: WP(4),
            shadowColor:
                level === "Beginner"
                    ? MyColors(0.1).green
                    : level === "Intermediate"
                    ? MyColors(0.1).yellow
                    : level === "Advanced"
                    ? MyColors(0.1).red
                    : "",
        },
    });

const RStyles = (dayCount, dayIndex) =>
    StyleSheet.create({
        dayButton: {
            width: dayCount === dayIndex + 1 ? HP(4.5) : HP(4),
            backgroundColor:
                dayIndex !== 6
                    ? dayCount === dayIndex + 1
                        ? MyColors(0.8).green
                        : MyColors(0.1).white
                    : MyColors(1).yellow,
            borderRadius: WP(2),
            justifyContent: "center",
            alignItems: "center",
            marginHorizontal: WP(1.2),
            aspectRatio: 1,
        },
        container: {
            flexDirection: "row",
        },
        dayNumber: [
            dayIndex !== 6
                ? {
                      color: MyColors(1).white,
                      fontSize: WP(3.5),
                      fontWeight: "bold",
                  }
                : {
                      color: MyColors(1).white,
                      fontSize: WP(4),
                      fontWeight: "bold",
                  },
        ],
        day7: {
            width: HP(5.5),
            aspectRatio: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor:
                dayCount === dayIndex + 1
                    ? MyColors(1).green
                    : MyColors(0.1).white,
            borderRadius: WP(8),
            padding: WP(1),
            marginLeft: WP(1),
        },
    });

export default { RStyles, Xtyles, levelStyles };
