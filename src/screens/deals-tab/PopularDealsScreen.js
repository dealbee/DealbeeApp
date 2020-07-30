import * as React from "react";

import BaseDealsScreen from "./BaseDealsScreen";

export default function PopularDealsScreen({ navigation }) {
  return (
    <BaseDealsScreen
      queryString="/topics?limit=20&sorted=COMMENT_DESC"
      flatListItems="PopularDealsItem"
      navigation={navigation}
    ></BaseDealsScreen>
  );
}
