import React, { Component, PropTypes } from "react";
import { composeWithTracker } from "/lib/api/compose";
import { Meteor } from "meteor/meteor";
import { ReactionProduct } from "/lib/api";
import { Reaction, i18next, Logger } from "/client/api";
import classnames from "classnames";
import { Wishlist } from "../components";
import { registerComponent } from "/imports/plugins/core/layout/lib/components";

class WishlistContainer extends Component {
  constructor(props) {
    super(props);
    //
  }

  get currentWishlist() {

  }

  get selectedVariant() {

  }

  handleCreateWishlist() {

  }
  // For finding current user, do we use Accounts.user() or Meteor.user()
  // Do we want to hold currentUser within a constructor or get

  handleWishlistButtonClick = (event, props) => {
    debugger
  }

  handleAddToWishlistClick = (event, props) => {
    debugger
    const currentUser = Accounts.user();

    if ( currentUser ) {
      Meteor.call("")
      // add item to wishlist
      // alert item has been added
      // change button to remove from wishlist
    } else {
      // pop open sign in
      // Alert you need to be signed in
      // maybe after sign in have it be able to add?
    }
  }

  handleRemoveFromWishlistClick = (event, props) => {

  }

  render() {
    // set onWishlistClick before
    return (
      <Wishlist
        onWishlistClick={this.handleWishlistButtonClick}
      />
    );
  }

}

function composer(props, onData) {

  onData(null, {
    // variant: getSelectedChildVariant,
    // currentUser: getCurrentUser
  });
}


WishlistContainer.propTypes = {
  variant: PropTypes.object
};

export default composeWithTracker(composer)(WishlistContainer);
