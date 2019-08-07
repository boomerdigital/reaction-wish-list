import React, { Component, PropTypes } from "react";
import { Meteor } from "meteor/meteor";
import { Session } from "meteor/session";
import { Reaction } from "/client/api";
import classnames from "classnames";
import { registerComponent } from "/imports/plugins/core/layout/lib/components";
import { Button } from "/imports/plugins/core/ui/client/components";


// Should this be a container instead
class Wishlist extends Component {

  renderAddToWishlistButton() {
    return (
      <div className="row">
        <Button
          id="btn-add-to-wishlist"
          bezelStyle="solid"
          className="btn-lg btn-block"
          label="Add to Wishlist"
          onClick={this.addToWishlistClick}
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
          onClick={this.removeFromWishlistClick}
        />
      </div>
    );
  }

  renderWishlistButton() {
    // if no current user, open sign in dropdown
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
          onClick={this.addToWishlistClick}
        />
      </div>
    );
  }
}

// Wishlist.propTypes = {
//   variant: PropTypes.object,
//   isWished: PropTypes.bool,
//   user: PropTypes.object,
//   onWishlistClick: PropTypes.func
// }

registerComponent({
  name: "Wishlist",
  component: Wishlist
});

export default Wishlist;
