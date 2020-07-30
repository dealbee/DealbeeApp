import * as React from "react";

import BaseDealsScreen from "./BaseDealsScreen";

export default function BestDealsScreen({ navigation }) {
  return (
    <BaseDealsScreen
      queryString="/topics?limit=20&sorted=UPVOTE_DESC"
      flatListItems="BestDealsItem"
      navigation={navigation}
    ></BaseDealsScreen>
  );
}
