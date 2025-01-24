import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import {
    heightPercentageToDP as HP,
    widthPercentageToDP as WP,
} from "react-native-responsive-screen";
import { MyColors } from "@/constants/myColors";
import Loading from "../../../../components/customs/loading";

export default function NextButtons({
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
}) {
    const [isError] = useState(error ? true : false);
    return (
        <View
            style={{ alignItems: "center", flexDirection: "row", gap: WP(10) }}
        >
            {!firstIndex && !skip && (
                <TouchableOpacity
                    disabled={isError}
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
                disabled={isError}
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
}
