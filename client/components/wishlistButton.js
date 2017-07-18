import React, { Component, PropTypes } from "react";
import { Meteor } from "meteor/meteor";
import { Session } from "meteor/session";
import { Reaction } from "/client/api";
import classnames from "classnames";
import { registerComponent } from "/imports/plugins/core/layout/lib/components";
import { Button } from "/imports/plugins/core/ui/client/components";

class WishlistButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      wished: this.props.hasWishedItem()
    }

    this.handleAddToWishlistClick = this.handleAddToWishlistClick.bind(this);
    this.handleRemoveToWishlistClick = this.handleRemoveToWishlistClick.bind(this); // I forget if we needs this at the moment
  }

  handleAddToWishlistClick = (event, props) => {
    event.preventDefault();
    event.stopPropagation();

    this.props.onWishlistItemAdd();
    this.setState({
      wished: true
    });
  }

  handleRemoveToWishlistClick = (event, props) => {
    event.preventDefault();
    event.stopPropagation();

    this.props.onWishlistItemAdd();
    this.setState({
      wished: false
    });
  }

  renderAddToWishlistButton(clickFunc) {
    return (
      <div className="row">
        <Button
          id="btn-add-to-wishlist"
          bezelStyle="solid"
          className="btn-lg btn-block"
          label="Add to Wishlist"
          onClick={clickFunc}
        />
      </div>
    );
  }

  renderRemoveFromWishlistButton(clickFunc) {
    return (
      <div className="row">
        <Button
          id="btn-remove-from-wishlist"
          bezelStyle="solid"
          className="btn-lg btn-block"
          label="Remove from Wishlist"
          onClick={clickFunc}
        />
      </div>
    );
  }

  renderWishlistButton() {
    // if no current user, open sign in dropdown
    // if current user, check if user has item on wishlist
    const userId = Meteor.userId();

    if ( userId ) {
      // If user has item on wishlist
      // debugger
      if (this.props.hasWishedItem) {
        return this.renderAddToWishlistButton(this.handleAddToWishlistClick)
      } else {
        return this.renderAddToWishlistButton(this.handleAddToWishlistClick)
      }
    } else {
      // pass onClick func to open sign in
    }
  }

  render() {
    return this.renderWishlistButton();
  }
}

WishlistButton.propTypes = {
  variantId: PropTypes.string,
  currentUserId: PropTypes.string,
  onWishlistItemAdd: PropTypes.func,
  onWishlistItemRemove: PropTypes.func,
  toggleWishedState: PropTypes.func,
  hasWishedItem: PropTypes.func
}

registerComponent({
  name: "WishlistButton",
  component: WishlistButton
});

export default WishlistButton;
