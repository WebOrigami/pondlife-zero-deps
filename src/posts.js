import * as files from "./files.js";
import parseDate from "./parseDate.js";
import {
  addNextPrevious,
  mapObject,
  mapValues,
  markdownDocument,
  markdownDocumentToHtml,
} from "./utilities.js";

// Post data pipeline: reads in a folder of markdown files, applies a number of
// transformations, and produces an object containing the posts ready for
// rendering in various forms. That top object has its keys in reverse
// chronological order, so the latest posts are first. Each post is an object
// with a `body` property containing the HTML content, front matter properties,
// and calculated properties.

// Read the entire markdown folder into memory as an object with Buffer values
const markdownFolder = new URL("../markdown", import.meta.url).pathname;
const markdownFiles = await files.read(markdownFolder);

// Convert to markdown documents; also parse date from file name
const markdownDocuments = mapValues(markdownFiles, (buffer, key) => ({
  ...markdownDocument(buffer),
  date: parseDate(key),
}));

// Transform to HTML
const htmlDocuments = mapObject(markdownDocuments, (document, key) => [
  // Change the keys from `.md` names to `.html` names
  key.replace(/\.md$/, ".html"),
  // Convert the markdown content to HTML
  markdownDocumentToHtml(document),
]);

// Add `nextKey`/`previousKey` properties so the post pages can be linked.
// The posts are already in chronological order because their names start
// with a YYYY-MM-DD date, so we can determine the next and previous posts
// by looking at the adjacent posts in the list. We need to do this before
// reversing the order in the next step; we want "next" to mean the next
// post in chronological order, not display order.
const crossLinked = addNextPrevious(htmlDocuments);

// Entries are sorted by date; reverse for latest first
const reversed = Object.fromEntries(Object.entries(crossLinked).reverse());

export default reversed;
