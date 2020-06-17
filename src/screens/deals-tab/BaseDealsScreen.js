import * as React from "react";
import { useState, useEffect } from "react";
import { View, FlatList } from "react-native";
import axios from "axios";

import HomeDealsItem from "../../components/HomeDealsItem";
import HotDealsItem from "../../components/HotDealsItem";
import FlashDealsItem from "../../components/FlashDealsItem";
import BestDealsItem from "../../components/BestDealsItem";
import PopularDealsItem from "../../components/PopularDealsItem";
import host from "../../../host.json";

export default function BaseDealsScreen({ queryString, flatListItems }) {
  const [deals, setDeals] = useState();
  useEffect(() => {
    async function fetchData() {
      // You can await here
      const response = await axios({
        url: host.hostApi + queryString,
      });
      formatData(response.data);
      setDeals(response.data);
    }

    fetchData();
  }, []);

  const formatData = function (data) {
    data.map((e) => {
      e.key = e["_key"];
      e.currency = e.currency.split(" - ")[0];
      if (e.thumb) {
        if (e.thumb[0] == "/") {
          e.thumb = `${host.host}${e.thumb}`;
        }
      }
      if (e.discountPrice)
        e.discountPrice = e.discountPrice
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      if (e.price)
        e.price = e.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return e;
    });
  };

  return (
    <View>
      <FlatList
        data={deals}
        renderItem={({ item }) => {
          switch (flatListItems) {
            case "HotDealsItem":
              return <HotDealsItem item={item}></HotDealsItem>;
            case "FlashDealsItem":
              return <FlashDealsItem item={item}></FlashDealsItem>;
            case "HomeDealsItem":
              return <BestDealsItem item={item}></BestDealsItem>;
            case "HotDealsItem":
              return <PopularDealsItem item={item}></PopularDealsItem>;
            default:
              return <HomeDealsItem item={item}></HomeDealsItem>;
          }
        }}
      ></FlatList>
    </View>
  );
}
