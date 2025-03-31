import path from "node:path";
import { fileURLToPath } from "node:url";
import * as files from "./files.js";
import siteFiles from "./site.js";

const modulePath = fileURLToPath(import.meta.url);
const buildFolder = path.resolve(modulePath, "../../build");
await files.clearFiles(buildFolder);
await files.writeFiles(buildFolder, siteFiles);
