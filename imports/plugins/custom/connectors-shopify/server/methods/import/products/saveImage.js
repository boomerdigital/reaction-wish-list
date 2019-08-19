import { Job } from "/imports/plugins/core/job-collection/lib";
import { Jobs } from "/lib/collections";
/**
 * Creates a new job to save an image from a given url
 * Saves an image from a url to the Collection FS image storage location
 * (default: Mongo GridFS)
 * @private
 * @method saveImage
 * @param  {string}  url url of the image to save
 * @param  {object}  metadata metadata to save with the image
 * @return {undefined}
 */
export function saveImage(url, metadata) {
  new Job(Jobs, "connectors/shopify/import/image", { url, metadata })
    .priority("normal")
    .retry({
      retries: 5,
      wait: 5000,
      backoff: "exponential" // delay by twice as long for each subsequent retry
    })
    .save();
}
