import { View, Text, TouchableOpacity, Pressable } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { LinearGradient } from "expo-linear-gradient";
import { MyColors } from "@/constants/myColors";
import {
    heightPercentageToDP as HP,
    widthPercentageToDP as WP,
} from "react-native-responsive-screen";
import { useState, useEffect } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";

const LineChartBlock = ({
    todayExercise,
    allDaysInAWeek,
    progress,
    exercisePlans,
}) => {
    const [isToggle, setToggle] = useState(false);
    const [allCalories, setAllCalories] = useState([]); // Changed to hold all days
    const [currentWeekOffset, setCurrentWeekOffset] = useState(0);

    const weekDays = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];

    const dayLabel = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Function to get Monday's date of the current week
    function getWeekMonday(offset) {
        const date = new Date();
        const day = date.getDay() + 1;
        const diff = day === 0 ? -6 : 1 - day;
        date.setDate(date.getDate() + diff + offset * 7); // Adjust by offset weeks
        return date;
    }

    // Get the start and end dates for this week
    const startOfWeek = getWeekMonday(currentWeekOffset);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const weekDaysWithDates = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        return {
            date: date.getDate(),
            month: date.getMonth(), // Adjust to 1-based month
            year: date.getFullYear(),
            weekday: weekDays[i],
        };
    });

    const [weekDate, setWeekDate] = useState([]);

    const data = {
        labels: dayLabel,
        datasets: [
            {
                data:
                    allCalories?.length > 0
                        ? allCalories.map((item) => item.completedCalories)
                        : Array(7).fill(0), // Data for the completed calories
                color: (opacity) => MyColors(opacity).green, // Color for completed calories
                strokeWidth: 2,
            },
            {
                data:
                    allCalories?.length > 0
                        ? allCalories.map((item) => item.totalCalories)
                        : Array(7).fill(0), // Data for total calories
                color: (opacity) => MyColors(opacity).yellow, // Color for total calories
                strokeWidth: 1,
            },
        ],
    };

    const updateWeekDates = () => {
        const startOfWeek = getWeekMonday(currentWeekOffset);
        const weekDates = Array.from({ length: 7 }, (_, i) => {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            return {
                weekday: dayLabel[i],
                date: `${date.getDate()}`, // Format MM/DD
                month: `${date.getMonth()}`,
                year: `${date.getFullYear()}`,
            };
        });
        setWeekDate(weekDates); // Set the week dates to state
    };

    const getWeeklyCalories = () => {
        let allDays = [];
        let weekDate = [];

        exercisePlans?.forEach((plan) => {
            plan?.weeks?.map((w, i) => {
                w?.[`week${i + 1}`]?.forEach((day) => {
                    allDays.push(day);
                });
            });
        });

        const allDayCalories = weekDaysWithDates.map((day) => {
            let dailyTotalCalories = 0;
            let dailyCompletedCalories = 0;

            allDays.forEach((dayExercise) => {
                const dayFormatted = `${dayExercise?.weekday}, ${dayExercise?.month}/${dayExercise?.date}/${dayExercise?.year}`;
                const currentDayFormatted = `${day.weekday}, ${day.month}/${day.date}/${day.year}`;

                if (dayFormatted === currentDayFormatted) {
                    // Loop through exercises to accumulate calorie

                    let dayNum = 1;
                    while (dayNum <= allDays?.length) {
                        dayExercise?.[`day${dayNum}`]?.forEach((exercise) => {
                            dailyTotalCalories += exercise.calories || 0;

                            if (exercise.completed) {
                                dailyCompletedCalories +=
                                    exercise.calories || 0;
                            }
                        });
                        dayNum++;
                    }
                }
            });

            return {
                date: `${day.weekday}, ${day.month}/${day.date}`,
                totalCalories: dailyTotalCalories,
                completedCalories: dailyCompletedCalories,
            };
        });

        setWeekDate(weekDate);
        setAllCalories(allDayCalories); // Update the state with the week's calorie data
    };

    useEffect(
        () => {
            getWeeklyCalories();
            updateWeekDates(); // Update week dates when offset changes
        },
        [progress, currentWeekOffset],
        [allDaysInAWeek]
    ); // Recalculate on offset change

    const nextWeek = () => {
        setCurrentWeekOffset((prevOffset) => prevOffset + 1);
    };

    const prevWeek = () => {
        setCurrentWeekOffset((prevOffset) => prevOffset - 1);
    };

    const calculateMonth = (month) => {
        switch (month) {
            case 0:
                return "Jan";
            case 1:
                return "Feb";
            case 2:
                return "Mar";
            case 3:
                return "Apr";
            case 4:
                return "May";
            case 5:
                return "Jun";
            case 6:
                return "Jul";
            case 7:
                return "Aug";
            case 8:
                return "Sep";
            case 9:
                return "Oct";
            case 10:
                return "Nov";
            case 11:
                return "Dec";
            default:
                return "Invalid month";
        }
    };

    return (
        <LinearGradient
            colors={[MyColors(0.5).gray, MyColors(1).black]}
            locations={[0, 1]}
            start={{ x: 0.1, y: 0 }}
            style={{
                borderColor: MyColors(1).gray,
                marginHorizontal: WP(2),
                borderRadius: WP(4),
                borderWidth: 1,
            }}
        >
            <View
                style={{
                    marginBottom: WP(2),
                    alignItems: "center",
                    paddingBottom: WP(1),
                    padding: WP(3),
                    flexDirection: "row",
                    gap: HP(3),
                }}
            >
                <Text
                    style={{
                        color: MyColors(1).green,
                        fontWeight: "bold",
                        fontSize: HP(2),
                    }}
                >
                    Calorie Record
                </Text>
                <View style={{ flexDirection: "row", gap: HP(2) }}>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: HP(1),
                        }}
                    >
                        <View
                            style={{
                                aspectRatio: 1,
                                height: HP(1),
                                borderRadius: HP(1),
                                backgroundColor: MyColors(1).green,
                            }}
                        />
                        <Text
                            style={{
                                color: MyColors(1).white,
                                fontWeight: "bold",
                                fontSize: HP(1.5),
                            }}
                        >
                            My Progress
                        </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: HP(1),
                        }}
                    >
                        <View
                            style={{
                                aspectRatio: 1,
                                height: HP(1),
                                borderRadius: HP(1),
                                backgroundColor: MyColors(1).yellow,
                            }}
                        />
                        <Text
                            style={{
                                color: MyColors(1).white,
                                fontWeight: "bold",
                                fontSize: HP(1.5),
                            }}
                        >
                            My Goal
                        </Text>
                    </View>
                </View>
            </View>

            <View
                style={{
                    gap: HP(1),
                    marginHorizontal: WP(3),
                    marginBottom: WP(3),
                    borderWidth: 1,
                    borderColor: MyColors(1).gray,
                    backgroundColor: MyColors(1).black,
                    borderRadius: WP(4),
                    overflow: "hidden",
                }}
            >
                <View
                    style={{
                        paddingTop: HP(1),
                        flexDirection: "row",
                        gap: WP(2),
                    }}
                >
                    <View
                        style={{
                            alignItems: "center",
                            justifyContent: "center",
                            paddingLeft: WP(4),
                            width: WP(15),
                        }}
                    >
                        <Text
                            style={{
                                color: MyColors(0.8).green,
                                fontSize: HP(1.5),
                                fontWeight: "bold",
                            }}
                        >
                            {calculateMonth(Number(weekDate?.[0]?.month))}
                        </Text>
                        <Text
                            style={{
                                color: MyColors(0.8).green,
                                fontWeight: "bold",
                                fontSize: HP(1),
                            }}
                        >
                            {weekDate?.[0]?.year}
                        </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-evenly",
                            width: `70%`,
                            borderBottomWidth: 1,
                            borderColor: MyColors(0.1).green,
                            paddingBottom: HP(1),
                        }}
                    >
                        {weekDate.map((item, i) => (
                            <View
                                key={i}
                                style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                    width: '3%',
                                }}
                            >
                                <Text
                                    style={{
                                        color: MyColors(0.8).green,
                                        fontSize: HP(1.2),
                                        width: WP(20),
                                        textAlign: "center",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {Number(item.date) === 1
                                        ? `${calculateMonth(
                                              Number(item.month)
                                          )}`
                                        : ""}
                                </Text>
                                <Text
                                    style={{
                                        color: MyColors(0.8).white,
                                        fontSize: HP(1),
                                        width: "100%",
                                        textAlign: "center",
                                    }}
                                >
                                    {item.date}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-around",
                    }}
                >
                    <TouchableOpacity onPress={prevWeek}>
                        <View
                            style={{
                                alignItems: "center",
                                justifyContent: "center",
                                flex: 1,
                                backgroundColor: MyColors(1).black,
                                paddingHorizontal: WP(2),
                            }}
                        >
                            <AntDesign
                                name="leftcircleo"
                                size={HP(2)}
                                color={
                                    isToggle
                                        ? MyColors(1).yellow
                                        : MyColors(1).green
                                }
                            />
                        </View>
                    </TouchableOpacity>
                    <LineChart
                        data={data}
                        width={WP(72)}
                        height={HP(14)}
                        chartConfig={{
                            backgroundColor: "transparent",
                            backgroundGradientFrom: MyColors(1).black,
                            backgroundGradientTo: MyColors(1).black,
                            decimalPlaces: 1,
                            color: (opacity, index) => MyColors(opacity).green,
                            labelColor: (opacity = 0.8) =>
                                MyColors(opacity).white,
                            style: { borderRadius: WP(4), marginBottom: HP(2) },
                            propsForDots: {
                                r: "2",
                                strokeWidth: 1,
                                stroke: MyColors(0.8).white,
                            },
                            propsForLabels: {
                                fontSize: HP(1),
                            },

                            fillShadowGradient: MyColors(0.1).green,
                            fillShadowGradientOpacity: 0,
                        }}
                        style={{ paddingBottom: HP(1) }}
                        yLabelsOffset={HP(1)}
                        xLabelsOffset={-HP(1)}
                        formatYLabel={(value) => `${value} cal`} // Adds "cal" to each Y-axis label
                        bezier
                    />
                    <TouchableOpacity onPress={nextWeek}>
                        <View
                            style={{
                                alignItems: "center",
                                justifyContent: "center",
                                flex: 1,
                                backgroundColor: MyColors(1).black,
                                paddingHorizontal: WP(2),
                            }}
                        >
                            <AntDesign
                                name="rightcircleo"
                                size={HP(2)}
                                color={
                                    isToggle
                                        ? MyColors(1).yellow
                                        : MyColors(1).green
                                }
                            />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </LinearGradient>
    );
};

export default LineChartBlock;
