import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

export const naturalOrder = new Intl.Collator(undefined, {
  numeric: true,
}).compare;

// Delete all files in the indicated folder
export async function clearFiles(folderPath) {
  folderPath = path.resolve(process.cwd(), folderPath);
  try {
    const directory = await fs.opendir(folderPath);
    for await (const entry of directory) {
      if (entry.isFile()) {
        const filePath = path.join(folderPath, entry.name);
        await fs.unlink(filePath);
      }
    }
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}

// Given a folder path, return an object holding the folder's contents: file
// names as keys and file content buffers as values
export async function readFiles(folderPath) {
  folderPath = path.resolve(process.cwd(), folderPath);
  const directory = await fs.opendir(folderPath);

  // Collect the directory entries
  const directoryEntries = [];
  for await (const entry of directory) {
    directoryEntries.push(entry);
  }

  // Map entries to file buffer or subfolder
  const entries = await Promise.all(
    directoryEntries.map(async (entry) => {
      const key = entry.name;
      const entryPath = path.join(folderPath, entry.name);
      const value = entry.isFile()
        ? await fs.readFile(entryPath)
        : await readFiles(entryPath);
      return [key, value];
    })
  );

  // Sort entries by name
  entries.sort(([a], [b]) => naturalOrder(a, b));

  return Object.fromEntries(entries);
}

// Write out an object holding file names as keys and file content buffers as
// values to a folder. Create the folder if it doesn't exist.
export async function writeFiles(folderPath, files) {
  folderPath = path.resolve(process.cwd(), folderPath);
  await fs.mkdir(folderPath, { recursive: true });
  for (const [fileName, contents] of Object.entries(files)) {
    const filePath = path.join(folderPath, fileName);
    if (isPlainObject(contents)) {
      // Subfolder
      const subfolderPath = path.join(folderPath, fileName);
      await writeFiles(subfolderPath, contents);
    } else {
      // File
      await fs.writeFile(filePath, contents);
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
