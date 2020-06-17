import * as React from "react";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SimpleLineIcons } from "@expo/vector-icons";

import DealsScreen from "./src/screens/deals-tab/DealsScreen";
import ChatScreen from "./src/screens/chat-tab/ChatScreen";
import NotificationScreen from "./src/screens/notification-tab/NotificationScreen";
import ProfileScreen from "./src/screens/profile-tab/ProfileScreen";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBarOptions={{
          activeTintColor: "#3399ff",
          inactiveTintColor: "grey",
        }}
      >
        <Tab.Screen
          name="Deals"
          component={DealsScreen}
          options={{
            tabBarLabel: "Deals",
            tabBarIcon: ({ color }) => (
              <SimpleLineIcons name="tag" size={24} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Chat"
          component={ChatScreen}
          options={{
            tabBarLabel: "Chat",
            tabBarIcon: ({ color }) => (
              <SimpleLineIcons name="bubble" size={24} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Notification"
          component={NotificationScreen}
          options={{
            tabBarLabel: "Thông báo",
            tabBarIcon: ({ color }) => (
              <SimpleLineIcons name="bell" size={24} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarLabel: "Tài khoản",
            tabBarIcon: ({ color }) => (
              <SimpleLineIcons name="user" size={24} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
