import { TouchableOpacity, View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { MyColors } from "../../../../../constants/myColors";
import {
    heightPercentageToDP as HP,
    widthPercentageToDP as WP,
} from "react-native-responsive-screen";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const RenderItem = ({ onPress, item, index }) => {
    const [targetTime, setTargetTime] = useState(null); // Store the target 12 AM time
    const [currentTime, setCurrentTime] = useState(new Date());

    // Function to calculate the next day's 12 AM time
    const getNextMidnight = () => {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(now.getDate() + 1); // Set to next day
        tomorrow.setHours(0, 0, 0, 0); // Set to 12:00:00 AM of the next day
        return tomorrow;
    };

    // Function to retrieve stored target time from AsyncStorage
    const getStoredTargetTime = async () => {
        try {
            const savedTime = await AsyncStorage.getItem("targetTime");
            return savedTime ? new Date(savedTime) : getNextMidnight();
        } catch (e) {
            console.error("Failed to fetch the target time from storage:", e);
            return getNextMidnight(); // Fallback to next midnight if any error
        }
    };

    useEffect(() => {
        const initializeTimer = async () => {
            let time = await getStoredTargetTime();
            setTargetTime(time);
        };

        initializeTimer();

        const timerInterval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        // Clear interval on unmount
        return () => clearInterval(timerInterval);
    }, []);

    // Save target time in AsyncStorage
    useEffect(() => {
        if (targetTime) {
            AsyncStorage.setItem("targetTime", targetTime.toISOString());
        }
    }, [targetTime]);

    // Calculate the remaining time until 12 AM tomorrow
    const remainingTime = targetTime
        ? targetTime.getTime() - currentTime.getTime()
        : 0;

    // Prevent negative time
    const timeLeft = remainingTime > 0 ? remainingTime : 0;

    // Convert remaining time to hours, minutes, and seconds
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    return (
        <>
            <TouchableOpacity
                key={index}
                onPress={() => onPress(item)}
                style={{
                    backgroundColor: MyColors(1).black,
                    padding: WP(3),
                    marginHorizontal: WP(1),
                    paddingHorizontal: WP(5),
                    borderRadius: WP(4),
                    borderWidth: 1,
                    borderColor: MyColors(1).gray,
                    width: WP(46),
                }}
            >
                <View
                    style={{
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexDirection: "row",
                        width: "100%",
                    }}
                >
                    <Text
                        style={{
                            color: MyColors(1).white,
                            fontWeight: "bold",
                            fontSize: 14,
                            maxWidth: WP(30),
                        }}
                    >
                        {item?.title}
                    </Text>
                    <Feather
                        name="arrow-right-circle"
                        size={WP(5)}
                        color={MyColors(1).green}
                    />
                </View>

                <Text style={{ color: MyColors(1).yellow, fontSize: HP(1) }}>
                    Expires in: {String(hours).padStart(2, "0")}:
                    {String(minutes).padStart(2, "0")}:
                    {String(seconds).padStart(2, "0")}
                </Text>
            </TouchableOpacity>
        </>
    );
};

export default RenderItem;
