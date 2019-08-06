import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { applyTheme, getRequiredValidator } from "@reactioncommerce/components/utils";
import { Components } from "@reactioncommerce/reaction-components";
import { Query, Mutation } from "react-apollo";
import { orderBy, uniqueId, get } from "lodash";
import Dropzone from "react-dropzone";
import styled from "styled-components";
import { Form } from "reacto-form";
import Button from "@reactioncommerce/components/Button/v1";
import Checkbox from "@reactioncommerce/components/Checkbox/v1";
import ErrorsBlock from "@reactioncommerce/components/ErrorsBlock/v1";
import Field from "@reactioncommerce/components/Field/v1";
import TextInput from "@reactioncommerce/components/TextInput/v1";
import Select from "@reactioncommerce/components/Select/v1";
import Grid from "@material-ui/core/Grid";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Card from "@material-ui/core/Card";
import Divider from "@material-ui/core/Divider";
import CardContent from "@material-ui/core/CardContent";
import MUICardActions from "@material-ui/core/CardActions";
import Typography from "@material-ui/core/Typography";
import { i18next } from "/client/api";
import { tagListingQuery, tagProductsQuery, topLevelTagsQuery } from "../../lib/queries";
import { addTagMutation, updateTagMutation, removeTagMutation, setTagHeroMediaMutation } from "../../lib/mutations";
import TagToolbar from "./TagToolbar";
import TagProductTable from "./TagProductTable";

const Title = styled.h3`
  margin-bottom: 16px;
`;

const CardActions = styled(MUICardActions)`
  justify-content: flex-end;
  padding-right: 0 !important;
`;

const PaddedField = styled(Field)`
  margin-bottom: 30px;
`;

const ContentGroup = styled.div`
  margin-bottom: 30px;
`;

const DropzoneWrapper = styled.div`
  .dropzone {
    background-color: ${applyTheme("MediaUploader.backgroundColor")};
    border: ${applyTheme("MediaUploader.border")};
    min-height: 325px;
    display: flex;
    align-items: center;
    position: relative;
  }
`;

const HeroEditButton = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
`;

const HeroUploadButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

class TagForm extends Component {
  static propTypes = {
    isLoadingShopId: PropTypes.bool,
    onCancel: PropTypes.func,
    onCreate: PropTypes.func,
    onUpdate: PropTypes.func,
    shopId: PropTypes.string.isRequired,
    tag: PropTypes.object
  }

  static defaultProps = {
    onCancel() {},
    onCreate() {},
    onUpdate() {},
    tag: {}
  }

  state = {
    currentTab: 0,
    uploadPreview: null
  }

  formValue = null;
  productOrderingPriorities = {}

  uniqueInstanceIdentifier = uniqueId("URLRedirectEditForm");

  async handleSubmit(data, mutation) {
    const { shopId } = this.props;
    const isNew = !data._id;

    const refetchQueries = [
      {
        query: tagListingQuery,
        variables: {
          shopId
        }
      },
      {
        query: topLevelTagsQuery,
        variables: {
          shopId
        }
      }
    ];

    const input = {
      id: data._id,
      name: data.name,
      displayTitle: data.displayTitle,
      isVisible: data.isVisible || false,
      isTopLevel: data.isTopLevel || false,
      shopId,
      heroMediaUrl: data.heroMediaUrl,
      metafields: [
        { key: "keywords", value: data.keywords || "", namespace: "metatag" },
        { key: "description", value: data.description || "", namespace: "metatag" },
        { key: "og:title", value: data["og:title"] || "", namespace: "metatag" },
        { key: "og:description", value: data["og:description"] || "", namespace: "metatag" },
        { key: "og:url", value: data["og:url"] || "", namespace: "metatag" },
        { key: "og:image", value: data["og:image"] || "", namespace: "metatag" },
        { key: "og:locale", value: data["og:locale"] || "", namespace: "metatag" },
        { key: "fb:app_id", value: data["fb:app_id"] || "", namespace: "metatag" }
      ]
    };

    if (!isNew) {
      if (data.isTopLevel || data.subTagIds.length === 0) {
        input.subTagIds = [];
      } else {
        input.subTagIds = [data.subTagIds];
      }

      if (Object.keys(this.productOrderingPriorities).length) {
        const featured = [];
        Object.keys(this.productOrderingPriorities).forEach((productId) => {
          const priority = this.productOrderingPriorities[productId];

          if (isNaN(parseInt(priority, 10)) === false) {
            featured.push({ productId, priority });
          }
        });

        input.featuredProductIds = orderBy(featured, ["priority"]).map(({ productId }) => productId);
      } else {
        input.featuredProductIds = null;
      }

      // On update, refetch featured products
      refetchQueries.push({
        query: tagProductsQuery,
        variables: {
          shopId,
          tagId: data._id
        }
      });
    }

    const result = await mutation({
      refetchQueries,
      variables: {
        input
      }
    });

    if (result.data.addTag) {
      this.props.onCreate(result.data.addTag.tag);
    } else {
      this.props.onUpdate(result.data.updateTag.tag);
    }

    return result;
  }

  handleRemove(id, mutation) {
    Alerts.alert({
      title: i18next.t("admin.routing.form.deleteConfirm"),
      type: "warning",
      showCancelButton: true
    }, async (isConfirm) => {
      if (isConfirm) {
        const { shopId } = this.props;

        await mutation({
          variables: {
            input: {
              id,
              shopId
            }
          }
        });
      }
    });
  }

  handleProductPriorityChange = (productId, priority) => {
    this.productOrderingPriorities[productId] = priority;
  }

  reset() {
    this.formValue = null;
  }

  handleCancel = () => {
    this.props.onCancel();
  }

  handleSubmitForm = () => {
    this.form.submit();
  }

  handleFormChange = (value) => {
    this.formValue = value;
  }

  handleTabChange = (event, value) => {
    this.setState({ currentTab: value });
  };

  handleDrop = (files) => {
    if (files.length === 0) return;

    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onloadend = () => {
      const base64data = reader.result;
      this.setState({ uploadPreview: base64data });
    };

    this.props.onHeroUpload(files);
  };

  handleDeleteHeroImage = () => {
    Alerts.alert({
      title: i18next.t("admin.tags.form.heroMediaDeleteConfirm"),
      type: "warning",
      showCancelButton: true
    }, async (isConfirm) => {
      if (isConfirm) {
        const { client, tag, shopId } = this.props;

        await client.mutate({
          mutation: setTagHeroMediaMutation,
          variables: {
            input: {
              id: tag._id,
              shopId,
              fileRecord: null
            }
          },
          refetchQueries: [{
            query: tagProductsQuery,
            variables: {
              shopId,
              tagId: tag._id
            }
          }]
        });
      }
    });
  }

  handleDropzoneClick = () => {
    this.dropzone && this.dropzone.open();
  }

  renderMediaGalleryUploader() {
    const { tag } = this.props;
    const { uploadPreview } = this.state;
    let content;

    if (tag && tag.heroMediaUrl) {
      let imageUrl;

      if (uploadPreview) {
        // Use the image preview from the upload if available
        imageUrl = uploadPreview;
      } else if (tag.heroMediaUrl) {
        // Otherwise use the url for the image saved in the database
        imageUrl = tag.heroMediaUrl;
      }

      content = (
        <Fragment>
          <HeroEditButton>
            <Button
              isShortHeight
              onClick={this.handleDeleteHeroImage}
            >
              {i18next.t("admin.tags.form.delete")}
            </Button>
          </HeroEditButton>
          <img src={imageUrl} width="100%" alt="" />
        </Fragment>
      );
    } else {
      content = (
        <HeroUploadButton>
          <Button
            actionType="secondary"
            isShortHeight
            onClick={this.handleDropzoneClick}
          >
            {i18next.t("admin.tags.form.uploadImage")}
          </Button>
        </HeroUploadButton>
      );
    }

    return (
      <DropzoneWrapper>
        <Dropzone
          disableClick
          className="dropzone"
          onDrop={this.handleDrop}
          ref={(inst) => { this.dropzone = inst; }}
          accept="image/jpg, image/png, image/jpeg"
        >
          {content}
        </Dropzone>
      </DropzoneWrapper>
    );
  }

  get tagData() {
    const { tag } = this.props;

    if (tag) {
      let metafields = {};

      if (Array.isArray(tag.metafields)) {
        tag.metafields.forEach((field) => {
          metafields[field.key] = field.value;
        });
      }

      return {
        ...tag,
        ...metafields
      };
    }

    return {};
  }

  render() {
    const tag = this.tagData;
    const isNew = !tag._id;
    const { shopId, topLevelTags } = this.props;
    const { currentTab } = this.state;
    const nameInputId = `name_${this.uniqueInstanceIdentifier}`;
    const slugInputId = `slug_${this.uniqueInstanceIdentifier}`;
    const isTopLevelInputId = `isTopLevel_${this.uniqueInstanceIdentifier}`;
    const heroMediaUrlInputId = `heroMediaUrl_${this.uniqueInstanceIdentifier}`;
    const displayTitleInputId = `displayTitle_${this.uniqueInstanceIdentifier}`;
    const keywordsInputId = `keywords_${this.uniqueInstanceIdentifier}`;
    const descriptionInputId = `description_${this.uniqueInstanceIdentifier}`;
    const ogTitleInputId = `ogTitle_${this.uniqueInstanceIdentifier}`;
    const ogDescriptionInputId = `ogDescription${this.uniqueInstanceIdentifier}`;
    const ogUrlInputId = `ogUrl_${this.uniqueInstanceIdentifier}`;
    const ogImageUrlInputId = `ogImageUrl_${this.uniqueInstanceIdentifier}`;
    const fbAppIdInputId = `fbAppId_${this.uniqueInstanceIdentifier}`;
    const ogLocaleInputId = `ogLocale_${this.uniqueInstanceIdentifier}`;
    const isVisibleInputId = `isVisible_${this.uniqueInstanceIdentifier}`;
    const subTagId = `subTagIds_${this.uniqueInstanceIdentifier}`;

    let title = i18next.t("admin.tags.form.formTitleNew");
    let mutation = addTagMutation;

    if (tag._id) {
      title = i18next.t("admin.tags.form.formTitleUpdate");
      mutation = updateTagMutation;
    }

    const tagOptions = (get(topLevelTags, "nodes") || []).map((t) => ({
      label: t.displayTitle || t.name,
      value: t._id
    }));

    return (
      <Mutation mutation={mutation}>
        {(mutationFunc) => (
          <Fragment>
            <Mutation mutation={removeTagMutation}>
              {(removeMutationFunc) => (
                <TagToolbar
                  onDelete={() => { this.handleRemove(tag._id, removeMutationFunc); }}
                  onCancel={this.handleCancel}
                  onSave={this.handleSave}
                />
              )}
            </Mutation>
            <Title>{title}</Title>
            <Form
              ref={(formRef) => { this.form = formRef; }}
              onChange={this.handleFormChange}
              onSubmit={(data) => this.handleSubmit(data, mutationFunc)}
              validator={getRequiredValidator("name", "displayTitle")}
              value={tag}
            >
              <ContentGroup>
                <PaddedField
                  name="name"
                  label={i18next.t("admin.tags.form.name")}
                  labelFor={nameInputId}
                  isRequired
                >
                  <TextInput id={nameInputId} name="name" placeholder="i.e. womens-shoes" />
                  <ErrorsBlock names={["name"]} />
                </PaddedField>
              </ContentGroup>

              <ContentGroup>
                <Tabs value={currentTab} onChange={this.handleTabChange}>
                  <Tab label={i18next.t("admin.tags.form.tagDetails")} />
                  <Tab label={i18next.t("admin.tags.form.metadata")} />
                  {tag._id && <Tab label={i18next.t("admin.tags.form.products")} />}
                </Tabs>
                <Divider />
              </ContentGroup>

              <Card>
                <CardContent>
                  {currentTab === 0 &&
                    <Grid container spacing={24}>
                      <Grid item md={6}>
                        <Typography variant="h6">{i18next.t("admin.tags.form.displayTitleAndSlug")}</Typography>
                        <PaddedField
                          helpText={i18next.t("admin.tags.form.displayTitleHelpText")}
                          name="displayTitle"
                          label={i18next.t("admin.tags.form.displayTitle")}
                          labelFor={displayTitleInputId}
                          isRequired
                        >
                          <TextInput id={displayTitleInputId} name="displayTitle" placeholder={i18next.t("admin.tags.form.displayTitlePlaceholder")} />
                          <ErrorsBlock names={["displayTitle"]} />
                        </PaddedField>

                        <PaddedField
                          helpText={i18next.t("admin.tags.form.slugHelpText")}
                          name="slug"
                          label={i18next.t("admin.tags.form.slug")}
                          labelFor={slugInputId}
                        >
                          <TextInput id={slugInputId} isReadOnly name="slug" placeholder={i18next.t("admin.tags.form.slugPlaceholder")} />
                          <ErrorsBlock names={["slug"]} />
                        </PaddedField>

                        <PaddedField
                          name="isVisible"
                          labelFor={isVisibleInputId}
                        >
                          <Checkbox
                            id={isVisibleInputId}
                            name="isVisible"
                            label={i18next.t("admin.tags.form.isVisible")}
                          />
                        </PaddedField>

                        <PaddedField
                          name="isTopLevel"
                          label="Is Top Level?"
                          labelFor={isTopLevelInputId}
                        >
                          <Checkbox name="isTopLevel" label="Is Top Level?" />
                          <ErrorsBlock names={["isTopLevel"]} />
                        </PaddedField>
                      </Grid>
                      <Grid item md={6}>
                        <Typography variant="h6">{i18next.t("admin.tags.form.tagListingHero")}</Typography>
                        <Typography>{i18next.t("admin.tags.form.tagListingHeroHelpText")}</Typography>
                        {this.renderMediaGalleryUploader()}

                        <PaddedField
                          name="heroMediaUrl"
                          label={i18next.t("admin.tags.form.heroMediaUrl")}
                          labelFor={heroMediaUrlInputId}
                        >
                          <TextInput id={heroMediaUrlInputId} name="heroMediaUrl" placeholder={i18next.t("admin.tags.form.heroMediaUrlPlaceholder")} />
                          <ErrorsBlock names={["heroMediaUrl"]} />
                        </PaddedField>
                      </Grid>
                      <Grid item xs={12}>
                        <PaddedField
                          name="subTagIds"
                          label="Parent tag"
                          labelFor={subTagId}
                        >
                          {(!isNew && !tag.isTopLevel) &&
                            <Select
                              id={subTagId}
                              name="subTagIds"
                              options={tagOptions}
                              value={tag.subTagIds && tag.subTagIds[0]}
                            />
                          }
                        </PaddedField>
                      </Grid>
                    </Grid>
                  }

                  {currentTab === 1 &&
                    <Grid container spacing={24}>
                      <Grid item md={6}>
                        <Typography variant="h6">{i18next.t("admin.tags.form.keywords")}</Typography>
                        <PaddedField
                          name="keywords"
                          label={i18next.t("admin.tags.form.keywords")}
                          labelFor={keywordsInputId}
                          isRequired
                        >
                          <TextInput id={keywordsInputId} name="keywords" placeholder={i18next.t("admin.tags.form.keywordsPlaceholder")} />
                          <ErrorsBlock names={["keywords"]} />
                        </PaddedField>

                        <PaddedField
                          name="description"
                          label={i18next.t("admin.tags.form.description")}
                          labelFor={descriptionInputId}
                        >
                          <TextInput id={descriptionInputId} name="description" placeholder={i18next.t("admin.tags.form.descriptionPlaceholder")} />
                          <ErrorsBlock names={["description"]} />
                        </PaddedField>
                      </Grid>
                      <Grid item md={6}>
                        <Typography variant="h6">{i18next.t("admin.tags.form.openGraph")}</Typography>
                        <PaddedField
                          name="og:title"
                          label={i18next.t("admin.tags.form.ogTitle")}
                          labelFor={ogTitleInputId}
                        >
                          <TextInput id={ogTitleInputId} name="og:title" placeholder={i18next.t("admin.tags.form.ogTitlePlaceholder")} />
                          <ErrorsBlock names={["og:title"]} />
                        </PaddedField>

                        <PaddedField
                          name="og:description"
                          label={i18next.t("admin.tags.form.ogDescription")}
                          labelFor={ogDescriptionInputId}
                        >
                          <TextInput id={ogDescriptionInputId} name="og:description" placeholder={i18next.t("admin.tags.form.ogDescriptionPlaceholder")} />
                          <ErrorsBlock names={["og:description"]} />
                        </PaddedField>

                        <PaddedField
                          name="og:url"
                          label={i18next.t("admin.tags.form.ogUrl")}
                          labelFor={ogDescriptionInputId}
                        >
                          <TextInput id={ogUrlInputId} name="og:url" placeholder={i18next.t("admin.tags.form.ogUrlPlaceholder")} />
                          <ErrorsBlock names={["og:url"]} />
                        </PaddedField>

                        <PaddedField
                          name="og:image"
                          label={i18next.t("admin.tags.form.ogImageUrl")}
                          labelFor={ogImageUrlInputId}
                        >
                          <TextInput id={ogImageUrlInputId} name="og:image" placeholder={i18next.t("admin.tags.form.ogImageUrlPlaceholder")} />
                          <ErrorsBlock names={["og:image"]} />
                        </PaddedField>

                        <PaddedField
                          name="og:locale"
                          label={i18next.t("admin.tags.form.ogLocale")}
                          labelFor={ogLocaleInputId}
                        >
                          <TextInput id={ogLocaleInputId} name="og:locale" placeholder={i18next.t("admin.tags.form.ogLocalePlaceholder")} />
                          <ErrorsBlock names={["og:locale"]} />
                        </PaddedField>

                        <PaddedField
                          name="fb:app_id"
                          label={i18next.t("admin.tags.form.fbAppId")}
                          labelFor={fbAppIdInputId}
                        >
                          <TextInput id={fbAppIdInputId} name="fb:app_id" placeholder={i18next.t("admin.tags.form.fbAppIdPlaceholder")} />
                          <ErrorsBlock names={["fb:app_id"]} />
                        </PaddedField>
                      </Grid>
                    </Grid>
                  }

                  {currentTab === 2 &&
                    <TagProductTable
                      onProductPriorityChange={this.handleProductPriorityChange}
                      shopId={shopId}
                      tagId={tag._id}
                    />
                  }

                  <CardActions disableActionSpacing>
                    <Button actionType="secondary" onClick={this.handleSubmitForm}>
                      {i18next.t("admin.tags.form.save")}
                    </Button>
                  </CardActions>
                </CardContent>
              </Card>
            </Form>
          </Fragment>
        )}
      </Mutation>
    );
  }
}

export default TagForm;
