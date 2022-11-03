import React, { useRef, useState, useEffect, useContext } from "react";
import { Image, Animated, StyleSheet, Text, View } from "react-native";
import Layout from "../../constants/Layout";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { coinlist } from "../../components/request";
import { ContextVal } from "../../components/Variables";
import { useNavigation } from "@react-navigation/native";

//
const { height, width } = Layout.window;
export const AuthScreen = (props) => {
  const { user, setuser, coinList, setCoinList } = useContext(ContextVal);
  const [coins, setcoins] = useState([]);
  const [isSet, setisSet] = useState(false);
  //interceptor
  coinlist.interceptors.response.use(
    function (response) {
      // Any status code that lie within the range of 2xx cause this function to trigger
      // console.log(`response.status`, response.status)
      return response;
    },
    function (error) {
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      // Do something with response error

      const originalRequest = error.config;
      if (!error.response) {
        // showMessage({
        //   message: "Network error",
        //   description: "We seem to be having technical difficulties",
        //   type: "danger",
        //   duration: 6000,
        // });
        return Promise.reject("Network Error");
      }
      // console.log(`originalRequest`, originalRequest);
      // else if ((error.response.status === 401) && !originalRequest._retry) {
      //     originalRequest._retry = true;
      //     return AuthService.getToken()
      //         .then(token => {
      //             const authTokenResponse = path(['data', 'response'], token)
      //             AxiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + authTokenResponse;
      //             originalRequest.headers['Authorization'] = 'Bearer ' + authTokenResponse;
      //             return axios(originalRequest);
      //         })
      //         .catch(err => err)
      if (error.response.status == 401) {
        const x = async () => {
          // await AsyncStorage.removeItem("loggedIn");
          // console.log(`nav`, originalRequest)
          // props.navigation.navigate("SignIn")
        };
        x();
        showMessage({
          message: "Session has expired",
          description: "Please login",
          type: "danger",
          duration: 6000,
        });
      }
      return Promise.reject(error);
    }
  );

  //pull coin data

  //declare variables
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fadeIn();
  }, []);

  const navigation = useNavigation();

  const fadeIn = async () => {
    // Will change fadeAnim value to 1 in 5 seconds
    try {
      const data = await AsyncStorage.getItem("loggedIn");
      const parsedStr = JSON.parse(data);
      console.log("parsedStr", parsedStr);
      setuser(parsedStr);
      // await AsyncStorage.removeItem("loggedIn");
      // navigation.navigate("Login");
      Animated.loop(
        Animated.sequence([
          Animated.delay(300),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 100,
            useNativeDriver: false,
          }),
        ]),
        {
          iterations: 3,
        }
      ).start(({ finished }) => {
        //   console.log(`datad`, Object.keys(user).length === 0);
        console.log("isSet", isSet);
        if (parsedStr) {
          props.navigation.navigate("Home");
        } else {
          props.navigation.navigate("Welcome");
        }
      });
    } catch (error) {
      console.log(`error`, error);
    }
  };
  return (
    <View lightColor="#FBF3DA" style={styles.container}>
      <Animated.View
        style={[
          styles.logo,
          {
            transform: [
              {
                scale: fadeAnim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [1, 0.5, 1],
                }),
              },
            ],
          },
        ]}
      >
        <Image
          style={{ height: 100, width: 100 }}
          source={require("../../assets/images/icon.png")}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: height,
    width: width,
    backgroundColor: "#fff",
  },
  logo: {
    marginTop: height / 2,
    justifyContent: "space-around",
    alignItems: "center",
  },
});

export default AuthScreen;
