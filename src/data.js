import path from "node:path";
import { fileURLToPath } from "url";
import * as files from "./files.js";
import { mapObject, markdownDocument } from "./utilities.js";

// Read markdown files
const modulePath = fileURLToPath(import.meta.url);
const markdownFolder = path.resolve(modulePath, "../../markdown");
const markdownFiles = await files.readFiles(markdownFolder);

// Convert to markdown documents, also parse date from file name
const markdownDocuments = mapObject(markdownFiles, ([key, buffer]) => [
  key,
  {
    ...markdownDocument(buffer),
    date: new Date(key.replace(/.md$/, "")),
  },
]);

// Entries are sorted by date; reverse for latest first
const reversed = Object.fromEntries(
  Object.entries(markdownDocuments).reverse()
);

export default reversed;
