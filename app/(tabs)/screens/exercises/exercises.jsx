import {
    heightPercentageToDP as HP,
    widthPercentageToDP as WP,
} from "react-native-responsive-screen";
import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    FlatList,
    StyleSheet,
    ImageBackground,
    Modal,
    Image,
    Animated,
    Easing,
    TextInput,
    Pressable,
    PanResponder,
} from "react-native";
import React, { useState, useLayoutEffect, useEffect, useRef } from "react";
import { useAuth } from "@/components/auth/authProvider";
import { MyColors } from "@/constants/myColors.jsx";
import CustomHeader from "@/components/customs/CustomHeader";
import Exercise from "./modal.jsx";
import { Feather, FontAwesome6, Ionicons } from "@expo/vector-icons";
import { setDoc, doc } from "firebase/firestore";
import { db } from "@/components/firebase/config";
import ProgressBar from "react-native-progress/Bar.js";
import { useNavigation } from "expo-router";
import Loading from "@/components/customs/loading.jsx";
import generator from "./exerciseGenerator.jsx";
import { getAuth } from "firebase/auth";
import AntDesign from "@expo/vector-icons/AntDesign";
import { userData } from "@/components/auth/userData.jsx";
import Entypo from "@expo/vector-icons/Entypo";
import OtherExercise from "./otherExercise/otherExercise.jsx";
import CustomHeaderB from "../settings/customDrawerLabel.jsx";
import { LinearGradient } from "expo-linear-gradient";
import { tunedParts } from "./AI/parts.jsx";
import planGeneratorInstructions from "./AI/planGeneratorInstructions.jsx";
import { planUpgradeInstructions } from "./AI/planUpgradeInstructions.jsx";
import RenderItem from "./otherExercise/otherExerciseBlock.jsx";
import Robot from "./AI/robot.jsx";
import {
    Menu,
    MenuOption,
    MenuOptions,
    MenuTrigger,
} from "react-native-popup-menu";
import LottieView from "lottie-react-native";

const Exercises = ({ route }) => {
    const {
        user,
        updateUserData,
        todayExercise,
        otherExercise,
        exercisePlans,
        progress,
        completedExerciseToday,
    } = useAuth();
    const [selectedItem, setSelectedItem] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const navigation = useNavigation();
    const currentUser = getAuth().currentUser;
    const [errorGenerating, setErrorGenerating] = useState(null);
    const data = userData();
    const {
        exerciseGenerator,
        upgradeExercisePlan,
        addToDatabase,
        getStorage,
        addUpgradeToDatabase,
    } = generator();
    const [userInput, setUserInput] = useState(null);
    const [generating, setGenerating] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [generatingText, setGeneratingText] = useState(null);

    const [selectedMainPlan, setSelectedMainPlan] = useState(null);

    const [busy, setBusy] = useState(false);
    const menuRef = useRef(null);
    const scrollViewRef2 = useRef(null);

    const runGenerator = async () => {
        console.log("running generator");
        const currentInput = userInput; // Store input before clearing
        setUserInput(null);
        setGenerating(true);
        setErrorGenerating("generating...");
        try {
            console.log("trying");
            const newExercisePlan = await exerciseGenerator({
                input: currentInput,
                setError: setErrorGenerating,
                setGenerating: setGenerating,
                instructions: planGeneratorInstructions(data),
            });

            console.log(newExercisePlan);
            const parsedPlan = JSON.parse(newExercisePlan);
            if (parsedPlan) {
                setErrorGenerating("please wait...");
                if (parsedPlan.error) {
                    setErrorGenerating("hmmm...");

                    setTimeout(() => {
                        setErrorGenerating(parsedPlan.error);
                        setGenerating(false);
                    }, 2000);
                } else {
                    setErrorGenerating("Adding to database...");
                    await addToDatabase(
                        parsedPlan,
                        currentUser,
                        setErrorGenerating
                    );
                    setErrorGenerating("Completed!");
                    setGenerating(false);
                }
            }
        } catch (error) {
            console.log(error);
            return runGenerator();
        } finally {
            updateUserData(currentUser.uid);
        }
    };
    // end of function

    useEffect(() => {
        if (exercisePlans.length === 0) {
            console.log("No exercise plan");
            runGenerator();
        }
    }, [exercisePlans]); // Dependency array will run whenever the user changes

    useEffect(() => {
        if (selectedItem) {
            setShowModal(true); // Opens the modal when an item is selected
        }
    }, [selectedItem]);

    const closeModal = () => {
        setShowModal(false);
        setSelectedItem(null); // Ensure selectedItem is cleared after closing the modal
    };

    const recommendedItems = ({ item, index }) => {
        const exe = item.exercise;
        const plan = item.plan;

        return (
            <ImageBackground style={styles.itemContainer} resizeMode="center">
                <View>
                    <View style={styles.itemLabelContainer}>
                        <Text
                            style={{
                                fontSize: HP(3),
                                color:
                                    exe?.name !== "Rest Day"
                                        ? MyColors(0.8).white
                                        : MyColors(1).green,
                                fontWeight: "bold",
                                paddingHorizontal: WP(2),
                                elevation: WP(4),
                                shadowColor: MyColors(0.2).white,
                                borderRadius: WP(10),
                                width: "auto",
                            }}
                        >
                            {exe?.name === "Rest Day"
                                ? plan?.title.replace(": Week 1", "") +
                                  " " +
                                  exe?.name
                                : exe?.name}
                        </Text>
                        {exe?.name !== "Rest Day" && (
                            <Text
                                style={{
                                    color: MyColors(1).yellow,
                                    fontSize: HP(1.2),
                                    paddingHorizontal: WP(2),
                                }}
                            >
                                {plan?.title.replace(": Week 1", "")}
                            </Text>
                        )}
                    </View>

                    <Text style={styles.itemDescription}>
                        {exe?.description}
                    </Text>
                </View>

                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: WP(1),
                    }}
                >
                    {exe?.completed === true && (
                        <Text
                            style={{
                                color: MyColors(1).green,
                                padding: WP(1),
                                borderRadius: WP(2),
                            }}
                        >
                            DONE todayExercise
                        </Text>
                    )}

                    {exe?.name !== "Rest Day" && (
                        <TouchableOpacity
                            style={{ width: WP(13) }}
                            onPress={() => setSelectedItem({ item, index })}
                            disabled={exe?.completed === true}
                        >
                            {exe?.completed !== true ? (
                                <Feather
                                    style={levelStyles().button}
                                    name="arrow-right-circle"
                                    size={HP(5)}
                                    color={MyColors(1).green}
                                />
                            ) : (
                                <AntDesign
                                    style={levelStyles().button}
                                    name={"checkcircleo"}
                                    size={HP(2)}
                                    color={
                                        exe?.completed === false
                                            ? MyColors(1).gray
                                            : MyColors(1).green
                                    }
                                />
                            )}
                        </TouchableOpacity>
                    )}
                </View>
            </ImageBackground>
        );
    };

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

    const scrollViewRef = useRef(null);

    const handlePlanPress = (item) => {
        setSelectedPlan(item);
        if (scrollViewRef?.current) {
            scrollViewRef?.current?.scrollTo({ x: WP(100), animated: true });
        }
    };

    const handleBackPress = () => {
        if (scrollViewRef?.current) {
            scrollViewRef?.current?.scrollTo({ x: WP(0), animated: true });
        }
        setTimeout(() => {
            setSelectedPlan(null);
        }, 100);
    };

    const [descShown, setDescShown] = useState(false);
    const moveHorizontal = useRef(new Animated.Value(-WP(100))).current;
    const moveVertical = useRef(new Animated.Value(0)).current; // Starting position
    const btnRotate = useRef(new Animated.Value(0)).current;

    const showDes = (tapped) => {
        const verticalValue = descShown ? 0 : HP(80);
        const horizontalValue = descShown ? -WP(100) : 0;
        setBusy(true);
        Animated.parallel([
            Animated.timing(moveHorizontal, {
                toValue: descShown ? horizontalValue : 0,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.timing(btnRotate, {
                toValue: descShown ? 0 : 180,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.timing(moveVertical, {
                toValue: descShown ? verticalValue : HP(80),
                duration: 500,
                useNativeDriver: true,
            }),
        ]).start();
        setDescShown(!descShown);
        setTimeout(() => {
            setBusy(false);
        }, 500);
    };

    const openMenu = () => {
        if (menuRef.current) {
            menuRef.current.open();
        }
    };

    const scrollViewRef123 = useRef(null);

    const showDesc = (item) => {
        setBusy(true);
        setSelectedMainPlan(item);
        if (scrollViewRef123?.current) {
            scrollViewRef123?.current?.scrollTo({ x: WP(100), animated: true });
        }
        setTimeout(() => {
            setBusy(false);
        }, 500);
    };

    const hideDesc = () => {
        setBusy(true);

        if (scrollViewRef123?.current) {
            scrollViewRef123?.current?.scrollTo({ x: WP(0), animated: true });
            setTimeout(() => {
                setSelectedMainPlan(null);
            }, 10);
        }
        setTimeout(() => {
            setBusy(false);
        }, 500);
    };

    const [activeIndex, setActiveIndex] = useState(0);

    const itemScrolls = (event) => {
        const scrollX = event.nativeEvent.contentOffset.x;
        const currentIndex = Math.round(scrollX / WP(100));
        setActiveIndex(currentIndex);
    };
    return (
        <ScrollView
            scrollEnabled={false}
            horizontal
            ref={scrollViewRef}
            style={{ backgroundColor: MyColors(1).black, flexDirection: "row" }}
            contentContainerStyle={{ width: WP(200) }}
            showsHorizontalScrollIndicator={false}
        >
            <SafeAreaView
                style={{ backgroundColor: MyColors(1).black, width: WP(100) }}
            >
                <Modal visible={showModal} transparent animationType="slide">
                    <Exercise
                        closeModal={closeModal}
                        selectedItem={selectedItem}
                    />
                </Modal>

                <CustomHeader title={"Exercises"} />

                {user?.exercisePlans && user?.exercisePlans?.length > 0 ? (
                    <View>
                        <View
                            style={[
                                {
                                    borderBottomWidth: 1,
                                    borderColor: MyColors(1).gray,
                                    justifyContent: "flex-start",
                                    alignItems: "flex-start",
                                    paddingHorizontal: WP(5),
                                },
                            ]}
                        >
                            <Pressable
                                onPress={selectedMainPlan ? hideDesc : showDes}
                                style={{
                                    borderRadius: WP(2),
                                    marginVertical: HP(2),
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flexDirection: "row",
                                    gap: HP(1),
                                }}
                                disabled={busy}
                            >
                                <Animated.View
                                    style={{
                                        transform: [
                                            {
                                                rotateZ: btnRotate.interpolate({
                                                    inputRange: [30, 90], // Changed to match the rotation values
                                                    outputRange: [
                                                        "0deg",
                                                        "180deg",
                                                    ], // Ensure these are strings
                                                }),
                                            },
                                        ],
                                    }}
                                >
                                    <AntDesign
                                        name={"downcircleo"} // Toggle icon based on descShown
                                        size={HP(2.5)}
                                        color={MyColors(1).green}
                                        style={{
                                            backgroundColor: MyColors(1).black,
                                        }}
                                    />
                                </Animated.View>
                                <Text
                                    style={{
                                        color: MyColors(1).green,
                                        fontWeight: "bold",
                                        fontSize: HP(2),
                                    }}
                                >
                                    {selectedMainPlan
                                        ? selectedMainPlan.title.replace(
                                              ": Week 1",
                                              ""
                                          )
                                        : "My Plans"}
                                </Text>
                            </Pressable>
                        </View>

                        <Animated.ScrollView
                            style={{
                                width: WP(100),
                                height: HP(68),
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
                                                {item.title.replace(
                                                    ": Week 1",
                                                    ""
                                                )}
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
                                            <RenderItem1
                                                plan={selectedMainPlan}
                                            />
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
                                                {
                                                    selectedMainPlan?.planDescription
                                                }
                                            </Text>

                                            <Text
                                                style={{
                                                    color: MyColors(1).green,
                                                    fontWeight: "bold",
                                                    fontSize: HP(1.5),
                                                }}
                                            >
                                                By doing this todayExercise plan
                                                you are expected to:
                                            </Text>

                                            <View style={{ gap: WP(1) }}>
                                                {selectedMainPlan?.generalObjectives?.map(
                                                    (o, index) => (
                                                        <Text
                                                            key={index + o}
                                                            style={{
                                                                color: MyColors(
                                                                    0.8
                                                                ).white,
                                                                fontSize:
                                                                    HP(1.5),
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
                                                backgroundColor:
                                                    MyColors(1).gray,
                                                height: 1,
                                            }}
                                        />

                                        <View style={{ padding: HP(2) }}>
                                            <View style={{ gap: HP(1) }}>
                                                <Text
                                                    style={{
                                                        color: MyColors(1)
                                                            .green,
                                                        fontWeight: "bold",
                                                        fontSize: HP(2.5),
                                                    }}
                                                >
                                                    Week {weekCount + 1}
                                                </Text>

                                                <Text
                                                    style={{
                                                        color: MyColors(0.8)
                                                            .white,
                                                        fontSize: HP(1.5),
                                                    }}
                                                >
                                                    {
                                                        selectedMainPlan
                                                            ?.weeks?.[0]
                                                            .weekDescription
                                                    }
                                                </Text>

                                                <Text
                                                    style={{
                                                        color: MyColors(1)
                                                            .green,
                                                        fontWeight: "bold",
                                                        fontSize: HP(1.5),
                                                    }}
                                                >
                                                    The objectives for this week
                                                    are:
                                                </Text>

                                                <View style={{ gap: WP(1) }}>
                                                    {selectedMainPlan?.weeks?.[0]?.weekObjectives?.map(
                                                        (o, index) => (
                                                            <Text
                                                                key={o + index}
                                                                style={{
                                                                    color: MyColors(
                                                                        0.8
                                                                    ).white,
                                                                    fontSize:
                                                                        HP(1.5),
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
                                                backgroundColor:
                                                    MyColors(1).gray,
                                                height: 1,
                                            }}
                                        />
                                    </ScrollView>
                                </View>
                            )}
                        </Animated.ScrollView>

                        <Animated.View
                            style={{
                                transform: [{ translateY: moveVertical }],
                            }}
                        >
                            {todayExercise &&
                            completedExerciseToday?.length !==
                                todayExercise?.length ? (
                                <>
                                    <View
                                        style={{
                                            paddingHorizontal: WP(5),
                                            backgroundColor: MyColors(1).black,
                                            borderTopWidth: 1,
                                            borderColor: MyColors(1).gray,
                                            width: WP(100),
                                        }}
                                    >
                                        <View
                                            style={{
                                                width: WP(90),
                                                justifyContent: "center",
                                                alignItems: "flex-start",
                                                paddingVertical: HP(2),
                                            }}
                                        >
                                            <Text
                                                style={[
                                                    {
                                                        fontSize: HP(3),
                                                        fontWeight: "bold",
                                                        color: MyColors(0.8)
                                                            .green,
                                                    },
                                                ]}
                                            >
                                                Today's todayExercise
                                            </Text>
                                        </View>

                                        {todayExercise?.completed === false && (
                                            <Text
                                                style={{
                                                    color: MyColors(1).white,
                                                    width: "100%",
                                                }}
                                            >
                                                You have {todayExercise?.length}{" "}
                                                exercises today, and{" "}
                                                {completedExerciseToday?.length ||
                                                    "none"}{" "}
                                                of them are completed.
                                            </Text>
                                        )}
                                        <View style={{ gap: HP(1) }}>
                                            <Text
                                                style={{
                                                    color: MyColors(1).white,
                                                }}
                                            >
                                                Today's Progress:{" "}
                                                <Text
                                                    style={{
                                                        color: MyColors(1)
                                                            .green,
                                                        fontWeight: "bold",
                                                    }}
                                                >
                                                    {progress.toFixed(2)}%
                                                </Text>
                                            </Text>
                                            <ProgressBar
                                                borderWidth={WP(0.7)}
                                                borderRadius={WP(4)}
                                                width={WP(90)}
                                                color={MyColors(1).green}
                                                progress={progress / 100 || 0}
                                                height={HP(0.5)}
                                                borderColor={MyColors(1).gray}
                                                unfilledColor={
                                                    MyColors(0.4).green
                                                }
                                            />
                                        </View>
                                    </View>

                                    <ScrollView
                                        showsHorizontalScrollIndicator={false}
                                        style={{
                                            paddingVertical: HP(3),
                                            borderColor: MyColors(1).gray,
                                            backgroundColor: MyColors(1).black,
                                        }}
                                        horizontal
                                        snapToInterval={WP(100)}
                                        ref={scrollViewRef2}
                                        onScroll={itemScrolls}
                                    >
                                        {todayExercise?.map(
                                            (todayExercise, exerciseIndex) => (
                                                <View
                                                    key={`todayExercise-${exerciseIndex}`}
                                                    style={
                                                        RStyles()
                                                            .exerciseContainer
                                                    }
                                                >
                                                    {recommendedItems({
                                                        item: todayExercise,
                                                        index: exerciseIndex,
                                                    })}
                                                </View>
                                            )
                                        )}
                                    </ScrollView>
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            gap: WP(5),
                                            justifyContent: "center",
                                            top: -20,
                                        }}
                                    >
                                        {todayExercise?.map((v, i) => (
                                            <View
                                                key={i}
                                                style={{
                                                    width: WP(1.5),
                                                    borderRadius: WP(2),
                                                    aspectRatio: 1,
                                                    backgroundColor:
                                                        i === activeIndex
                                                            ? MyColors(0.4)
                                                                  .white
                                                            : MyColors(0.2)
                                                                  .white,
                                                }}
                                            ></View>
                                        ))}
                                    </View>
                                </>
                            ) : (
                                <LinearGradient
                                    colors={["transparent", MyColors(1).black]}
                                    start={[1, 0]}
                                    end={[1, 1]}
                                    locations={[0, 0.3]}
                                >
                                    <View
                                        style={{
                                            paddingHorizontal: WP(5),
                                            height: HP(20),
                                            alignItems: "center",
                                            justifyContent: "center",
                                            backgroundColor: MyColors(1).black,
                                            borderTopWidth: 1,
                                            borderColor: MyColors(1).gray,
                                            width: WP(100),
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: MyColors(1).green,
                                                fontSize: HP(3),
                                                fontWeight: "bold",
                                            }}
                                        >
                                            CONGRATULATIONS!
                                        </Text>
                                        <Text
                                            style={{
                                                color: MyColors(1).white,
                                                fontSize: HP(1.4),
                                                textAlign: "center",
                                            }}
                                        >
                                            You completed all exercises today we
                                            have something for you tomorrow!
                                        </Text>
                                    </View>
                                </LinearGradient>
                            )}

                            <View
                                style={{
                                    width: "100%",
                                    height: 1,
                                    backgroundColor: MyColors(1).gray,
                                }}
                            />
                            {otherExercise && (
                                <View
                                    style={{
                                        width: WP(100),
                                        gap: WP(2),
                                        height: HP(30),
                                        backgroundColor: MyColors(1).black,
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: MyColors(1).white,
                                            fontWeight: "bold",
                                            marginLeft: WP(5),
                                            paddingTop: WP(2),
                                        }}
                                    >
                                        Other todayExercise Plans
                                    </Text>
                                    <View
                                        style={{
                                            width: "100%",
                                            height: 1,
                                            backgroundColor: MyColors(1).gray,
                                        }}
                                    />
                                    <FlatList
                                        numColumns={2}
                                        data={otherExercise}
                                        nestedScrollEnabled={true}
                                        keyExtractor={(item, index) =>
                                            item + index
                                        }
                                        contentContainerStyle={{
                                            width: WP(100),
                                            gap: WP(2),
                                            paddingHorizontal: WP(2),
                                        }}
                                        style={{
                                            width: WP(100),
                                        }}
                                        renderItem={({ item, index }) => (
                                            <RenderItem
                                                onPress={handlePlanPress}
                                                item={item}
                                                index={index}
                                            />
                                        )}
                                    />
                                </View>
                            )}
                        </Animated.View>
                    </View>
                ) : (
                    <View
                        style={{
                            backgroundColor: MyColors(1).black,
                            height: HP(20),
                            alignItems: "center",
                            justifyContent: "center",
                            marginTop: HP(25),
                        }}
                    >
                        <View
                            style={{
                                alignItems: "center",
                                justifyContent: "center",
                                height: HP(40),
                                gap: HP(5),
                            }}
                        >
                            <View
                                style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <Text style={{ color: MyColors(1).white }}>
                                    Generating Exercises for you
                                </Text>
                                <Text style={{ color: MyColors(1).white }}>
                                    please wait
                                </Text>
                            </View>
                            <View
                                style={{
                                    width: WP(20),
                                    height: WP(10),
                                    justifyContent: "center",
                                }}
                            >
                                <LottieView
                                    source={require("@/assets/json/typing.json")}
                                    loop
                                    autoPlay
                                    style={{ height: HP(4) }}
                                />
                            </View>
                        </View>
                    </View>
                )}
                {user?.exercisePlans && user?.exercisePlans?.length > 0 && (
                    <>
                        <SafeAreaView
                            style={{
                                position: "absolute",
                                bottom: 0,
                                flexDirection: "row",
                                width: WP(100),
                                backgroundColor: MyColors(1).black,
                                height: HP(8),
                                borderTopWidth: 1,
                                borderColor: MyColors(1).gray,
                                alignItems: "center",
                                justifyContent: "space-between",
                                paddingHorizontal: WP(3),
                            }}
                        >
                            <TextInput
                                style={{
                                    color: MyColors(1).white,
                                    paddingHorizontal: WP(3),
                                    backgroundColor: MyColors(1).gray,
                                    borderRadius: WP(4),
                                    width: WP(75),
                                    height: HP(5),
                                }}
                                placeholder="Enter your todayExercise plan"
                                placeholderTextColor={MyColors(0.5).white}
                                onChangeText={(value) => setUserInput(value)}
                                value={userInput}
                            />
                            <TouchableOpacity
                                disabled={!userInput || generating}
                                onPress={() => runGenerator()}
                            >
                                {!generating ? (
                                    <Text
                                        Text
                                        style={{
                                            color: userInput
                                                ? MyColors(1).green
                                                : MyColors(0.5).white,
                                        }}
                                    >
                                        GENERATE
                                    </Text>
                                ) : (
                                    <View
                                        style={{
                                            width: WP(20),
                                            height: WP(10),
                                            justifyContent: "center",
                                        }}
                                    >
                                        <LottieView
                                            source={require("@/assets/json/typing.json")}
                                            loop
                                            autoPlay
                                            style={{ height: HP(4) }}
                                        />
                                    </View>
                                )}
                            </TouchableOpacity>
                        </SafeAreaView>
                    </>
                )}

                {todayExercise?.length > 0 && (
                    <Robot
                        setText={setErrorGenerating}
                        open={openMenu}
                        text={errorGenerating}
                    />
                )}

                <Menu
                    ref={menuRef}
                    style={{
                        position: "absolute",
                        bottom: HP(24),
                        right: WP(20),
                    }}
                >
                    <MenuTrigger
                        triggerOnLongPress
                        onPress={openMenu}
                    ></MenuTrigger>
                    <MenuOptions>
                        <MenuOption
                            style={{
                                padding: WP(4),
                                backgroundColor: MyColors(1).gray,
                            }}
                            onSelect={() => navigation.navigate("Chats")}
                        >
                            <Text style={{ color: MyColors(1).white }}>
                                Chat with AI?
                            </Text>
                        </MenuOption>
                    </MenuOptions>
                </Menu>
            </SafeAreaView>

            {selectedPlan && (
                <SafeAreaView
                    style={{
                        backgroundColor: MyColors(1).black,
                        width: WP(100),
                    }}
                >
                    <CustomHeaderB navigation={handleBackPress} />
                    <OtherExercise item={selectedPlan} back={handleBackPress} />
                </SafeAreaView>
            )}
        </ScrollView>
    );
};

export default Exercises;

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

const styles = StyleSheet.create({
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
