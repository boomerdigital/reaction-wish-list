import { Meteor } from "meteor/meteor";
import React, { Component, PropTypes } from "react";
import { composeWithTracker } from "/lib/api/compose";
import { Reaction, i18next, Logger } from "/client/api";
import { ReactionProduct } from "/lib/api";
import classnames from "classnames";
import { Wishlist } from "../../lib/collections";
import { WishlistButton } from "../components";
import { registerComponent } from "/imports/plugins/core/layout/lib/components";

class WishlistContainer extends Component {

  get currentUserId() {
    return Meteor.userId();
  }

  handleAddToWishlist() {
    const userId = Meteor.userId();
    const productId = ReactionProduct.selectedProductId();
    const variantId = ReactionProduct.selectedVariantId();

    if ( userId ) {

      Meteor.call("addToWishlist", userId, productId, variantId, function(err, result) {
        if (err) {
          Alerts.toast(i18next.t("app.error", { error: err.reason }), "error");
          return false;
        } else {
          console.log("Added Items")
          return true;
        }
      });

    } else {
      // pop open sign in
      // Alert you need to be signed in
      // maybe after sign in have it be able to add?
    }
  }

  handleRemoveFromWishlist() {
    const userId = Meteor.userId();
    const productId = ReactionProduct.selectedProductId();
    const variantId = ReactionProduct.selectedVariantId();

    return Meteor.call("removeFromWishlist", userId, productId, variantId, function(err, result) {
      if (err) {
        Alerts.toast(i18next.t("app.error", { error: err.reason }), "error");
        return false;
      } else {
        console.log("Removed Items")
        return true;
      }
    });
    // change button to add from wishlist
  }

  render() {
    return (
      <WishlistButton
        onWishlistItemAdd={this.handleAddToWishlist}
        onWishlistItemRemove={this.handleRemoveFromWishlist}
        currentUserId={this.currentUserId}
      />
    );
  }

}

function composer(props, onData) {
  const currentUserId = Meteor.userId();

  onData(null, {
    currentUserId: currentUserId
  });
}


WishlistContainer.propTypes = {
  variant: PropTypes.object
};

export default composeWithTracker(composer)(WishlistContainer);
