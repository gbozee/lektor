"use strict";

import PropTypes from "prop-types";
import React from "react";
import ReactDOM from "react-dom";
// import { Router, Route, IndexRoute } from 'react-router'
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Component from "./components/Component";
import i18n from "./i18n";
import { useBeforeUnload } from "history";
import createBrowserHistory from "history/lib/createBrowserHistory";

/* eslint-disable no-unused-vars */
import Bootstrap from "bootstrap";
import BootstrapExtras from "./bootstrap-extras";
import FACss from "font-awesome/css/font-awesome.css";

// polyfill for internet explorer
import PromiseOnly from "native-promise-only";
import EventSource from "event-source-polyfill";
/* eslint-enable no-unused-vars */

// route targets
import App from "./views/App";
import Dash from "./views/Dash";
import EditPage from "./views/EditPage";
import DeletePage from "./views/DeletePage";
import PreviewPage from "./views/PreviewPage";
import AddChildPage from "./views/AddChildPage";
import AddAttachmentPage from "./views/AddAttachmentPage";

i18n.currentLanguage = $LEKTOR_CONFIG.lang;

class BadRoute extends Component {
  render() {
    return (
      <div>
        <h2>Nothing to see here</h2>
        <p>There is really nothing to see here.</p>
      </div>
    );
  }
}

BadRoute.contextTypes = {
  router: PropTypes.func
};

const routes = (() => {
  // route setup
  let routes = [
    { name: "edit", path: ":path/edit", component: EditPage },
    { name: "delete", path: ":path/delete", component: DeletePage },
    { name: "preview", path: ":path/preview", component: PreviewPage },
    { name: "add-child", path: ":path/add-child", component: AddChildPage },
    { name: "upload", path: ":path/upload", component: AddAttachmentPage }
  ];
  return (
    <Route
      name="app"
      path={$LEKTOR_CONFIG.admin_root}
      render={props => {
        return (
          <App {...props} route={{ childRoutes: routes }}>
            <Switch>
              {routes.map(route => (
                <Route
                  key={route.name}
                  name={route.name}
                  path={route.path}
                  component={route.component}
                />
              ))}
              <Route path="" component={Dash} />
              <route path="*" component={BadRoute} />
            </Switch>
          </App>
        );
      }}
    />
  );
})();

const dash = document.getElementById("dash");

if (dash) {
  ReactDOM.render(
    <BrowserRouter>
      {/* <Router history={useBeforeUnload(createBrowserHistory)()}> */}
      <Switch>
        {routes}
        <Route path="*" component={BadRoute} />
      </Switch>
      {/* </Router> */}
    </BrowserRouter>,
    dash
  );
}
