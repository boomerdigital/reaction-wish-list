import React, { Component, PropTypes } from "react";
import { composeWithTracker } from "/lib/api/compose";
import { Meteor } from "meteor/meteor";
import { Reaction } from "/client/api";
import { ReactionProduct } from "/lib/api";
import classnames from "classnames";
import { registerComponent } from "/imports/plugins/core/layout/lib/components";
import { Button } from "/imports/plugins/core/ui/client/components";

class WishlistButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      wished: this.hasWishedItem()
    }

    this.hasWishedItem = this.hasWishedItem.bind(this);
  }

  hasWishedItem() {
    const userId = Meteor.userId();
    const productId = ReactionProduct.selectedProductId();
    const variantId = ReactionProduct.selectedVariantId();
    if ( userId ) {

      Meteor.call("hasWishedItem", userId, productId, variantId, function(err, result){

        if (err || result == null) {
          this.setState({
            wished: false
          });
          return false;
        } else {
          this.setState({
            wished: result
          });
          return result;
        }
      }.bind(this));
    } else {
      this.setState({
        wished: false
      });
      return false;
    }
  }

  handleAddToWishlistClick = (event, props) => {
    this.props.onWishlistItemAdd();
    this.hasWishedItem();
  }

  handleRemoveToWishlistClick = (event, props) => {
    this.props.onWishlistItemRemove();
    this.hasWishedItem();
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
          className="btn-lg btn-block btn-primary"
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
      if (this.hasWishedItem()) {
        return this.renderRemoveFromWishlistButton(this.handleRemoveToWishlistClick)
      } else {
        return this.renderAddToWishlistButton(this.handleAddToWishlistClick)
      }
    } else {
      // pass onClick func to open sign in
    }
  }

  render() {
    if(this.state.wished == false) {
      return this.renderAddToWishlistButton(this.handleAddToWishlistClick)
    } else {
      return this.renderRemoveFromWishlistButton(this.handleRemoveToWishlistClick)
    }
  }
}

function composer(props, onData) {
  onData(null, {});
}

WishlistButton.propTypes = {
  currentUserId: PropTypes.string,
  onWishlistItemAdd: PropTypes.func,
  onWishlistItemRemove: PropTypes.func
}

registerComponent({
  name: "WishlistButton",
  component: WishlistButton
});

export default composeWithTracker(composer)(WishlistButton);
