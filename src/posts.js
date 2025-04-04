import { readFiles } from "./files.js";
import {
  addNextPrevious,
  mapEntries,
  mapValues,
  markdownDocument,
  markdownDocumentToHtml,
  parseDate,
} from "./utilities.js";

// Data pipeline: reads in a collection of Buffer objects representing the
// markdown files, applies a number of transformations, and produces a
// reverse-chronological ordered collection of document objects ready for
// rendering in various forms.

// Read markdown files into an object with Buffer values
const markdownFolder = new URL("../markdown", import.meta.url).pathname;
const markdownFiles = await readFiles(markdownFolder);

// Convert to markdown documents; also parse date from file name
const markdownDocuments = mapValues(markdownFiles, (buffer, key) => ({
  ...markdownDocument(buffer),
  date: parseDate(key),
}));

// Transform to HTML
const htmlDocuments = mapEntries(markdownDocuments, (document, key) => [
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
