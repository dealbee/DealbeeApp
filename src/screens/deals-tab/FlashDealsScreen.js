import * as React from "react";

import BaseDealsScreen from "./BaseDealsScreen";

export default function FlashDealsScreen({ navigation }) {
  return (
    <BaseDealsScreen
      queryString="/topics?limit=20&sorted=TIME_LEFT_ASC&flashdeal=true"
      flatListItems="FlashDealsItem"
      navigation={navigation}
    ></BaseDealsScreen>
  );
}
