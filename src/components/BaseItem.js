import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { SimpleLineIcons } from "@expo/vector-icons";

export function ItemThumb({ item }) {
  return (
    <View style={styles.thumbContainer}>
      {item.thumb.length == 0 ? (
        <Image style={styles.thumbImg} source={require("../assets/no-img-found.png")}></Image>
      ) : (
        <Image style={styles.thumbImg} source={{ uri: item.thumb }}></Image>
      )}
      
    </View>
  );
}

export function ItemTitle({ item }) {
  return (
    <View style={styles.containerTitle}>
      <Text numberOfLines={2} style={styles.textTitle}>
        {item.title}
      </Text>
    </View>
  );
}

export function ItemPrice({ item }) {
  return (
    <View style={styles.containerPrice}>
      <Text style={styles.textPrice}>
        {item.discountPrice} {item.currency}{" "}
        <Text style={styles.textOrPrice}>
          {item.price} {item.currency}
        </Text>
      </Text>
    </View>
  );
}

function ItemInf({ iconName, iconSize, iconColor, value }) {
  return (
    <View style={styles.itemInteraction}>
      <SimpleLineIcons
        name={iconName}
        size={iconSize}
        color={iconColor}
        style={styles.itemInteractionIcon}
      />
      <Text style={styles.itemInteractionText}>{value}</Text>
    </View>
  );
}

export function ItemInteraction({ item }) {
  return (
    <View style={styles.containerInteraction}>
      <ItemInf
        iconName="eye"
        iconSize={15}
        iconColor="grey"
        value={item.viewcount ? item.viewcount : 0}
      />
      <ItemInf
        iconName="like"
        iconSize={15}
        iconColor="grey"
        value={item.upvotes ? item.upvotes : 0}
      />
      <ItemInf
        iconName="dislike"
        iconSize={15}
        iconColor="grey"
        value={item.downvotes ? item.downvotes : 0}
      />
      <ItemInf
        iconName="bubbles"
        iconSize={15}
        iconColor="grey"
        value={item.postcount ? item.postcount - 1 : 0}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  thumbContainer: {
    flex: 10,
    flexDirection: "row",
  },
  textTitle: {
    fontSize: 13,
    color: "#3399FF",
    fontWeight: "normal",
  },
  containerTitle: {},
  containerPrice: {},
  containerInteraction: {
    flexDirection: "row",
    color: "grey",
  },
  itemInteraction: {
    flexDirection: "row",
    marginRight: 20,
  },
  itemInteractionText: {
    fontSize: 10,
    color: "grey",
  },
  itemInteractionIcon: {
    marginRight: 2,
  },
  textPrice: {
    color: "#2ED573",
    fontSize: 15,
    fontWeight: "bold",
  },
  textOrPrice: {
    fontSize: 10,
    fontWeight: "normal",
    color: "#808080",
    textDecorationLine: "line-through",
  },
  thumbImg: {
    margin: 10,
    height: 80,
    width: 80,
    borderRadius: 3,
  },
});
