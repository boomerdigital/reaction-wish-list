import { FileRecord } from "@reactioncommerce/file-collections";
import fetch from "node-fetch";
import { Jobs, Tags } from "/lib/collections";
import { Media } from "/imports/plugins/core/files/server";

/**
 * @summary Add media from URL
 * @param {String} url - url from which to grab image
 * @param {Object} metadata - Metadata to add to the image
 * @returns {Promise<void>} - Result of Media insert
 */
async function addMediaFromUrl({ url, metadata }) {
  const fileRecord = await FileRecord.fromUrl(url, { fetch });

  // Set workflow to "published" to bypass revision control on insert for this image.
  fileRecord.metadata = { ...metadata, workflow: "published" };

  if (metadata.tagId) {
    const mediaRecord = await Media.insert(fileRecord);
    const heroMediaUrl = `${FileRecord.downloadEndpointPrefix}/${Media.name}/${mediaRecord._id}/large/${mediaRecord.name()}`;

    return Tags.update({
      _id: metadata.tagId
    }, {
      $set: {
        heroMediaUrl
      }
    });
  }
  return Media.insert(fileRecord);
}

export const importImages = () => {
  Jobs.processJobs("connectors/shopify/import/image", {
    pollInterval: 60 * 60 * 1000, // Retry failed images after an hour
    workTimeout: 5 * 1000 // No image import should last more than 5 seconds
  }, (job, callback) => {
    const { data } = job;
    const { url } = data;
    try {
      Promise.await(addMediaFromUrl(data));
      job.done(`Finished importing image from ${url}`);
      callback();
    } catch (error) {
      job.fail(`Failed to import image from ${url}.`);
      callback();
    }
  });
};
