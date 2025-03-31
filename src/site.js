import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "url";
import markdownDocuments from "./data.js";
import drawdown from "./drawdown.js";
import * as files from "./files.js";
import jsonFeed from "./jsonFeed.js";
import rss from "./rss.js";
import { multiPostPage, page, singlePostPage } from "./templates.js";
import { mapObject, markdownDocument, paginate } from "./utilities.js";

const modulePath = fileURLToPath(import.meta.url);

// Convert markdown documents to HTML
const posts = mapObject(markdownDocuments, ([key, document]) => [
  key.replace(/\.md$/, ".html"),
  {
    ...document,
    body: drawdown(document.body),
  },
]);

// Apply post template
const postPages = mapObject(posts, ([key, document]) => [
  key,
  singlePostPage(document, key),
]);

// Static assets
const images = await files.readFiles(path.resolve(modulePath, "../../images"));
const assets = await files.readFiles(path.resolve(modulePath, "../assets"));

// Paginated pages
const paginatedPosts = paginate(posts, 10);
const pages = mapObject(paginatedPosts, ([index, paginated]) => [
  `${parseInt(index) + 1}.html`,
  multiPostPage(paginated),
]);

// Index page
const indexHtml = pages["1.html"];

// About page
const aboutMarkdown = await fs.readFile(
  path.resolve(modulePath, "../about.md")
);
const aboutMarkdownDocument = markdownDocument(aboutMarkdown);
const aboutHtml = page(
  {
    ...aboutMarkdownDocument,
    body: drawdown(aboutMarkdownDocument.body),
  },
  "about.html"
);

// Feeds
const feedData = jsonFeed(posts);
const feedJson = JSON.stringify(feedData, null, 2);
const feedXml = rss(feedData);

// Consolidate all site resources into a single object
export default {
  "about.html": aboutHtml,
  assets,
  "feed.json": feedJson,
  "feed.xml": feedXml,
  images,
  "index.html": indexHtml,
  pages,
  posts: postPages,
};
