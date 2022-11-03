import React, {
  Component,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Platform,
  Dimensions,
  Animated as Animated2,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Animated, { EasingNode, withSpring } from "react-native-reanimated";

import {
  TapGestureHandler,
  State,
  GestureHandlerRootView,
} from "react-native-gesture-handler";

import { ContextVal } from "../components/Variables";
import NotFoundScreen from "./NotFoundScreen";
import ModalScreen from "./ModalScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Welcome from "./auth/welcome";
import AuthScreen from "./auth/authScreen";
import Login from "./auth/login";
import Home from "./home";
import Layout from "../constants/Layout";
import Navigation from "../navigation";
import { useNavigation } from "@react-navigation/native";
const { height, width } = Dimensions.get("window");
const Stack = createNativeStackNavigator();

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

function runTiming(clock, value, dest, props) {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0),
  };

  const config = {
    duration: 2000,
    toValue: new Value(0),
    easing: Easing.inOut(Easing.ease),
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

const BaseScreen = (props) => {
  const { focus, setFocus } = useContext(ContextVal);
  const [isLoading, setisLoading] = useState(false);
  const scale = useRef(new Animated.Value(1)).current;
  const [isImageFocused, setisImageFocused] = useState(focus);
  const nav = useNavigation();
  useEffect(() => {
    console.log("focus", focus);

    if (focus) {
      Animated2.spring(scale, {
        toValue: 0.8,
        speed: 90,
      });
      //   Animated.spring(scale, {
      //     toValue: 0.8,
      //   }).start();
    } else {
      Animated2.spring(scale, {
        toValue: 1,
        speed: 50,
      });
      //   Animated.spring(scale, {
      //     toValue: 1,
      //   }).start();
    }
  });

  const actionBarY = scale.interpolate({
    inputRange: [0.8, 1],
    outputRange: [9, -10],
  });

  const borderRadius = scale.interpolate({
    inputRange: [0.9, 1],
    outputRange: [30, 0],
  });

  //   dashOpacity = new Value(1);
  const dashX = scale.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1],
    // extrapolate: Extrapolate.CLAMP
  });

  const scaled = {
    transform: [{ scale: scale, translateX: dashX }],
    marginLeft: focus ? width / 1.5 : 0,
  };

  return (
    <GestureHandlerRootView>
      <View
        style={{
          backgroundColor: "#0a2240",
          // marginTop: Layout.window.topMargin,
          height: "100%",
          width: width,
        }}
      >
        <Animated.View
          style={{
            position: "absolute",
            // top: 0,
            right: 0,
            bottom: 0,
            left: actionBarY,
            height: height,
            width: width,
            marginLeft: "20%",
          }}
        >
          <View style={styles.drawer}>
            <TouchableOpacity
              onPress={() => {}}
              style={styles.displayPhoto}
              keyboardHandlingEnabled={true}
            >
              <Ionicons
                size={80}
                color={"#fff"}
                name={Platform.OS === "ios" ? "ios-person" : "md-person"}
                style={styles.options}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.options}>
              <Text style={styles.drawText}>
                <MaterialIcons name="file-upload" size={14} color="white" />
                Update Photo
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.options}
              onPress={async () => {
                await AsyncStorage.removeItem("loggedIn");
                props.navigation.navigate("Auth");
              }}
            >
              <Text style={styles.drawText}>
                <Ionicons name="md-log-out" size={14} color="white" /> Log Out
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {focus ? (
          <TouchableWithoutFeedback
            onPress={() => {
              setFocus(!focus);
            }}
            style={{ height: height, width: width, backgroundColor: "white" }}
          >
            <Animated.View
              style={[
                {
                  marginTop: Layout.window.topMargin,
                  height: height,
                  width,
                  opacity: 0.5,
                  backgroundColor: "white",
                  borderRadius: borderRadius,
                },
                scaled,
              ]}
            >
              <Animated.View
                style={[
                  {
                    height: height - 50,
                    marginTop: 20,
                    marginLeft: 20,
                    width: width,
                    backgroundColor: "white",
                    borderRadius: borderRadius,
                  },
                ]}
              ></Animated.View>
            </Animated.View>
          </TouchableWithoutFeedback>
        ) : (
          <Animated.View
            style={[
              {
                height: "100%",
                width,
                borderRadius: focus ? 15 : 0,
              },
              scaled,
            ]}
          >
            <Navigation />
          </Animated.View>
        )}
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  displayPhoto: {
    fontFamily: "Roboto",
    margin: 5,
    paddingLeft: 10,
    fontSize: 15,
    marginBottom: 10,
    // borderLeftColor:'#fff',
    // borderLeftWidth:5,
    color: "#fff",
    width: width / 2,
    alignItems: "center",
    justifyContent: "space-around",
  },
  drawText: {
    fontFamily: "Roboto",
    margin: 5,
    paddingLeft: 10,
    fontSize: 15,
    // borderLeftColor:'#fff',
    // borderLeftWidth:5,
    color: "#fff",
    width: 200,
  },
  drawer: {
    flex: 1,
    marginTop: 50,
    padding: 15,
    borderColor: "#fff",
    width: width / 3,
    marginRight: 60,
    height: 200,
    width,
    alignItems: "center",
  },
  options: {
    borderColor: "#fff",
    width: width,
    // borderWidth:0.5,
    // borderRadius: 15,
  },
});

export default BaseScreen;
// export default BaseScreen
// style={{
//   position: 'absolute',
//   right: 0,
//   bottom: 0,
//   top:0,
//   height: height+30,
//   width: width,
//   backgroundColor: '#0a2240',
//   // flexDirection: 'row',
//   justifyContent: 'space-around'
// }}
