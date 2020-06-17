import * as React from "react";

import BaseDealsScreen from "./BaseDealsScreen";

export default function FlashDealsScreen() {
  return (
    <BaseDealsScreen
      queryString="/topics?limit=20&sorted=TIME_LEFT_DESC&flashdeal=true"
      flatListItems="FlashDealsItem"
    ></BaseDealsScreen>
  );
}
