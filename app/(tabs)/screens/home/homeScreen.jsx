import {
    View,
    Text,
    SafeAreaView,
    ScrollView,
    Modal,
    StyleSheet,
    Platform,
} from "react-native";
import React, { useState, useEffect } from "react";
import {
    heightPercentageToDP as HP,
    widthPercentageToDP as WP,
} from "react-native-responsive-screen";
import Animated, { useSharedValue } from "react-native-reanimated";
import { Pedometer } from "expo-sensors";
import CustomHeader from "@/components/customs/CustomHeader";
import { MyColors } from "@/constants/myColors";
import CustomAlert from "@/components/customs/customAlert";
import { useAuth } from "@/components/auth/authProvider";
import Loading from "@/components/customs/loading";
import Blocks from "./blocks";
import HWmodal from "./hwmodal";
import Banner from "./banner";
export default function HomeScreen() {
    const { user } = useAuth();
    const [showAlert, setShowAlert] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showLoadingScreen, setShowLoadingScreen] = useState(true);
    const [scrollPosition, setScrollPosition] = useState(0); // State to track scroll position

    const [pedometerAvailable, setPedometerAvailable] = useState("Checking");
    const [stepCount, setStepCount] = useState(0); // Live step count
    const [pastStepCount, setPastStepCount] = useState(0); // Steps before app opened
    const [calories, setCalories] = useState(1500);

    const blocksData = [
        {
            id: 1,
            color: MyColors(1).gray,
            text: "Steps",
            value: `${stepCount} / 5000`,
        },
        {
            id: 3,
            color: MyColors(1).gray,
            text: "Distance",
            value: 0 + " m",
        },
        {
            id: 4,
            color: MyColors(1).gray,
            text: "Calorie burn",
            value: 100 + " / " + calories,
        },
    ];

    useEffect(() => {
        const initializePedometer = async () => {
            try {
                // Check if Pedometer is available
                const isAvailable = await Pedometer.isAvailableAsync();
                if (!isAvailable) {
                    setPedometerAvailable("Not available");
                    return;
                }

                // Request permissions
                const { status } = await Pedometer.requestPermissionsAsync();
                if (status !== "granted") {
                    setPedometerAvailable("Permission not granted");
                    return;
                }

                setPedometerAvailable("Available");

                if (Platform.OS === "ios") {
                    const startOfDay = new Date();
                    startOfDay.setHours(0, 0, 0, 0);
                    const result = await Pedometer.getStepCountAsync(
                        startOfDay,
                        new Date()
                    );
                    setPastStepCount(result.steps);
                }

                // Start live step count tracking for both iOS and Android
                const subscription = Pedometer.watchStepCount((result) => {
                    setStepCount(result.steps);
                });

                // Cleanup the subscription on unmount
                return () => subscription.remove();
            } catch (e) {
                console.error("Error initializing Pedometer:", e);
            }
        };

        initializePedometer();
    }, []);

    useEffect(() => {
        if (user) {
            if (
                !user?.bodyMetrics ||
                !user?.gender ||
                !user?.activityLevel ||
                !user?.fitnessLevel ||
                !user?.mainGoal ||
                !user?.birthDate ||
                !user?.selectedPlace
            ) {
                setShowModal(true);
            } else {
                setShowModal(false);
            }
            setShowLoadingScreen(false);
        }
    }, [user]);

    const handleScroll = (event) => {
        const { x } = event.nativeEvent.contentOffset;
        setScrollPosition(x);
    };

    return (
        <SafeAreaView style={styles.mainContainer}>
            {showAlert && (
                <CustomAlert
                    message={"Do you want to save the changes?"}
                    cancelText={"No"}
                    acceptText={"Yes"}
                />
            )}
            <CustomHeader title={"Home"} />
            {showLoadingScreen && (
                <Modal>
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: MyColors(1).black,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <View style={{ height: HP(8) }}>
                            <Loading />
                        </View>
                    </View>
                </Modal>
            )}
            <ScrollView style={styles.container}>
                <Banner user={user} />
                <View style={styles.divider}>
                    <Text style={styles.label}>Your activities:</Text>
                </View>

                <View
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Animated.FlatList
                        data={blocksData}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                        contentContainerStyle={{
                            justifyContent: "space-between",
                            width: WP(92) + 1,
                        }}
                        renderItem={({ item, index }) => (
                            <Blocks
                                item={item}
                                length={blocksData.length}
                                scrollPosition={scrollPosition}
                            />
                        )}
                        keyExtractor={(item) => item.id.toString()}
                    />
                </View>

                {showModal && <HWmodal />}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    divider: {
        borderColor: MyColors(1).gray,
        borderTopWidth: 1,
        marginVertical: WP(2),
    },
    container: {
        padding: 10,
        flex: 1,
        borderRadius: 10,
        borderColor: MyColors(1).gray,
        marginVertical: 10,
    },
    mainContainer: {
        flex: 1,
        backgroundColor: MyColors(1).black,
    },
    label: {
        color: MyColors(1).white,
        elevation: 10,
        shadowColor: MyColors(1).green,
        fontSize: WP(4),
        margin: WP(2),
        fontWeight: "bold",
    },
});
