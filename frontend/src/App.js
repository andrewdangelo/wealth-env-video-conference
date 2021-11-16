import React from "react";
import { useSelector } from "react-redux";

import Join from "./views/Join/Join";
import Room from "./views/Room/Room"

import { ReactLazyPreload } from "./ReactLazyPreload";

/* const Room = ReactLazyPreload(() => import("./views/Room/Room")); */

function App() {
  const room = useSelector((state) => state.room);

  if (room.state === "connected") {
    return <Room />;
  } else {
    return <Join />;
  }
}

export default App;
