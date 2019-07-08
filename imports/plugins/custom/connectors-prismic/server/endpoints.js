import Reaction from "/imports/plugins/core/core/server/Reaction";
import get from "lodash/get";

// Prismic hard limit
const PER_PAGE = 50;

Reaction.Endpoints.add("get", "/prismic/catalog", (req, res) => {
  const { query: { page = 1 } } = req;
  
  const skip = (page - 1) * PER_PAGE;
  const cursor = Reaction.Collections.Catalog.find({}, { limit: PER_PAGE, skip });

  const results = cursor.map((doc, index, cursor) => ({
      id: get(doc, "_id"),
      title: get(doc, "product.title"),
      description: get(doc, "product.description"),
      image_url: get(doc, "media.primaryImage.URLs.thumbnail"),
      last_update: get(doc, "updatedAt"),
      blob: doc
    }
  ));

  // false is to ignore the skip and limit
  const results_size = cursor.count(false);

  const options = {
    code: 200,
    data: { results, results_size }
  };

  return Reaction.Endpoints.sendResponse(res, options);
});
