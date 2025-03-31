import { clearFiles, writeFiles } from "./files.js";
import siteFiles from "./site.js";

// Build writes the site resources to the build folder
const buildFolder = new URL("../build", import.meta.url).pathname;
await clearFiles(buildFolder);
await writeFiles(buildFolder, siteFiles);
