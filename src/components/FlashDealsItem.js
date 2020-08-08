import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { ItemThumb, ItemTitle, ItemPrice, ItemInteraction } from "./BaseItem";

function ItemExpired({item}) {
  return (
    <View style={style.expiredContainer}>
      <Text style={style.text}>Ngày Kết thúc: </Text>
      <Text style={style.text}> {item.expiredDate} {item.expiredTime} </Text>
    </View>
  )
}

export default function FlashDealsItem({ item }) {
  return (
    <View style={style.background}>
      <ItemThumb item={item}></ItemThumb>
      <View style={style.contentContainer}>
        <ItemTitle item={item}></ItemTitle>
        <ItemPrice item={item}></ItemPrice>
        <ItemExpired item={item}></ItemExpired>
        <ItemInteraction item={item}></ItemInteraction>
      </View>
    </View>
  );
}
const style = StyleSheet.create({
  background: {
    flex: 1,
    flexDirection: "row",
    height: 120,
    backgroundColor: "#fff",
  },
  contentContainer: {
    padding: 10,
    fontSize: 12,
    flex: 28,
    flexDirection: "column",
  },
  expiredContainer: {
    flexDirection: "row",
    marginBottom: 3,
  },
  text: {
    fontSize: 12,
    color: "red"
  }
});
