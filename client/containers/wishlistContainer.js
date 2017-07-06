import React, { Component, PropTypes } from "react";
import { composeWithTracker } from "/lib/api/compose";
import { Meteor } from "meteor/meteor";
import { ReactionProduct } from "/lib/api";
import { Reaction, i18next, Logger } from "/client/api";
import classnames from "classnames";
import { registerComponent } from "/imports/plugins/core/layout/lib/components";

class WishlistContainer extends Component {
  constructor(props) {
    super(props);
    //
  }

  // For finding current user, do we use Accounts.user() or Meteor.user()
  // Do we want to hold currentUser within a constructor or get

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

  renderAddToWishlistButton() {
    return (
      <div className="row">
        <Button
          id="btn-add-to-wishlist"
          bezelStyle="solid"
          className="btn-lg btn-block"
          label="Add to Wishlist"
          onClick={this.handleAddToWishlistClick}
        />
      </div>
    );
  }

  renderRemoveFromWishlistButton() {
    return (
      <div className="row">
        <Button
          id="btn-remove-from-wishlist"
          bezelStyle="solid"
          className="btn-lg btn-block"
          label="Remove from Wishlist"
          onClick={this.handleRemoveFromWishlistClick}
        />
      </div>
    );
  }

  renderWishlistButton() {
    // if no current user default to add to
    // if current user, check if user has item on wishlist
  }

  render() {
    // this.renderWishlistButton();
    return (
      <div className="row">
        <Button
          id="btn-add-to-wishlist"
          bezelStyle="solid"
          className="btn-lg btn-block"
          label="Add to Wishlist"
          onClick={this.handleAddToWishlistClick}
        />
      </div>
    );
  }

}

onData(null, {
  currentUser: getCurrentUser
});

WishlistContainer.propTypes = {
};

export default composeWithTracker(composer)(WishlistContainer);
