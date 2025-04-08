import * as files from "./files.js";
import jsonFeed from "./jsonFeed.js";
import jsonFeedToRss from "./jsonFeedToRss.js";
import posts from "./posts.js";
import multiPostPage from "./templates/multiPostPage.js";
import singlePostPage from "./templates/singlePostPage.js";
import {
  htmlPageForMarkdownFile,
  mapEntries,
  mapValues,
  paginate,
} from "./utilities.js";

// Return the path relative to this module
const relativePath = (filePath) => new URL(filePath, import.meta.url).pathname;

// Group posts into pages of 10
const pages = mapEntries(paginate(posts, 10), (paginated, index) => [
  `${parseInt(index) + 1}.html`, // Change names to `1.html`, `2.html`, ...
  multiPostPage(paginated), // Apply template to the set of 10 posts
]);

// Convert posts to a feed object in JSON Feed schema
const feed = jsonFeed(posts);

//
// This is the primary representation of the site as an object
//
export default {
  "about.html": await htmlPageForMarkdownFile(relativePath("about.md")),
  assets: await files.read(relativePath("assets")),
  "feed.json": JSON.stringify(feed, null, 2),
  "feed.xml": jsonFeedToRss(feed),
  images: await files.read(relativePath("../images")),
  "index.html": pages["1.html"], // same as first page in pages area
  pages,
  posts: mapValues(posts, singlePostPage),
};
