"use strict";
import dialogSystem from "../dialogSystem";
import BaseComponent from "./BaseComponent";

class Component extends BaseComponent {
  constructor(props) {
    super(props);
    this._unlistenBeforeLeavingRoute = null;
  }

  /* helper function for forwarding props down the tree */
  getRoutingProps() {
    return {
      history: this.props.history,
      location: this.props.location,
      params: this.props.match.params,
      route: this.props.route,
      routeParams: this.props.match.params,
      routes: this.props.routes
    };
  }

  /* helper that can generate a path to a rule */
  getPathToAdminPage(name, params) {
    let parts = this.props.routes.map(x => x.name);
    parts = ["app", ...parts];
    if (name !== null) {
      if (name.substr(0, 1) === ".") {
        parts[parts.length - 1] = name.substr(1);
      } else {
        parts = name.split(".");
      }
    }
    const rv = [];
    let node = this.props.routes[0];
    if (node.name !== parts.shift()) {
      return null;
    }
    rv.push(node.relativePath);

    parts.forEach(part => {
      for (let i = 0; i < node.childRoutes.length; i++) {
        if (node.childRoutes[i].name === part) {
          node = node.childRoutes[i];
          rv.push(node.relativePath);
          return;
        }
      }
      node = null;
    });
    let result = rv.join("/").replace(/:[a-zA-Z]+/g, m => {
      const key = m.substr(1);
      return params[key] || this.props.params[key];
    });
    return result;
  }

  /* helper to transition to a specific page */
  transitionToAdminPage(name, params) {
    this.props.history.push(this.getPathToAdminPage(name, params));
    // this.props.history.pushState(null, this.getPathToAdminPage(name, params));
  }

  componentDidMount() {
    super.componentDidMount();
    if (this.props.history !== undefined) {
      this._unlistenBeforeLeavingRoute = this.props.history.listen(
        this.props.route,
        this.routerWillLeave.bind(this)
      );
    }
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    if (this._unlistenBeforeLeavingRoute) {
      this._unlistenBeforeLeavingRoute();
    }
  }

  routerWillLeave(nextLocation) {
    if (dialogSystem.preventNavigation()) {
      return false;
    } else {
      dialogSystem.dismissDialog();
    }
  }
}
export default Component;
