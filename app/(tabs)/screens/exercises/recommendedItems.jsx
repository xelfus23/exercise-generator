import { ImageBackground, View, Text, TouchableOpacity } from "react-native";
import {
    heightPercentageToDP as HP,
    widthPercentageToDP as WP,
} from "react-native-responsive-screen";
import { MyColors } from "../../../../constants/myColors";
import Ztyles from "./styles";
import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

const styles = Ztyles.Xtyles
const levelStyles = Ztyles.levelStyles

export default RecommendedItems = ({ item, index, setSelectedItem }) => {
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

                <Text style={styles.itemDescription}>{exe?.description}</Text>
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
                        Completed
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
