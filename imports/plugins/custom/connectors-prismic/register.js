import Reaction from "/imports/plugins/core/core/server/Reaction";

Reaction.registerPackage({
  label: "Prismic Connect",
  name: "reaction-connectors-prismic",
  icon: "fa fa-exchange",
  autoEnable: true,
  settings: {
    apiKey: "",
    password: "",
    sharedSecret: "",
    shopName: "",
    webhooks: [],
    webhooksDomain: ""
  },
  registry: [{
    label: "prismic Connect Settings",
    name: "settings/connectors/prismic",
    icon: "fa fa-exchange",
    route: "/dashboard/connectors/prismic",
    provides: ["connectorSettings"],
    container: "dashboard",
    template: "prismicConnectSettings"
  }]
});
