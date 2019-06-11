import { registerOperatorRoute } from "/imports/client/ui";
import "./templates";

registerOperatorRoute({
  isNavigationLink: false,
  isSetting: false,
  mainComponent: "connectorSettings",
  path: "/settings/connectors"
});

