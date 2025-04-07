import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

// For sorting in natural order
const naturalOrder = new Intl.Collator(undefined, {
  numeric: true,
}).compare;

// Delete all files in the indicated folder
export async function clear(folderPath) {
  folderPath = path.resolve(process.cwd(), folderPath);
  try {
    const entries = await fs.readdir(folderPath, { withFileTypes: true });
    await Promise.all(
      entries.map((entry) =>
        fs.rm(path.join(folderPath, entry.name), { recursive: true })
      )
    );
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}

// Given a folder path, return an object holding the folder's contents: file
// names as keys and file content buffers as values
export async function read(folderPath) {
  folderPath = path.resolve(process.cwd(), folderPath);

  // Collect the directory entries
  const directoryEntries = await fs.readdir(folderPath, {
    withFileTypes: true,
  });

  // Map directory entries to file buffer or subfolder
  const entries = await Promise.all(
    directoryEntries.map(async (entry) => {
      const key = entry.name;
      const entryPath = path.join(folderPath, entry.name);
      const value = entry.isFile()
        ? await fs.readFile(entryPath)
        : await read(entryPath);
      return [key, value];
    })
  );

  // Sort entries by name
  entries.sort(([keyA], [keyB]) => naturalOrder(keyA, keyB));

  return Object.fromEntries(entries);
}

// Write out an object holding file names as keys and file content buffers as
// values to a folder.
export async function write(folderPath, files) {
  folderPath = path.resolve(process.cwd(), folderPath);
  // Create the folder if it doesn't exist
  await fs.mkdir(folderPath, { recursive: true });
  // Write out all the files
  await Promise.all(
    Object.entries(files).map(async ([fileName, contents]) => {
      const entryPath = path.join(folderPath, fileName);
      return isPlainObject(contents)
        ? write(entryPath, contents) // Subfolder
        : fs.writeFile(entryPath, contents); // File
    })
  );
}

// Quick test: return true if object is a plain object, doesn't handle
// cross-realm objects.
function isPlainObject(object) {
  return (
    object !== null &&
    typeof object === "object" &&
    Object.getPrototypeOf(object) === Object.prototype
  );
}
