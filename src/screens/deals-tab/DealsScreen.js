import * as React from "react";
import { View, StyleSheet } from "react-native";
import { Header, Image, SearchBar } from "react-native-elements";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { FontAwesome5 } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";

import HomeDealsScreen from "./HomeDealsScreen";
import HotDealsScreen from "./HotDealsScreen";
import FlashDealsScreen from "./FlashDealsScreen";
import BestDealsScreen from "./BestDealsScreen";
import PopularDealsScreen from "./PopularDealsScreen";
import ForYouDealsScreen from "./ForYouDealsScreen";
import { preventAutoHide } from "expo/build/launch/SplashScreen";

const TopTab = createMaterialTopTabNavigator();

export default function DealsScreen() {
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
        <TopTab.Screen
          name="ForYouDeals"
          component={ForYouDealsScreen}
          options={{
            tabBarLabel: "Cho bạn",
            tabBarIcon: ({ color }) => (
              <SimpleLineIcons name="check" size={20} color={color} />
            ),
          }}
        />
      </TopTab.Navigator>
    </>
  );
}
