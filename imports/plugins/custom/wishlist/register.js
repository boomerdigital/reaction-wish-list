import Reaction from "/imports/plugins/core/core/server/Reaction";
import schemas from "./server/no-meteor/schemas";
import resolvers from "./server/no-meteor/resolvers/index";
import queries from "./server/no-meteor/queries";
import mutations from "./server/no-meteor/mutations";
import startup from "./server/startup";

Reaction.registerPackage({
  label: "Wishlist",
  name: "wishlist",
  icon: "fa fa-vine",
  autoEnable: true,
  functionsByType: {
    startup: [startup]
  },
  graphQL: {
    schemas,
    resolvers,
  },
  queries,
  mutations,
});