import * as React from "react";
import { useState, useEffect } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import axios from "axios";

import PinnedDealsItem from "../../components/PinnedDealsItem";
import HotDealsItem from "../../components/HotDealsItem";
import FlashDealsItem from "../../components/FlashDealsItem";
import BestDealsItem from "../../components/BestDealsItem";
import PopularDealsItem from "../../components/PopularDealsItem";
import host from "../../../host.json";

export default function BaseDealsScreen({
  navigation,
  queryString,
  flatListItems,
}) {
  const [deals, setDeals] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchData(offset, true);
  }, []);

  function fetchData(off, isRefresh) {
    var url = host.hostApi + queryString + "&offset=" + off;
    console.log(url);
    fetch(url)
      .then((response) => response.json())
      .then((json) => {setTotal(json.total); return json;})
      .then((json) => formatData(json.topics))
      .then((json) => isRefresh ? setDeals(json) : setDeals(deals.concat(json)))
      .catch((error) => console.error(error))
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
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

  useEffect(() => {
    if (offset <= total) 
      fetchData(offset, false);
  }, [offset]);

  const handleLoadMore = () => {
    setOffset(offset + 20);
  };

  useEffect(() => {
    if (refreshing) 
      fetchData(0, true);
  }, [refreshing]);

  const handleRefresh = () => {
    setRefreshing(true);
  };

  const renderItem = ({ item }) => {
    switch (flatListItems) {
      case "HotDealsItem":
        return (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Details", { tid: item.tid });
            }}
          >
            <HotDealsItem item={item}></HotDealsItem>
          </TouchableOpacity>
        );
      case "FlashDealsItem":
        return (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Details", { tid: item.tid });
            }}
          >
            <FlashDealsItem item={item}></FlashDealsItem>
          </TouchableOpacity>
        );
      case "BestDealsItem":
        return (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Details", { tid: item.tid });
            }}
          >
            <BestDealsItem item={item}></BestDealsItem>
          </TouchableOpacity>
        );
      case "PopularDealsItem":
        return (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Details", { tid: item.tid });
            }}
          >
            <PopularDealsItem item={item}></PopularDealsItem>
          </TouchableOpacity>
        );
      default:
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
  };
  return (
    <>
      {isLoading || refreshing ? (
        <ActivityIndicator />
      ) : (
        <View>
          <FlatList
            data={deals}
            keyExtractor={(item) => item._key + offset}
            onEndReached={handleLoadMore}
            renderItem={renderItem}
            getItemLayout={(data, index) => ({
              length: 100,
              offset: 100 * index,
              index,
            })}
            refreshing={refreshing}
            onRefresh={handleRefresh}
          ></FlatList>
        </View>
      )}
    </>
  );
}
