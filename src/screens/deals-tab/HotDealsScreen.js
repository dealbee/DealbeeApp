import * as React from "react";

import BaseDealsScreen from "./BaseDealsScreen";

export default function HotDealsScreen({ navigation }) {
  return (
    <BaseDealsScreen
      queryString="/topics?limit=20&sorted=DISCOUNT_MONEY_DESC&currency=vnd"
      flatListItems="HotDealsItem"
      navigation={navigation}
    ></BaseDealsScreen>
  );
}
