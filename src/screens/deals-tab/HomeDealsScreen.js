import * as React from "react";

import BaseDealsScreen from "./BaseDealsScreen";

export default function HomeDealsScreen() {
  return (
    <BaseDealsScreen
      queryString="/topics?limit=20"
      flatListItems="HomeDealsItem"
    ></BaseDealsScreen>
  );
}
