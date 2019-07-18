import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { Query } from "react-apollo";
import { topLevelTagsQuery } from "../../lib/queries";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

class TagParentTagSelect extends Component {
  static propTypes = {
    shopId: PropTypes.string.isRequired,
    tagId: PropTypes.string
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

          return (
            <Fragment>
              <ul>
                {tags.nodes.map((tag) => {
                  return <li>{tag.slug}</li>
                })}
              </ul>
              <Select
                // value={values.age}
                // onChange={handleChange}
                inputProps={{
                  name: 'relatedTagIds',
                }}
              >
                {tags.nodes.map((tag) => {
                  <MenuItem value={tag._id}>{tag.slug}</MenuItem>
                })}
              </Select>
            </Fragment>
          );
        }}
      </Query>
    );
  }
}

export default TagParentTagSelect;
