import * as React from "react";
import { Text, View } from "react-native";
import BaseDealsScreen from "./BaseDealsScreen";

export default function PinnedDealsScreen({ navigation }) {
  return (
    <BaseDealsScreen
      queryString="/pinned-topics?limit=20"
      flatListItems="HomeDealsItem"
      navigation={navigation}
    ></BaseDealsScreen>
  );
}
