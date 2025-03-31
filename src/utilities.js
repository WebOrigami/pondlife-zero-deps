// Create a new object by applying a function to each [key, value] pair
export function mapObject(obj, fn) {
  return Object.fromEntries(Object.entries(obj).map(fn));
}

// If the text has front matter, parse it and return the object along with a
// @text property holding the body text. If there's no front matter, the object
// will just have @text.
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
