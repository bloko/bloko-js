const fse = require('fs-extra');
const glob = require('glob');

glob('types/*.d.ts', function (er, files) {
  files.forEach(file => {
    fse.copySync(`${process.cwd()}/${file}`, `${process.cwd()}/dist/${file}`);
  });
});
