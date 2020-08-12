import * as React from "react";
import { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Text,
  View,
  StyleSheet,
  Button,
  ScrollView,
  Linking,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
  TextInput,
  Alert,
  RefreshControl,
} from "react-native";
import { Header, SearchBar, Badge } from "react-native-elements";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { SimpleLineIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { createStackNavigator } from "@react-navigation/stack";
// @ts-ignore
import { SliderBox } from "react-native-image-slider-box";
import Markdown from "react-native-easy-markdown";
import { Formik } from "formik";
import axios from "axios";

import host from "../../../host.json";
import HomeDealsScreen from "./HomeDealsScreen";
import HotDealsScreen from "./HotDealsScreen";
import FlashDealsScreen from "./FlashDealsScreen";
import BestDealsScreen from "./BestDealsScreen";
import PopularDealsScreen from "./PopularDealsScreen";
import PinnedDealsScreen from "./PinnedDealsScreen";
import PinnedDealsItem from "../../components/PinnedDealsItem";
import { color } from "react-native-reanimated";

const TopTab = createMaterialTopTabNavigator();

function Search({navigation}) {
  const [searchStr, setSearchStr] = useState("");
  const [deals, setDeals] = useState([]);
  const [offset, setOffset] = useState(0);
  const [isLoadingTopic, setLoadingTopic] = useState(false);
  const [total, setTotal] = useState(0);

  function replaceSpace(str) {
    var res = str.trim().split("");
    var spaceCount = 0, index, i = 0;
    for (i = 0; i < res.length; i++) {
      if (res[i] == " ") ++spaceCount;
    }
    index = res.length + spaceCount * 2;
    for (i = res.length - 1; i >= 0; i--) {
      if (res[i] == " ") {
        res[index - 1] = '0';
        res[index - 2] = '2';
        res[index - 3] = '%'; 
        index = index - 3; 
      } else {
        res[index - 1] = res[i];
        index--; 
      }
    }
    return res.join("");
  }

  function fetchData(off, isLoadmore) {
    var url = host.hostApi + "/topics/search?offset=" + off + "&limit=20&text=" + replaceSpace(searchStr);
    console.log(url);
    fetch(url)
      .then((response) => response.json())
      .then((json) => {setTotal(json.total); return json;})
      .then((json) => formatData(json.topics))
      .then((json) => isLoadmore ? setDeals(deals.concat(json)) : setDeals(json))
      .catch((error) => console.error(error))
      .finally(() => {setLoadingTopic(false); setOffset(off)});
  }

  const formatData = function (data) {
    data.map((e) => {
      e.key = e["_key"];
      if (e.currency) {
        e.currency = e.currency.split(" - ")[0];
      } else e.currency = "";
      if (e.thumb) {
        if (e.thumb[0] == "/") {
          e.thumb = `${host.host}${e.thumb}`;
        }
      } else e.thumb = "";
      if (e.discountPrice)
        e.discountPrice = e.discountPrice
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      if (e.price)
        e.price = e.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return e;
    });
    return data;
  };

  const handleLoadMore = () => {
    if (offset > total) return;
    fetchData(offset + 20, true);
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Details", { tid: item.tid });
        }}
      >
        <PinnedDealsItem item={item}></PinnedDealsItem>
      </TouchableOpacity>
    );
  }

  return (
    <>
      <View style={styles.searchScreenContainer}>
        <View style={styles.searchBarContainer}>
          <Text style={styles.searchBarText}>Nhập từ khóa</Text>
          <View style={styles.searchBar}>
            <TextInput
              style={styles.inputSearch}
              placeholder="Bạn cần tìm gì..."
              onChangeText={text => setSearchStr(text)}
              value={searchStr}
            />
            <SimpleLineIcons 
              style={styles.searchIcon} 
              name="magnifier" size={20} 
              color="#000" 
              onPress={() => {
                setDeals([]);
                setLoadingTopic(true);
                fetchData(0, false);
              }}
            />
          </View>
          <Text style={styles.searchResultText}>Kết quả</Text>
        </View>
        <View style={styles.searchResultContainer}>
          {isLoadingTopic ? (
            <ActivityIndicator />
          ) : (
            <View>
              <FlatList
                data={deals}
                keyExtractor={(item) => item._key}
                onEndReached={handleLoadMore}
                renderItem={renderItem}
                getItemLayout={(data, index) => ({
                  length: 100,
                  offset: 100 * index,
                  index,
                })}
              ></FlatList>
            </View>
          )}
        </View>
      </View>
    </>
  )
}

function Home({navigation}) {
  return (
    <>
      <Header
        leftContainerStyle={{
          flex: 10,
        }}
        centerContainerStyle={{
          flex: 80,
          alignItems: "center"
        }}
        rightContainerStyle={{
          flex: 10,
        }}
        placement="left"
        leftComponent={
          <Image
            source={require("../../assets/dealbee-icon.png")}
            style={{ width: 40, height: 40 }}
          />
        }
        centerComponent={
          { text: 'Dealbee', style: { color: '#fff', fontSize: 20 } }
        }
        rightComponent={{ 
          icon: 'search', 
          color: '#fff', 
          size: 26, 
          onPress: () => {
            navigation.navigate("Search");
          }
        }}
        statusBarProps={{
          barStyle: "light-content",
          translucent: true,
        }}
        containerStyle={{}}
      />

      <TopTab.Navigator
        tabBarOptions={{
          activeTintColor: "#3399ff",
          inactiveTintColor: "grey",
          labelStyle: {
            fontSize: 10,
            textTransform: "none",
          },
          showIcon: true,
          showLabel: false,
        }}
      >
        <TopTab.Screen
          name="HomeDeals"
          component={HomeDealsScreen}
          options={{
            tabBarLabel: "Trang chính",
            tabBarIcon: ({ color }) => (
              <SimpleLineIcons name="layers" size={20} color={color} />
            ),
          }}
        />
        <TopTab.Screen
          name="PinnedDeals"
          component={PinnedDealsScreen}
          options={{
            tabBarLabel: "Được ghim",
            tabBarIcon: ({ color }) => (
              <SimpleLineIcons name="pin" size={20} color={color} />
            ),
          }}
        />
        <TopTab.Screen
          name="HotDeals"
          component={HotDealsScreen}
          options={{
            tabBarLabel: "Hot deals",
            tabBarIcon: ({ color }) => (
              <SimpleLineIcons name="fire" size={20} color={color} />
            ),
          }}
        />
        <TopTab.Screen
          name="FlashDeals"
          component={FlashDealsScreen}
          options={{
            tabBarLabel: "Flash deals",
            tabBarIcon: ({ color }) => (
              <SimpleLineIcons name="energy" size={20} color={color} />
            ),
          }}
        />
        <TopTab.Screen
          name="BestDeals"
          component={BestDealsScreen}
          options={{
            tabBarLabel: "Tốt nhất",
            tabBarIcon: ({ color }) => (
              <SimpleLineIcons name="badge" size={20} color={color} />
            ),
          }}
        />
        <TopTab.Screen
          name="PopularDeals"
          component={PopularDealsScreen}
          options={{
            tabBarLabel: "Phổ biến",
            tabBarIcon: ({ color }) => (
              <SimpleLineIcons name="globe" size={20} color={color} />
            ),
          }}
        />
      </TopTab.Navigator>
    </>
  );
}

function Details({ navigation, route }) {
  const [isLoadingTopic, setLoadingTopic] = useState(true);
  const [item, setItem] = useState();
  const [upvote, setUpvote] = useState(false);
  const [downvote, setDownvote] = useState(false);

  const urlGetTopic = host.hostApi + "/topics/" + route.params.tid;

  useEffect(() => {
    console.log(urlGetTopic);
    fetch(urlGetTopic)
      .then((response) => response.json())
      .then((json) => formatData(json))
      .then((json) => setItem(json))
      .catch((error) => console.error(error))
      .finally(() => setLoadingTopic(false));
  }, []);

  useEffect(() => {
    if (item && global.user) {
      if (item.mainPost.upvotedBy.includes(global.user.uid)) {
        setUpvote(true);
        console.log("setUpvote(true)");
      } else {
        setUpvote(false);
        console.log("setUpvote(false)");
      }
      if (item.mainPost.downvotedBy.includes(global.user.uid)) {
        setDownvote(true);
        console.log("setDownvote(true)");
      } else {
        setDownvote(false);
        console.log("setDownvote(false)");
      }
    }
  }, [item]);

  const formatData = function (data) {
    data.key = data["_key"];
    if (data.currency)
      data.currency = data.currency.split(" - ")[0];
    else data.currency = "";
    if (data.thumb) {
      if (data.thumb[0] == "/") {
        data.thumb = `${host.host}${data.thumb}`;
      }
    } else data.thumb = "";
    if (data.discountPrice)
      data.discountPrice = data.discountPrice
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    if (data.price)
      data.price = data.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    if (!data.upvotes) data.upvotes = 0;
    if (!data.downvotes) data.downvotes = 0;
    data.votes = data.upvotes - data.downvotes;

    return data;
  };

  const [comments, setcomments] = useState([]);
  const [offset, setOffset] = useState(0);
  const [isLoadingComments, setLoadingComments] = useState(true);

  useEffect(() => {
    getComments(0);
  }, []);

  const [totalComment, setTotalComment] = useState();

  function getComments(off) {
    const urlGetComments =
      host.hostApi +
      "/topics/" +
      route.params.tid +
      "/posts?limit=5&offset=" +
      off;
    console.log(urlGetComments);
    fetch(urlGetComments)
      .then((response) => response.json())
      .then((json) => {
        setTotalComment(json.total);
        setcomments(comments.concat(json.posts));
      })
      .catch((error) => console.error(error))
      .finally(() => setLoadingComments(false));
  }

  const handleLoadMore = () => {
    if (offset < totalComment) {
      getComments(offset + 5);
      setOffset(offset + 5);
    }
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [modalCmtVisible, setModalCmtVisible] = useState(false);

  const upvotePressHandler = (pid) => {
    if (!global.isLogined) {
      setModalVisible(true);
    } else {
      if (!upvote) {
        const data = {
          delta: 1,
          uid: global.user.uid,
        };
        axios({
          method: "POST",
          url: host.hostApi + "/posts/" + pid + "/vote",
          headers: {},
          data: data,
        })
          .then(function (response) {
            console.log(response.data);
            var newItem = { ...item };
            newItem.upvotes = response.data.payload.post.upvotes;
            newItem.downvotes = response.data.payload.post.downvotes;
            newItem.votes = response.data.payload.post.votes;
            var index = newItem.mainPost.downvotedBy.indexOf(data.uid);
            if (index > -1) {
              newItem.mainPost.downvotedBy.splice(index, 1);
            }
            newItem.mainPost.upvotedBy.push(data.uid);
            setItem(newItem);
          })
          .catch(function (error) {
            console.log(error);
            console.log(data);
            Alert.alert("Xử lý thất bại !!!");
          });
      } else {
        const data = {
          uid: global.user.uid,
        };
        axios({
          method: "DELETE",
          url: host.hostApi + "/posts/" + pid + "/vote",
          headers: {},
          data: data,
        })
          .then(function (response) {
            console.log(response.data);
            var newItem = { ...item };
            newItem.upvotes = response.data.payload.post.upvotes;
            newItem.downvotes = response.data.payload.post.downvotes;
            newItem.votes = response.data.payload.post.votes;
            var index = newItem.mainPost.upvotedBy.indexOf(data.uid);
            if (index > -1) {
              newItem.mainPost.upvotedBy.splice(index, 1);
            }
            setItem(newItem);
          })
          .catch(function (error) {
            console.log(error);
            Alert.alert("Xử lý thất bại !!!");
          });
      }
    }
  };

  const downvotePressHandler = (pid) => {
    if (!global.isLogined) {
      setModalVisible(true);
    } else {
      if (!downvote) {
        const data = {
          delta: -1,
          uid: global.user.uid,
        };
        axios({
          method: "POST",
          url: host.hostApi + "/posts/" + pid + "/vote",
          headers: {},
          data: data,
        })
          .then(function (response) {
            console.log(response.data);
            var newItem = { ...item };
            newItem.upvotes = response.data.payload.post.upvotes;
            newItem.downvotes = response.data.payload.post.downvotes;
            newItem.votes = response.data.payload.post.votes;
            var index = newItem.mainPost.upvotedBy.indexOf(data.uid);
            if (index > -1) {
              newItem.mainPost.upvotedBy.splice(index, 1);
            }
            newItem.mainPost.downvotedBy.push(data.uid);
            setItem(newItem);
          })
          .catch(function (error) {
            console.log(error);
            Alert.alert("Xử lý thất bại !!!");
          });
      } else {
        const data = {
          uid: global.user.uid,
        };
        axios({
          method: "DELETE",
          url: host.hostApi + "/posts/" + pid + "/vote",
          headers: {},
          data: data,
        })
          .then(function (response) {
            console.log(response.data);
            var newItem = { ...item };
            newItem.upvotes = response.data.payload.post.upvotes;
            newItem.downvotes = response.data.payload.post.downvotes;
            newItem.votes = response.data.payload.post.votes;
            var index = newItem.mainPost.downvotedBy.indexOf(data.uid);
            if (index > -1) {
              newItem.mainPost.downvotedBy.splice(index, 1);
            }
            setItem(newItem);
          })
          .catch(function (error) {
            console.log(error);
            Alert.alert("Xử lý thất bại !!!");
          });
      }
    }
  };

  const commentPressHandler = () => {
    if (!global.isLogined) {
      setModalVisible(true);
    } else {
      setModalCmtVisible(true);
    }
  };

  const handleRefresh = () => {
    navigation.replace("Temp", { tid: item.tid });
  };

  return (
    <>
      {isLoadingTopic || isLoadingComments ? (
        <ActivityIndicator />
      ) : (
        <>
          <Modal visible={modalCmtVisible} animationType="slide">
            <View style={styles.modalContent}>
              <SimpleLineIcons
                name="close"
                size={24}
                style={styles.modalClose}
                onPress={() => setModalCmtVisible(false)}
              />
              <Text style={styles.formTitle}>Nhập bình luận</Text>
              <Formik
                initialValues={{ content: "" }}
                onSubmit={(values) => {
                  var url = host.hostApi + "/posts/";
                  console.log(url);
                  console.log({ ...values, uid: global.user.uid, tid: item.tid });
                  axios({
                    method: "POST",
                    url: url,
                    headers: {},
                    data: { ...values, uid: global.user.uid, tid: item.tid },
                  })
                    .then(function (response) {
                      Alert.alert("Thêm bình luận thành công.");
                      navigation.replace("Temp", { tid: item.tid });
                    })
                    .catch(function (error) {
                      console.log(error);
                      Alert.alert("Xử lý thất bại !!!");
                    });
                }}
              >
                {(props) => (
                  <View>
                    <TextInput
                      multiline
                      onChangeText={props.handleChange("content")}
                      value={props.values.username}
                      style={styles.inputLogin}
                      placeholder="Nhập bình luận ... "
                    ></TextInput>
                    <Button
                      title="Bình luận"
                      onPress={props.handleSubmit}
                    ></Button>
                  </View>
                )}
              </Formik>
            </View>
          </Modal>
          <Modal visible={modalVisible} animationType="slide">
            <View style={styles.modalContent}>
              <SimpleLineIcons
                name="close"
                size={24}
                style={styles.modalClose}
                onPress={() => setModalVisible(false)}
              />
              <Text style={styles.formTitle}>
                Bạn cần đăng nhập để tiếp tục
              </Text>
              <Formik
                initialValues={{ username: "", password: "" }}
                onSubmit={(values) => {
                  axios({
                    method: "POST",
                    url: host.hostApi + "/users/login",
                    headers: {},
                    data: values,
                  })
                    .then(function (response) {
                      global.user = response.data;
                      global.isLogined = true;

                      Alert.alert("Đăng nhập thành công.");
                      navigation.replace("Temp", { tid: item.tid });
                    })
                    .catch(function (error) {
                      console.log(error);
                      Alert.alert("Đăng nhập thất bại !!!");
                    });
                }}
              >
                {(props) => (
                  <View>
                    <TextInput
                      onChangeText={props.handleChange("username")}
                      value={props.values.username}
                      style={styles.inputLogin}
                      placeholder="Nhập username ... "
                      autoCompleteType="username"
                    ></TextInput>
                    <TextInput
                      secureTextEntry
                      onChangeText={props.handleChange("password")}
                      value={props.values.password}
                      style={styles.inputLogin}
                      placeholder="Nhập password ... "
                      autoCompleteType="password"
                    ></TextInput>
                    <Button
                      title="Đăng nhập"
                      onPress={props.handleSubmit}
                    ></Button>
                  </View>
                )}
              </Formik>
            </View>
          </Modal>

          <ScrollView 
            style={styles.detailContainer}
            refreshControl={
              <RefreshControl
                onRefresh={handleRefresh}
              />
            }
          >
            <View style={styles.infoContainer}>
              <View style={styles.sliderBox}>
                <SliderBox
                  images={
                    item.images != undefined
                      ? item.images
                      : Array.of(item.thumb)
                  }
                />
              </View>
              <View style={styles.contentContainer}>
                <View style={styles.content}>
                  <Text style={styles.title}>{item.title}</Text>
                  <View style={styles.priceContainer}>
                    <Text style={styles.discountPrice}>
                      {item.discountPrice} {item.currency}{" "}
                      <Text style={styles.price}>
                        {item.price} {item.currency}
                      </Text>
                    </Text>
                  </View>
                  <View style={styles.description}>
                    <Markdown>{item.mainPost.content}</Markdown>
                  </View>
                  <Button
                    onPress={() => {
                      Linking.openURL(item.dealUrl);
                    }}
                    title="Xem ngay"
                  />
                </View>
              </View>
              <View style={styles.reactionContainer}>
                <TouchableOpacity
                  style={styles.buttonReaction}
                  onPress={() => upvotePressHandler(item.mainPost.pid)}
                >
                  <View style={styles.reaction}>
                    <AntDesign
                      name="like1"
                      size={24}
                      color={upvote ? "#4496D6" : "grey"}
                    />
                    {/* <Text style={styles.numReaction}>
                      {" "}
                      {item.upvotes ? item.upvotes : 0}
                    </Text> */}
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.buttonReaction}
                  onPress={() => downvotePressHandler(item.mainPost.pid)}
                >
                  <View style={styles.reaction}>
                    <AntDesign
                      name="dislike1"
                      size={24}
                      color={downvote ? "#4496D6" : "grey"}
                    />
                    {/* <Text style={styles.numReaction}>
                      {" "}
                      {item.downvotes ? item.downvotes : 0}
                    </Text> */}
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.buttonReaction}
                  onPress={() => commentPressHandler()}
                >
                  <View style={styles.reaction}>
                    <AntDesign name="message1" size={24} color="grey" />
                    {/* <Text style={styles.numReaction}>
                      {" "}
                      {item.postcount ? item.postcount - 1 : 0}
                    </Text> */}
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.commentsContainer}>
              <View style={styles.hearderComments}>
                <View style={styles.dealScore}>
                  {/* <View style={styles.score}>
                    <Text style={styles.numScore}>
                      {item.upvotes - item.downvotes}
                    </Text>
                  </View> */}
                  <Badge
                    status="success"
                    value={item.votes}
                    containerStyle={styles.score}
                    badgeStyle={{ width: 35, height: 35 }}
                  ></Badge>
                  <Text style={styles.dealScoreText}>Deal Score</Text>
                </View>
                <View style={styles.numComments}>
                  <Text style={styles.numberCmt}>
                    {item.postcount ? item.postcount - 1 : 0} {"Bình luận"}
                  </Text>
                </View>
              </View>
              {/* <FlatList
                data={comments}
                keyExtractor={(item) => item._key}
                renderItem={({ item }) => <Comment comment={item}></Comment>}
                onEndReached={handleLoadMore}
              ></FlatList> */}
              <View>
                {comments.map((item, index) => (
                  <View key={item._key}>
                    <Comment
                      navigation={navigation}
                      comment={item}
                      index={index}
                    ></Comment>
                  </View>
                ))}
                {offset + 5 < totalComment ? (
                  <View style={styles.seeMoreCmt}>
                    <TouchableOpacity
                      onPress={handleLoadMore}
                      style={styles.seeMore}
                    >
                      <Text style={styles.seeMoreText}>Xem thêm</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <></>
                )}
              </View>
            </View>
          </ScrollView>
        </>
      )}
    </>
  );
}

function Comment({ navigation, comment, index }) {
  const [item, setItem] = useState(comment);
  function secondsToDhms(seconds) {
    seconds = Number(seconds);
    var d = Math.floor(seconds / (3600 * 24));
    if (d > 0) {
      return d + " ngày trước";
    }
    var h = Math.floor((seconds % (3600 * 24)) / 3600);
    if (h > 0) {
      return h + " giờ trước";
    }
    var m = Math.floor((seconds % 3600) / 60);
    if (m > 0) {
      return h + " phút trước";
    }
    var s = Math.floor(seconds % 60);
    if (s > 0) {
      return h + " giây trước";
    }

    return "";
  }
  var curTime = new Date().getTime();
  var cmtTime = item.timestamp;
  const time = secondsToDhms(Math.floor((curTime - cmtTime) / 1000));

  const [modalVisible, setModalVisible] = useState(false);
  const [upvote, setUpvote] = useState(false);
  const [downvote, setDownvote] = useState(false);

  useEffect(() => {
    if (item && global.user) {
      if (item.upvotedBy.includes(global.user.uid)) {
        setUpvote(true);
        console.log("setUpvote(true)");
      } else {
        setUpvote(false);
        console.log("setUpvote(false)");
      }
      if (item.downvotedBy.includes(global.user.uid)) {
        setDownvote(true);
        console.log("setDownvote(true)");
      } else {
        setDownvote(false);
        console.log("setDownvote(false)");
      }
    }
  }, [item]);

  const upvoteCmtPressHandler = (pid) => {
    if (!global.isLogined) {
      setModalVisible(true);
    } else {
      if (!upvote) {
        const data = {
          delta: 1,
          uid: global.user.uid,
        };
        axios({
          method: "POST",
          url: host.hostApi + "/posts/" + pid + "/vote",
          headers: {},
          data: data,
        })
          .then(function (response) {
            console.log(response.data);
            var newItem = { ...item };
            newItem.upvotes = response.data.payload.post.upvotes;
            newItem.downvotes = response.data.payload.post.downvotes;
            newItem.votes = response.data.payload.post.votes;
            var index = newItem.downvotedBy.indexOf(data.uid);
            if (index > -1) {
              newItem.downvotedBy.splice(index, 1);
            }
            newItem.upvotedBy.push(data.uid);
            setItem(newItem);
          })
          .catch(function (error) {
            console.log(error);
            console.log(data);
            Alert.alert("Xử lý thất bại !!!");
          });
      } else {
        const data = {
          uid: global.user.uid,
        };
        axios({
          method: "DELETE",
          url: host.hostApi + "/posts/" + pid + "/vote",
          headers: {},
          data: data,
        })
          .then(function (response) {
            console.log(response.data);
            var newItem = { ...item };
            newItem.upvotes = response.data.payload.post.upvotes;
            newItem.downvotes = response.data.payload.post.downvotes;
            var index = newItem.upvotedBy.indexOf(data.uid);
            if (index > -1) {
              newItem.upvotedBy.splice(index, 1);
            }
            setItem(newItem);
          })
          .catch(function (error) {
            console.log(error);
            Alert.alert("Xử lý thất bại !!!");
          });
      }
    }
  };

  const downvoteCmtPressHandler = (pid) => {
    if (!global.isLogined) {
      setModalVisible(true);
    } else {
      if (!downvote) {
        const data = {
          delta: -1,
          uid: global.user.uid,
        };
        axios({
          method: "POST",
          url: host.hostApi + "/posts/" + pid + "/vote",
          headers: {},
          data: data,
        })
          .then(function (response) {
            console.log(response.data);
            var newItem = { ...item };
            newItem.upvotes = response.data.payload.post.upvotes;
            newItem.downvotes = response.data.payload.post.downvotes;
            newItem.votes = response.data.payload.post.votes;
            var index = newItem.upvotedBy.indexOf(data.uid);
            if (index > -1) {
              newItem.upvotedBy.splice(index, 1);
            }
            newItem.downvotedBy.push(data.uid);
            setItem(newItem);
          })
          .catch(function (error) {
            console.log(error);
            Alert.alert("Xử lý thất bại !!!");
          });
      } else {
        const data = {
          uid: global.user.uid,
        };
        axios({
          method: "DELETE",
          url: host.hostApi + "/posts/" + pid + "/vote",
          headers: {},
          data: data,
        })
          .then(function (response) {
            console.log(response.data);
            var newItem = { ...item };
            newItem.upvotes = response.data.payload.post.upvotes;
            newItem.downvotes = response.data.payload.post.downvotes;
            newItem.votes = response.data.payload.post.votes;
            var index = newItem.downvotedBy.indexOf(data.uid);
            if (index > -1) {
              newItem.downvotedBy.splice(index, 1);
            }
            setItem(newItem);
          })
          .catch(function (error) {
            console.log(error);
            Alert.alert("Xử lý thất bại !!!");
          });
      }
    }
  };

  return (
    <>
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContent}>
          <SimpleLineIcons
            name="close"
            size={24}
            style={styles.modalClose}
            onPress={() => setModalVisible(false)}
          />
          <Text style={styles.formTitle}>Bạn cần đăng nhập để tiếp tục</Text>
          <Formik
            initialValues={{ username: "", password: "" }}
            onSubmit={(values) => {
              axios({
                method: "POST",
                url: host.hostApi + "/users/login",
                headers: {},
                data: values,
              })
                .then(function (response) {
                  global.user = response.data;
                  global.isLogined = true;
                  Alert.alert("Đăng nhập thành công.");
                  navigation.replace("Temp", { tid: item.tid });
                })
                .catch(function (error) {
                  console.log(error);
                  Alert.alert("Đăng nhập thất bại !!!");
                });
            }}
          >
            {(props) => (
              <View>
                <TextInput
                  onChangeText={props.handleChange("username")}
                  value={props.values.username}
                  style={styles.inputLogin}
                  placeholder="Nhập username ... "
                ></TextInput>
                <TextInput
                  secureTextEntry
                  onChangeText={props.handleChange("password")}
                  value={props.values.password}
                  style={styles.inputLogin}
                  placeholder="Nhập password ... "
                ></TextInput>
                <Button title="Đăng nhập" onPress={props.handleSubmit}></Button>
              </View>
            )}
          </Formik>
        </View>
      </Modal>

      <View style={styles.commentBox}>
        <View style={styles.commentBoxHeader}>
          <View style={styles.commentBoxHeaderAvatarContainer}>
            {item.user.picture ? (
              <Image
                style={styles.commentBoxHeaderAvatar}
                source={{ uri: item.user.picture }}
              ></Image>
            ) : (
              <Image
                style={styles.commentBoxHeaderAvatar}
                source={require("../../assets/user-default-avatar.png")}
              ></Image>
            )}
            {/* <Image
            style={styles.commentBoxHeaderAvatar}
            source={require("../../assets/user-default-avatar.png")}
          ></Image> */}
          </View>
          <View style={styles.commentBoxHeaderUserNameContainer}>
            <Text style={styles.commentBoxHeaderUserName}>
              {item.user.username} {"("}
              {item.user.reputation ? item.user.reputation : 0}
              {")"}
            </Text>
          </View>
          <View style={styles.commentBoxHeaderTimeContainer}>
            <Text style={styles.commentBoxHeaderTime}>{time}</Text>
          </View>
        </View>
        <View style={styles.commentBoxBody}>
          <View style={{ flex: 15 }}></View>
          <View style={styles.commentBoxBodyContentContainer}>
            <Text style={styles.commentBoxBodyContent}>{item.content}</Text>
          </View>
        </View>
        <View style={{ ...styles.commentBoxBody, marginTop: 5 }}>
          <View style={{ flex: 15 }}></View>
          <View style={styles.commentBoxBodyContentContainer}>
            <TouchableOpacity
              style={{ ...styles.buttonReaction, flex: 1 / 5 }}
              onPress={() => upvoteCmtPressHandler(item.pid)}
            >
              <View style={styles.reaction}>
                <AntDesign
                  name="like1"
                  size={15}
                  color={upvote ? "#4496D6" : "grey"}
                />
                <Text style={styles.numReaction}>
                  {" "}
                  {item.upvotes ? item.upvotes : 0}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ ...styles.buttonReaction, flex: 1 / 5 }}
              onPress={() => downvoteCmtPressHandler(item.pid)}
            >
              <View style={styles.reaction}>
                <AntDesign
                  name="dislike1"
                  size={15}
                  color={downvote ? "#4496D6" : "grey"}
                />
                <Text style={styles.numReaction}>
                  {" "}
                  {item.downvotes ? item.downvotes : 0}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
}

function Temp({navigation, route}) {
  navigation.replace("Details", { tid: route.params.tid });
  return (
    <></>
  )
}

const Stack = createStackNavigator();

export default function DealsScreen({ queryString, flatListItems }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
        initialParams={{
          queryString: queryString,
          flatListItems: flatListItems,
        }}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="Details" component={Details} options={{title: "Chi tiết"}} />
      <Stack.Screen name="Search" component={Search} options={{title: "Tìm kiếm"}} />
      <Stack.Screen name="Temp" component={Temp} options={{title: "Temporary"}} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  searchScreenContainer: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#fff"
  },
  searchBarContainer: {
    // flex: 20,
    // flexDirection: "column",
    height: 120,
    marginHorizontal: 15,
    marginTop: 5,
    borderBottomColor: "#CED0D4",
    borderBottomWidth: 0.5,
  },
  searchBarText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  searchIcon: {
    padding: 10,
  },
  inputSearch: {
    flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    backgroundColor: '#fff',
    color: '#424242',
  },
  searchResultContainer: {
    flex: 80,
    flexDirection: "column",
    marginTop: 5,
  },
  searchResultText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  detailContainer: {
    flex: 1,
  },
  infoContainer: {
    backgroundColor: "white",
    marginBottom: 10,
  },
  sliderBox: {
    paddingBottom: 15,
    borderBottomColor: "#CED0D4",
    borderBottomWidth: 0.5,
  },
  contentContainer: {
    marginHorizontal: 15,
    borderBottomColor: "#CED0D4",
    borderBottomWidth: 0.5,
  },
  content: {
    marginVertical: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "normal",
  },
  priceContainer: {
    flexDirection: "row",
    marginVertical: 10,
  },
  discountPrice: {
    fontSize: 22,
    fontWeight: "bold",
  },
  price: {
    color: "red",
    fontSize: 14,
    textDecorationLine: "line-through",
    fontWeight: "normal",
  },
  description: {
    fontSize: 20,
    marginBottom: 5,
  },
  reactionContainer: {
    marginHorizontal: 15,
    marginVertical: 10,
    flexDirection: "row",
    flex: 1,
  },
  buttonReaction: {
    flexDirection: "row",
    flex: 1 / 3,
    justifyContent: "center",
  },
  reaction: {
    flexDirection: "row",
    alignItems: "center",
  },
  numReaction: {
    color: "grey",
    fontSize: 10,
  },
  commentsContainer: {
    backgroundColor: "white",
  },
  hearderComments: {
    marginHorizontal: 15,
    borderBottomColor: "#CED0D4",
    borderBottomWidth: 0.5,
    flexDirection: "row",
    flex: 1,
    alignContent: "center",
  },
  dealScore: {
    flex: 50,
    flexDirection: "row",
    alignItems: "flex-start",
    alignItems: "center",
  },
  score: {
    padding: 5,
  },
  dealScoreText: {
    marginLeft: 5,
    color: "grey",
    fontSize: 14,
  },
  numComments: {
    flex: 50,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  numberCmt: {
    fontSize: 14,
    color: "#4496D6",
  },
  commentBox: {
    marginHorizontal: 15,
    marginTop: 5,
    paddingBottom: 5,
    borderBottomColor: "#CED0D4",
    borderBottomWidth: 0.5,
    flexDirection: "column",
  },
  commentBoxHeader: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  commentBoxHeaderAvatarContainer: {
    flex: 15,
    alignItems: "center",
  },
  commentBoxHeaderAvatar: {
    width: 30,
    height: 30,
    borderRadius: 50,
  },
  commentBoxHeaderUserNameContainer: {
    flex: 55,
    alignItems: "flex-start",
  },
  commentBoxHeaderUserName: {
    color: "#4496D6",
  },
  commentBoxHeaderTimeContainer: {
    flex: 30,
    alignItems: "flex-end",
  },
  commentBoxHeaderTime: {
    fontSize: 10,
    color: "grey",
  },
  commentBoxBody: {
    flex: 1,
    flexDirection: "row",
  },
  commentBoxBodyContentContainer: {
    flex: 85,
    flexDirection: "row",
  },
  commentBoxBodyContent: {
    fontSize: 16,
  },
  modalClose: {
    marginVertical: 20,
    borderWidth: 1,
    borderColor: "#f2f2f2",
    padding: 10,
    borderRadius: 10,
    alignSelf: "center",
  },
  modalContent: {
    flex: 1,
    marginHorizontal: 15,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4496D6",
    marginBottom: 20,
    textAlign: "center",
  },
  inputLogin: {
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 5,
    padding: 10,
    fontSize: 18,
    borderRadius: 6,
  },
  seeMoreCmt: {
    marginHorizontal: 15,
    // marginBottom: 15,
    alignItems: "center",
  },
  seeMore: {
    margin: 10,
  },
  seeMoreText: {
    color: "grey",
  },
});
