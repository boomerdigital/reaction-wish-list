import Reaction from "/imports/plugins/core/core/server/Reaction";

Reaction.registerPackage({
  label: "Classic WishList functionality for reaction",
  name: "reaction-wish-list",
  icon: "fa fa-thumb-tack",
  autoEnable: true,
  settings: {},
  registry: [
    {
      container: "core",
      description: "Classic wish list functionality",
      icon: "fa fa-thumb-tack",
      label: "Wishlist",
      name: "dashboardProductImporter",
      priority: 2,
      provides: "dashboard",
      route: "/dashboard/wishlist",
      template: "wishlist",
      workflow: "coreWorkflow"
    }
  ]
});
