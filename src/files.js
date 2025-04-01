import fs from "node:fs";
import path from "node:path";
import process from "node:process";

export const naturalOrder = new Intl.Collator(undefined, {
  numeric: true,
}).compare;

// Delete all files in the indicated folder
export function clearFiles(folderPath) {
  folderPath = path.resolve(process.cwd(), folderPath);
  try {
    const entries = fs.readdirSync(folderPath, { withFileTypes: true });
    for (const entry of entries) {
      const filePath = path.join(folderPath, entry.name);
      fs.rmSync(filePath, { recursive: true });
    }
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}

// Given a folder path, return an object holding the folder's contents: file
// names as keys and file content buffers as values
export function readFiles(folderPath) {
  folderPath = path.resolve(process.cwd(), folderPath);

  // Collect the directory entries
  const directoryEntries = fs.readdirSync(folderPath, { withFileTypes: true });

  // Map entries to file buffer or subfolder
  const entries = directoryEntries.map((entry) => {
    const key = entry.name;
    const entryPath = path.join(folderPath, entry.name);
    const value = entry.isFile()
      ? fs.readFileSync(entryPath)
      : readFiles(entryPath);
    return [key, value];
  });

  // Sort entries by name
  entries.sort(([a], [b]) => naturalOrder(a, b));

  return Object.fromEntries(entries);
}

// Write out an object holding file names as keys and file content buffers as
// values to a folder. Create the folder if it doesn't exist.
export function writeFiles(folderPath, files) {
  folderPath = path.resolve(process.cwd(), folderPath);
  fs.mkdirSync(folderPath, { recursive: true });
  for (const [fileName, contents] of Object.entries(files)) {
    const filePath = path.join(folderPath, fileName);
    if (isPlainObject(contents)) {
      // Subfolder
      const subfolderPath = path.join(folderPath, fileName);
      writeFiles(subfolderPath, contents);
    } else {
      // File
      fs.writeFileSync(filePath, contents);
    }
  }
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
