import React from "react";
import { View, StyleSheet } from "react-native";

import { ItemThumb, ItemTitle, ItemPrice, ItemInteraction } from "./BaseItem";

export default function PinnedDealsItem({ item }) {
  return (
    <View style={style.background}>
      <ItemThumb item={item}></ItemThumb>
      <View style={style.contentContainer}>
        <ItemTitle item={item}></ItemTitle>
        <ItemPrice item={item}></ItemPrice>
        <ItemInteraction item={item}></ItemInteraction>
      </View>
    </View>
  );
}
const style = StyleSheet.create({
  background: {
    flex: 1,
    flexDirection: "row",
    height: 100,
    backgroundColor: "#fff",
  },
  contentContainer: {
    padding: 10,
    fontSize: 12,
    flex: 28,
    flexDirection: "column",
  },
});
