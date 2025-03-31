import markdownDocuments from "./data.js";
import * as files from "./files.js";
import jsonFeed from "./jsonFeed.js";
import rss from "./rss.js";
import { multiPostPage, singlePostPage } from "./templates.js";
import {
  htmlPageForMarkdownFile,
  mapEntries,
  mapValues,
  markdownDocumentsToHtml,
  paginate,
} from "./utilities.js";

// Return the path relative to this module
const relativePath = (filePath) => new URL(filePath, import.meta.url).pathname;

// Convert markdown documents to HTML
const posts = markdownDocumentsToHtml(markdownDocuments);

// Group posts into sets of 10
const pages = mapEntries(paginate(posts, 10), ([index, paginated]) => [
  `${parseInt(index) + 1}.html`, // names will be `1.html`, `2.html`, ...
  multiPostPage(paginated),
]);

// Convert posts to a feed object in JSON Feed schema
const feed = jsonFeed(posts);

// Consolidate all site resources into a single object
export default {
  "about.html": await htmlPageForMarkdownFile(relativePath("about.md")),
  assets: await files.readFiles(relativePath("assets")),
  "feed.json": JSON.stringify(feed, null, 2),
  "feed.xml": rss(feed),
  images: await files.readFiles(relativePath("../images")),
  "index.html": pages["1.html"], // same as first page in pages area
  pages,
  posts: mapValues(posts, singlePostPage),
};
