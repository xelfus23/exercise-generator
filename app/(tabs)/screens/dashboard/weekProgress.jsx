import { LinearGradient } from "expo-linear-gradient";
import { MyColors } from "@/constants/myColors";
import {
    widthPercentageToDP as WP,
    heightPercentageToDP as HP,
} from "react-native-responsive-screen";
import { useEffect, useRef, useState } from "react";
import {
    Text,
    View,
    Animated,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import { useAuth } from "@/components/auth/authProvider";
import {
    Menu,
    MenuOption,
    MenuOptions,
    MenuTrigger,
} from "react-native-popup-menu";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";

const StackedBarChartBlock = ({ allDaysInAWeek, progress, exercisePlans }) => {
    const { user } = useAuth();
    const today = new Date();
    const PBar = ({ value }) => {
        const progress = useRef(new Animated.Value(0)).current;

        useEffect(() => {
            Animated.timing(progress, {
                toValue: value / 100, // Normalize progress (0 to 1)
                duration: 1000,
                useNativeDriver: false,
            }).start();
        }, [value]);

        const width = progress.interpolate({
            inputRange: [0, 1],
            outputRange: ["0%", "100%"],
        });

        return (
            <View
                style={{
                    height: HP(0.8),
                    backgroundColor: MyColors(0.2).green,
                    borderRadius: WP(4),
                    width: WP(62),
                    justifyContent: "center",
                    borderWidth: 1,
                    borderColor: MyColors(1).gray,
                    overflow: "hidden",
                }}
            >
                <Animated.View
                    style={{
                        height: HP(0.8),
                        backgroundColor: MyColors(0.8).green,
                        width: width, // Apply interpolated width
                        alignItems: "flex-end",
                        justifyContent: "center",
                    }}
                />
            </View>
        );
    };

    const [dailyProgress, setDailyProgress] = useState([]); // Store daily progress in state
    const [selectedPlan, setSelectedPlan] = useState(exercisePlans?.[0]); // Store selected plan in state
    const [weekNumber, setWeekNumber] = useState(0);

    const calculateWeekProgress = (plan, weeks) => {
        let progressArray = [];

        plan?.weeks?.[weeks]?.[`week${weeks + 1}`]?.map((day, index) => {
            const exercisePlanEachDay = day?.[`day${index + 1}`];
            const completedExercises = exercisePlanEachDay.filter(
                (exe) => exe.completed === true
            ).length;
            const progress =
                (completedExercises / exercisePlanEachDay.length) * 100 || 0;
            progressArray.push(progress);
        });

        setDailyProgress(progressArray); // Set calculated progress in state
    };

    useEffect(() => {
        calculateWeekProgress(selectedPlan, weekNumber);
    }, []);

    const scrollViewRef = useRef(null);

    const scrollToRight = () => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
    };

    const selectPlan = (num, plan, weeks) => {
        if (num === 1) {
            setSelectedPlan(plan);
            scrollToRight();
        } else if (num === 2) {
            setWeekNumber(weeks);
            calculateWeekProgress(plan, weeks);
        }
    };

    return (
        <LinearGradient
            colors={[MyColors(0.5).gray, MyColors(1).black]}
            locations={[0, 1]} // Adjust the locations to 0, 0.5, 1 for proper distribution
            start={{ x: 0.1, y: 0 }}
            style={{
                borderColor: MyColors(1).gray,
                margin: WP(2),
                borderWidth: 1,
                padding: WP(3),
                borderRadius: WP(4),
            }}
        >
            <View
                style={{
                    flex: 1, // Use flex to allow centering
                    justifyContent: "center", // Center vertically
                    alignItems: "center", // Center horizontally
                }}
            >
                <View
                    style={{
                        width: WP(100),
                        paddingTop: 0,
                        padding: WP(5),
                        flexDirection: "row",
                        gap: HP(2),
                    }}
                >
                    <Menu
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: HP(1),
                        }}
                    >
                        <MenuTrigger>
                            <Entypo
                                name="select-arrows"
                                size={HP(2.5)}
                                color={MyColors(1).white}
                            />
                        </MenuTrigger>

                        <Text
                            style={{
                                color: MyColors(0.8).green,
                                fontWeight: "bold",
                                fontSize: HP(1.5),
                            }}
                        >
                            {selectedPlan?.title}
                        </Text>

                        <MenuOptions
                            optionsContainerStyle={{
                                backgroundColor: MyColors(1).gray,
                                borderWidth: 1,
                                borderColor: MyColors(1).gray,
                                width: WP(70),
                            }}
                            closeOnSelect={false}
                        >
                            <LinearGradient
                                colors={[MyColors(1).gray, MyColors(1).black]}
                                style={{
                                    overflow: "hidden",
                                }}
                                start={{ x: 0, y: 0 }}
                            >
                                <ScrollView
                                    horizontal
                                    contentContainerStyle={{
                                        width: WP(70 * 2),
                                        padding: WP(2),
                                    }}
                                    style={{ maxHeight: HP(20) }}
                                    ref={scrollViewRef}
                                    scrollEnabled={false}
                                >
                                    <View
                                        style={{
                                            width: WP(70),
                                            overflow: "hidden",
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: MyColors(0.8).green,
                                                fontWeight: "bold",
                                                borderBottomWidth: 1,
                                                borderColor: MyColors(1).gray,
                                                paddingBottom: HP(1),
                                                fontSize: HP(2),
                                            }}
                                        >
                                            Select Plan
                                        </Text>
                                        <View style={{ gap: HP(1.5) }}>
                                            {exercisePlans?.map((plan) => (
                                                <TouchableOpacity
                                                    key={plan.title}
                                                    onPress={() =>
                                                        selectPlan(
                                                            1,
                                                            plan,
                                                            null
                                                        )
                                                    }
                                                >
                                                    <Text
                                                        style={{
                                                            color: MyColors(0.8)
                                                                .white,
                                                            fontSize: HP(1.3),
                                                        }}
                                                    >
                                                        {plan.title}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </View>

                                    <View style={{ width: WP(70) }}>
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                                borderBottomWidth: 1,
                                                borderColor: MyColors(1).gray,
                                                paddingBottom: HP(1),
                                                gap: HP(1),
                                            }}
                                        >
                                            <TouchableOpacity
                                                onPress={() =>
                                                    scrollViewRef.current.scrollTo(
                                                        {
                                                            x: 0,
                                                            y: 0,
                                                            animated: true,
                                                        }
                                                    )
                                                }
                                            >
                                                <AntDesign
                                                    name="arrowleft"
                                                    size={HP(2)}
                                                    color={MyColors(1).green}
                                                />
                                            </TouchableOpacity>
                                            <Text
                                                style={{
                                                    color: MyColors(0.8).white,
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                Select Week
                                            </Text>
                                        </View>
                                        {selectedPlan?.weeks?.map(
                                            (weeks, index) => (
                                                <MenuOption
                                                    key={index}
                                                    closeOnSelect={false} // Ensure the menu remains open
                                                    onSelect={() =>
                                                        selectPlan(
                                                            2,
                                                            selectedPlan,
                                                            index
                                                        )
                                                    }
                                                >
                                                    <Text
                                                        style={{
                                                            color: MyColors(0.8)
                                                                .white,
                                                        }}
                                                    >
                                                        Week {index + 1}
                                                    </Text>
                                                </MenuOption>
                                            )
                                        )}
                                    </View>
                                </ScrollView>
                            </LinearGradient>
                        </MenuOptions>
                    </Menu>
                </View>

                <View
                    style={{
                        backgroundColor: MyColors(1).black,
                        borderRadius: WP(4),
                        padding: WP(4),
                        paddingTop: 0,
                        width: "100%",
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            borderBottomWidth: 1,
                            borderColor: MyColors(1).gray,
                            paddingVertical: HP(1),
                        }}
                    >
                        <Text
                            style={{
                                color: MyColors(0.8).white,
                                fontWeight: "bold",
                                fontSize: HP(1.3),
                            }}
                        >
                            Day
                        </Text>
                        <Text
                            style={{
                                color: MyColors(0.8).white,
                                fontWeight: "bold",
                                fontSize: HP(1.3),
                            }}
                        >
                            Progress
                        </Text>
                        <Text
                            style={{
                                color: MyColors(0.8).white,
                                fontWeight: "bold",
                                fontSize: HP(1.3),
                            }}
                        >
                            Percentage
                        </Text>
                    </View>
                    <View>
                        {dailyProgress?.map((v, i) => (
                            <View
                                key={i}
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: WP(3),
                                }}
                            >
                                <Text
                                    style={{
                                        color: MyColors(0.8).white,
                                        fontWeight: "bold",
                                    }}
                                >
                                    {i + 1}
                                </Text>
                                <PBar value={v} />
                                <Text
                                    style={{
                                        color: MyColors(0.8).white,
                                        fontWeight: "bold",
                                    }}
                                >
                                    {v.toFixed(1)} %{" "}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>
            </View>
        </LinearGradient>
    );
};

export default StackedBarChartBlock;
