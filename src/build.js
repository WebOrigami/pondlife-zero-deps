import * as files from "./files.js";
import siteFiles from "./site.js";

// Build writes the site resources to the build folder
const buildFolder = new URL("../build", import.meta.url).pathname;
await files.clear(buildFolder);
await files.write(buildFolder, siteFiles);
