import React from "react";
import ReactDOM from "react-dom";
import domready from "domready";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

//context
import RoomContext from "./RoomContext";

import Logger from "./Logger";

import { store } from "./redux/store";
import { Provider } from "react-redux";
import SFU from "./SFU/SFU";

import randomString from "random-string";

//styles
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import App from "./App";
import Join from "./views/Join/Join";
import deviceInfo from "./deviceInfo";

const logger = new Logger("Index");

let sfu;

window.STORE = store;

SFU.init({ store });

domready(async () => {
  logger.debug("DOM ready");

  console.log(logger);

  run();
});

async function run() {
  logger.debug("run() [environment:%s]", process.env.NODE_ENV);

  const peerId = randomString({ length: 8 }).toLowerCase();
  const urlParser = new URL(window.location);
  const parameters = urlParser.searchParams;

  const produce = parameters.get("produce") !== "false";
  const forceTcp = parameters.get("forceTcp") === "true";
  const displayName = parameters.get("displayName");
  const muted = parameters.get('muted') === 'true';

  const { pathname } = window.location;

  let basePath = pathname.substring(0, pathname.lastIndexOf('/'));

  if(!basePath) basePath = '/';



  const device = deviceInfo();

  sfu = new SFU({
    peerId,
    displayName,
    device,
    produce,
    forceTcp,
  });

  ReactDOM.render(
    <Provider store={store}>
      <RoomContext.Provider value={sfu}>
        <Router>
          <Switch>
            <Route exact path="/:id" component={App} />
            <Route exact path="/" component={Join} />
          </Switch>
        </Router>
      </RoomContext.Provider>
    </Provider>,
    document.getElementById("root")
  );
}
