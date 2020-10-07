const readDirP = require('readdirp-walk');
const { getText } = require('./transform-to-mdx');
const { challengeToString } = require('./create-mdx');
const { parseMarkdown } = require('../../index');
const fs = require('fs');

const challengeDir = '../../../../curriculum/challenges/english';

readDirP({ root: challengeDir, fileFilter: ['*.md'] }).on('data', file => {
  if (file.stat.isFile()) {
    generateTranscribableChallenge(file.fullPath)
      .then(challengeToString)
      .then(text => fs.writeFileSync(file.fullPath + 'x', text))
      .catch(() => {
        console.log(file.path);
      });
  }
});

function generateTranscribableChallenge(fullPath) {
  return Promise.all([parseMarkdown(fullPath), getText(fullPath)]).then(
    results => ({
      ...results[0],
      ...results[1]
    })
  );
}
