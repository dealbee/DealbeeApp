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
import { color } from "react-native-reanimated";

const TopTab = createMaterialTopTabNavigator();

function Home() {
  return (
    <>
      <Header
        leftContainerStyle={{
          flex: 5,
        }}
        centerContainerStyle={{
          flex: 95,
        }}
        placement="left"
        leftComponent={
          <Image
            source={{
              uri:
                "https://res.cloudinary.com/tkm/image/upload/c_scale,h_128/v1574161033/logo/tkm-round.png",
            }}
            style={{ width: 30, height: 30 }}
          />
        }
        centerComponent={
          <SearchBar
            placeholder="Type Here..."
            lightTheme
            placeholder="Search"
            round
            containerStyle={{
              borderBottomColor: "transparent",
              borderTopColor: "transparent",
              backgroundColor: "transparent",
              width: "100%",
            }}
            inputContainerStyle={{
              backgroundColor: "white",
            }}
          />
        }
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
    fetch(urlGetTopic)
      .then((response) => response.json())
      .then((json) => formatData(json))
      .then((json) => setItem(json))
      .catch((error) => console.error(error))
      .finally(() => setLoadingTopic(false));
  }, []);

  const formatData = function (data) {
    data.key = data["_key"];
    data.currency = data.currency.split(" - ")[0];
    if (data.thumb) {
      if (data.thumb[0] == "/") {
        data.thumb = `${host.host}${data.thumb}`;
      }
    }
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
            setUpvote(response.data.payload.upvote);
            setDownvote(response.data.payload.downvote);
            var newItem = { ...item };
            newItem.upvotes = response.data.payload.post.upvotes;
            newItem.downvotes = response.data.payload.post.downvotes;
            newItem.votes = response.data.payload.post.votes;
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
            setUpvote(response.data.payload.upvote);
            setDownvote(response.data.payload.downvote);
            var newItem = { ...item };
            newItem.upvotes = response.data.payload.post.upvotes;
            newItem.downvotes = response.data.payload.post.downvotes;
            newItem.votes = response.data.payload.post.votes;
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
            setUpvote(response.data.payload.upvote);
            setDownvote(response.data.payload.downvote);
            var newItem = { ...item };
            newItem.upvotes = response.data.payload.post.upvotes;
            newItem.downvotes = response.data.payload.post.downvotes;
            newItem.votes = response.data.payload.post.votes;
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
            setUpvote(response.data.payload.upvote);
            setDownvote(response.data.payload.downvote);
            var newItem = { ...item };
            newItem.upvotes = response.data.payload.post.upvotes;
            newItem.downvotes = response.data.payload.post.downvotes;
            newItem.votes = response.data.payload.post.votes;
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
                  axios({
                    method: "POST",
                    url: url,
                    headers: {},
                    data: { ...values, uid: global.user, tid: item.tid },
                  })
                    .then(function (response) {
                      setModalCmtVisible(false);
                      Alert.alert("Thêm bình luận thành công.");
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
                      if (item.mainPost.upvotedBy.includes(global.user.uid)) {
                        setUpvote(true);
                      }
                      if (item.mainPost.downvotedBy.includes(global.user.uid)) {
                        setDownvote(true);
                      }
                      setModalVisible(false);
                      Alert.alert("Đăng nhập thành công.");
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

          <ScrollView style={styles.detailContainer}>
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
            setUpvote(response.data.payload.upvote);
            setDownvote(response.data.payload.downvote);
            var newItem = { ...item };
            newItem.upvotes = response.data.payload.post.upvotes;
            newItem.downvotes = response.data.payload.post.downvotes;
            newItem.votes = response.data.payload.post.votes;
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
            setUpvote(response.data.payload.upvote);
            setDownvote(response.data.payload.downvote);
            var newItem = { ...item };
            newItem.upvotes = response.data.payload.post.upvotes;
            newItem.downvotes = response.data.payload.post.downvotes;
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
            setUpvote(response.data.payload.upvote);
            setDownvote(response.data.payload.downvote);
            var newItem = { ...item };
            newItem.upvotes = response.data.payload.post.upvotes;
            newItem.downvotes = response.data.payload.post.downvotes;
            newItem.votes = response.data.payload.post.votes;
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
            setUpvote(response.data.payload.upvote);
            setDownvote(response.data.payload.downvote);
            var newItem = { ...item };
            newItem.upvotes = response.data.payload.post.upvotes;
            newItem.downvotes = response.data.payload.post.downvotes;
            newItem.votes = response.data.payload.post.votes;
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
                  console.log(item);
                  if (item.upvotedBy.includes(global.user.uid)) {
                    setUpvote(true);
                  }
                  if (item.downvotedBy.includes(global.user.uid)) {
                    setDownvote(true);
                  }
                  setModalVisible(false);
                  Alert.alert("Đăng nhập thành công.");
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
              {item.user.reputation}
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
      <Stack.Screen name="Details" component={Details} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
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
