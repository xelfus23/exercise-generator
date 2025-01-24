import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    FlatList,
    Image,
    TouchableOpacity,
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
import NextButtons from "./next";
import styles from "./styles";
import stylesX from "../../auth/authStyles";
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
        next,
        heightOptions,
        weightOptions,
        heightOffsetX,
        weightOffsetX,
        setHeightOffsetX,
        setWeightOffsetX,
    }) => {
        const { width } = Dimensions.get("window");
        const [heightUnit, setHeightUnit] = useState("CM");
        const [weightUnit, setWeightUnit] = useState("KG");
        const [error, setError] = useState(null);
        const isTablet = () => {
            const { height, width } = Dimensions.get("window");
            const aspectRatio = height / width;
            return width >= 600 || aspectRatio < 1.6;
        };

        const itemWidth = isTablet() ? WP(1) : WP(2);
        const snapInterval = itemWidth;
        const centerX = width / 2;
        const heightListRef = useRef(null);
        const weightListRef = useRef(null);

        const [selectedWei, setSelectedWei] = useState(null);
        const [selectedHei, setSelectedHei] = useState(null);

        const test = () => {
            console.log(selectedHei, selectedWei);
        };

        const heightScroll = useCallback(
            (event) => {
                const offset = event.nativeEvent.contentOffset.x;
                setHeightOffsetX(offset);

                let heightIndex = Math.round(
                    (offset + centerX - itemWidth / 2) / snapInterval
                );
                heightIndex = Math.max(
                    0,
                    Math.min(heightIndex, heightOptions.length - 1)
                );

                setSelectedHei(
                    parseFloat(heightOptions[heightIndex].value - (isTablet() ? 1 : 0.4)).toFixed(1)
                );
            },
            [
                centerX,
                heightOptions,
                itemWidth,
                snapInterval,
                setHeightOffsetX,
                setSelectedHei,
            ]
        );

        const weightScroll = useCallback(
            (event) => {
                const offset = event.nativeEvent.contentOffset.x;
                setWeightOffsetX(offset);

                let weightIndex = Math.round(
                    (offset + centerX - itemWidth / 2) / snapInterval
                );
                weightIndex = Math.max(
                    0,
                    Math.min(weightIndex, weightOptions.length - 1)
                );

               setSelectedWei(
                    parseFloat(weightOptions[weightIndex].value - (isTablet() ? 1 : 0.4)).toFixed(1)
                );
            },
            [
                centerX,
                weightOptions,
                itemWidth,
                snapInterval,
                setWeightOffsetX,
                setSelectedWei,
            ]
        );

        const getItemLayout = useCallback(
            (data, index) => ({
                length: itemWidth,
                offset: itemWidth * index,
                index,
            }),
            [itemWidth]
        );

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
            });
            next(1);
        };

        const backButton = () => {
            setSelectedHeightAndWeight({
                height: selectedHei,
                weight: selectedWei,
                heightUnit: heightUnit,
                weightUnit: weightUnit,
            });
            next(-1);
        };

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

        useEffect(() => {
            if (heightListRef?.current && selectedHeightAndWeight?.height) {
                heightListRef?.current.scrollToOffset({
                    offset: initialHeightIndex * itemWidth,
                    animated: false,
                });
            }
            if (weightListRef?.current && selectedHeightAndWeight?.weight) {
                weightListRef?.current.scrollToOffset({
                    offset: initialWeightIndex * itemWidth,
                    animated: false,
                });
            }
        }, [
            heightListRef,
            weightListRef,
            initialHeightIndex,
            initialWeightIndex,
            itemWidth,
            selectedHeightAndWeight,
        ]);

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
                                            ref={heightListRef}
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
                                            initialScrollIndex={
                                                initialHeightIndex
                                            }
                                            renderItem={({ item, index }) => (
                                                <RenderItemHeight
                                                    value={item}
                                                    index={index}
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
                                            ref={weightListRef}
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
                                            initialScrollIndex={
                                                initialWeightIndex
                                            }
                                            renderItem={({ item, index }) => (
                                                <RenderItemWeight
                                                    value={item}
                                                    index={index}
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

                <TouchableOpacity
                    onPress={test}
                    style={{
                        backgroundColor: MyColors(1).green,
                        margin: HP(2),
                        padding: HP(2),
                    }}
                >
                    <Text>Test</Text>
                </TouchableOpacity>

                <NextButtons
                    handleSubmit={handleSubmit}
                    error={error}
                    back={backButton}
                />
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
