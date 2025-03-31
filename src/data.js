import { readFiles } from "./files.js";
import { mapValues, markdownDocument } from "./utilities.js";

// Read markdown files
const markdownFolder = new URL("../markdown", import.meta.url).pathname;
const markdownFiles = await readFiles(markdownFolder);

// Convert to markdown documents, also parse date from file name
const markdownDocuments = mapValues(markdownFiles, (buffer, key) => ({
  ...markdownDocument(buffer),
  date: new Date(key.replace(/.md$/, "")),
}));

// Entries are sorted by date; reverse for latest first
const reversed = Object.fromEntries(
  Object.entries(markdownDocuments).reverse()
);

export default reversed;
