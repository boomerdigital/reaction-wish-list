/* eslint camelcase: 0 */
import Reaction from "/imports/plugins/core/core/server/Reaction";
import schemas from "./server/no-meteor/schemas";
import {
  paymentSubmit,
  paymentCapture,
  createRefund,
  listRefunds
} from "./server/methods/braintreeMethods";

Reaction.registerPackage({
  label: "BrainTree",
  icon: "fa fa-credit-card",
  autoEnable: true,
  graphQL: {
    schemas
  },
  name: "reaction-braintree", // usually same as meteor package
  // private package settings config (blackbox)
  settings: {
    "mode": false,
    "merchant_id": "",
    "public_key": "",
    "private_key": "",
    "reaction-braintree": {
      enabled: false,
      support: ["Authorize", "Capture", "Refund"]
    }
  },
  paymentMethods: [
    {
      canRefund: true,
      name: "braintree_card",
      displayName: "Braintree Card",
      functions: {
        capturePayment: paymentCapture,
        createAuthorizedPayment: paymentSubmit,
        createRefund,
        listRefunds
      }
    }
  ],
  registry: [
    {
      label: "Braintree",
      provides: ["paymentSettings"],
      container: "dashboard",
      template: "braintreeSettings"
    },
    // configures template for checkout
    // paymentMethod dynamic template
    {
      template: "braintreePaymentForm",
      provides: ["paymentMethod"],
      icon: "fa fa-credit-card"
    }
  ]
});
