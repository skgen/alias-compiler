const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

function resolveAliasInFile(rootPath, alias, importAliased, filePath, content) {
  const absFilePath = path.resolve(rootPath, filePath);
  const absImportPath = importAliased
    .replace(alias.find, path.resolve(rootPath, alias.replacement));
  const relative = path.relative(absFilePath, absImportPath);
  const absFilePathLength = absFilePath.split(path.sep);
  const absImportPathLength = absImportPath.split(path.sep);
  let replacement = relative.replace(`..${path.sep}`, '');
  if (absFilePathLength.length < absImportPathLength.length
     || path.dirname(absFilePath) === path.dirname(absImportPath)) {
    replacement = relative.replace(`..${path.sep}`, `.${path.sep}`);
  }
  return content.replace(importAliased, replacement);
}

function replaceAliasesInFile(rootPath, fpath, aliases) {
  let content = fs.readFileSync(fpath, {
    encoding: 'utf-8',
  });
  for (let j = 0; j < aliases.length; j += 1) {
    const alias = aliases[j];
    let res = content.match(new RegExp(`${alias.find}(/\\w+)+`));
    let found = res ? res[0] : null;
    while (found) {
      content = resolveAliasInFile(rootPath, alias, found, fpath, content);
      res = content.match(new RegExp(`${alias.find}(/\\w+)+`));
      found = res ? res[0] : null;
    }
  }
  return content;
}

function buildRecursive(rootPath, currentDirnamePath, destPath, aliases, dry, depthPath = '') {
  console.log(chalk.grey(`[R] ${currentDirnamePath.replace(rootPath, '')}`));
  const filenames = fs.readdirSync(currentDirnamePath, {
    withFileTypes: true,
  });
  for (let i = 0; i < filenames.length; i += 1) {
    const fn = filenames[i];
    const tk = Reflect.ownKeys(fn)[1];
    const type = fn[tk];
    if (type === 1) {
      const fpath = path.resolve(currentDirnamePath, fn.name);
      const newContent = replaceAliasesInFile(rootPath, fpath, aliases);
      if (!dry) {
        fs.ensureDirSync(path.resolve(destPath, depthPath));
      }
      const destinationPath = path.resolve(destPath, depthPath, fn.name);
      console.log(`${chalk.green(`[W${dry ? ':D' : ''}]`)} ${destinationPath.replace(rootPath, '')}`);
      if (!dry) {
        fs.writeFileSync(destinationPath, newContent, { encoding: 'utf-8' });
      }
    }
    if (type === 2) {
      const nextFolderPath = path.resolve(currentDirnamePath, fn.name);
      const nextDepthPath = path.resolve(destPath, depthPath, fn.name);
      buildRecursive(rootPath, nextFolderPath, destPath, aliases, dry, nextDepthPath);
    }
  }
}

function build(options) {
  const {
    aliases, entry, output, root, dry,
  } = options;
  const buildPath = path.resolve(root, entry);
  const destPath = path.resolve(root, output);
  if (!dry) {
    fs.rmSync(destPath, { recursive: true, force: true });
  }
  console.log(`Executing ${chalk.white.bold(`${dry ? 'dry' : 'compile'}`)} run ...`);
  console.log(chalk.grey(`=> ${root}`));
  console.log();
  buildRecursive(root, buildPath, destPath, aliases, dry);
}

module.exports = {
  build,
};
