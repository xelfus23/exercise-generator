import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    FlatList,
    Image,
    TouchableOpacity,
    Animated,
} from "react-native";
import React, {
    useState,
    useEffect,
    useRef,
    useCallback,
    useMemo,
} from "react";
import {
    heightPercentageToDP as HP,
    widthPercentageToDP as WP,
} from "react-native-responsive-screen";
import { MyColors } from "@/constants/myColors";
import Loading from "../../../../components/customs/loading";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign } from "@expo/vector-icons";
import styles from "./styles";
import stylesX from "../../auth/authStyles";
import LottieView from "lottie-react-native";
const LoginRegisterStyle = stylesX.LoginRegisterStyle;

const RenderItemHeight = React.memo(({ value, index, itemWidth }) => {
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
                {value?.value?.split(".").length > 1 && index % 10 === 0
                    ? Math.floor(value.value)
                    : ""}
            </Text>
        </View>
    );
});

const RenderItemWeight = React.memo(({ value, index, itemWidth }) => {
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
                <Text style={heightAndWeightStyles(value, index).lines}>|</Text>
            </View>
            <Text style={heightAndWeightStyles(value, index).label}>
                {value?.value?.split(".").length > 1 && index % 10 === 0
                    ? Math.floor(value.value)
                    : ""}
            </Text>
        </View>
    );
});
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const HeightAndWeight = React.memo(
    ({
        setSelectedHeightAndWeight,
        selectedHeightAndWeight,
        heightOptions,
        weightOptions,
        heightOffsetX,
        weightOffsetX,
        setHeightOffsetX,
        setWeightOffsetX,
        scrollY,
        setIndex,
    }) => {
        const { width } = Dimensions.get("window");
        const [heightUnit, setHeightUnit] = useState("CM");
        const [weightUnit, setWeightUnit] = useState("KG");
        const [error, setError] = useState(null);
        const [isSubmitted, setSubmitted] = useState(false);
        const isTablet = () => {
            const { height, width } = Dimensions.get("window");
            const aspectRatio = height / width;
            return width >= 600 || aspectRatio < 1.6;
        };
        const fadeAnimationOpacity = useRef(new Animated.Value(1)).current;

        const itemWidth = isTablet() ? WP(1) : WP(2);
        const snapInterval = itemWidth;
        const centerX = width / 2;
        const heightListRef = useRef(null);
        const weightListRef = useRef(null);

        const AnimatedTouchableOpacity =
            Animated.createAnimatedComponent(TouchableOpacity);

        const heightScroll = useCallback(
            (event) => {
                const offset = event.nativeEvent.contentOffset.x;
                let heightIndex = Math.round(
                    (offset + centerX - itemWidth / 2) / snapInterval
                );
                heightIndex = Math.max(
                    0,
                    Math.min(heightIndex, heightOptions.length - 1)
                );
                setSelectedHeightAndWeight((prev) => ({
                    ...prev,
                    height: parseFloat(
                        heightOptions[heightIndex].value -
                            (isTablet() ? 1 : 0.4)
                    ).toFixed(1),
                    heightUnit: heightUnit,
                }));
            },
            [centerX, heightOptions, itemWidth, snapInterval, setHeightOffsetX]
        );

        const weightScroll = useCallback(
            (event) => {
                const offset = event.nativeEvent.contentOffset.x;
                let weightIndex = Math.round(
                    (offset + centerX - itemWidth / 2) / snapInterval
                );
                weightIndex = Math.max(
                    0,
                    Math.min(weightIndex, weightOptions.length - 1)
                );
                setSelectedHeightAndWeight((prev) => ({
                    ...prev,
                    weight: parseFloat(
                        weightOptions[weightIndex].value -
                            (isTablet() ? 1 : 0.4)
                    ).toFixed(1),
                    weightUnit: weightUnit,
                }));
            },
            [centerX, weightOptions, itemWidth, snapInterval, setWeightOffsetX]
        );

        const getItemLayout = useCallback(
            (data, index) => ({
                length: itemWidth,
                offset: itemWidth * index,
                index,
            }),
            [itemWidth]
        );

        const findInitialIndex = useCallback((options, selectedValue) => {
            if (selectedValue) {
                const foundIndex = options.findIndex(
                    (item) =>
                        parseFloat(item.value) === parseFloat(selectedValue)
                );
                return foundIndex === -1 ? 0 : foundIndex;
            }
            return 0;
        }, []);

        const initialHeightIndex = useMemo(
            () =>
                findInitialIndex(
                    heightOptions,
                    selectedHeightAndWeight?.height
                ),
            [heightOptions, selectedHeightAndWeight?.height, findInitialIndex]
        );
        const initialWeightIndex = useMemo(
            () =>
                findInitialIndex(
                    weightOptions,
                    selectedHeightAndWeight?.weight
                ),
            [weightOptions, selectedHeightAndWeight?.weight, findInitialIndex]
        );

        const handleNext = () => {
            if (
                !selectedHeightAndWeight?.height &&
                !selectedHeightAndWeight?.weight
            ) {
                setError("Please select a valid height and weight");
                setTimeout(() => {
                    setError(null);
                }, 5000);
            } else {
                fadeAnimation();
            }
        };

        const fadeAnimation = () => {
            Animated.timing(fadeAnimationOpacity, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true,
            }).start(() => {
                setSubmitted(true);
                setIndex(4);
            });
        };

        useEffect(() => {
            console.log(
                `Height: ${selectedHeightAndWeight?.height} Weight: ${selectedHeightAndWeight?.weight}`
            );
        }, [selectedHeightAndWeight]);

        const moveScroll = scrollY.interpolate({
            inputRange: [2700, 4000],
            outputRange: [0, 1000],
            extrapolate: "clamp",
        });

        const scrollIconOpacity = scrollY.interpolate({
            inputRange: [2800, 4600],
            outputRange: [1, 0], // Start at 0 and fade out
            extrapolate: "clamp",
        });

        const fadeOutOpacity = scrollY.interpolate({
            inputRange: [1700, 2400],
            outputRange: [1, 0],
            extrapolate: "clamp",
        });

        return (
            <View
                style={{
                    height: HP(100),
                    width: WP(100),
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <View style={{ width: WP(90), marginBottom: HP(3) }}>
                    {!isSubmitted ? (
                        <Animated.Text
                            style={{
                                fontSize: HP(2),
                                color: MyColors(0.8).white,
                                textAlign: "center",
                                opacity: fadeAnimationOpacity,
                            }}
                        >
                            Select your{" "}
                            <Text
                                style={{
                                    fontWeight: "bold",
                                    color: MyColors(1).green,
                                    textShadowRadius: HP(1.2),
                                    textShadowColor: MyColors(1).green,
                                }}
                            >
                                height
                            </Text>{" "}
                            and{" "}
                            <Text
                                style={{
                                    fontWeight: "bold",
                                    color: MyColors(1).green,
                                    textShadowRadius: HP(1.2),
                                    textShadowColor: MyColors(1).green,
                                }}
                            >
                                weight
                            </Text>
                        </Animated.Text>
                    ) : (
                        <Text
                            style={{
                                fontSize: HP(2),
                                color: MyColors(0.8).white,
                                textAlign: "center",
                            }}
                        >
                            Keep{" "}
                            <Text
                                style={{
                                    fontWeight: "bold",
                                    color: MyColors(1).green,
                                    textShadowRadius: HP(1.2),
                                    textShadowColor: MyColors(1).green,
                                }}
                            >
                                scrolling
                            </Text>
                        </Text>
                    )}
                </View>

                {!isSubmitted && (
                    <>
                        <Animated.View
                            style={{
                                borderRadius: WP(4),
                                width: WP(90),
                                alignItems: "center",
                                justifyContent: "center",
                                padding: HP(4),
                                gap: HP(2),
                                opacity: fadeAnimationOpacity,
                            }}
                        >
                            {weightOptions && heightOptions ? (
                                <View style={{ gap: HP(3) }}>
                                    <View>
                                        <View style={{ width: WP(80) }}>
                                            <Text
                                                style={{
                                                    color: MyColors(0.8).white,
                                                    fontSize: HP(2),
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                Height in{" "}
                                                <Text
                                                    style={{
                                                        color: MyColors(1)
                                                            .green,
                                                        textShadowColor:
                                                            MyColors(1).green,
                                                        textShadowRadius: HP(1),
                                                    }}
                                                >
                                                    centimeters
                                                </Text>
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
                                                    MyColors(0.1).green,
                                                    MyColors(1).black,
                                                ]}
                                                locations={[0, 0.49, 0.51, 1]}
                                                start={{ x: 0, y: 1 }}
                                                end={{ x: 1, y: 1 }}
                                                style={{
                                                    height: HP(8),
                                                    overflow: "hidden",
                                                    borderTopWidth: 1,
                                                    borderBottomWidth: 1,
                                                    borderColor:
                                                        MyColors(0.2).gray,
                                                }}
                                            >
                                                <LinearGradient
                                                    style={{
                                                        position: "absolute",
                                                        right: 0,
                                                        top: 0,
                                                        bottom: 0,
                                                        width: WP(20),
                                                        zIndex: 100,
                                                    }}
                                                    pointerEvents="none"
                                                    start={{ x: 1, y: 1 }}
                                                    end={{ x: 0, y: 0 }}
                                                    colors={[
                                                        MyColors(1).black,
                                                        "transparent",
                                                    ]}
                                                />
                                                <LinearGradient
                                                    style={{
                                                        position: "absolute",
                                                        left: 0,
                                                        top: 0,
                                                        bottom: 0,
                                                        width: WP(20),
                                                        zIndex: 100,
                                                    }}
                                                    pointerEvents="none"
                                                    start={{ x: 0, y: 0 }}
                                                    end={{ x: 1, y: 1 }}
                                                    colors={[
                                                        MyColors(1).black,
                                                        "transparent",
                                                    ]}
                                                />
                                                <FlatList
                                                    ref={heightListRef}
                                                    data={heightOptions}
                                                    horizontal
                                                    snapToInterval={itemWidth}
                                                    decelerationRate={"fast"}
                                                    onMomentumScrollEnd={
                                                        heightScroll
                                                    }
                                                    contentContainerStyle={{
                                                        justifyContent:
                                                            "center",
                                                    }}
                                                    getItemLayout={
                                                        getItemLayout
                                                    }
                                                    showsHorizontalScrollIndicator={
                                                        false
                                                    }
                                                    style={{
                                                        width: isTablet()
                                                            ? WP(81)
                                                            : WP(83.5),
                                                    }}
                                                    initialScrollIndex={
                                                        initialHeightIndex
                                                    }
                                                    renderItem={({
                                                        item,
                                                        index,
                                                    }) => (
                                                        <RenderItemHeight
                                                            value={item}
                                                            index={index}
                                                            itemWidth={
                                                                itemWidth
                                                            }
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
                                                    color: MyColors(0.8).white,
                                                    fontSize: HP(2),
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                Weight in{" "}
                                                <Text
                                                    style={{
                                                        color: MyColors(1)
                                                            .green,
                                                        textShadowColor:
                                                            MyColors(1).green,
                                                        textShadowRadius: HP(1),
                                                    }}
                                                >
                                                    kilograms
                                                </Text>
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
                                                    MyColors(0.1).green,
                                                    MyColors(1).black,
                                                ]}
                                                locations={[0, 0.49, 0.51, 1]}
                                                start={{ x: 0, y: 1 }}
                                                end={{ x: 1, y: 1 }}
                                                style={{
                                                    height: HP(8),
                                                    borderTopWidth: 1,
                                                    borderBottomWidth: 1,
                                                    borderColor:
                                                        MyColors(0.2).gray,
                                                    overflow: "hidden",
                                                }}
                                            >
                                                <LinearGradient
                                                    style={{
                                                        position: "absolute",
                                                        right: 0,
                                                        top: 0,
                                                        bottom: 0,
                                                        width: WP(20),
                                                        zIndex: 100,
                                                    }}
                                                    pointerEvents="none"
                                                    start={{ x: 1, y: 1 }}
                                                    end={{ x: 0, y: 0 }}
                                                    colors={[
                                                        MyColors(1).black,
                                                        "transparent",
                                                    ]}
                                                />
                                                <LinearGradient
                                                    style={{
                                                        position: "absolute",
                                                        left: 0,
                                                        top: 0,
                                                        bottom: 0,
                                                        width: WP(20),
                                                        zIndex: 100,
                                                    }}
                                                    pointerEvents="none"
                                                    start={{ x: 0, y: 0 }}
                                                    end={{ x: 1, y: 1 }}
                                                    colors={[
                                                        MyColors(1).black,
                                                        "transparent",
                                                    ]}
                                                />
                                                <FlatList
                                                    ref={weightListRef}
                                                    data={weightOptions}
                                                    horizontal
                                                    snapToInterval={itemWidth}
                                                    decelerationRate={"fast"}
                                                    onMomentumScrollEnd={
                                                        weightScroll
                                                    }
                                                    contentContainerStyle={{
                                                        justifyContent:
                                                            "center",
                                                    }}
                                                    getItemLayout={
                                                        getItemLayout
                                                    }
                                                    showsHorizontalScrollIndicator={
                                                        false
                                                    }
                                                    style={{
                                                        width: isTablet()
                                                            ? WP(81)
                                                            : WP(83.5),
                                                    }}
                                                    initialScrollIndex={
                                                        initialWeightIndex
                                                    }
                                                    renderItem={({
                                                        item,
                                                        index,
                                                    }) => (
                                                        <RenderItemWeight
                                                            value={item}
                                                            index={index}
                                                            itemWidth={
                                                                itemWidth
                                                            }
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
                        </Animated.View>

                        {error && !isSubmitted && (
                            <Text
                                style={[
                                    LoginRegisterStyle.error,
                                    { marginTop: HP(2) },
                                ]}
                            >
                                {error}
                            </Text>
                        )}

                        <View style={{ height: HP(6), borderWidth: 1 }}>
                            {!isSubmitted &&
                            selectedHeightAndWeight?.height &&
                            selectedHeightAndWeight?.weight ? (
                                <AnimatedTouchableOpacity
                                    onPress={handleNext}
                                    style={{
                                        // backgroundColor: MyColors(1).gray,
                                        borderWidth: 1,
                                        borderColor: MyColors(1).green,
                                        borderRadius: WP(4),
                                        width: WP(60),
                                        alignItems: "center",
                                        justifyContent: "center",
                                        height: HP(6),
                                        opacity: fadeAnimationOpacity,
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: HP(2),
                                            color: MyColors(1).white,
                                            fontWeight: "bold",
                                        }}
                                    >
                                        Submit
                                    </Text>
                                </AnimatedTouchableOpacity>
                            ) : (
                                isSubmitted &&
                                selectedHeightAndWeight?.height &&
                                selectedHeightAndWeight?.weight && (
                                    <Animated.View
                                        style={{
                                            alignItems: "center",
                                            justifyContent: "center",
                                            height: HP(15),
                                            transform: [
                                                { translateY: moveScroll },
                                            ],
                                            opacity: scrollIconOpacity,
                                            borderWidth: 1
                                        }}
                                    >
                                        <LottieView
                                            source={require("@/assets/json/scrolldown.json")}
                                            autoPlay
                                            loop
                                            style={{
                                                height: "100%",
                                                aspectRatio: 1,
                                                zIndex: 1000,
                                            }}
                                        />
                                    </Animated.View>
                                )
                            )}
                        </View>
                    </>
                )}
            </View>
        );
    }
);

export default HeightAndWeight;

const heightAndWeightStyles = (value, index) =>
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
        },
        label: {
            color: MyColors(0.8).white,
            fontSize: index % 10 === 0 ? HP(1.4) : HP(1.3),
            width: WP(6),
            textAlign: "center",
        },
    });
