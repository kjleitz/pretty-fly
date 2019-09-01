const fs = require('fs');
const path = require('path');
const _ = require('underscore');

const templatePath = path.resolve(__dirname, 'src', 'index.template.html');
const templateFile = fs.readFileSync(templatePath);
const template = templateFile.toString();

const buildDir = path.resolve(__dirname, 'build');
const buildFileNames = fs.readdirSync(buildDir);

const moduleFileNames = buildFileNames.filter(fileName => !fileName.match(/^index\.js$|\.js\.map$/));
const modulePaths = moduleFileNames.map(fileName => `/build/${fileName}`);

const compileTemplate = _.template(template);
const outputHtml = compileTemplate({ modulePaths });

const outputPath = path.resolve(__dirname, 'index.html');
fs.writeFileSync(outputPath, outputHtml);
