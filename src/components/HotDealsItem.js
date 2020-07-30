import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Foundation } from "@expo/vector-icons";

import { ItemThumb, ItemTitle, ItemPrice, ItemInteraction } from "./BaseItem";

function ItemDiscount({ item }) {
  function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }
  return (
    <View style={styles.containerDiscount}>
      <Foundation name="burst-sale" size={25} color="red" />
      <Text style={styles.discountText}>
        {!item.price || !item.discountPrice
          ? 0
          : formatNumber(
              parseInt(item.price.replace(/,/g, "")) -
                parseInt(item.discountPrice.replace(/,/g, ""))
            )}{" "}
        {item.currency}
      </Text>
    </View>
  );
}

export default function HotDealsItem({ item }) {
  return (
    <View style={styles.background}>
      <ItemThumb item={item}></ItemThumb>
      <View style={styles.contentContainer}>
        <ItemTitle item={item}></ItemTitle>
        <ItemPrice item={item}></ItemPrice>
        <ItemDiscount item={item}></ItemDiscount>
        <ItemInteraction item={item}></ItemInteraction>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
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
  containerDiscount: {
    flexDirection: "row",
  },
  discountText: {
    fontSize: 15,
    color: "red",
  },
});
