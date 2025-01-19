import {
    View,
    ScrollView,
    Modal,
    Alert,
    StatusBar,
    Animated,
} from "react-native";
import { useState, useEffect } from "react";
import { db } from "@/components/firebase/config";
import { setDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import {
    heightPercentageToDP as HP,
    widthPercentageToDP as WP,
} from "react-native-responsive-screen";
import { MyColors } from "@/constants/myColors";
import { useAuth } from "@/components/auth/authProvider";

import NickName from "./getuserdetails/nickname";
import Gender from "./getuserdetails/gender";
import BirthDate from "./getuserdetails/birthdate";
import HeightAndWeight from "./getuserdetails/heightweight";
import BodyFatPercentage from "./getuserdetails/bodyfatpercentage";
import MainGoal from "./getuserdetails/maingoal";
import PreferablePlaces from "./getuserdetails/place";
import ActivityLevel from "./getuserdetails/activity";
import SelectFitnessLevel from "./getuserdetails/fitness";
import SubmitScreen from "./getuserdetails/submit";

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const heightOptions = Array.from({ length: 1441 }, (_, i) => ({
    label: (i * 0.1 + 80).toFixed(1),
    value: (i * 0.1 + 80).toFixed(1),
}));

const weightOptions = Array.from({ length: 2141 }, (_, i) => ({
    label: (i * 0.1 + 20).toFixed(1),
    value: (i * 0.1 + 20).toFixed(1),
}));

export default function HWmodal({ setShowModal }) {
    const { updateUserData, user, } = useAuth();
    const today = new Date();

    const [nickName, setNickName] = useState(null);
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

    const [heightOffsetX, setHeightOffsetX] = useState(null);
    const [weightOffsetX, setWeightOffsetX] = useState(null);

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
            nickName &&
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
                        nickName: nickName,
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
                setShowModal(false);
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
        <NickName
            setNickName={setNickName}
            nickName={nickName}
            next={nextButton}
        />,
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
            heightOptions={heightOptions}
            weightOptions={weightOptions}
            setWeightOffsetX={setWeightOffsetX}
            weightOffsetX={weightOffsetX}
            setHeightOffsetX={setHeightOffsetX}
            heightOffsetX={heightOffsetX}
        />,
        <BodyFatPercentage
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
        <Modal style={{ zIndex: 100 }}>
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

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------
