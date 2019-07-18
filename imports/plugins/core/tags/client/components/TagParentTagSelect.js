import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { Query } from "react-apollo";
import { uniqueId } from "lodash";
import { topLevelTagsQuery } from "../../lib/queries";
import Select from "@reactioncommerce/components/Select/v1";
import { Tags } from "/lib/collections";
import { TagHelpers } from "/imports/plugins/core/ui-tagnav/client/helpers";

class TagParentTagSelect extends Component {
  static propTypes = {
    shopId: PropTypes.string.isRequired,
    tag: PropTypes.object
  }

  uniqueInstanceIdentifier = uniqueId("URLRedirectEditForm");

  onChange = (parentTagId) => {
    const { tag } = this.props;

    TagHelpers.updateTag(tag._id, tag.name, parentTagId);
  }

  render() {
    const { shopId } = this.props;

    if (!shopId) {
      return null;
    }

    return (
      <Query query={topLevelTagsQuery} variables={{ shopId }} fetchPolicy="network-only">
        {({ data, fetchMore }) => {
          const tags = data && data.tags;

          if(!tags) {
            return null;
          }

          console.log(tags)

          const relatedTagId = `relatedTagIdsId_${this.uniqueInstanceIdentifier}`;
          const tagOptions = (tags.nodes || []).map((tag) => ({
            label: tag.displayTitle,
            value: tag._id
          }));


          return (
            <Fragment>
              <ul>
                {tags.nodes.map((tag) => {
                  return <li>{tag.slug}</li>
                })}
              </ul>
              <Select
                id={relatedTagId}
                name="relatedTagId"
                options={tagOptions}
                onChange={this.onChange}
              />
            </Fragment>
          );
        }}
      </Query>
    );
  }
}

export default TagParentTagSelect;
