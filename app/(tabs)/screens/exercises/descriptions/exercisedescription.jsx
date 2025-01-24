import {
    heightPercentageToDP as HP,
    widthPercentageToDP as WP,
} from "react-native-responsive-screen";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Animated,
    StyleSheet,
} from "react-native";
import { MyColors } from "@/constants/myColors.jsx";
import { Feather } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { Entypo } from "@expo/vector-icons";
import Xstyles from "./../styles";
const RStyles = Xstyles.RStyles;
const levelStyles = Xstyles.levelStyles;
const styles = Xstyles.Xtyles;

export default function exerciseDescriptions({
    moveHorizontal,
    exercisePlans,
    selectedMainPlan,
    busy,
    showDesc,
    scrollViewRef123,
}) {
    const [dayCount, setDayCount] = useState(1);
    const [weekCount, setWeekCount] = useState(0);

    const RenderItem1 = ({ plan }) => {
        useEffect(() => {
            const today = new Date();
            let weekNumber;

            const todayFormatted = today.toLocaleString("en-US", {
                month: "numeric",
                day: "numeric",
                year: "numeric",
                timeZone: "Asia/Manila",
            });

            const todayWeekDay = today.toLocaleString("en-US", {
                weekday: "long",
                timeZone: "Asia/Manila",
            });

            const todayParts = todayFormatted.split("/");

            const newTodayFormatted = `${todayWeekDay}, ${
                todayParts[0] - 1
            }/${Number(todayParts[1])}/${todayParts[2].trim()}`;

            plan?.weeks?.map((week, index) => {
                week?.[`week${index + 1}`]?.forEach((day) => {
                    const dayFormatted = `${day?.weekday}, ${day?.month}/${day?.date}/${day?.year}`;

                    if (dayFormatted === newTodayFormatted) {
                        let dayC = 1;
                        weekNumber = index;
                        while (dayC <= 7) {
                            const exercises = day[`Day${dayC}`];
                            if (exercises) {
                                setDayCount(dayC);
                            }
                            dayC++;
                        }
                    }
                });
            });

            setWeekCount(weekNumber);
        }, [plan]);

        return (
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                {selectedMainPlan?.weeks?.[weekCount]?.[
                    `week${weekCount + 1}`
                ]?.map((day, index) =>
                    index !== 6 ? (
                        <View key={`day${index}`}>
                            <View style={[RStyles(dayCount, index).dayButton]}>
                                <Text style={RStyles().dayNumber}>
                                    {index + 1}
                                </Text>
                            </View>
                            <View
                                style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <Entypo
                                    name="triangle-up"
                                    size={HP(2)}
                                    color={
                                        dayCount === index + 1
                                            ? MyColors(1).green
                                            : "transparent"
                                    }
                                />
                            </View>
                        </View>
                    ) : (
                        <View key={`day${index}`}>
                            <View style={RStyles(dayCount, index).day7}>
                                <Text
                                    style={RStyles(dayCount, index).dayNumber}
                                >
                                    {index + 1}
                                </Text>
                            </View>
                            <View
                                style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <Entypo
                                    name="triangle-up"
                                    size={HP(2)}
                                    color={
                                        dayCount === index + 1
                                            ? MyColors(1).green
                                            : "transparent"
                                    }
                                />
                            </View>
                        </View>
                    )
                )}
            </View>
        );
    };

    return (
        <Animated.ScrollView
            style={{
                width: WP(100),
                height: HP(80),
                transform: [{ translateX: moveHorizontal }],
                position: "absolute",
                top: HP(9),
            }}
            ref={scrollViewRef123}
            horizontal
            scrollEnabled={false}
        >
            <ScrollView
                style={{
                    width: WP(100),
                }}
                contentContainerStyle={{
                    gap: HP(1),
                }}
            >
                {exercisePlans?.map((item) => (
                    <TouchableOpacity
                        key={item.title}
                        onPress={() => showDesc(item)}
                        disabled={busy}
                    >
                        <Animated.View
                            style={{
                                padding: HP(2),
                                borderWidth: 1,
                                marginHorizontal: HP(1),
                                borderColor: MyColors(1).gray,
                                borderRadius: WP(4),
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <Text
                                style={{
                                    color: MyColors(0.8).white,
                                    fontSize: HP(1) + WP(1),
                                }}
                            >
                                {item.title.replace(": Week 1", "")}
                            </Text>

                            <Feather
                                style={levelStyles().button}
                                name="arrow-right-circle"
                                size={HP(3)}
                                color={MyColors(1).green}
                            />
                        </Animated.View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            {selectedMainPlan && (
                <View
                    style={{
                        width: WP(100),
                    }}
                >
                    <View
                        style={{
                            borderBottomWidth: 1,
                            borderColor: MyColors(1).gray,
                            paddingVertical: WP(2),
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                            }}
                        >
                            <Text
                                style={[
                                    styles.itemLabel,
                                    {
                                        marginLeft: WP(3),
                                        marginTop: HP(1),
                                    },
                                ]}
                            >
                                Day
                            </Text>
                            <RenderItem1 plan={selectedMainPlan} />
                        </View>
                    </View>

                    <ScrollView contentContainerStyle={{}}>
                        <View
                            style={{
                                gap: WP(2),
                                padding: HP(2),
                                width: WP(100),
                            }}
                        >
                            <Text
                                style={{
                                    color: MyColors(0.8).white,
                                    fontSize: HP(1.5),
                                    textAlign: "justify",
                                }}
                            >
                                {selectedMainPlan?.planDescription}
                            </Text>

                            <Text
                                style={{
                                    color: MyColors(1).green,
                                    fontWeight: "bold",
                                    fontSize: HP(1.5),
                                }}
                            >
                                By doing this todayExercise plan you are
                                expected to:
                            </Text>

                            <View style={{ gap: WP(1) }}>
                                {selectedMainPlan?.generalObjectives?.map(
                                    (o, index) => (
                                        <Text
                                            key={index + o}
                                            style={{
                                                color: MyColors(0.8).white,
                                                fontSize: HP(1.5),
                                            }}
                                        >
                                            - {o}
                                        </Text>
                                    )
                                )}
                            </View>
                        </View>

                        <View
                            style={{
                                width: WP(100),
                                backgroundColor: MyColors(1).gray,
                                height: 1,
                            }}
                        />

                        <View style={{ padding: HP(2) }}>
                            <View style={{ gap: HP(1) }}>
                                <Text
                                    style={{
                                        color: MyColors(1).green,
                                        fontWeight: "bold",
                                        fontSize: HP(2.5),
                                    }}
                                >
                                    Week {weekCount + 1}
                                </Text>

                                <Text
                                    style={{
                                        color: MyColors(0.8).white,
                                        fontSize: HP(1.5),
                                    }}
                                >
                                    {
                                        selectedMainPlan?.weeks?.[0]
                                            .weekDescription
                                    }
                                </Text>

                                <Text
                                    style={{
                                        color: MyColors(1).green,
                                        fontWeight: "bold",
                                        fontSize: HP(1.5),
                                    }}
                                >
                                    The objectives for this week are:
                                </Text>

                                <View style={{ gap: WP(1) }}>
                                    {selectedMainPlan?.weeks?.[0]?.weekObjectives?.map(
                                        (o, index) => (
                                            <Text
                                                key={o + index}
                                                style={{
                                                    color: MyColors(0.8).white,
                                                    fontSize: HP(1.5),
                                                }}
                                            >
                                                - {o}
                                            </Text>
                                        )
                                    )}
                                </View>
                            </View>
                        </View>

                        <View
                            style={{
                                width: WP(100),
                                backgroundColor: MyColors(1).gray,
                                height: 1,
                            }}
                        />
                    </ScrollView>
                </View>
            )}
        </Animated.ScrollView>
    );
}
