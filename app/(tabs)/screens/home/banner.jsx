import { View, Text, Dimensions, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import {
    heightPercentageToDP as HP,
    widthPercentageToDP as WP,
} from "react-native-responsive-screen";
import { MyColors } from "@/constants/myColors";
import { LinearGradient } from "expo-linear-gradient";
import GradientText from "../../../../components/customs/gradientText";

const Banner = ({ user }) => {
    const [currentTime, setCurrentTime] = useState("");
    const [formattedDate, setFormattedDate] = useState("");

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const formattedTime = now.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            });
            setCurrentTime(formattedTime);

            const formattedDate = now.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
            });

            setFormattedDate(formattedDate);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    if (!user) {
        return null;
    }

    return (
        <View style={styles.container}>
            <View
                style={{ flexDirection: "row", gap: 10, alignItems: "center" }}
            >
                <Text style={styles.label}>Hi</Text>
                <GradientText
                    style={[styles.name]}
                    text={user?.firstName}
                    colors={[MyColors(1).green, MyColors(1).black]}
                />
            </View>
            <Text style={styles.date}>{formattedDate}</Text>
            {/* <Text style={styles.date}>{currentTime}</Text> */}

            {!user?.recentExercises ? (
                <Text style={styles.recentExercises}>
                    You don't have any recent exercises
                </Text>
            ) : (
                <Text style={styles.recentExercises}>
                    Last opened exercise:{" "}
                    <Text style={styles.exercise}>
                        {user?.recentExercises?.name}
                    </Text>
                </Text>
            )}
        </View>
    );
};

export default Banner;

const styles = StyleSheet.create({
    container: {
        padding: HP(3),
        borderRadius: 10,
    },
    label: {
        fontSize: WP(7),
        color: MyColors(1).white,
    },
    name: {
        fontSize: WP(8),
        fontWeight: "bold",
    },
    recentExercises: {
        fontSize: WP(2.5),
        color: MyColors(1).white,
        opacity: 0.5,
    },
    exercise: {
        color: MyColors(1).green,
    },
    date: {
        fontSize: WP(3.5),
        color: MyColors(1).white,
    },
});
