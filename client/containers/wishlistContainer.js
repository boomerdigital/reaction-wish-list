import { Meteor } from "meteor/meteor";
import React, { Component, PropTypes } from "react";
import { composeWithTracker } from "/lib/api/compose";
import { Reaction, i18next, Logger } from "/client/api";
import { ReactionProduct } from "/lib/api";
import classnames from "classnames";
import { Wishlist } from "../../lib/collections";
import { WishlistButton } from "../components";
import { registerComponent } from "/imports/plugins/core/layout/lib/components";


function hasWishedItem() {
  const userId = Meteor.userId();
  const productId = ReactionProduct.selectedProductId();
  const variantId = ReactionProduct.selectedVariantId();
  if ( userId ) {

    Meteor.call("hasWishedItem", userId, productId, variantId, function(err, result){

      // I don't know how to collect the information here and return it outside of the call func
      if (result == null) {
        return false;
      } else {
        return true;
      }
    });
  } else {
    return false;
  }
}

class WishlistContainer extends Component {

  get currentUserId() {
    return Meteor.userId();
  }

  toggleWishedState(state) {
    // debugger
    // Somehow want to tell the button to switch its state
  }

  handleAddToWishlist() {
    const userId = Meteor.userId();
    const productId = ReactionProduct.selectedProductId();
    const variantId = ReactionProduct.selectedVariantId();

    if ( userId ) {
      let currentWishlist = Wishlist.findOne({ userId: userId }) // This does not work but Wishlist is defined

      // Check if item is already on wishlist
      Meteor.call("addToWishlist", userId, productId, variantId, function(err, result) {
        this.toggleWishedState(true);
        if (err) {
          Alerts.toast(i18next.t("app.error", { error: err.reason }), "error");
          return false;
        } else {
          console.log("Added Items")
          return true;
        }
      }.bind(this)); // Testing binding to be able to tell the button to switch state correctly

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
      variantId={this.selectedVariantId}
      toggleWishedState={this.toggleWishedState}
      hasWishedItem={hasWishedItem}
      />
    );
  }

}

function composer(props, onData) {
  const currentUserId = Meteor.userId();

  onData(null, {
    currentUserId: currentUserId,
    hasWishedItem: hasWishedItem
  });
}


WishlistContainer.propTypes = {
  variant: PropTypes.object
};

export default composeWithTracker(composer)(WishlistContainer);
