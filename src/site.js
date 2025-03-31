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

const relativePath = (filePath) => new URL(filePath, import.meta.url).pathname;

// Convert markdown documents to HTML
const posts = markdownDocumentsToHtml(markdownDocuments);

// Paginated pages
const pages = mapEntries(paginate(posts, 10), ([index, paginated]) => [
  `${parseInt(index) + 1}.html`,
  multiPostPage(paginated),
]);

// Convert posts to feed
const feed = jsonFeed(posts);

// Consolidate all site resources into a single object
export default {
  "about.html": await htmlPageForMarkdownFile(relativePath("about.md")),
  assets: await files.readFiles(relativePath("assets")),
  "feed.json": JSON.stringify(feed, null, 2),
  "feed.xml": rss(feed),
  images: await files.readFiles(relativePath("../images")),
  "index.html": pages["1.html"],
  pages,
  posts: mapValues(posts, singlePostPage),
};
