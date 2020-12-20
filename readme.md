# Slack App CSS Patcher!

[![GitHub Repo stars](https://img.shields.io/github/stars/Mkassabov/slack-css-patcher?style=social)](https://github.com/Mkassabov/slack-css-patcher/stargazers)

A simple tool to patch the slack app with custom css.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [License](#license)

## Installation

Make sure nodejs is installed.

Clone the repo then execute the following command in the directory:

```sh
npm install
```

## Usage

### Adding the patch

The npm script `start` is used to run the actual program itself. In order for the script to do anything it needs to be provided both a path to the slack app folder as well as a path to the css patch file. After the command is run, restart the slack app (note make sure to fully quit out of the app not just closing it).

```sh
npm run start -- slack:"<slack-app-folder>" css:"<patchfile-path>.css"
```

These changes will persist untilt the slack app is updated or until this program is rerun resulting and in the patch being overwritten. Since updaing the slack app can overwrite changes in the slack app folder it is reccomended to keep the css patchfile in a folder outside the slack app folder.

### example

```sh
npm run start -- slack:"C:\Users\Michael\AppData\Local\slack" css:"patch.css"
```

### removing the patch

The patch can be removed in 2 ways.

1. Overwriting the css patch with an empty css patch. This is done by adding a patch where the csspatchfile is just an empty file. While this will add a `<style>` node to the app it will not contain any styles and thus will not make any changes.

2. Removing the uncompiled folder and letting slack fallback to the unmodified `asar` package. This can be done by going to the slack app folder than navigating to `\app-<version-number>\resources` and deleting the `app` folder. This will force the app to fallback on the `app.asar` file that contains all the original, unmodified, code.

## License

MIT
