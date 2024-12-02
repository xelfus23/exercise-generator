import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React from "react";
import {
  widthPercentageToDP as WP,
  heightPercentageToDP as HP,
} from "react-native-responsive-screen";
import { MyColors } from "../../constants/myColors";

export default function CustomAlert({ message, acceptText, cancelText }) {
  return (
    <SafeAreaView
      style={{
        width: WP(100),
        height: HP(100),
        justifyContent: "center",
        alignItems: "center",
        zIndex: 100,
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        position: "absolute",
      }}
    >
      <View
        style={{
          backgroundColor: MyColors(1).gray,
          borderWidth: 1,
          padding: 20,
          borderRadius: 10,
          width: WP(80),
          height: HP(20),
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
        }}
      >
        <View
          style={{
            height: HP(10),
            width: WP(75),
            borderRadius: 10,
            padding: 20,
          }}
        >
          <Text style={{ fontSize: 16, color: MyColors(1).white }}>
            {message}
          </Text>
        </View>

        <View
          style={[
            {
              flexDirection: "row",
              width: WP(80),
              justifyContent: "center",
              gap: 50,
            },
          ]}
        >
          <TouchableOpacity
            style={[{ backgroundColor: MyColors(1).red }, style.Button]}
          >
            <Text style={style.Text}>{cancelText}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[{ backgroundColor: MyColors(1).green }, style.Button]}
          >
            <Text style={style.Text}>{acceptText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  Button: {
    padding: 10,
    borderRadius: 10,
    width: WP(25),
    height: HP(5),
    justifyContent: "center",
    alignItems: "center",
  },
  Text: {
    color: MyColors(1).white,
    fontWeight: "bold",
    fontSize: 16,
  },
});
