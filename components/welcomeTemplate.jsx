import React from "react";

import { StyleSheet, Image, Text, View } from "react-native";
import Layout from "../constants/Layout";
// import SvgUri from "expo-svg-uri";

const { height, width } = Layout.window;

export default function WelcomeTemplate(props) {
  return (
    <View style={styles.container}>
      <Image style={styles.img} source={props.png} />

      <View>
        <Text style={styles.title}>{props.text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    justifyContent: "space-around",
    alignItems: "center",
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#c1c1c1",
    justifyContent: "center",
    marginTop: 10,
    alignItems: "center",
    textAlign: "center",
    backgroundColor: "transparent",
  },
  img: {
    width: width / 1.5,
    height: height / 3.5,
    justifyContent: "space-around",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // elevation: 5,
  },
});
