import * as React from "react";
import { useState, useEffect } from "react";
import {
  SectionList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
} from "react-native";

import PinnedDealsItem from "../../components/PinnedDealsItem";
import HotDealsItem from "../../components/HotDealsItem";
import FlashDealsItem from "../../components/FlashDealsItem";
import BestDealsItem from "../../components/BestDealsItem";
import PopularDealsItem from "../../components/PopularDealsItem";
import host from "../../../host.json";

export default function HomeDealsScreen({ navigation }) {
  const [pinnedDeals, setPinnedDeals] = useState([]);
  const [hotDeals, setHotDeals] = useState([]);
  const [flashDeals, setFlashDeals] = useState([]);
  const [bestDeals, setBestDeals] = useState([]);
  const [popularDeals, setPopularDeals] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const DATA = [
    {
      title: "Deals được ghim",
      data: pinnedDeals,
      renderItem: ({ item }) => {
        return (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Details", { tid: item.tid });
            }}
          >
            <PinnedDealsItem item={item}></PinnedDealsItem>
          </TouchableOpacity>
        );
      },
    },
    {
      title: "Hot deals",
      data: hotDeals,
      renderItem: ({ item }) => {
        return (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Details", { tid: item.tid });
            }}
          >
            <HotDealsItem item={item}></HotDealsItem>
          </TouchableOpacity>
        );
      },
    },
    {
      title: "Flash deals",
      data: flashDeals,
      renderItem: ({ item }) => {
        return (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Details", { tid: item.tid });
            }}
          >
            <FlashDealsItem item={item}></FlashDealsItem>
          </TouchableOpacity>
        );
      },
    },
    {
      title: "Best deals",
      data: bestDeals,
      renderItem: ({ item }) => {
        return (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Details", { tid: item.tid });
            }}
          >
            <BestDealsItem item={item}></BestDealsItem>
          </TouchableOpacity>
        );
      },
    },
    {
      title: "Popular deals",
      data: popularDeals,
      renderItem: ({ item }) => {
        return (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Details", { tid: item.tid });
            }}
          >
            <PopularDealsItem item={item}></PopularDealsItem>
          </TouchableOpacity>
        );
      },
    },
  ];

  useEffect(() => {
    getData();
  }, []);

  function getData() {
    fetchData(host.hostApi + "/pinned-topics?limit=10", "pinned");
    fetchData(
      host.hostApi + "/topics?limit=10&sorted=DISCOUNT_MONEY_DESC&currency=vnd",
      "hot"
    );
    fetchData(
      host.hostApi + "/topics?limit=10&sorted=TIME_LEFT_ASC&flashdeal=true",
      "flash"
    );
    fetchData(host.hostApi + "/topics?limit=10&sorted=UPVOTE_DESC", "best");
    fetchData(host.hostApi + "/topics?limit=10&sorted=VIEW_DESC", "popular");
  }

  function fetchData(url, type) {
    console.log(url);
    fetch(url)
      .then((response) => response.json())
      .then((json) => formatData(json.topics))
      .then((json) => {
        switch (type) {
          case "hot":
            setHotDeals(json);
            break;
          case "flash":
            setFlashDeals(json);
            break;
          case "best":
            setBestDeals(json);
            break;
          case "popular":
            setPopularDeals(json);
            break;
          default:
            setPinnedDeals(json);
            break;
        }
      })
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

  const renderSectionHeader = ({ section }) => {
    return (
      <View style={styles.sectionHeaderContainer}>
        <Text style={styles.sectionHeader}>{section.title}</Text>
      </View>
    );
  };

  const handleSeeMore = (title) => {
    switch (title) {
      case "Deals được ghim":
        console.log("jump to pinned");
        navigation.jumpTo("PinnedDeals");
        break;
      case "Hot deals":
        console.log("jump to hot");
        navigation.jumpTo("HotDeals");
        break;
      case "Flash deals":
        console.log("jump to flash");
        navigation.jumpTo("FlashDeals");
        break;
      case "Best deals":
        console.log("jump to best");
        navigation.jumpTo("BestDeals");
        break;
      case "Popular deals":
        console.log("jump to popular");
        navigation.jumpTo("PopularDeals");
        break;
    }
  };

  const renderSectionFooter = ({ section }) => {
    return (
      <>
        {section.data.length > 0 ? (
          <View style={styles.seeMore}>
            <TouchableOpacity
              onPress={() => handleSeeMore(section.title)}
              style={styles.seeMoreTouch}
            >
              <Text style={styles.seeMoreText}>Xem thêm</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.seeMore}>
            <Text style={styles.seeMoreText}>Hiện tại chưa có</Text>
          </View>
        )}
        <View style={styles.sectionSeparator}></View>
      </>
    );
  };

  const itemSeparatorComponent = () => {
    return <View style={styles.itemSeparator}></View>;
  };

  const handleRefresh = () => {
    setRefreshing(true);
    getData();
  };

  return (
    <>
      {isLoading || refreshing ? (
        <ActivityIndicator />
      ) : (
        <SectionList
          sections={DATA}
          keyExtractor={(item) => item._key}
          renderSectionHeader={renderSectionHeader}
          renderSectionFooter={renderSectionFooter}
          ItemSeparatorComponent={itemSeparatorComponent}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  sectionHeaderContainer: {
    backgroundColor: "#fff",
  },
  sectionHeader: {
    marginHorizontal: 12,
    marginTop: 5,
    fontSize: 20,
    fontWeight: "bold",
    backgroundColor: "#fff",
  },
  sectionSeparator: {
    backgroundColor: "#CED0D4",
    height: 10,
  },
  itemSeparator: {
    marginHorizontal: 12,
    borderBottomColor: "#CED0D4",
    borderBottomWidth: 0.5,
    backgroundColor: "#fff",
  },
  seeMore: {
    alignItems: "center",
    backgroundColor: "#fff",
  },
  seeMoreTouch: {
    margin: 10,
    borderColor: "#CED0D4",
    borderWidth: 0.5,
    borderRadius: 20,
  },
  seeMoreText: {
    color: "grey",
    padding: 7,
  },
});
