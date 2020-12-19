import { promisify } from "util";
import fs from "fs";
import asar from "asar";
const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const SLACK_APP_PATH = process.argv
  .filter((str) => /^slack:/.test(str))[0]
  .replace(/^slack:/, "");

const PATCH_FILE_PATH = process.argv
  .filter((str) => /^css:/.test(str))[0]
  .replace(/^css:/, "");

// ╔════════════════════════════════════╗
// ║        Unpack ASAR app file        ║
// ╚════════════════════════════════════╝
const slackDirectory = (await readdir(SLACK_APP_PATH))[0];
const appDirectory = `${SLACK_APP_PATH}/${slackDirectory}/resources`;
asar.extractAll(`${appDirectory}/app.asar`, `${appDirectory}/app`);

// ╔═══════════════════════════════════╗
// ║          Clean patch.css          ║
// ╚═══════════════════════════════════╝
const patchFile = await readFile(PATCH_FILE_PATH, "utf8");
const cleanedPatchFile = patchFile
  .replace(/[\r\n]/g, " ")
  .replace(/\"/g, '\\"')
  .replace(/\'/g, "\\'");

// ╔════════════════════════════════════╗
// ║          Inject patch.css          ║
// ╚════════════════════════════════════╝
const injectionString = `&&parent.ownerDocument.head.insertBefore((() => {const div = document.createElement("style"); div.innerText=\`${cleanedPatchFile}\`; return div})(), parent.ownerDocument.head.firstChild)`;

const SLACK_PRELOAD_FILE = await readFile(
  `${appDirectory}/app/dist/preload.bundle.js`,
  "utf8"
);
const newSlackPreloadFile = SLACK_PRELOAD_FILE.replace(
  /(?<=parent)(?=\&\&parent)/gm,
  injectionString
);

await writeFile(
  `${appDirectory}/app/dist/preload.bundle.js`,
  newSlackPreloadFile,
  "utf8"
);
