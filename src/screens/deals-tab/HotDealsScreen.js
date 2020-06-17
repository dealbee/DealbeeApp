import * as React from "react";

import BaseDealsScreen from "./BaseDealsScreen";

export default function HotDealsScreen() {
  return (
    <BaseDealsScreen
      queryString="/topics?limit=20&sorted=DISCOUNT_MONEY_DESC&currency=vnd"
      flatListItems="HotDealsItem"
    ></BaseDealsScreen>
  );
}
