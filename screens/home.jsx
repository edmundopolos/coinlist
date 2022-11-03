import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import SearchInput, { createFilter } from "react-native-search-filter";
import Layout from "../constants/Layout";
import * as Constants from "expo-constants";
import { ContextVal } from "../components/Variables";
import { coinlist } from "../components/request";
import { showMessage } from "react-native-flash-message";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const KEYS_TO_FILTERS = ["serial", "brand", "model"];
const { height, width, topMargin } = Layout.window;

export default function Home(props) {
  const KEYS_TO_FILTERS = ["name"];

  const [search, setsearch] = useState("");
  const [coins, setcoins] = useState([]);
  const [isSet, setisSet] = useState(false);
  const { focus, setFocus, coinList, setCoinList } = useContext(ContextVal);
  const nav = useNavigation();

  const filtered = coins.filter(createFilter(search, KEYS_TO_FILTERS));
  var images = {
    eth: require("../assets/images/eth.png"),
    tron: require("../assets/images/tron.png"),
    dash: require("../assets/images/dash.png"),
    btc: require("../assets/images/btc.png"),
    cusb: require("../assets/images/cusb.png"),
    usdt: require("../assets/images/usdt.png"),
    bnb: require("../assets/images/bnb.png"),
    cusd: require("../assets/images/cusd.png"),
    fusb: require("../assets/images/eth.png"),
  };
  useEffect(() => {
    nav.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          testID="menu"
          style={{ marginLeft: 15 }}
          onPress={() => setFocus(true)}
        >
          <Ionicons name="menu" size={20} />
        </TouchableOpacity>
      ),
      title: null,
    });
    coinlist
      .get("/")
      .then((res) => {
        if (res.status == 200) {
          setisSet(true);
          setCoinList(res.data.data.rates);
          const dt = Object.values(res.data.data.rates);
          var imgname = "";
          var name = "";
          dt.forEach((element) => {
            name = element["key"].split("-");
            if (name[1].length > 6) {
              imgname = name[1].split("", 4);
              imgname = imgname.toString().replace(/,/g, "");
            } else {
              imgname = name[1].split("", 3);
              imgname = imgname.toString().replace(/,/g, "");
            }
            element["name"] = name[1];
            // console.log("first", element["name"]);
            element["img"] = images[imgname.toLocaleLowerCase()];
            coins.push(element);
            // console.log("imgname", images[imgname.toLocaleLowerCase()]);
          });
          setCoinList(coins);
        }
      })
      .catch((res) => {
        showMessage({
          message: "Network Issue has occured",
          description: "We are unable to load avialable coins",
          type: "danger",
        });
      });
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.content} key={item.name}>
      <View style={styles.tabs}>
        <View>
          <Image style={styles.image} source={item.img} />
        </View>
        <View style={styles.details}>
          <View>
            <Text style={[styles.ttext2]}>Coin: {item.name}</Text>
            <Text style={[styles.ttext2]}>Rate: {item.rate}</Text>
          </View>
        </View>
      </View>
    </View>
  );
  return (
    <View
      testID="homepage"
      style={styles.container}
      darkColor={"rgba(255,255,255,0.1)"}
    >
      <View style={{ justifyContent: "space-around" }}>
        {isSet == true ? (
          <>
            <SearchInput
              testID="searchField"
              onChangeText={(term) => {
                setsearch(term);
              }}
              style={styles.searchInput}
              placeholder="search for missing items"
            />
            <View style={{ marginTop: topMargin }}>
              <FlatList
                data={filtered}
                renderItem={renderItem}
                keyExtractor={(item) => item.name}
                // extraData={selectedId}
              />
            </View>
          </>
        ) : (
          <ActivityIndicator size={"large"} color={"blue"} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  searchInput: {
    padding: 10,
    borderColor: "#CCC",
    borderRadius: 10,
    borderWidth: 1,
    width: width - 20,
    marginTop: topMargin,
  },
  tabs: {
    flex: 1,
    width: width / 2.5,
    height: height / 3.6,
    borderWidth: 0.5,
    borderColor: "transparent",
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderTopRightRadius: 15,
    flexDirection: "column",
    elevation: 3,
    marginLeft: 12,
    margin: 5,
    backgroundColor: "#34384f",
    elevation: 3,
    justifyContent: "space-around",
  },
  details: {
    flexDirection: "row",
  },
  ttext2: {
    padding: "1%",
    paddingLeft: "3%",
    fontFamily: "Lato",
    fontSize: 12,
    width: 200,
    color: "#fff",
  },
  image: {
    height: height / 6.5,
    width: width / 2.9,
    margin: 15,
  },
  content: {
    marginTop: topMargin,
    justifyContent: "space-around",
    alignItems: "center",
  },
});
