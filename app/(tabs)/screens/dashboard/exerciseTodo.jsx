import {
    View,
    Text,
    Animated,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import React, { useEffect, useRef } from "react";
import {
    widthPercentageToDP as WP,
    heightPercentageToDP as HP,
} from "react-native-responsive-screen";
import { MyColors } from "@/constants/myColors";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "expo-router";

export default function ToDo({ todayExercise }) {
    const navigation = useNavigation();
    const drawerRef = useRef(new Animated.Value(-WP(60)))?.current;
    const isDrawerOpen = useRef(false);
    const toggle = () => {
        Animated.timing(drawerRef, {
            toValue: isDrawerOpen.current ? -WP(60) : 0,
            duration: 500,
            useNativeDriver: true,
        }).start(() => {
            isDrawerOpen.current = !isDrawerOpen.current;
        });
    };

    useEffect(() => {
        if (drawerRef === 0) {
            toggle();
        }
    }, []);
    return (
        <Animated.View
            style={{
                position: "absolute",
                width: WP(60),
                height: HP(65),
                zIndex: 1,
                backgroundColor: MyColors(1).black,
                gap: WP(3),
                borderColor: MyColors(1).gray,
                borderWidth: 1,
                paddingRight: WP(2),
                transform: [{ translateX: drawerRef }],
                marginTop: HP(18),
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                borderRadius: WP(4),
            }}
        >
            <View
                style={{
                    borderColor: MyColors(1).gray,
                    padding: WP(3),
                    gap: WP(3),
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    borderRadius: WP(4),
                    height: HP(64),
                }}
            >
                <Text
                    style={{
                        color: MyColors(1).green,
                        fontWeight: "bold",
                        fontSize: 18,
                    }}
                >
                    Exercise to do today:
                </Text>
                <ScrollView
                    style={{
                        borderWidth: 1,
                        borderColor: MyColors(1).gray,
                        borderRadius: WP(4),
                        backgroundColor: MyColors(0.3).gray,
                        width: "100%",
                    }}
                    bounces={false}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        gap: WP(4),
                        padding: WP(4),
                    }}
                >
                    {todayExercise?.length > 0 ? (
                        todayExercise?.map(
                            (item) =>
                                item?.exercise?.name !== "Rest Day" && (
                                    <View
                                        key={
                                            item?.exercise?.name +
                                            item?.exercise?.key
                                        }
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            gap: WP(2),
                                        }}
                                    >
                                        <AntDesign
                                            name="checkcircleo"
                                            size={24}
                                            color={
                                                item?.exercise?.completed ===
                                                true
                                                    ? MyColors(1).green
                                                    : MyColors(0.3).white
                                            }
                                        />
                                        <Text
                                            style={{
                                                fontSize: 13,
                                                color: MyColors(0.8).white,
                                            }}
                                        >
                                            {item?.exercise?.name}
                                        </Text>
                                    </View>
                                )
                        )
                    ) : (
                        <Text
                            style={{
                                color: MyColors(0.8).white,
                                fontWeight: "bold",
                                fontSize: 14,
                                padding: WP(3),
                                textAlign: "center",
                            }}
                        >
                            You don't have exercise yet please generate
                        </Text>
                    )}
                </ScrollView>
            </View>

            <TouchableOpacity
                onPress={toggle}
                style={{
                    width: WP(4),
                    height: HP(8),
                    position: "absolute",
                    right: -WP(6),
                    top: HP(30),
                    backgroundColor: MyColors(0.5).white,
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    borderRadius: WP(10),
                }}
            />
        </Animated.View>
    );
}
