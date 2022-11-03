import React, { useEffect, useRef } from "react";
import {
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import Layout from "../constants/Layout";

const { height, width } = Layout.window;

export default function Textnput(props) {
  const inp1 = useRef();
  useEffect(() => {
    if (props.clear == true) {
      inp1.current.clear();
    }
  });

  return (
    <KeyboardAvoidingView
      style={[
        styles.container,
        props.valid == null || props.valid == true
          ? { borderRadius: 15 }
          : { borderRadius: 15, borderWidth: 0.5, borderColor: "red" },
      ]}
    >
      <View>
        <TextInput
          testID={props.testID}
          ref={inp1}
          {...props}
          style={[styles.input, props.style]}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
// textAlign={"center"}
const styles = StyleSheet.create({
  container: {
    justifyContent: "space-around",
    alignItems: "center",
  },
  input: {
    borderRadius: 1,

    padding: "5%",
    justifyContent: "space-around",
    width: width - 100,
    backgroundColor: "#F8F8F8",
    // borderColor:'#FF6385'
  },
});
