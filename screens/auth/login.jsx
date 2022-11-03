import React, { useContext, useState } from "react";
// import * as Notifications from "expo-notifications";
import {
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  KeyboardAvoidingView,
  Animated,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import * as Constants from "expo-constants";
// import { View, Text } from "../../components/Themed";
import Textnput from "../../components/textnput";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import Layout from "../../constants/Layout";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import { showMessage, hideMessage } from "react-native-flash-message";
import { useEffect } from "react";
import * as LocalAuthentication from "expo-local-authentication";
import { strongRegex, validateEmail, weakRegex } from "../../components/helper";
import { useRef } from "react";
// import * as Network from "expo-network";

import { ContextVal } from "../../components/Variables";
import { showMessage } from "react-native-flash-message";

const { height, width, topMargin } = Layout.window;

export const Login = (props) => {
  useEffect(() => {
    bioCheck();
    setuser({
      email: "Test@test.com",
      name: "Edmund",
      password: "Test@123",
    });
  }, [props]);

  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [view, setview] = useState(true);
  const [hasFingerPrint, sethasFingerPrint] = useState(false);
  const [bioEnrolled, setbioEnrolled] = useState(false);
  const [validemail, setvalidemail] = useState(true);
  const [validpassword, setvalidpassword] = useState(null);
  const [ip, setip] = useState("");
  const [ptoken, setptoken] = useState();
  const [accessToken, setAccessToken] = React.useState();

  props.navigation.addListener("beforeRemove", (e) => {
    // Prevent default behavior of leaving the screen
    if (e.data.action.type == "GO_BACK") {
      e.preventDefault();
      console.log("e", e);
    }
    // Prompt the user before leaving the screen
  });

  const fadeAnim = useRef(new Animated.Value(1)).current;

  const { user, setuser } = useContext(ContextVal);
  const fadeIn = async () => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(800),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: false,
        }),
      ]),
      {
        iterations: 5,
      }
    ).start();
  };

  const login = async () => {
    fadeIn();
    if (password != "" && email != "") {
      setvalidemail(true);
      setvalidpassword(true);

      if (!password.match(weakRegex)) {
        setvalidpassword(false);
        showMessage({
          message: "Password Security",
          description:
            "Password must contain a capital letter,special character and number",
          type: "danger",
        });
        return false;
      }

      if (!validateEmail(email)) {
        setvalidpassword(false);
        showMessage({
          message: "Email Security",
          description: "Email format is incorrect",
          type: "danger",
        });
      }
      console.log("first", email, user.email, password, user.password);
      if (email == user.email && password == user.password) {
        await AsyncStorage.setItem("loggedIn", JSON.stringify(user));
        props.navigation.navigate("Home");
      } else {
        props.navigation.navigate("Login");
      }

      // await AsyncStorage.setItem("loggedIn", JSON.stringify(data));
    }
  };

  const bioCheck = async () => {
    await LocalAuthentication.isEnrolledAsync().then((res) =>
      setbioEnrolled(res)
    );
    if (LocalAuthentication.hasHardwareAsync()) {
      LocalAuthentication.supportedAuthenticationTypesAsync().then((res) => {
        if (res.length > 0 && bioEnrolled) {
          sethasFingerPrint(true);
          return true;
        } else if (res.length < 0 && bioEnrolled == false) {
          showMessage({
            message: "Kindly enroll your biometrics",
            description: "No biometric data",
            type: "danger",
          });
          return false;
        }
      });
    }
  };

  const bioLogin = async () => {
    const userinfo = user;
    if (bioCheck()) {
      const validate = await LocalAuthentication.authenticateAsync({
        fallbackLabel: "use your login credential instead",
      });
      console.log(`validate`, validate);
      if (validate.success) {
        setuser(userinfo);
        props.navigation.navigate("Home");
      } else {
        showMessage({
          message: "Unable to validate biometric data",
          description: "something went wrong",
          type: "danger",
        });
      }
    }
  };

  //
  return (
    <View
      testID="login-page"
      style={styles.container}
      lightColor="#FBF3DA"
      darkColor="#00000080"
    >
      <StatusBar networkActivityIndicatorVisible={false} />
      <View
        lightColor="#FBF3DA"
        style={{
          marginTop: topMargin * 3,
          alignItems: "center",
          width: width,
          height: height,
        }}
      >
        <KeyboardAvoidingView style={styles.modalView}>
          <View lightColor="#FBF3DA" darkColor="#00000080" style={styles.title}>
            <Animated.Image
              style={{ height: 50, width: 50, opacity: fadeAnim }}
              height={100}
              width={200}
              source={require("../../assets/images/icon.png")}
            />
            <Text style={styles.textTitle}> Welcome To CoinList</Text>

            <View style={styles.textInput}>
              <Textnput
                testID={"emailField"}
                textContentType={"emailAddress"}
                autoCapitalize={"none"}
                onChangeText={(text) => setemail(text.trim())}
                placeholder="email"
                valid={validemail}
                textAlign={"left"}
                style={{ width: width - 50 }}
              />
              <Ionicons
                name="mail"
                size={24}
                color="#B7B7B7"
                style={styles.icons}
              />
            </View>
            <View style={styles.textInput}>
              <Textnput
                testID={"passwordField"}
                textContentType={"password"}
                autoCapitalize={"none"}
                secureTextEntry={view}
                onChangeText={(text) => setpassword(text.trim())}
                placeholder="password"
                valid={validpassword}
                textAlign={"left"}
                style={{ width: width - 50 }}
              />
              <View
                style={{
                  backgroundColor: "transparent",
                  position: "absolute",
                  right: 10,
                  padding: "5%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TouchableOpacity
                  hitSlop={{ top: 20, left: 20, right: 20 }}
                  onPress={() => setview(!view)}
                >
                  <Ionicons
                    name={view ? "lock-closed" : "lock-open"}
                    size={24}
                    color="#B7B7B7"
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.textInput}></View>
            <View
              lightColor="#FBF3DA"
              style={[
                styles.textInput,
                { flexDirection: "row", width: width, padding: 5 },
              ]}
            >
              <View style={{ flexDirection: "row" }}></View>
              <TouchableOpacity
                testID="login-button"
                onPress={() =>
                  showMessage({
                    message: "Forgot Password",
                    description: "Not available at the moment",
                    type: "danger",
                  })
                }
              >
                <Text style={[styles.textForgot]}> Forgotten password ?</Text>
              </TouchableOpacity>
            </View>
          </View>

          {hasFingerPrint && (
            <View>
              <TouchableOpacity
                style={{
                  marginTop: "5%",
                  width: width,
                  height: height / 8,
                  padding: 5,

                  justifyContent: "space-around",
                  alignItems: "center",
                }}
                onPress={() => bioLogin()}
              >
                <Ionicons name="finger-print" size={50} color="black" />
              </TouchableOpacity>
            </View>
          )}
          <View
            lightColor="#FBF3DA"
            style={{
              width: width,
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={{
                marginTop: "5%",
                width: width - 50,
                height: 50,
                borderRadius: 15,
                padding: 5,
                backgroundColor: "#22567E",
                justifyContent: "space-around",
                alignItems: "center",
                borderWidth: 0.5,
              }}
              onPress={() => login()}
            >
              <Text style={{ color: "#fff" }}>Continue</Text>
            </TouchableOpacity>
            {/* <View lightColor='#FBF3DA' style={{flexDirection:'row',width:width-100,height:50, justifyContent: 'space-around', alignItems:'center'}}>
                        <View lightColor='#000' style={{width:width/3,backgroundColor:'gray',height:1}}/>
                        <Text style={{color:'#000'}}>OR</Text>
                        <View lightColor='#000' style={{width:width/3,backgroundColor:'gray',height:1}}/>

                      </View>
                    <TouchableOpacity style={{marginTop:'5%', width: width-50, height:50, borderRadius:15, padding:5, backgroundColor:'#fff', justifyContent:'space-around',alignItems:'center'}} onPress={()=> signInAsync() } >
                      <Text style={{color:'#000'}}>Login with Google</Text></TouchableOpacity> */}
            <View
              lightColor="#FBF3DA"
              style={{
                flexDirection: "row",
                width: width - 100,
                height: 50,
                alignItems: "center",
              }}
            >
              <Text style={styles.title}> Don't have an account? </Text>
              <TouchableOpacity
                hitSlop={{ top: 20, left: 20, right: 20 }}
                onPress={() => {
                  showMessage({
                    message: "Create account",
                    description: "Not available at the moment",
                    type: "danger",
                  });
                }}
              >
                <Text style={[styles.title, { color: "#CC4F15" }]}>
                  click here
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: height,
    // alignItems:'center',
    width,
  },
  inputContainer: {
    marginTop: "2%",
    height: height - 40,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  icons: {
    position: "absolute",
    right: 10,
    padding: "5%",
  },
  textInput: {
    fontSize: 17,
    lineHeight: 24,
    width: "75%",
    marginTop: "9%",
    // paddingLeft: 5,
    borderRadius: 5,
    alignItems: "center",
    fontFamily: "Lato",
  },
  modalView: {
    width: width,
    height: height,
    //  justifyContent:'center',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  textTitle: {
    fontWeight: "bold",
    fontSize: 20,
    fontFamily: "Lato",
  },
  title: {
    //   marginTop:'10%',
    alignItems: "center",
    fontFamily: "Lato",
  },
  textForgot: {
    color: "#CC4F15",
    fontSize: 13,
    marginTop: 5,
    marginLeft: "5%",
    width: width / 2,
    fontFamily: "Lato",
  },
});
