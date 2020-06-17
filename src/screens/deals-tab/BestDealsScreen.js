import * as React from "react";

import BaseDealsScreen from "./BaseDealsScreen";

export default function BestDealsScreen() {
  return (
    <BaseDealsScreen
      queryString="/topics?limit=20&sorted=UPVOTE_DESC"
      flatListItems="BestDealsItem"
    ></BaseDealsScreen>
  );
}
