#!/usr/bin/env node

import main from "./index.js";
import { promisify } from "util";
import fs from "fs";
const readFile = promisify(fs.readFile);

const [, , ...args] = process.argv;
function getArgument(args, name, noValue = false) {
  const keyIndex = args.indexOf(name);
  if (keyIndex === -1) {
    return noValue ? false : null;
  } else {
    return noValue ? true : args[keyIndex + 1];
  }
}

async function printHelp() {
  const packageJson = JSON.parse(await readFile("./package.json", "utf8"));
  const out = `
Running Version ${packageJson.version}

Usage:

  --slack-path       : Specify the path to the Slack Desktop App directory
  -sp                : Specify the path to the Slack Desktop App directory
  
  --patch-file       : Specify the path to the Slack Desktop App directory
  -pf                : Specify the path to the Slack Desktop App directory

  --help             : Shows this help text
  -h                 : Shows this help text
  `;
  console.log(out);
}

const argSlackPath = getArgument(args, "--slack-path");
const argSP = getArgument(args, "-sp");
const argPathFile = getArgument(args, "--patch-file");
const argPF = getArgument(args, "-pf");
const argHelp =
  getArgument(args, "--help", true) || getArgument(args, "-h", true);

if (argHelp) {
  printHelp();
}

const SLACK_APP_PATH = argSlackPath != null ? argSlackPath : argSP;
const PATCH_FILE_PATH = argPathFile != null ? argPathFile : argPF;

main(SLACK_APP_PATH, PATCH_FILE_PATH);
