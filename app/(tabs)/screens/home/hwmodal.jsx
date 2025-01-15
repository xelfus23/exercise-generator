import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Modal,
    Alert,
    StyleSheet,
    Image,
    Dimensions,
    SafeAreaView,
    StatusBar,
    FlatList,
    Animated,
    Pressable,
    TextInput,
} from "react-native";
import { useMemo } from "react";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { db } from "@/components/firebase/config";
import { setDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import {
    heightPercentageToDP as HP,
    widthPercentageToDP as WP,
} from "react-native-responsive-screen";
import { MyColors } from "@/constants/myColors";
import Loading from "../../../../components/customs/loading";
import { useAuth } from "@/components/auth/authProvider";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { LinearGradient } from "expo-linear-gradient";
import { LoginRegisterStyle } from "../../auth/authStyles";
import ExerciseHandler from "../exercises/exercisehandler";
import Slider from "@react-native-community/slider";
import { useSharedValue } from "react-native-reanimated";
import { AntDesign } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { throttle } from "lodash";

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------

export default function HWmodal() {
    const { updateUserData, user } = useAuth();
    const today = new Date();

    const [selectedGender, setSelectedGender] = useState(null);

    const [birthYear, setBirthYear] = useState(today.getFullYear());
    const [birthMonth, setBirthMonth] = useState(today.getMonth());
    const [birthDay, setBirthDay] = useState(today.getDate());

    const [selectedGoal, setSelectedGoal] = useState([]);

    const [selectedHeightAndWeight, setSelectedHeightAndWeight] =
        useState(null);
    const [selectedActivityLevel, setSelectedActivityLevel] =
        useState("Sedentary");
    const [selectedFitnessLevel, setSelectedFitnessLevel] =
        useState("Beginner");
    const [selectedPlaces, setSelectedPlaces] = useState(null);

    const [selectedBodyMeasurements, setSelectedBodyMeasurements] = useState({
        waist: 0,
        neck: 0,
        hip: 0,
        unit: null,
    });
    const [isSubmit, setIsSubmit] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [isBirthYear, setIsBirthYear] = useState(false);

    useEffect(() => {
        if (birthDay && birthMonth && birthYear) {
            setIsBirthYear(true);
        }
    }, [birthDay, birthMonth, birthYear]);

    useEffect(() => {
        const submitData = async () => {
            setIsLoading(true);
            await HandleSubmit();
            setIsLoading(false);
            setIsSubmit(false);
        };

        if (isSubmit) {
            submitData();
        }
    }, [isSubmit]);

    const HandleSubmit = async () => {
        if (
            selectedGender &&
            isBirthYear &&
            selectedGoal.length > 0 &&
            selectedHeightAndWeight &&
            selectedActivityLevel &&
            selectedFitnessLevel &&
            selectedPlaces.length > 0
        ) {
            const auth = getAuth();
            const user = auth.currentUser;

            try {
                await setDoc(
                    doc(db, "users", user.uid),
                    {
                        gender: selectedGender,
                        birthDate: {
                            year: birthYear,
                            month: birthMonth,
                            day: birthDay,
                        },
                        mainGoal: selectedGoal,
                        heightAndWeight: selectedHeightAndWeight,
                        activityLevel: selectedActivityLevel,
                        fitnessLevel: selectedFitnessLevel,
                        selectedPlace: selectedPlaces,
                        bodyMeasurements: selectedBodyMeasurements,
                    },
                    { merge: true }
                );
                await updateUserData(user.uid);
            } catch (error) {
                console.error("Error updating document: ", error);
                Alert.alert("Error updating profile", error.message);
            }
        } else {
            Alert.alert("Please fill all required fields");
        }
    };

    const [index, setIndex] = useState(0);
    const [progress, setProgress] = useState(new Animated.Value(0));

    const nextButton = (value) => {
        setIndex((prev) => prev + value);
    };

    useEffect(() => {
        setTimeout(() => {
            Animated.timing(progress, {
                toValue: index,
                duration: 100,
                useNativeDriver: false, // Set to false for width animations
            }).start();
        }, 200);
    }, [index]); // Only include index as the dependency

    const screens = [
        <Gender
            setSelectedGender={setSelectedGender}
            selectedGender={selectedGender}
            next={nextButton}
        />,
        <BirthDate
            setBirthDay={setBirthDay}
            setBirthMonth={setBirthMonth}
            setBirthYear={setBirthYear}
            selectedBirthDay={birthDay}
            selectedBirthMonth={birthMonth}
            selectedBirthYear={birthYear}
            next={nextButton}
        />,
        <HeightAndWeight
            setSelectedHeightAndWeight={setSelectedHeightAndWeight}
            selectedHeightAndWeight={selectedHeightAndWeight}
            next={nextButton}
        />,
        <BodyFatPercentageScreen
            selectedBodyMeasurements={selectedBodyMeasurements}
            setSelectedBodyMeasurements={setSelectedBodyMeasurements}
            selectedGender={selectedGender}
            selectedHeightAndWeight={selectedHeightAndWeight}
            next={nextButton}
        />,
        <MainGoal
            setSelectedGoal={setSelectedGoal}
            selectedGoal={selectedGoal}
            next={nextButton}
        />,
        <PreferablePlaces
            setSelectedPlaces={setSelectedPlaces}
            next={nextButton}
        />,
        <ActivityLevel
            setSelectedActivityLevel={setSelectedActivityLevel}
            selectedActivityLevel={selectedActivityLevel}
            next={nextButton}
        />,
        <SelectFitnessLevel
            setSelectedFitnessLevel={setSelectedFitnessLevel}
            submit={setIsSubmit}
            isLoading={isLoading}
            next={nextButton}
        />,
        <SubmitScreen
            selectedGender={selectedGender}
            selectedHeightAndWeight={selectedHeightAndWeight}
            selectedBirthDay={birthDay}
            selectedBirthMonth={birthMonth}
            selectedBirthYear={birthYear}
            selectedGoal={selectedGoal}
            selectedPlaces={selectedPlaces}
            selectedActivityLevel={selectedActivityLevel}
            selectedFitnessLevel={selectedFitnessLevel}
            selectedBodyMeasurements={selectedBodyMeasurements}
            submit={setIsSubmit}
            isLoading={isLoading}
            next={nextButton}
        />,
    ];

    const ProgressBarT = () => {
        // Interpolate progress value to width
        const width = progress.interpolate({
            inputRange: [0, screens.length - 1],
            outputRange: ["0%", "100%"],
        });

        return (
            <View
                style={{
                    height: HP(0.2),
                    backgroundColor: MyColors(1).white,
                    borderRadius: WP(4),
                    marginTop: HP(5),
                    width: WP(80),
                    justifyContent: "center",
                }}
            >
                <Animated.View
                    style={{
                        height: HP(0.2),
                        backgroundColor: MyColors(1).green,
                        borderRadius: WP(10),
                        width: width, // Apply interpolated width
                        alignItems: "flex-end",
                        justifyContent: "center",
                    }}
                ></Animated.View>
                <View
                    style={{
                        position: "absolute",
                        width: WP(80),
                        justifyContent: "space-between",
                        flexDirection: "row",
                    }}
                >
                    {screens.map((item, i) => (
                        <View
                            key={i}
                            style={{
                                backgroundColor:
                                    index >= i
                                        ? MyColors(1).green
                                        : MyColors(1).white,
                                width: HP(1),
                                aspectRatio: 1,
                                borderRadius: WP(4),
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <View
                                style={{
                                    backgroundColor: MyColors(1).white,
                                    width: HP(0.6),
                                    aspectRatio: 1,
                                    borderRadius: WP(4),
                                }}
                            ></View>
                        </View>
                    ))}
                </View>
            </View>
        );
    };

    return (
        <Modal>
            <StatusBar
                backgroundColor={MyColors(1).black}
                barStyle={"light-content"}
            />

            <ScrollView style={{ flex: 1, backgroundColor: MyColors(1).black }}>
                <View
                    style={{
                        paddingVertical: WP(2),
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <ProgressBarT />
                </View>
                {screens?.[index]}
            </ScrollView>
        </Modal>
    );
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const Gender = ({ selectedGender, setSelectedGender, next }) => {
    const [error, setError] = useState(null);

    const handlePress = (gender) => {
        setSelectedGender(gender);
    };

    const nextButton = () => {
        if (!selectedGender) {
            setError("Please select your gender.");
            setTimeout(() => {
                setError(null);
            }, 2000);
            return;
        }
        next(1);
    };

    const backButton = () => {
        next(-1);
    };

    return (
        <View style={styles.container}>
            <View style={{ paddingHorizontal: WP(5) }}>
                <View style={{ marginBottom: HP(3) }}>
                    <Text style={styles.Title}>
                        • Please select your gender
                    </Text>
                </View>
                <View style={styles.pickerContainer}>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-around",
                            marginTop: HP(5),
                        }}
                    >
                        <View
                            style={{
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => handlePress("Male")}
                                style={genderStyles.button}
                            >
                                <FontAwesome
                                    name="male"
                                    size={100}
                                    color={
                                        selectedGender === "Male"
                                            ? MyColors(1).green
                                            : MyColors(0.2).green
                                    }
                                />
                            </TouchableOpacity>
                            <Text style={genderStyles.label}>Male</Text>
                        </View>

                        <View
                            style={{
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => handlePress("Female")}
                                style={genderStyles.button}
                            >
                                <FontAwesome
                                    name="female"
                                    size={100}
                                    color={
                                        selectedGender === "Female"
                                            ? MyColors(1).purple
                                            : MyColors(0.2).purple
                                    }
                                />
                            </TouchableOpacity>
                            <Text style={genderStyles.label}>Female</Text>
                        </View>
                    </View>

                    <View
                        style={{
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => handlePress("Other")}
                            style={{
                                marginTop: HP(5),
                                paddingHorizontal: 20,
                                borderRadius: 20,
                                height: "auto",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Text
                                style={{
                                    color:
                                        selectedGender === "Other"
                                            ? MyColors(1).white
                                            : MyColors(0.4).white,
                                    fontSize: 16,
                                }}
                            >
                                Others / I'd rather not say
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <Text style={[LoginRegisterStyle.error, { marginBottom: HP(3) }]}>
                {error}
            </Text>
            <NextButtons
                handleSubmit={nextButton}
                error={error}
                back={backButton}
                firstIndex={true}
            />
        </View>
    );
};

const genderStyles = StyleSheet.create({
    label: {
        fontSize: 24,
        color: MyColors(1).white,
        paddingHorizontal: 10,
        borderRadius: 10,
    },
    button: {
        width: 100,
        height: 100,
        alignItems: "center",
        justifyContent: "center",
    },
});

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const BirthDate = ({
    setBirthDay,
    setBirthMonth,
    setBirthYear,
    selectedBirthDay,
    selectedBirthMonth,
    selectedBirthYear,
    next,
}) => {
    const getDaysInMonth = (month, year) =>
        new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (month, year) =>
        new Date(year, month, 1).getDay();
    const getMonthName = (month) => {
        const monthNames = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];
        return monthNames[month];
    };

    const today = new Date();
    const [isYearPickerVisible, setYearPickerVisible] = useState(false);

    const nextButton = () => {
        next(1);
    };

    const todayYear = today.getFullYear();

    const handlePreviousMonth = () => {
        if (selectedBirthMonth === 0) {
            setBirthMonth(11);
            setBirthYear(selectedBirthYear - 1);
        } else {
            setBirthMonth(selectedBirthMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (selectedBirthMonth === 11) {
            setBirthMonth(0);
            setBirthYear(selectedBirthYear + 1);
        } else {
            setBirthMonth(selectedBirthMonth + 1);
        }
    };

    const daysInMonth = getDaysInMonth(selectedBirthMonth, selectedBirthYear);
    const firstDayOfMonth = getFirstDayOfMonth(
        selectedBirthMonth,
        selectedBirthYear
    );

    const daysArray = Array.from(
        { length: firstDayOfMonth },
        () => null
    ).concat(Array.from({ length: daysInMonth }, (_, index) => index + 1));

    // Show a year picker when the year is tapped
    const showYearPicker = () => {
        setYearPickerVisible(true);
    };

    const selectYear = (year) => {
        setBirthYear(year);
        setYearPickerVisible(false);
    };

    const generateYears = (start, end) => {
        let years = [];
        for (let i = start; i <= end; i++) {
            years.push(i);
        }
        return years;
    };

    const backButton = () => {
        next(-1);
    };

    return (
        <View style={styles.container}>
            <View
                style={{
                    padding: HP(2),
                    width: "90%",
                    gap: HP(1),
                    borderWidth: 1,
                    borderColor: MyColors(1).gray,
                    borderRadius: WP(4),
                }}
            >
                <Text style={styles.Title}>• Select your date of birth:</Text>

                <View
                    style={{
                        padding: 10,
                        backgroundColor: MyColors(1).black,
                        borderRadius: 10,
                        alignSelf: "center",
                    }}
                >
                    {/* Month and Year Header */}
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            paddingBottom: 5,
                            marginBottom: HP(1),
                            borderBottomWidth: 1,
                            borderColor: MyColors(1).gray,
                            borderRadius: WP(4),
                        }}
                    >
                        <TouchableOpacity
                            onPress={handlePreviousMonth}
                            style={{
                                padding: 5,
                            }}
                        >
                            <AntDesign
                                name="caretleft"
                                size={HP(3)}
                                color={MyColors(1).green}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={showYearPicker}>
                            <Text
                                style={{
                                    fontSize: 20,
                                    fontWeight: "bold",
                                    color: MyColors(0.8).green,
                                }}
                            >{`${getMonthName(
                                selectedBirthMonth
                            )} ${selectedBirthYear}`}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleNextMonth}
                            style={{
                                padding: 5,
                            }}
                        >
                            <AntDesign
                                name="caretright"
                                size={HP(3)}
                                color={MyColors(1).green}
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Days of the Week */}
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-around",
                        }}
                    >
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                            (day) => (
                                <Text
                                    key={day}
                                    style={{
                                        width: "14.28%",
                                        textAlign: "center",
                                        fontWeight: "bold",
                                        color: MyColors(0.8).white,
                                    }}
                                >
                                    {day}
                                </Text>
                            )
                        )}
                    </View>

                    {/* Days Grid */}
                    <View
                        style={{
                            flexDirection: "row",
                            flexWrap: "wrap",
                        }}
                    >
                        {daysArray.map((day, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    {
                                        width: "14.28%",
                                        aspectRatio: 1, // Make each day a square
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginVertical: HP(0.5),
                                    },
                                    selectedBirthDay === day
                                        ? {
                                            backgroundColor:
                                                MyColors(0.8).green,
                                            borderRadius: WP(2),
                                        }
                                        : null,
                                ]}
                                onPress={() => day && setBirthDay(day)}
                                disabled={!day}
                            >
                                <Text
                                    style={[
                                        {
                                            fontSize: 16,
                                            color: MyColors(1).white,
                                        },
                                        !day
                                            ? {
                                                color: "transparent",
                                            }
                                            : null,
                                    ]}
                                >
                                    {day || ""}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </View>
            <Text style={styles.error}></Text>

            {/* Year Picker Modal */}
            <Modal visible={isYearPickerVisible} transparent>
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: MyColors(0.8).black,
                    }}
                >
                    <View
                        style={{
                            backgroundColor: MyColors(1).black,
                            borderWidth: 1,
                            borderColor: MyColors(1).gray,
                            padding: HP(2),
                            height: HP(40),
                            borderRadius: WP(4),
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: HP(2),
                        }}
                    >
                        <ScrollView
                            style={{
                                width: WP(80),
                                borderWidth: 1,
                                borderRadius: WP(2),
                                borderColor: MyColors(1).gray,
                            }}
                            contentContainerStyle={{
                                justifyContent: "center",
                                alignItems: "center",
                                flexWrap: "wrap",
                                flexDirection: "row",
                            }}
                        >
                            {generateYears(todayYear - 71, todayYear)
                                .reverse()
                                .map((year) => (
                                    <TouchableOpacity
                                        key={year}
                                        onPress={() => selectYear(year)}
                                        style={{
                                            width: WP(20),
                                            justifyContent: "center",
                                            alignItems: "center",
                                            paddingVertical: HP(1),
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color:
                                                    selectedBirthYear === year
                                                        ? MyColors(1).green
                                                        : MyColors(1).white,
                                                fontSize: HP(2),
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {year}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                        </ScrollView>
                        <TouchableOpacity
                            onPress={() => setYearPickerVisible(false)}
                            style={{
                                backgroundColor: MyColors(1).black,
                                borderColor: MyColors(1).gray,
                                borderWidth: 1,
                                padding: HP(1),
                                paddingHorizontal: HP(3),
                                borderRadius: WP(4),
                            }}
                        >
                            <Text
                                style={{
                                    color: MyColors(1).green,
                                    fontWeight: "bold",
                                    fontSize: HP(2),
                                }}
                            >
                                Close
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <NextButtons handleSubmit={nextButton} back={backButton} />
        </View>
    );
};

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const MainGoal = ({ setSelectedGoal, selectedGoal, next }) => {
    const [error, setError] = useState(null);

    const nextButton = () => {
        if (selectedGoal.length === 0) {
            setError("Please select your goal.");
            setTimeout(() => {
                setError(null);
            }, 2000);
            return;
        }
        next(1); // Pass the incremented index to the next function
    };

    const mainGoals = [
        "Weight management",
        "Muscle building",
        "Cardiovascular health",
        "Flexibility",
        "Balance and coordination",
        "Injury prevention",
        "Stress reduction",
        "Mood improvement",
        "Better sleep",
        "Increased energy",
        "Confidence and self-esteem",
        "Improved health",
        "Increased lifespan",
        "Better quality of life",
        "Athletic performance",
        "Body composition",
        "Core strength development",
        "Joint mobility improvement",
        "Bone density enhancement",
        "Posture correction",
        "Metabolic health optimization",
        "Chronic pain relief",
        "Functional strength training",
        "Heart rate control",
        "Immune system support",
        "Reduction in sedentary lifestyle",
    ];

    const onPress = (item) => {
        let chosenItems = [...selectedGoal];

        if (selectedGoal.includes(item)) {
            chosenItems = chosenItems.filter((goal) => goal !== item);
        } else {
            chosenItems.push(item);
        }
        setSelectedGoal(chosenItems);
    };

    const backButton = () => {
        next(-1);
    };

    return (
        <SafeAreaView style={MainGoalStyles.container}>
            <View
                style={{
                    width: WP(90),
                    paddingTop: HP(2),
                    marginBottom: HP(2),
                }}
            >
                <Text style={[styles.Title]}>• What are your main goals?</Text>
                <Text
                    style={{ color: MyColors(0.8).white, marginLeft: HP(1.2) }}
                >
                    Choose one or more:
                </Text>
            </View>
            <View style={MainGoalStyles.pickerContainer}>
                <View
                    style={{
                        gap: WP(2),
                        height: HP(60),
                    }}
                >
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            flexDirection: "row",
                            flexWrap: "wrap",
                            gap: HP(1),
                            justifyContent: "center",
                            paddingVertical: HP(2),
                        }}
                    >
                        {mainGoals.map((item, index) => (
                            <TouchableOpacity
                                key={item}
                                onPress={() => onPress(item)}
                                style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                    padding: WP(2),
                                    backgroundColor: !selectedGoal.includes(
                                        item
                                    )
                                        ? MyColors(1).gray
                                        : MyColors(0.4).gray,
                                    borderRadius: WP(3),
                                    width: WP(40), // Adjust to fit two columns
                                    height: HP(5),
                                }}
                            >
                                <Text
                                    style={{
                                        borderColor: MyColors(1).gray,
                                        textAlign: "center",
                                        color: !selectedGoal.includes(item)
                                            ? MyColors(1).white
                                            : MyColors(1).green,
                                        fontSize: HP(1),
                                    }}
                                >
                                    {item}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </View>
            <Text style={[LoginRegisterStyle.error, { marginBottom: HP(2) }]}>
                {error}
            </Text>
            <NextButtons
                handleSubmit={nextButton}
                back={backButton}
                error={error}
            />
        </SafeAreaView>
    );
};

const MainGoalStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: MyColors(1).black,
        alignItems: "center",
        marginTop: HP(2),
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: MyColors(1).gray,
        borderRadius: WP(4),
        width: WP(90),
    },
    button: {
        width: "auto",
        padding: 10,
        backgroundColor: MyColors(1).gray,
        width: WP(80),
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
    },
    label: {
        fontSize: WP(4),
        color: MyColors(1).white,
    },
});

const RenderItemHeight = React.memo(
    ({ value, index, selectedItem, itemWidth }) => {
        return (
            <View
                style={{
                    alignItems: "center",
                    width: itemWidth,
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-around",
                        width: "100%",
                    }}
                >
                    <Text
                        style={{
                            fontSize:
                                index % 10 === 0
                                    ? HP(2)
                                    : index % 5 === 0
                                        ? HP(1.6)
                                        : HP(1.2),
                            color: MyColors(0.8).white,
                            top:
                                index % 10 === 0
                                    ? -HP(0.4)
                                    : index % 5 === 0
                                        ? -HP(0.3)
                                        : -HP(0.1),
                        }}
                    >
                        |
                    </Text>
                </View>
                <Text style={heightAndWeightStyles(value, index).label}>
                    {value?.label?.split(".").length > 1 && index % 10 === 0
                        ? Math.floor(value.label)
                        : ""}
                </Text>
            </View>
        );
    }
);

const RenderItemWeight = React.memo(
    ({ value, index, selectedItem, itemWidth }) => {
        return (
            <View
                style={{
                    alignItems: "center",
                    width: itemWidth,
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-around",
                        width: "100%",
                    }}
                >
                    <Text
                        style={
                            heightAndWeightStyles(value, index, selectedItem)
                                .lines
                        }
                    >
                        |
                    </Text>
                </View>
                <Text style={heightAndWeightStyles(value, index).label}>
                    {value?.label?.split(".").length > 1 && index % 10 === 0
                        ? Math.floor(value.label)
                        : ""}
                </Text>
            </View>
        );
    }
);

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const HeightAndWeight = React.memo(
    ({ setSelectedHeightAndWeight, selectedHeightAndWeight, next }) => {
        const { width } = Dimensions.get("window");

        const [heightUnit, setHeightUnit] = useState("CM");
        const [weightUnit, setWeightUnit] = useState("KG");

        const [error, setError] = useState(null);

        const isTablet = () => {
            const { height, width } = Dimensions.get("window");
            const aspectRatio = height / width;
            return width >= 600 || aspectRatio < 1.6; // Width > 600 typically indicates a tablet
        };

        const itemWidth = isTablet() ? WP(1) : WP(2); // Adjust width for centering
        const snapInterval = itemWidth;
        const centerX = width / 2;

        const heightScroll = (event) => {
            const offsetX = event.nativeEvent.contentOffset.x;
            let heightIndex = Math.round(
                (offsetX + centerX - itemWidth / 2) / snapInterval
            );

            heightIndex = Math.max(
                0,
                Math.min(heightIndex, heightOptions.length - 1)
            ); // Ensure index stays in bounds

            setSelectedHei(
                parseFloat(
                    heightOptions[heightIndex].value - (isTablet() ? 1 : 0.4)
                ).toFixed(1)
            ); // Set height only if it has changed
        };

        // Use onMomentumScrollEnd to update when scrolling stops

        const heightOptions = useMemo(
            () =>
                Array.from({ length: 1441 }, (_, i) => ({
                    label: (i * 0.1 + 80).toFixed(1),
                    value: (i * 0.1 + 80).toFixed(1),
                })),
            []
        );
        // Empty dependency array to ensure it's computed only once

        // Weight options with decimal precision
        const weightOptions = useMemo(
            () =>
                Array.from({ length: 2141 }, (_, i) => ({
                    label: (i * 0.1 + 20).toFixed(1), // Weight ranges from 20.0 kg to 110.0 kg
                    value: (i * 0.1 + 20).toFixed(1),
                })),
            []
        );

        const weightScroll = (event) => {
            const offsetX = event.nativeEvent.contentOffset.x;

            let weightIndex = Math.round(
                (offsetX + centerX - itemWidth / 2) / snapInterval
            );

            weightIndex = Math.max(
                0,
                Math.min(weightIndex, weightOptions.length - 1)
            );

            weightIndex = Math.max(
                0,
                Math.min(weightIndex, weightOptions.length)
            );
            setSelectedWei(
                parseFloat(
                    weightOptions[weightIndex].value - (isTablet() ? 1 : 0.4)
                ).toFixed(1)
            );
        };

        const getItemLayout = (data, index) => ({
            length: itemWidth,
            offset: itemWidth * index,
            index,
        });

        const [selectedWei, setSelectedWei] = useState(null);
        const [selectedHei, setSelectedHei] = useState(null);
        // Height options with decimal precision

        const handleSubmit = () => {
            if (!selectedHei || !selectedWei) {
                setError("Please select your height and weight.");
                setTimeout(() => {
                    setError(null);
                }, 2000);
                return;
            }
            setSelectedHeightAndWeight({
                height: selectedHei,
                weight: selectedWei,
                heightUnit: heightUnit,
                weightUnit: weightUnit,
            }); // Example if you need to set again
            next(1);
        };

        const backButton = () => {
            setSelectedHeightAndWeight({
                height: selectedHei,
                weight: selectedWei,
                unit: unit,
            }); // Example if you need to set again
            next(-1);
        };

        return (
            <View style={styles.container}>
                <View style={{ width: WP(90), marginBottom: HP(3) }}>
                    <Text style={styles.Title}>
                        • Select your height and weight
                    </Text>
                </View>
                <View
                    style={{
                        borderWidth: 1,
                        borderColor: MyColors(1).gray,
                        borderRadius: WP(4),
                        width: WP(90),
                        alignItems: "center",
                        justifyContent: "center",
                        padding: HP(4),
                        gap: HP(2),
                    }}
                >
                    {weightOptions && heightOptions ? (
                        <View style={{ gap: HP(3) }}>
                            <View>
                                <View style={{ width: WP(80) }}>
                                    <Text
                                        style={{
                                            color: MyColors(1).white,
                                            fontSize: HP(2),
                                            fontWeight: "bold",
                                        }}
                                    >
                                        Height in cm
                                    </Text>
                                </View>

                                <View style={{ alignItems: "center" }}>
                                    <AntDesign
                                        name="caretdown"
                                        size={HP(1.5)}
                                        color={MyColors(1).white}
                                    />
                                    <LinearGradient
                                        colors={[
                                            MyColors(1).black,
                                            MyColors(0.1).green,
                                            MyColors(0.5).green,
                                            MyColors(0.1).green,
                                            MyColors(1).black,
                                        ]}
                                        locations={[0, 0.49, 0.5, 0.51, 1]}
                                        start={{ x: 0, y: 1 }}
                                        end={{ x: 1, y: 1 }}
                                        style={
                                            heightAndWeightStyles()
                                                .linearGradient
                                        }
                                    >
                                        <FlatList
                                            data={heightOptions}
                                            horizontal
                                            snapToInterval={itemWidth}
                                            decelerationRate={"fast"}
                                            onMomentumScrollEnd={heightScroll}
                                            contentContainerStyle={{
                                                justifyContent: "center",
                                            }}
                                            getItemLayout={getItemLayout}
                                            showsHorizontalScrollIndicator={
                                                false
                                            }
                                            style={{
                                                width: isTablet()
                                                    ? WP(81)
                                                    : WP(83.5),
                                            }}
                                            renderItem={({ item, index }) => (
                                                <RenderItemHeight
                                                    value={item}
                                                    index={index}
                                                    selectedItem={selectedHei}
                                                    itemWidth={itemWidth}
                                                />
                                            )}
                                            keyExtractor={(data) =>
                                                data.value.toString()
                                            }
                                        />
                                    </LinearGradient>
                                    <AntDesign
                                        name="caretup"
                                        size={HP(1.5)}
                                        color={MyColors(1).white}
                                    />
                                </View>
                            </View>

                            <View>
                                <View style={{ width: WP(80) }}>
                                    <Text
                                        style={{
                                            color: MyColors(1).white,
                                            fontSize: HP(2),
                                            fontWeight: "bold",
                                        }}
                                    >
                                        Weight in kg
                                    </Text>
                                </View>

                                <View style={{ alignItems: "center" }}>
                                    <AntDesign
                                        name="caretdown"
                                        size={HP(1.5)}
                                        color={MyColors(1).white}
                                    />
                                    <LinearGradient
                                        colors={[
                                            MyColors(1).black,
                                            MyColors(0.1).green,
                                            MyColors(0.5).green,
                                            MyColors(0.1).green,
                                            MyColors(1).black,
                                        ]}
                                        locations={[0, 0.49, 0.5, 0.51, 1]}
                                        start={{ x: 0, y: 1 }}
                                        end={{ x: 1, y: 1 }}
                                        style={{
                                            height: HP(8),
                                            borderTopWidth: 1,
                                            borderBottomWidth: 1,
                                            borderColor: MyColors(1).gray,
                                            overflow: "hidden",
                                        }}
                                    >
                                        <FlatList
                                            data={weightOptions}
                                            horizontal
                                            snapToInterval={itemWidth}
                                            decelerationRate={"fast"}
                                            onMomentumScrollEnd={weightScroll}
                                            contentContainerStyle={{
                                                justifyContent: "center",
                                            }}
                                            getItemLayout={getItemLayout}
                                            showsHorizontalScrollIndicator={
                                                false
                                            }
                                            style={{
                                                width: isTablet()
                                                    ? WP(81)
                                                    : WP(83.5),
                                            }}
                                            renderItem={({ item, index }) => (
                                                <RenderItemWeight
                                                    value={item}
                                                    index={index}
                                                    selectedItem={selectedWei}
                                                    itemWidth={itemWidth}
                                                />
                                            )}
                                            keyExtractor={(data) =>
                                                data.value.toString()
                                            }
                                        />
                                    </LinearGradient>
                                    <AntDesign
                                        name="caretup"
                                        size={HP(1.5)}
                                        color={MyColors(1).white}
                                    />
                                </View>
                            </View>
                        </View>
                    ) : (
                        <View style={{ height: HP(10) }}>
                            <Loading />
                        </View>
                    )}
                </View>

                <Text style={[LoginRegisterStyle.error, { marginTop: HP(2) }]}>
                    {error}
                </Text>

                <NextButtons
                    handleSubmit={handleSubmit}
                    error={error}
                    back={backButton}
                />
            </View>
        );
    }
);

const heightAndWeightStyles = (value, index, selectedHeightAndWeight) =>
    StyleSheet.create({
        linearGradient: {
            height: HP(8),
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: MyColors(1).gray,
            overflow: "hidden",
        },
        lines: {
            fontSize:
                index % 10 === 0 ? HP(2) : index % 5 === 0 ? HP(1.6) : HP(1.2),
            color: MyColors(0.8).white,
            top:
                index % 10 === 0
                    ? -HP(0.4)
                    : index % 5 === 0
                        ? -HP(0.3)
                        : -HP(0.1),
            fontWeight:
                selectedHeightAndWeight === value?.value ? "bold" : "normal",
        },
        label: {
            color: MyColors(0.8).white,
            fontSize: index % 10 === 0 ? HP(1.4) : HP(1.3),
            width: WP(6),
            textAlign: "center",
        },
    });

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const ActivityLevel = ({
    setSelectedActivityLevel,
    selectedActivityLevel,
    next,
}) => {
    const ActivityLevels = [
        {
            label: "Sedentary",
            description: "Little to no exercise; primarily sitting.",
        },
        {
            label: "Lightly Active",
            description: "Engaging in light exercise 1-3 days per week.",
        },
        {
            label: "Moderately Active",
            description:
                "Participating in moderate exercise 3-5 days per week.",
        },
        {
            label: "Very Active",
            description: "Engaging in vigorous exercise 6-7 days per week.",
        },
        {
            label: "Extremely Active",
            description:
                "Undergoing intense exercise twice a day or having a physically demanding job.",
        },
    ];

    const [sliderValue, setSliderValue] = useState(0);

    const handleValueChange = (value) => {
        setSliderValue(value);
        setSelectedActivityLevel(ActivityLevels[value].label);
    };

    const handleSubmit = () => {
        next(1);
    };

    const backButton = () => {
        next(-1);
    };

    return (
        <View style={[styles.container]}>
            <View style={{ width: WP(90) }}>
                <Text
                    style={{
                        fontSize: HP(2),
                        color: MyColors(1).white,
                        fontWeight: "bold",
                    }}
                >
                    {" "}
                    What's your current activity level?
                </Text>
            </View>

            <LinearGradient
                colors={[MyColors(0.5).black, MyColors(1).black]}
                locations={[0, 1]}
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    height: HP(40),
                    marginTop: HP(3),
                    width: WP(90),
                    justifyContent: "flex-end",
                    borderWidth: 1,
                    borderColor: MyColors(1).gray,
                    borderRadius: WP(4),
                }}
            >
                <Slider
                    style={{
                        width: HP(32),
                        height: 10,
                        transform: [{ rotate: "-90deg" }],
                        position: "absolute",
                        left: -HP(10),
                        borderWidth: 1,
                        paddingVertical: WP(3),
                        borderRadius: WP(4),
                        borderColor: MyColors(1).gray,
                    }}
                    minimumValue={0}
                    maximumValue={ActivityLevels.length - 1}
                    step={1}
                    value={sliderValue}
                    onValueChange={handleValueChange}
                    minimumTrackTintColor={MyColors(1).green}
                    maximumTrackTintColor={MyColors(1).white}
                    thumbTintColor={MyColors(1).white}
                />

                <View
                    style={{
                        justifyContent: "space-between",
                        height: HP(30),
                        width: WP(40),
                        marginRight: WP(25),
                    }}
                >
                    {ActivityLevels.slice()
                        .reverse()
                        .map((item, index) => (
                            <View key={item.label}>
                                <Text
                                    style={{
                                        color:
                                            index ===
                                                ActivityLevels.length -
                                                1 -
                                                sliderValue // Adjust index to match reversed array
                                                ? MyColors(0.8).green
                                                : MyColors(0.8).white,
                                        fontSize: HP(2),
                                        fontWeight: "bold",
                                    }}
                                >
                                    {item.label}
                                </Text>
                            </View>
                        ))}
                </View>
            </LinearGradient>

            <View
                style={{
                    marginVertical: HP(2),
                    padding: WP(3),
                    borderRadius: WP(4),
                }}
            >
                <Text style={{ color: MyColors(0.8).white }}>
                    {selectedActivityLevel?.description}
                </Text>
            </View>

            <NextButtons next={handleSubmit} back={backButton} />
        </View>
    );
};

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const SelectFitnessLevel = ({
    setSelectedFitnessLevel,
    submit,
    isLoading,
    next,
}) => {
    const FitnessLevels = [
        {
            label: "Beginner",
            characteristics: [
                "New to exercise or returning after a long break.",
                "May have low endurance and strength.",
            ],
            typicalActivities: [
                "Light cardio (walking, jogging).",
                "Basic strength exercises (bodyweight squats, push-ups).",
                "Flexibility exercises (stretching, yoga).",
            ],
        },
        {
            label: "Intermediate",
            characteristics: [
                "Regularly exercises but has not reached advanced fitness levels.",
                "Moderate endurance and strength.",
            ],
            typicalActivities: [
                "Moderate cardio (running, cycling).",
                "Weight training (using weights or resistance bands).",
                "More structured flexibility routines (yoga, Pilates).",
            ],
        },
        {
            label: "Advanced",
            characteristics: [
                "Highly consistent with workouts, with significant strength and endurance.",
                "Often participates in specific sports or competitive activities.",
            ],
            typicalActivities: [
                "Intense cardio (interval training, long-distance running).",
                "Advanced weight training (heavy lifting, complex compound movements).",
                "Specialized flexibility and mobility work (dynamic stretching, advanced yoga).",
            ],
        },
        {
            label: "Athlete",
            characteristics: [
                "Dedicated to a specific sport or competitive training program.",
                "High endurance, strength, and skill level in specific physical activities.",
            ],
            typicalActivities: [
                "Sport-specific training (speed, agility, skill drills).",
                "Sport-specific strength and conditioning exercises.",
                "Recovery techniques (foam rolling, sports massage, advanced stretching).",
            ],
        },
    ];

    const [fitnessLevel, setFitnessLevel] = useState({
        label: "Beginner",
        characteristics: [
            "New to exercise or returning after a long break.",
            "May have low endurance and strength.",
        ],
        typicalActivities: [
            "Light cardio (walking, jogging).",
            "Basic strength exercises (bodyweight squats, push-ups).",
            "Flexibility exercises (stretching, yoga).",
        ],
    });

    const [error, setError] = useState(false);

    const handleSubmit = () => {
        if (!fitnessLevel) {
            setError("Please select your fitness level.");
            setTimeout(() => {
                setError(null);
            }, 2000);
            return;
        }
        setSelectedFitnessLevel(fitnessLevel?.label);
        next(1);
    };

    const backButton = () => {
        next(-1);
    };

    const updateSelectedItems = (item) => {
        if (!fitnessLevel || fitnessLevel.label !== item.label) {
            setFitnessLevel(item);
        }
    };

    return (
        <View style={[styles.container]}>
            <Text
                style={{
                    fontSize: WP(5),
                    color: MyColors(1).white,
                    fontWeight: "bold",
                    width: WP(90),
                    marginBottom: HP(2),
                }}
            >
                {" "}
                What's your current fitness level?
            </Text>
            <ScrollView
                style={{ marginTop: HP(2) }}
                contentContainerStyle={{ gap: HP(2) }}
                showsVerticalScrollIndicator={false}
            >
                <View style={{ flexDirection: "row", paddingBottom: HP(3) }}>
                    <View style={{ gap: HP(3.5) }}>
                        {FitnessLevels.map((levels) => (
                            <TouchableOpacity
                                key={levels.label}
                                style={{
                                    width: WP(30),
                                    borderRadius: HP(3),
                                    borderWidth: 1,
                                    borderColor:
                                        fitnessLevel?.label === levels.label
                                            ? MyColors(1).green
                                            : MyColors(1).gray,
                                    overflow: "hidden",
                                }}
                                onPress={() => updateSelectedItems(levels)}
                            >
                                <LinearGradient
                                    colors={[
                                        fitnessLevel?.label === levels.label
                                            ? MyColors(0.1).black
                                            : MyColors(1).black,
                                        MyColors(1).black,
                                    ]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    locations={[0, 0.7]}
                                    style={{
                                        justifyContent: "center",
                                        alignItems: "center",
                                        padding: HP(2),
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: MyColors(0.8).white,
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {levels.label}
                                    </Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View
                        style={{
                            width: WP(60),
                            paddingHorizontal: WP(5),
                        }}
                    >
                        {fitnessLevel && (
                            <View style={{ gap: HP(1) }}>
                                <Text
                                    style={{
                                        color: MyColors(1).green,
                                        fontWeight: "bold",
                                        fontSize: HP(2),
                                    }}
                                >
                                    Description:
                                </Text>
                                {fitnessLevel.characteristics.map(
                                    (char, index) => (
                                        <Text
                                            key={index}
                                            style={{
                                                color: MyColors(1).white,
                                                fontSize: HP(1.5),
                                            }}
                                        >
                                            {char}
                                        </Text>
                                    )
                                )}

                                <Text
                                    style={{
                                        color: MyColors(1).green,
                                        fontWeight: "bold",
                                        fontSize: HP(2),
                                    }}
                                >
                                    Typical Activities:
                                </Text>
                                {fitnessLevel.typicalActivities.map(
                                    (act, index) => (
                                        <Text
                                            key={index}
                                            style={{
                                                color: MyColors(1).white,
                                                fontSize: HP(1.5),
                                            }}
                                        >
                                            {act}
                                        </Text>
                                    )
                                )}
                            </View>
                        )}
                    </View>
                </View>

                {error && (
                    <Text style={[LoginRegisterStyle.error]}>{error}</Text>
                )}

                <NextButtons
                    handleSubmit={handleSubmit}
                    isLoading={isLoading}
                    error={error}
                    back={backButton}
                />
            </ScrollView>
        </View>
    );
};

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const PreferablePlaces = ({ setSelectedPlaces, next }) => {
    const places = [
        {
            name: "Home",
            description:
                "A personal and private space, typically inside a house or apartment, where you can relax, live, and manage daily activities. It's easily accessible, allowing you to have flexibility in your schedule.",
        },
        {
            name: "Outdoor",
            description:
                "Any open, natural environment such as parks, fields, or beaches. It provides fresh air, natural scenery, and a space that can be used for recreational activities, walking, or socializing.",
        },
        {
            name: "Gym",
            description:
                "A fitness center or facility equipped with machines, free weights, and other exercise tools. It’s a controlled environment specifically designed for training and physical exercise.",
        },
    ];

    const [selected, setSelected] = useState([]);
    const [error, setError] = useState(null);

    const updateSelectedItem = (item) => {
        setSelected((prev) => {
            if (prev.includes(item)) {
                return prev.filter((selectedItem) => selectedItem !== item);
            } else {
                return [...prev, item];
            }
        });

        console.log(selected);
    };

    const nextButton = () => {
        if (selected.length === 0) {
            setError("Please select one or more.");
            setTimeout(() => {
                setError(null);
            }, 2000);
            return;
        }
        setSelectedPlaces(selected);
        next(1);
    };

    const backButton = () => {
        next(-1);
    };

    return (
        <View style={{ alignItems: "center" }}>
            <View style={{ marginTop: HP(4), width: WP(90) }}>
                <Text
                    style={{
                        color: MyColors(0.8).white,
                        fontWeight: "bold",
                        fontSize: HP(2),
                    }}
                >
                    • Which place do you prefer to do your exercise?
                </Text>
                <Text
                    style={{
                        color: MyColors(0.8).white,
                        fontSize: HP(1.6),
                    }}
                >
                    Choose one or more:
                </Text>
            </View>
            <View
                style={{
                    borderWidth: 1,
                    borderColor: MyColors(1).gray,
                    marginHorizontal: WP(5),
                    marginTop: HP(3),
                    borderRadius: WP(4),
                    width: WP(90),
                    padding: HP(1),
                    gap: HP(1),
                }}
            >
                {places.map((item, index) => (
                    <Pressable
                        key={index}
                        onPress={() => updateSelectedItem(item.name)}
                    >
                        <View
                            style={{
                                justifyContent: "space-between",
                                alignItems: "center",
                                borderRadius: WP(4),
                                borderWidth: 1,
                                borderColor: selected.includes(item.name)
                                    ? MyColors(0.8).green
                                    : MyColors(1).gray,
                                padding: HP(1),
                                paddingHorizontal: HP(2),
                                flexDirection: "row",
                                gap: WP(4),
                            }}
                        >
                            <Text
                                style={{
                                    color: selected.includes(item.name)
                                        ? MyColors(0.8).green
                                        : MyColors(0.5).white,
                                    fontSize: HP(2),
                                    fontWeight: "bold",
                                    elevation: selected.includes(item.name)
                                        ? 4
                                        : 0,
                                }}
                            >
                                {item.name}
                            </Text>

                            <Text
                                style={{
                                    color: selected.includes(item.name)
                                        ? MyColors(0.8).white
                                        : MyColors(0.5).white,
                                    fontSize: HP(1.5),
                                    width: WP(50),
                                }}
                            >
                                {item.description}
                            </Text>
                        </View>
                    </Pressable>
                ))}
            </View>

            <Text
                style={{
                    color: MyColors(0.8).red,
                    textAlign: "center",
                    paddingVertical: HP(2),
                }}
            >
                {error}
            </Text>

            <View style={{ justifyContent: "center", alignItems: "center" }}>
                <NextButtons next={nextButton} back={backButton} />
            </View>
        </View>
    );
};

const BodyFatPercentageScreen = ({
    selectedBodyMeasurements,
    setSelectedBodyMeasurements,
    selectedGender,
    selectedHeightAndWeight,
    next,
}) => {
    const circumferences =
        selectedGender === "Male"
            ? [
                {
                    name: "Waist",
                    value: selectedBodyMeasurements.waist,
                    setter: setSelectedBodyMeasurements,
                    instructions: [
                        "First, let's measure your waist.",
                        "Measure around the narrowest part of your waist, typically just above the belly button.",
                        "Relax your abdomen and breathe out naturally while measuring to avoid tensing the muscles.",
                        "Keep the tape measure parallel to the floor",
                    ],
                },
                {
                    name: "Neck",
                    value: selectedBodyMeasurements.neck,
                    setter: setSelectedBodyMeasurements,
                    instructions: [
                        "And last, let's measure your neck.",
                        `Wrap the tape around the neck, just below your Adam’s apple.`,
                        "Keep the tape level and snug, but avoid compressing the skin.",
                        "Stand straight and look forward during this measurement.",
                    ],
                },
            ]
            : selectedGender === "Female"
                ? [
                    {
                        name: "Waist",
                        value: selectedBodyMeasurements.waist,
                        setter: setSelectedBodyMeasurements.waist,
                        instructions: [
                            "First, let's measure your waist.",
                            "Measure around the narrowest part of your waist, typically just above the belly button.",
                            "Relax your abdomen and breathe out naturally while measuring to avoid tensing the muscles.",
                            "Keep the tape measure parallel to the floor",
                        ],
                    },
                    {
                        name: "Hip",
                        value: selectedBodyMeasurements.hip,
                        setter: setSelectedBodyMeasurements.hip,
                        instructions: [
                            "Second, let's measure your hip.",
                            "Stand with your feet together and measure around the widest part of your hips and buttocks.",
                            "Ensure the tape is snug but not too tight, and it should remain parallel to the floor.",
                            "This measurement is usually taken at the fullest part of the hips.",
                        ],
                    },
                    {
                        name: "Neck",
                        value: selectedBodyMeasurements.neck,
                        setter: setSelectedBodyMeasurements.neck,
                        instructions: [
                            "And last, let's measure your neck.",
                            "Wrap the tape around the neck, just at the base of your neck.",
                            "Keep the tape level and snug, but avoid compressing the skin.",
                            "Stand straight and look forward during this measurement.",
                        ],
                    },
                ]
                : [
                    {
                        name: "Waist",
                        value: selectedBodyMeasurements.waist,
                        setter: setSelectedBodyMeasurements.waist,
                        instructions: [
                            "First, let's measure your waist.",
                            "Measure around the narrowest part of your waist, typically just above the belly button.",
                            "Relax your abdomen and breathe out naturally while measuring to avoid tensing the muscles.",
                            "Keep the tape measure parallel to the floor",
                        ],
                    },
                    {
                        name: "Hip",
                        value: selectedBodyMeasurements.hip,
                        setter: setSelectedBodyMeasurements.hip,
                        instructions: [
                            "And now, let's measure your hip.",
                            "Stand with your feet together and measure around the widest part of your hips and buttocks.",
                            "Ensure the tape is snug but not too tight, and it should remain parallel to the floor.",
                            "This measurement is usually taken at the fullest part of the hips.",
                        ],
                    },
                    {
                        name: "Neck",
                        value: selectedBodyMeasurements.neck,
                        setter: setSelectedBodyMeasurements.neck,
                        instructions: [
                            "And last, let's measure your neck.",
                            "Wrap the tape around the neck, just below the Adam’s apple for men and at the base of the neck for women.",
                            "Keep the tape level and snug, but avoid compressing the skin.",
                            "Stand straight and look forward during this measurement.",
                        ],
                    },
                ];

    // const calculateBodyFatPercentage = (
    //     selectedBodyMeasurements,
    //     gender,
    //     HW,
    //     unit
    // ) => {

    //     let waist = selectedBodyMeasurements.waist;
    //     let neck = selectedBodyMeasurements.neck;
    //     let hip = selectedBodyMeasurements.hip
    //     let height = HW.height

    //     const CM_TO_INCH = 0.393701;

    //     console.log(`Gender: ${gender}, height ${height.height}, Waist: ${waist}, Neck: ${neck} Hip: ${hip}`);
    //     console.log(selectedBodyMeasurements)

    //     if (gender === "Male" && waist <= neck) {
    //         console.log(
    //             "Waist must be larger than neck for a valid calculation."
    //         );
    //         return null; // Prevent the calculation if the waist is not larger than the neck.
    //     }

    //     if (gender === "Female" && waist + hip <= neck) {
    //         console.log(
    //             "Combined waist and hip must be larger than neck for a valid calculation."
    //         );
    //         return null; // Prevent the calculation if waist + hip is not larger than neck.
    //     }

    //     if (unit === "CM") {
    //         waist *= CM_TO_INCH;
    //         neck *= CM_TO_INCH;
    //         hip *= CM_TO_INCH;
    //     }

    //     height *= CM_TO_INCH;

    //     console.log(
    //         `Converted waist: ${waist}, neck: ${neck}, height: ${height}`
    //     );

    //     if (gender === "Male") {
    //         const bodyFat = (
    //             86.01 * Math.log10(waist - neck) -
    //             70.041 * Math.log10(height) +
    //             36.76
    //         ).toFixed(2);
    //         console.log(`Body Fat Percentage (Male): ${bodyFat} %`);
    //         return bodyFat;
    //     } else if (gender === "Female") {
    //         const bodyFat = (
    //             163.205 * Math.log10(waist + hip - neck) -
    //             97.684 * Math.log10(height) -
    //             78.387
    //         ).toFixed(2);
    //         console.log(`Body Fat Percentage (Female): ${bodyFat} %`);
    //         return bodyFat;
    //     } else {
    //         throw new Error("Invalid gender");
    //     }
    // };

    const toInches = (cm) => (cm / 2.54).toFixed(2);
    const toCm = (inches) => (inches * 2.54).toFixed(2);

    const handleUnitChange = (newUnit) => {
        if (newUnit !== unit) {
            // Ensure all measurements are converted before updating the unit
            setSelectedBodyMeasurements({
                waist:
                    unit === "CM"
                        ? toInches(selectedBodyMeasurements.waist)
                        : toCm(selectedBodyMeasurements.waist),
                hip:
                    unit === "CM"
                        ? toInches(selectedBodyMeasurements.hip)
                        : toCm(selectedBodyMeasurements.hip),
                neck:
                    unit === "CM"
                        ? toInches(selectedBodyMeasurements.neck)
                        : toCm(selectedBodyMeasurements.neck),
                unit: newUnit,
            });
            setUnit(newUnit);
        }
    };

    const [isContinue, setIsContinue] = useState(false);
    const SVRef = useRef(0);
    const [i, setI] = useState(0);

    const backButton = (value, index) => {
        if (!isContinue || index === 0) {
            if (isContinue) {
                setIsContinue(false);
            } else {
                next(-1);
            }
        } else if (index > 0) {
            SVRef.current.scrollTo({
                x: WP(100) * (index - 1),
                animated: true,
            });
        } else if (index === 0) {
            setIsContinue(false);
        }
    };

    const continueButton = () => {
        setIsContinue(true);
    };

    const nextButton = (value, index) => {
        if (!isContinue) {
            next(1);
        } else if (index < circumferences.length - 1) {
            if (!value.value) {
                Alert.alert("Error", "Please enter your measurement.");
                return;
            }

            if (/\s/.test(value.value)) {
                Alert.alert("Error", "Measurement should not contain spaces.");
                return;
            }

            if (/[^0-9.]/.test(value.value)) {
                Alert.alert(
                    "Error",
                    "Please enter a valid measurement without special characters."
                );
                return;
            }

            if (!/^\d+(\.\d+)?$/.test(value.value)) {
                Alert.alert("Error", "Please enter a numeric measurement.");
                return;
            }

            if (Math.round(value.value) === 0) {
                Alert.alert("Error", "Measurement cannot be zero.");
                return;
            }
            SVRef.current.scrollTo({
                x: WP(100) * (index + 1),
                animated: true,
            });
        } else {
            next(1); // Proceed to the next screen
        }
    };

    useEffect(() => {
        handleUnitChange("CM");
    }, [isContinue]);

    const [unit, setUnit] = useState("IN");

    return (
        <View style={{}}>
            <Text
                style={{
                    color: MyColors(1).white,
                    fontWeight: "bold",
                    fontSize: HP(2.5),
                    padding: WP(5),
                }}
            >
                Let's get your body circumferences measurements
            </Text>

            {isContinue && (
                <View style={{ width: WP(100) }}>
                    <View
                        style={{
                            padding: HP(1),
                            flexDirection: "row",
                            alignItems: "center",
                            gap: HP(1),
                            marginHorizontal: WP(5),
                        }}
                    >
                        <Text
                            style={{
                                color:
                                    unit === "CM"
                                        ? MyColors(1).white
                                        : MyColors(0.8).white,
                                fontWeight: unit === "CM" ? "bold" : "normal",
                                width: WP(20),
                            }}
                            onPress={() => handleUnitChange("CM")}
                        >
                            Centimeters
                        </Text>
                        <Text
                            style={{ color: MyColors(1).white }}
                            onPress={() => handleUnitChange("CM")}
                        >
                            /
                        </Text>
                        <Text
                            style={{
                                color:
                                    unit === "IN"
                                        ? MyColors(1).white
                                        : MyColors(0.8).white,
                                fontWeight: unit === "IN" ? "bold" : "normal",
                                width: WP(20),
                            }}
                            onPress={() => handleUnitChange("IN")}
                        >
                            Inches
                        </Text>
                    </View>
                </View>
            )}

            {!isContinue ? (
                <View style={{ padding: WP(5), gap: HP(2) }}>
                    <View>
                        <Text
                            style={{
                                color: MyColors(1).white,
                                fontSize: HP(2),
                                fontWeight: "bold",
                            }}
                        >
                            Tools:
                        </Text>

                        <View style={{ gap: HP(1), flexDirection: "row" }}>
                            <Text
                                style={{
                                    color: MyColors(1).white,
                                    fontSize: HP(2),
                                    fontWeight: "bold",
                                }}
                            >
                                •
                            </Text>
                            <Text
                                style={{
                                    color: MyColors(0.8).white,
                                    fontSize: HP(2),
                                }}
                            >
                                Use a flexible, non-stretchable{" "}
                                <Text
                                    style={{
                                        fontWeight: "bold",
                                        color: MyColors(1).white,
                                    }}
                                >
                                    Tape Measure.
                                </Text>
                                (usually made of cloth or plastic)
                            </Text>
                        </View>
                    </View>

                    <View>
                        <Text
                            style={{
                                color: MyColors(1).white,
                                fontSize: HP(2),
                                fontWeight: "bold",
                            }}
                        >
                            Body Position:
                        </Text>

                        <View style={{ gap: HP(1), flexDirection: "row" }}>
                            <Text
                                style={{
                                    color: MyColors(1).white,
                                    fontSize: HP(2),
                                    fontWeight: "bold",
                                }}
                            >
                                •
                            </Text>
                            <Text
                                style={{
                                    color: MyColors(0.8).white,
                                    fontSize: HP(2),
                                }}
                            >
                                Perform these measurements in{" "}
                                <Text
                                    style={{
                                        fontWeight: "bold",
                                        color: MyColors(1).white,
                                    }}
                                >
                                    standing
                                </Text>
                                ,{" "}
                                <Text
                                    style={{
                                        fontWeight: "bold",
                                        color: MyColors(1).white,
                                    }}
                                >
                                    relaxed{" "}
                                </Text>
                                position.
                            </Text>
                        </View>
                    </View>

                    <View>
                        <Text
                            style={{
                                color: MyColors(1).white,
                                fontSize: HP(2),
                                fontWeight: "bold",
                            }}
                        >
                            Consistency:
                        </Text>

                        <View style={{ gap: HP(1), flexDirection: "row" }}>
                            <Text
                                style={{
                                    color: MyColors(1).white,
                                    fontSize: HP(2),
                                    fontWeight: "bold",
                                }}
                            >
                                •
                            </Text>
                            <Text
                                style={{
                                    color: MyColors(0.8).white,
                                    fontSize: HP(2),
                                }}
                            >
                                Measure each area three times, and use the
                                average of the readings for the most accurate
                                results.
                            </Text>
                        </View>
                    </View>
                </View>
            ) : (
                <ScrollView
                    horizontal
                    contentContainerStyle={{}}
                    style={{ width: WP(100) }}
                    snapToInterval={WP(100)}
                    ref={SVRef}
                    scrollEnabled={false}
                >
                    {circumferences.map((v, i) => (
                        <View
                            key={i}
                            style={{
                                width: WP(100),
                                padding: WP(5),
                                gap: HP(2),
                            }}
                        >
                            <View
                                style={{
                                    alignItems: "center",
                                    flexDirection: "row",
                                    gap: HP(2),
                                }}
                            >
                                <Text
                                    style={{
                                        color: MyColors(1).white,
                                        fontWeight: "bold",
                                        fontSize: HP(2.5),
                                    }}
                                >
                                    {i + 1}. {v.name}
                                </Text>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        gap: HP(2),
                                        borderRadius: WP(4),
                                        borderWidth: 1,
                                        borderColor: MyColors(1).gray,
                                        padding: HP(1),
                                        paddingHorizontal: HP(2),
                                        justifyContent: "space-around",
                                    }}
                                >
                                    <TextInput
                                        placeholder="Enter your measurement"
                                        style={{
                                            color: MyColors(1).white,
                                        }}
                                        value={v.value}
                                        onChangeText={(text) =>
                                            v.setter({
                                                ...selectedBodyMeasurements,
                                                [v.name.toLowerCase()]: text,
                                            })
                                        }
                                        inputMode="numeric"
                                        placeholderTextColor={
                                            MyColors(0.6).white
                                        }
                                    />
                                    <Text
                                        style={{
                                            color: MyColors(1).white,
                                            fontSize: HP(2),
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {unit}
                                    </Text>
                                </View>
                            </View>

                            <View style={{ gap: HP(2) }}>
                                {v.instructions.map((ins, inv) => (
                                    <View
                                        key={inv}
                                        style={{ flexDirection: "row" }}
                                    >
                                        <Text
                                            style={{ color: MyColors(1).white }}
                                        >
                                            •{" "}
                                        </Text>

                                        <Text
                                            style={{ color: MyColors(1).white }}
                                        >
                                            {ins}
                                        </Text>
                                    </View>
                                ))}
                            </View>

                            <View
                                style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <NextButtons
                                    next={() => nextButton(v, i)}
                                    back={() => backButton(v, i)}
                                    skipIndex={true}
                                    isContinue={isContinue}
                                />
                            </View>
                        </View>
                    ))}
                </ScrollView>
            )}

            {!isContinue && (
                <View
                    style={{ justifyContent: "center", alignItems: "center" }}
                >
                    <NextButtons
                        next={continueButton}
                        back={backButton}
                        skip={true}
                    />
                </View>
            )}
            {!isContinue && (
                <View
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <NextButtons
                        next={() => nextButton(i)}
                        back={() => backButton(i)}
                        skipIndex={true}
                        isContinue={isContinue}
                    />
                </View>
            )}
        </View>
    );
};

const SubmitScreen = ({
    selectedGender,
    selectedHeightAndWeight,
    selectedBirthDay,
    selectedBirthMonth,
    selectedBirthYear,
    selectedGoal,
    selectedPlaces,
    selectedActivityLevel,
    selectedFitnessLevel,
    selectedBodyMeasurements,
    submit,
    isLoading,
    next,
}) => {
    const getMonth = (m) => {
        switch (m) {
            case 0:
                return "January";
            case 1:
                return "February";
            case 2:
                return "March";
            case 3:
                return "April";
            case 4:
                return "May";
            case 5:
                return "June";
            case 6:
                return "July";
            case 7:
                return "August";
            case 8:
                return "September";
            case 9:
                return "October";
            case 10:
                return "November";
            case 11:
                return "December";
            default:
                return "Invalid month";
        }
    };

    const [error, setError] = useState(false);

    const handleSubmit = () => {
        submit(true);
    };

    const backButton = () => {
        next(-1);
    };

    console.log(selectedBodyMeasurements.waist);

    return (
        <ScrollView
            style={{ marginTop: HP(5) }}
            contentContainerStyle={{ alignItems: "center", gap: HP(2) }}
        >
            <View
                style={{
                    borderWidth: 1,
                    borderColor: MyColors(1).gray,
                    borderRadius: WP(4),
                    width: WP(90),
                    padding: WP(4),
                    gap: HP(1),
                }}
            >
                <Text
                    style={{
                        fontSize: HP(2.5),
                        fontWeight: "bold",
                        color: MyColors(1).white,
                    }}
                >
                    Review your information
                </Text>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: HP(1),
                        borderWidth: 1,
                        borderRadius: WP(2),
                        borderColor: MyColors(1).gray,
                        padding: HP(1),
                    }}
                >
                    <Text style={submitStyles.label}>Gender:</Text>
                    <Text style={submitStyles.value}>{selectedGender}</Text>
                </View>
                <View
                    style={{
                        borderWidth: 1,
                        borderColor: MyColors(1).gray,
                        padding: HP(1),
                        gap: HP(1),
                        borderRadius: WP(2),
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: HP(1),
                        }}
                    >
                        <Text style={submitStyles.label}>Height:</Text>
                        <Text style={submitStyles.value}>
                            {selectedHeightAndWeight.height}{" "}
                            {selectedHeightAndWeight.unit}
                        </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: HP(1),
                        }}
                    >
                        <Text style={submitStyles.label}>Weight:</Text>
                        <Text style={submitStyles.value}>
                            {selectedHeightAndWeight.weight}{" "}
                            {selectedHeightAndWeight.unit}
                        </Text>
                    </View>
                </View>
                <View
                    style={{
                        borderWidth: 1,
                        borderColor: MyColors(1).gray,
                        padding: HP(1),
                        gap: HP(1),
                        borderRadius: WP(2),
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: HP(1),
                        }}
                    >
                        <Text style={submitStyles.label}>Birth Date:</Text>
                        <Text style={submitStyles.value}>
                            {getMonth(selectedBirthMonth)} {selectedBirthDay},{" "}
                            {selectedBirthYear}
                        </Text>
                    </View>
                </View>
                <View
                    style={{
                        borderWidth: 1,
                        borderColor: MyColors(1).gray,
                        padding: HP(1),
                        gap: HP(1),
                        borderRadius: WP(2),
                        flexDirection: "row",
                    }}
                >
                    <Text style={submitStyles.label}>Goals:</Text>
                    <Text style={submitStyles.value}>
                        {selectedGoal?.map(
                            (v, i) =>
                                `• ${v} ${i !== selectedGoal.length - 1 ? "\n" : ""
                                }`
                        )}
                    </Text>
                </View>
                {Number(selectedBodyMeasurements.waist) !== 0 &&
                    Number(selectedBodyMeasurements.neck) !== 0 && (
                        <View
                            style={{
                                borderWidth: 1,
                                borderColor: MyColors(1).gray,
                                padding: HP(1),
                                gap: HP(1),
                                borderRadius: WP(2),
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: HP(1),
                                }}
                            >
                                <Text style={submitStyles.label}>Waist:</Text>
                                <Text style={submitStyles.value}>
                                    {selectedBodyMeasurements.waist}{" "}
                                    {selectedBodyMeasurements?.unit}
                                </Text>
                            </View>

                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: HP(1),
                                }}
                            >
                                <Text style={submitStyles.label}>Neck:</Text>
                                <Text style={submitStyles.value}>
                                    {selectedBodyMeasurements?.neck}{" "}
                                    {selectedBodyMeasurements?.unit}
                                </Text>
                            </View>

                            {selectedGender === "Female" && (
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        gap: HP(1),
                                    }}
                                >
                                    <Text style={submitStyles.label}>
                                        Hips:
                                    </Text>
                                    <Text style={submitStyles.value}>
                                        {selectedBodyMeasurements?.hip}{" "}
                                        {selectedBodyMeasurements?.unit}
                                    </Text>
                                </View>
                            )}
                        </View>
                    )}
                <View
                    style={{
                        borderWidth: 1,
                        borderColor: MyColors(1).gray,
                        padding: HP(1),
                        gap: HP(1),
                        borderRadius: WP(2),
                        flexDirection: "row",
                    }}
                >
                    <Text style={submitStyles.label}>Places:</Text>
                    <Text style={submitStyles.value}>
                        {selectedPlaces?.map(
                            (v, i) =>
                                `• ${v} ${i !== selectedPlaces.length - 1 ? "\n" : ""
                                }`
                        )}
                    </Text>
                </View>
                <View
                    style={{
                        borderWidth: 1,
                        borderColor: MyColors(1).gray,
                        padding: HP(1),
                        gap: HP(1),
                        borderRadius: WP(2),
                        flexDirection: "row",
                    }}
                >
                    <Text style={submitStyles.label}>Activity Level:</Text>
                    <Text style={submitStyles.value}>
                        {selectedActivityLevel}
                    </Text>
                </View>
                <View
                    style={{
                        borderWidth: 1,
                        borderColor: MyColors(1).gray,
                        padding: HP(1),
                        gap: HP(1),
                        borderRadius: WP(2),
                        flexDirection: "row",
                    }}
                >
                    <Text style={submitStyles.label}>Fitness Level:</Text>
                    <Text style={submitStyles.value}>
                        {selectedFitnessLevel}
                    </Text>
                </View>
            </View>

            <NextButtons
                lastIndex={true}
                isLoading={isLoading}
                handleSubmit={handleSubmit}
                back={backButton}
            />
        </ScrollView>
    );
};

const submitStyles = StyleSheet.create({
    label: {
        fontSize: HP(1.8),
        fontWeight: "bold",
        color: MyColors(0.8).white,
    },
    value: {
        color: MyColors(0.7).white,
        fontSize: HP(1.8),
        flex: 1,
    },
});
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const NextButtons = ({
    next,
    handleSubmit,
    error,
    isLoading,
    back,
    firstIndex,
    lastIndex,
    skip,
    skipIndex,
    isContinue,
}) => {
    return (
        <View
            style={{ alignItems: "center", flexDirection: "row", gap: WP(10) }}
        >
            {!firstIndex && !skip && (
                <TouchableOpacity
                    disabled={error}
                    onPress={back}
                    style={{
                        padding: 5,
                        width: WP(40),
                        backgroundColor: MyColors(1).gray,
                        borderRadius: 15,
                        marginBottom: 20,
                        alignItems: "center",
                        justifyContent: "center",
                        height: HP(6),
                        borderWidth: 1,
                        borderColor: MyColors(1).yellow,
                    }}
                >
                    <Text
                        style={{
                            fontSize: HP(2),
                            color: error ? MyColors(1).red : MyColors(1).white,
                            fontWeight: "bold",
                        }}
                    >
                        Back
                    </Text>
                </TouchableOpacity>
            )}

            <TouchableOpacity
                disabled={error}
                onPress={next || handleSubmit}
                style={{
                    padding: 5,
                    width: firstIndex || skip ? WP(80) : WP(40),
                    backgroundColor: MyColors(1).gray,
                    borderRadius: 15,
                    marginBottom: 20,
                    alignItems: "center",
                    justifyContent: "center",
                    height: HP(6),
                    borderWidth: 1,
                    borderColor: MyColors(1).green,
                }}
            >
                {!isLoading ? (
                    <Text
                        style={{
                            fontSize: HP(2),
                            color: error ? MyColors(1).red : MyColors(1).white,
                            fontWeight: "bold",
                        }}
                    >
                        {lastIndex
                            ? "Submit"
                            : skip
                                ? "Continue"
                                : !skipIndex || isContinue
                                    ? "Next"
                                    : "Skip"}
                    </Text>
                ) : (
                    <Loading />
                )}
            </TouchableOpacity>
        </View>
    );
};

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------

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
