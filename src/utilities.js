import fs from "node:fs/promises";
import drawdown from "./drawdown.js";
import page from "./templates/page.js";

// Given a set of documents, add `nextKey` and `previousKey` properties
export function addNextPrevious(documents) {
  const keys = Object.keys(documents);
  const result = {};
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const document = { ...documents[key] };
    document.nextKey = keys[i + 1];
    document.previousKey = keys[i - 1];
    result[key] = document;
  }
  return result;
}

// Create a new object by applying a function to each [key, value] pair
export function mapObject(object, fn) {
  // Get the object's [key, value] pairs
  const entries = Object.entries(object);
  // Map each entry to a new [key, value] pair
  const mappedEntries = entries.map(([key, value]) => fn(value, key, object));
  // Create a new object from the mapped entries
  return Object.fromEntries(mappedEntries);
}

// Create a new object by mapping each value; keep the keys the same
export function mapValues(object, fn) {
  return mapObject(object, (value, key, object) => [
    key,
    fn(value, key, object),
  ]);
}

// If the text has front matter, parse it and return the object along with a
// `body` property holding the body text. If there's no front matter, the object
// will just have `body`.
export function markdownDocument(content) {
  let text = String(content);
  let data;
  const regex =
    /^(---\r?\n(?<frontText>[\s\S]*?\r?\n?)---\r?\n)(?<body>[\s\S]*$)/;
  const match = regex.exec(text);
  if (match?.groups) {
    const { frontText, body } = match.groups;
    text = body;
    // Parse each line of front text as `key: value` and add it to the data object.
    data = {};
    const lines = frontText.split("\n");
    for (const line of lines) {
      const [key, value] = line.split(":");
      if (key && value) {
        data[key] = value.trim();
      }
    }
  }
  return Object.assign({ body: text }, data);
}

// Convert a single markdown document to HTML
export function markdownDocumentToHtml(markdownDocument) {
  return {
    ...markdownDocument,
    body: drawdown(markdownDocument.body),
  };
}

// Read the indicated markdown file and return an HTML page for it
export async function markdownFileToHtmlPage(markdownPath) {
  const markdownDocument = await readMarkdownDocument(markdownPath);
  const htmlDocument = markdownDocumentToHtml(markdownDocument);
  return page(htmlDocument);
}

/**
 * Return a new grouping of the object's values into chunks of the specified
 * size.
 *
 * @param {object} object
 * @param {number} [size=10]
 */
export function paginate(object, size = 10) {
  const keys = Object.keys(object);
  const pageCount = Math.ceil(keys.length / size);

  // Group keys into size-sized chunks
  const paginated = [];
  for (let pageNumber = 0; pageNumber < pageCount; pageNumber++) {
    const index = pageNumber * size;
    const pageKeys = keys.slice(index, index + size);
    const items = {};
    for (const key of pageKeys) {
      items[key] = object[key];
    }
    const page = {
      items,
      nextPage: pageNumber + 2 <= pageCount ? pageNumber + 2 : null,
      pageCount,
      pageNumber: pageNumber + 1,
      previousPage: pageNumber - 1 >= 0 ? pageNumber : null,
    };
    paginated.push(page);
  }

  return paginated;
}

export async function readMarkdownDocument(filePath) {
  const markdown = await fs.readFile(filePath);
  return markdownDocument(markdown);
}
