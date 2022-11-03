import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Animated, { EasingNode } from "react-native-reanimated";
import {
  TapGestureHandler,
  State,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
const { width, height } = Dimensions.get("window");

const {
  Value,
  event,
  block,
  cond,
  eq,
  set,
  Clock,
  startClock,
  stopClock,
  debug,
  timing,
  clockRunning,
  interpolateNode,
  Extrapolate,
} = Animated;

function runTiming(clock, value, dest) {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0),
  };

  const config = {
    duration: 1000,
    toValue: new Value(0),
    easing: EasingNode.inOut(EasingNode.ease),
  };

  return block([
    cond(clockRunning(clock), 0, [
      set(state.finished, 0),
      set(state.time, 0),
      set(state.position, value),
      set(state.frameTime, 0),
      set(config.toValue, dest),
      startClock(clock),
    ]),
    timing(clock, state, config),
    cond(state.finished, debug("stop clock", stopClock(clock))),
    state.position,
  ]);
}
const Welcome = (props) => {
  const buttonOpacity = new Value(1);

  const onStateChange = event([
    {
      nativeEvent: ({ state }) =>
        block([
          cond(
            eq(state, State.END),
            set(buttonOpacity, runTiming(new Clock(), 1, 0))
          ),
        ]),
    },
  ]);

  const buttonY = interpolateNode(buttonOpacity, {
    inputRange: [0, 1],
    outputRange: [100, 0],
    extrapolate: Extrapolate.CLAMP,
  });

  const bgY = interpolateNode(buttonOpacity, {
    inputRange: [0, 1],
    outputRange: [-height / 4, 0],
    extrapolate: Extrapolate.CLAMP,
  });

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
        justifyContent: "flex-end",
        // justifyContent: "space-around",
      }}
    >
      <Animated.View
        style={{
          justifyContent: "space-around",
          alignItems: "center",
          ...StyleSheet.absoluteFill,
          transform: [{ translateY: bgY }],
        }}
      >
        <View style={{ justifyContent: "space-around", alignItems: "center" }}>
          <Text style={{ fontFamily: "Lato", fontWeight: "700", fontSize: 24 }}>
            Welcome To CoinList
          </Text>
          <Image
            source={require("../../assets/images/door.png")}
            style={{ height: 300, width: 300 }}
          />
        </View>
      </Animated.View>
      <View style={{ height: height / 8, justifyContent: "center" }}>
        <GestureHandlerRootView>
          <TapGestureHandler onHandlerStateChange={onStateChange}>
            <Animated.View
              style={{
                ...styles.button,
                opacity: buttonOpacity,
                transform: [{ translateY: buttonY }],
              }}
              testID={"sign-button"}
            >
              <Text style={{ fontSize: 20, fontWeight: "bold", color: "#fff" }}>
                SIGN IN
              </Text>
            </Animated.View>
          </TapGestureHandler>
        </GestureHandlerRootView>
        {/*  */}
      </View>
      <Animated.View
        style={{
          // opacity: buttonOpacity,
          bottom: -80,
          transform: [{ translateY: bgY }],
        }}
      >
        <TouchableOpacity
          style={{ ...styles.button, backgroundColor: "#2E71DC" }}
          onPress={() => props.navigation.navigate("Login")}
          testID={"proceed-button"}
        >
          <Text style={{ fontSize: 20, fontWeight: "bold", color: "white" }}>
            Proceed To Login
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "blue",
    height: 70,
    marginHorizontal: 20,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 5,
  },
});
