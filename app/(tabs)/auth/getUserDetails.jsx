import {
    View,
    ScrollView,
    Modal,
    Alert,
    StatusBar,
    Animated,
    Text,
} from "react-native";
import { useState, useEffect, useRef } from "react";
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
import LottieView from "lottie-react-native";

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const getWeight = () => {
    const array = Array.from({ length: 2141 }, (_, i) => ({
        value: (i * 0.1 + 20).toFixed(1),
    }));
    return array;
};

const getHeight = () => {
    const array = Array.from({ length: 1441 }, (_, i) => ({
        value: (i * 0.1 + 80).toFixed(1),
    }));
    return array;
};

const weightOptions = getWeight();
const heightOptions = getHeight();

export default function GetUserDetails() {
    const { updateUserData, user, checkInitializationStatus } = useAuth();
    const today = new Date();
    const [index, setIndex] = useState(0);
    const [isSubmit, setIsSubmit] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isBirthYear, setIsBirthYear] = useState(false);
    const [heightOffsetX, setHeightOffsetX] = useState(null);
    const [weightOffsetX, setWeightOffsetX] = useState(null);
    const [nickName, setNickName] = useState(null);
    const [selectedGender, setSelectedGender] = useState(null);
    const [birthYear, setBirthYear] = useState(null);
    const [birthMonth, setBirthMonth] = useState(null);
    const [birthDay, setBirthDay] = useState(null);
    const [selectedGoal, setSelectedGoal] = useState([]);
    const [selectedHeightAndWeight, setSelectedHeightAndWeight] =
        useState(null);
    const [selectedActivityLevel, setSelectedActivityLevel] =
        useState("Sedentary");
    const [selectedFitnessLevel, setSelectedFitnessLevel] =
        useState("Beginner");
    const [selectedPlaces, setSelectedPlaces] = useState([]);
    const [selectedBodyMeasurements, setSelectedBodyMeasurements] = useState({
        waist: 0,
        neck: 0,
        hip: 0,
        unit: null,
    });

    const [scrollOffset, setScrollOffset] = useState(0);
    const scrollY = useRef(new Animated.Value(0)).current;

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

    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        if (isFinished) {
            checkInitializationStatus(user);
        }
    }, [isFinished]);

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
            const currentUser = auth.currentUser;
            try {
                await setDoc(
                    doc(db, "users", currentUser.uid),
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
                console.log(
                    "GetUserDetails: HandleSubmit - User document updated successfully"
                );
                console.log(
                    "GetUserDetails: HandleSubmit - Calling updateUserData",
                    user.uid
                );

                await updateUserData(currentUser.uid);

                console.log(
                    "GetUserDetails: HandleSubmit - after updateUserData",
                    user
                );
                console.log(
                    "GetUserDetails: HandleSubmit - updateUserData finished, setting isAuth to true"
                );

                setIsFinished(true);
            } catch (error) {
                console.error("Error updating document: ", error);
                Alert.alert("Error updating profile", error.message);
            }
        } else {
            Alert.alert("Error", "Please fill all required fields");
        }
    };

    const screens = [
        <NickName
            setNickName={setNickName}
            nickName={nickName}
            scrollY={scrollY}
            setIndex={setIndex}
            scrollOffset={scrollOffset}
        />,
        <Gender
            setSelectedGender={setSelectedGender}
            selectedGender={selectedGender}
            scrollY={scrollY}
            setIndex={setIndex}
            nickName={nickName}
            scrollOffset={scrollOffset}
        />,
        <BirthDate
            setBirthDay={setBirthDay}
            setBirthMonth={setBirthMonth}
            setBirthYear={setBirthYear}
            selectedBirthDay={birthDay}
            selectedBirthMonth={birthMonth}
            selectedBirthYear={birthYear}
            scrollY={scrollY}
            setIndex={setIndex}
            scrollOffset={scrollOffset}
        />,
        <HeightAndWeight
            setSelectedHeightAndWeight={setSelectedHeightAndWeight}
            selectedHeightAndWeight={selectedHeightAndWeight}
            heightOptions={heightOptions}
            weightOptions={weightOptions}
            setWeightOffsetX={setWeightOffsetX}
            weightOffsetX={weightOffsetX}
            setHeightOffsetX={setHeightOffsetX}
            heightOffsetX={heightOffsetX}
            scrollY={scrollY}
            setIndex={setIndex}
            scrollOffset={scrollOffset}
        />,
        <BodyFatPercentage
            selectedBodyMeasurements={selectedBodyMeasurements}
            setSelectedBodyMeasurements={setSelectedBodyMeasurements}
            selectedGender={selectedGender}
            selectedHeightAndWeight={selectedHeightAndWeight}
            scrollY={scrollY}
            scrollOffset={scrollOffset}
            setIndex={setIndex}
        />,
        <MainGoal
            setSelectedGoal={setSelectedGoal}
            selectedGoal={selectedGoal}
            scrollY={scrollY}
            setIndex={setIndex}
            scrollOffset={scrollOffset}
            nickName={nickName}
        />,
        <PreferablePlaces
            setSelectedPlaces={setSelectedPlaces}
            selectedPlaces={selectedPlaces}
            scrollY={scrollY}
            setIndex={setIndex}
            scrollOffset={scrollOffset}
        />,
        <ActivityLevel
            setSelectedActivityLevel={setSelectedActivityLevel}
            selectedActivityLevel={selectedActivityLevel}
            scrollY={scrollY}
            setIndex={setIndex}
            scrollOffset={scrollOffset}
        />,
        <SelectFitnessLevel
            setSelectedFitnessLevel={setSelectedFitnessLevel}
            submit={setIsSubmit}
            isLoading={isLoading}
            scrollOffset={scrollOffset}
            scrollY={scrollY}
            setIndex={setIndex}
        />,
        <SubmitScreen
            nickName={nickName}
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
            scrollY={scrollY}
            scrollOffset={scrollOffset}
            setIndex={setIndex}
        />,
    ];

    const handleScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: true }
    );

    useEffect(() => {
        scrollY.addListener(({ value }) => {
            console.log(value);
            setScrollOffset(value);
        });
        return () => {
            scrollY.removeAllListeners();
        };
    }, [scrollY]);

    return (
        <Modal style={{ zIndex: 100 }}>
            <StatusBar
                backgroundColor={MyColors(1).black}
                barStyle={"light-content"}
            />
            <Animated.ScrollView
                style={{ flex: 1, backgroundColor: MyColors(1).black }}
                onScroll={handleScroll}
                decelerationRate={0.998}
                keyboardShouldPersistTaps="handled"
            >
                {screens?.map(
                    (v, i) =>
                        i <= index && (
                            <View key={i} style={{ flex: 1 }}>
                                {v}
                            </View>
                        )
                )}
            </Animated.ScrollView>
        </Modal>
    );
}

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------
