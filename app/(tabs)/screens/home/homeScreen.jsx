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
import Banner from "./banner";
import { useNavigation, useRouter } from "expo-router";
import { useSegments } from "expo-router";

export default function HomeScreen() {
    const { user, isLoading, showModal } = useAuth();
    const [showAlert, setShowAlert] = useState(false);
    const [scrollPosition, setScrollPosition] = useState(0); // State to track scroll position
    const [pedometerAvailable, setPedometerAvailable] = useState("Checking");
    const [stepCount, setStepCount] = useState(0); // Live step count
    const [pastStepCount, setPastStepCount] = useState(0); // Steps before app opened
    const [calories, setCalories] = useState(1500);
    const navigation = useNavigation();

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
                setPedometerAvailable("Available");
            } catch (e) {
                console.error("Error initializing Pedometer:", e);
                setPedometerAvailable("Not available");
            }
        };

        initializePedometer();
    }, [user]);

    const handleScroll = (event) => {
        const { x } = event.nativeEvent.contentOffset;
        setScrollPosition(x);
    };

    useEffect(() => {
        if (showModal) {
            navigation.navigate("getDetails");
        }
    }, []);

    const [isTutorial, setIsTutorial] = useState(false);

    return (
        <SafeAreaView style={styles.mainContainer}>
            {showAlert && (
                <CustomAlert
                    message={"Do you want to save the changes?"}
                    cancelText={"No"}
                    acceptText={"Yes"}
                />
            )}
            {isLoading && (
                <Modal
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 101,
                    }}
                >
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

            <CustomHeader title={"Home"} />

            {isTutorial && (
                <View
                    style={{
                        backgroundColor: MyColors(0.5).green,
                        borderRadius: WP(4),
                        position: "absolute",
                        bottom: HP(2),
                        left: WP(10),
                        justifyContent: "center",
                        alignItems: "center",
                        padding: WP(3),
                        borderWidth: 1,
                        borderColor: MyColors(1).green,
                    }}
                >
                    <Text
                        style={{
                            color: MyColors(1).white,
                            textAlign: "center",
                            fontWeight: "bold",
                            fontSize: HP(1.6),
                        }}
                    >
                        Tap to view your dashboard
                    </Text>
                    <View
                        style={{
                            left: 30, // Position it outside the bubble on the right
                            borderLeftWidth: 10,
                            borderLeftColor: MyColors(1).green,
                            position: "absolute",
                            width: 0,
                            height: 0,
                            borderBottomWidth: 5,
                            borderTopColor: "transparent",
                            borderBottomWidth: 10,
                            borderBottomColor: "transparent",
                            bottom: -10,
                        }}
                    />
                    <View
                        style={{
                            left: 20, // Position it outside the bubble on the right
                            borderRightWidth: 10,
                            borderRightColor: MyColors(1).green,
                            position: "absolute",
                            width: 0,
                            height: 0,
                            borderBottomWidth: 5,
                            borderTopColor: "transparent",
                            borderBottomWidth: 10,
                            borderBottomColor: "transparent",
                            bottom: -10,
                        }}
                    />
                </View>
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
