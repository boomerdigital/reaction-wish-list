import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingBag } from "@fortawesome/free-solid-svg-icons";
import { registerOperatorRoute } from "/imports/client/ui";
import "./settings/shopify";

registerOperatorRoute({
  isNavigationLink: true,
  isSetting: true,
  mainComponent: "shopifyConnectSettings",
  path: "/settings/connectors/shopify",
  // eslint-disable-next-line react/display-name
  SidebarIconComponent: (props) => <FontAwesomeIcon icon={faShoppingBag} {...props} />,
  sidebarI18nLabel: "admin.dashboard.shopifyConnectLabel"
});
