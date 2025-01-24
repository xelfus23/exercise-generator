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
    Modal,
    Animated,
    TextInput,
    Pressable,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/components/auth/authProvider";
import { MyColors } from "@/constants/myColors.jsx";
import CustomHeader from "@/components/customs/CustomHeader";
import Exercise from "./modal.jsx";
import { Feather } from "@expo/vector-icons";
import ProgressBar from "react-native-progress/Bar.js";
import { useNavigation } from "expo-router";
import Loading from "@/components/customs/loading.jsx";
import { getAuth } from "firebase/auth";
import { AntDesign } from "@expo/vector-icons";
import userData from "@/components/auth/userData.jsx";
import Entypo from "@expo/vector-icons/Entypo";
import OtherExercise from "./otherExercise/otherExercise.jsx";
import CustomHeaderB from "../settings/customDrawerLabel.jsx";
import { LinearGradient } from "expo-linear-gradient";
import { tunedParts } from "./AI/parts.jsx";
import RenderItem from "./otherExercise/otherExerciseBlock.jsx";
import Robot from "./AI/robot.jsx";
import {
    Menu,
    MenuOption,
    MenuOptions,
    MenuTrigger,
} from "react-native-popup-menu";
import LottieView from "lottie-react-native";
import ExerciseDescriptions from "./descriptions/exercisedescription.jsx";
import RecommendedItems from "./recommendedItems.jsx";
import Zstyles from "./styles.jsx";
import PlanGenerator from "./AI/planGenerator.jsx";

const RStyles = Zstyles.RStyles;
const levelStyles = Zstyles.levelStyles;

const Exercises = ({ route }) => {
    const { setTabBarVisible } = route.params ? route.params : false;

    const {
        user,
        updateUserData,
        todayExercise,
        otherExercise,
        exercisePlans,
        progress,
        completedExerciseToday,
        isAuthenticated,
    } = useAuth();

    if (!isAuthenticated) return null;

    const data = userData();
    const { Generate } = PlanGenerator();
    const [selectedItem, setSelectedItem] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const navigation = useNavigation();
    const currentUser = getAuth().currentUser;
    const [errorGenerating, setErrorGenerating] = useState(null);
    const [userInput, setUserInput] = useState(null);
    const [generating, setGenerating] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [generatingText, setGeneratingText] = useState(null);
    const [selectedMainPlan, setSelectedMainPlan] = useState(null);
    const [busy, setBusy] = useState(false);
    const menuRef = useRef(null);
    const scrollViewRef2 = useRef(null);
    const [descShown, setDescShown] = useState(false);
    const moveHorizontal = useRef(new Animated.Value(-WP(100))).current;
    const moveVertical = useRef(new Animated.Value(0)).current; // Starting position
    const btnRotate = useRef(new Animated.Value(0)).current;
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollViewRef123 = useRef(null);
    const scrollViewRef = useRef(null);
    const [isError, setIsError] = useState(false);

    const runGenerator = async () => {
        console.log("Running Generator");
        const currentInput = userInput;
        setUserInput(null);
        setGenerating(true);
        setErrorGenerating("Generating...");
        setIsError(false);

        try {
            console.log("generate 1");
            const result = await Generate({
                input: currentInput,
                setError: setErrorGenerating,
                setGenerating: setGenerating,
                setIsError: setIsError,
            });
            if (result.success) {
            } else {
                return runGenerator();
            }
        } catch (error) {
            console.warn("Error Stage 1:", error);
        } finally {
            await updateUserData(currentUser.uid);
            setGenerating(false);
        }
    };

    useEffect(() => {
        setTabBarVisible && setTabBarVisible(true);
    }, []);

    useEffect(() => {
        if (exercisePlans.length === 0 && todayExercise.length === 0) {
            runGenerator();
        }
    }, [exercisePlans]);

    useEffect(() => {
        if (selectedItem) {
            setShowModal(true);
        }
    }, [selectedItem]);

    const closeModal = () => {
        setShowModal(false);
        setSelectedItem(null);
    };

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

    const itemScrolls = (event) => {
        const scrollX = event.nativeEvent.contentOffset.x;
        const currentIndex = Math.round(scrollX / WP(100));
        setActiveIndex(currentIndex);
    };

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

    // Function to sort exercises: Incomplete first
      const sortExercises = (exercises) => {
        if (!exercises) return [];
        return [...exercises].sort((a, b) => {
            // Sort by completed status
            if (a.exercise.completed && !b.exercise.completed) {
                return 1; // b (not completed) comes first
            }
            if (!a.exercise.completed && b.exercise.completed) {
                return -1; // a (not completed) comes first
            }
            return 0; // Keep the original order if both have the same completed status
        });
    };

    const sortedTodayExercise = sortExercises(todayExercise);

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

                        <ExerciseDescriptions
                            moveHorizontal={moveHorizontal}
                            exercisePlans={exercisePlans}
                            selectedMainPlan={selectedMainPlan}
                            busy={busy}
                            setBusy={setBusy}
                            hideDesc={hideDesc}
                            showDesc={showDesc}
                            scrollViewRef123={scrollViewRef123}
                            setSelectedItem={setSelectedItem}
                        />
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
                                                My Exercise Today
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
                                        {sortedTodayExercise?.map(
                                            (todayExercise, exerciseIndex) => (
                                                <View
                                                    key={`todayExercise-${exerciseIndex}`}
                                                    style={
                                                        RStyles()
                                                            .exerciseContainer
                                                    }
                                                >
                                                    {RecommendedItems({
                                                        item: todayExercise,
                                                        index: exerciseIndex,
                                                        setSelectedItem:
                                                            setSelectedItem,
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
                                        {sortedTodayExercise?.map((v, i) => (
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
                                {!isError ? (
                                    <LottieView
                                        source={require("@/assets/json/typing.json")}
                                        loop
                                        autoPlay
                                        style={{ height: HP(4) }}
                                    />
                                ) : (
                                    <TouchableOpacity
                                        style={{
                                            backgroundColor: MyColors(1).gray,
                                            paddingHorizontal: WP(2),
                                            borderRadius: WP(4),
                                            paddingVertical: HP(1),
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontWeight: "bold",
                                                color: MyColors(0.9).white,
                                                textAlign: "center",
                                            }}
                                        >
                                            Retry
                                        </Text>
                                    </TouchableOpacity>
                                )}
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